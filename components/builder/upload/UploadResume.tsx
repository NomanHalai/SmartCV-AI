'use client'

import { useState, useCallback, useRef } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type UploadStage = 'idle' | 'uploading' | 'parsing' | 'done' | 'error'

interface UploadResumeProps {
  onClose?: () => void
  onSuccess?: () => void
}

export function UploadResume({ onClose, onSuccess }: UploadResumeProps) {
  const { resume, setActiveStep } = useResumeStore()
  const [stage, setStage] = useState<UploadStage>('idle')
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{ name: string; email: string; title: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const store = useResumeStore()

  const STAGES: Record<UploadStage, string> = {
    idle: '',
    uploading: 'Reading file...',
    parsing: 'Claude AI is extracting your resume data...',
    done: 'Resume imported successfully!',
    error: '',
  }

  async function processFile(file: File) {
    if (!file) return
    setFileName(file.name)
    setError('')
    setStage('uploading')

    try {
      const formData = new FormData()
      formData.append('file', file)

      setStage('parsing')

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to parse resume')
      }

      // Populate store with parsed data
      const parsed = data.resume
      store.updatePersonal(parsed.personal || {})
      store.updateSummary(parsed.summary || '')
      store.setSkills(parsed.skills || [])

      // Clear and set experiences
      ;(resume.experiences || []).forEach((e) => store.removeExperience(e.id))
      ;(parsed.experiences || []).forEach((e: any) => store.addExperience(e))

      // Clear and set educations
      ;(resume.educations || []).forEach((e) => store.removeEducation(e.id))
      ;(parsed.educations || []).forEach((e: any) => store.addEducation(e))

      // Clear and set projects
      ;(resume.projects || []).forEach((p) => store.removeProject(p.id))
      ;(parsed.projects || []).forEach((p: any) => store.addProject(p))

      // Clear and set certifications
      ;(resume.certifications || []).forEach((c) => store.removeCertification(c.id))
      ;(parsed.certifications || []).forEach((c: any) => store.addCertification(c))

      setPreview({
        name: `${parsed.personal?.firstName || ''} ${parsed.personal?.lastName || ''}`.trim(),
        email: parsed.personal?.email || '',
        title: parsed.personal?.jobTitle || '',
      })

      setStage('done')

      setTimeout(() => {
        onSuccess?.()
        store.setActiveStep('personal')
      }, 1800)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setStage('error')
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    []
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const isLoading = stage === 'uploading' || stage === 'parsing'

  return (
    <div className="relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors z-10"
        >
          <X size={14} className="text-slate-500" />
        </button>
      )}

      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles size={16} className="text-teal-600" />
          Import Existing Resume
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Upload your PDF or DOCX — Claude AI will extract all sections automatically
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-teal-400 bg-teal-50 scale-[1.01]'
            : stage === 'done'
            ? 'border-emerald-300 bg-emerald-50 cursor-default'
            : stage === 'error'
            ? 'border-red-300 bg-red-50 cursor-pointer'
            : isLoading
            ? 'border-teal-200 bg-teal-50/50 cursor-wait'
            : 'border-slate-200 bg-slate-50 hover:border-teal-300 hover:bg-teal-50/30'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          onChange={handleFileChange}
          className="hidden"
        />

        {stage === 'idle' && (
          <>
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Upload size={22} className="text-teal-600" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Drop your resume here
            </p>
            <p className="text-xs text-slate-400 mb-3">or click to browse</p>
            <div className="flex items-center justify-center gap-2">
              <span className="badge bg-slate-100 text-slate-500 border-slate-200">PDF</span>
              <span className="badge bg-slate-100 text-slate-500 border-slate-200">DOCX</span>
              <span className="badge bg-slate-100 text-slate-500 border-slate-200">DOC</span>
            </div>
          </>
        )}

        {isLoading && (
          <>
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-3">
              <Loader2 size={22} className="text-teal-600 animate-spin" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">{STAGES[stage]}</p>
            {fileName && <p className="text-xs text-slate-400">{fileName}</p>}
            {stage === 'parsing' && (
              <div className="mt-3 space-y-1.5 text-left max-w-xs mx-auto">
                {['Detecting sections...', 'Extracting experience...', 'Parsing skills & education...'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                    <span className="text-xs text-slate-500">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {stage === 'done' && preview && (
          <>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={22} className="text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-emerald-700 mb-1">Successfully imported!</p>
            {preview.name && <p className="text-xs font-medium text-slate-600">{preview.name}</p>}
            {preview.title && <p className="text-xs text-slate-400">{preview.title}</p>}
            {preview.email && <p className="text-xs text-slate-400">{preview.email}</p>}
            <p className="text-xs text-slate-400 mt-2">Redirecting to editor...</p>
          </>
        )}

        {stage === 'error' && (
          <>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} className="text-red-500" />
            </div>
            <p className="text-sm font-semibold text-red-600 mb-1">Upload failed</p>
            <p className="text-xs text-red-400 mb-3 max-w-xs mx-auto">{error}</p>
            <p className="text-xs text-slate-400">Click to try again</p>
          </>
        )}
      </div>

      {/* Tips */}
      {stage === 'idle' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-xs font-medium text-blue-700 mb-1">For best results:</p>
          <ul className="text-xs text-blue-600 space-y-0.5">
            <li>• Use a text-based PDF (not scanned image)</li>
            <li>• Max file size: 10MB</li>
            <li>• After import, review all sections for accuracy</li>
          </ul>
        </div>
      )}
    </div>
  )
}
