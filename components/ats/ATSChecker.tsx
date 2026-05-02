'use client'

import { ChangeEvent, useMemo, useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Info,
  Loader2,
  Sparkles,
  Upload,
  XCircle,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ATSIssue, ATSResult, ResumeData } from '@/types'

function ScoreRing({ score }: { score: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#4f46e5' : score >= 55 ? '#f59e0b' : '#ef4444'
  const grade = score >= 93 ? 'A+' : score >= 87 ? 'A' : score >= 82 ? 'B+' : score >= 75 ? 'B' : score >= 68 ? 'C+' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F'

  return (
    <div className="flex flex-col items-center">
      <svg width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/10" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 56 56)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.4s' }}
        />
        <text x="56" y="52" textAnchor="middle" fontSize="24" fontWeight="800" fill={color} fontFamily="system-ui">{score}</text>
        <text x="56" y="68" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui">out of 100</text>
        <text x="56" y="82" textAnchor="middle" fontSize="13" fontWeight="800" fill={color} fontFamily="system-ui">{grade}</text>
      </svg>
      <p className="mt-1 text-xs font-medium text-muted-foreground">
        {score >= 75 ? 'ATS-ready resume' : score >= 55 ? 'Needs improvement' : 'Needs major fixes'}
      </p>
    </div>
  )
}

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const color = value >= 75 ? '#4f46e5' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="mb-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{weight}</span>
          <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  )
}

const ISSUE_STYLES: Record<ATSIssue['type'], { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
  error: { bg: 'bg-red-50 dark:bg-red-400/10', border: 'border-red-200 dark:border-red-400/20', icon: XCircle, iconColor: 'text-red-500' },
  warning: { bg: 'bg-amber-50 dark:bg-amber-400/10', border: 'border-amber-200 dark:border-amber-400/20', icon: AlertTriangle, iconColor: 'text-amber-500' },
  success: { bg: 'bg-emerald-50 dark:bg-emerald-400/10', border: 'border-emerald-200 dark:border-emerald-400/20', icon: CheckCircle2, iconColor: 'text-emerald-500' },
  info: { bg: 'bg-blue-50 dark:bg-blue-400/10', border: 'border-blue-200 dark:border-blue-400/20', icon: Info, iconColor: 'text-blue-500' },
}

function IssueCard({ issue }: { issue: ATSIssue }) {
  const style = ISSUE_STYLES[issue.type]
  const Icon = style.icon

  return (
    <div className={cn('rounded-2xl border p-3', style.bg, style.border)}>
      <div className="flex items-start gap-2">
        <Icon size={15} className={cn('mt-0.5 flex-shrink-0', style.iconColor)} />
        <div>
          <p className="text-xs font-semibold text-foreground">{issue.title}</p>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{issue.description}</p>
          {issue.fix && <p className="mt-1 text-xs font-medium text-foreground">{issue.fix}</p>}
        </div>
      </div>
    </div>
  )
}

function hasResumeContent(resume: ResumeData) {
  return Boolean(
    resume.personal.firstName ||
    resume.personal.email ||
    resume.summary ||
    resume.experiences.length ||
    resume.skills.length,
  )
}

export function ATSChecker() {
  const { resume, atsResult, setATSResult } = useResumeStore()
  const [mode, setMode] = useState<'builder' | 'upload'>('builder')
  const [analyzing, setAnalyzing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedName, setUploadedName] = useState('')
  const [uploadedResume, setUploadedResume] = useState<ResumeData | null>(null)
  const [error, setError] = useState('')
  const [improvementPlan, setImprovementPlan] = useState<string[]>([])

  const result = atsResult
  const activeResume = mode === 'builder' ? resume : uploadedResume

  const detectedLabel = useMemo(() => {
    if (mode === 'builder') return 'Current builder resume'
    if (uploadedName) return uploadedName
    return 'Uploaded resume'
  }, [mode, uploadedName])

  async function analyzeResume(targetResume = activeResume) {
    if (!targetResume) return

    setAnalyzing(true)
    setError('')
    setImprovementPlan([])

    try {
      const res = await fetch('/api/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: targetResume }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to analyze resume.')
      if (data.result) setATSResult(data.result as ATSResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume.')
    } finally {
      setAnalyzing(false)
    }
  }

  function selectMode(nextMode: 'builder' | 'upload') {
    setMode(nextMode)
    setError('')
    setImprovementPlan([])
    setATSResult(null)
  }

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setMode('upload')
    setUploading(true)
    setError('')
    setImprovementPlan([])
    setATSResult(null)
    setUploadedName(file.name)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const parseRes = await fetch('/api/ats-upload', {
        method: 'POST',
        body: formData,
      })
      const parsed = await parseRes.json()

      if (!parseRes.ok) throw new Error(parsed.error || 'Failed to read uploaded resume.')

      setUploadedResume(parsed.resume as ResumeData)
      if (parsed.result) setATSResult(parsed.result as ATSResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not analyze uploaded resume.')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  function buildImprovementPlan() {
    if (!result) return

    const fixes = result.issues
      .filter((issue) => issue.type !== 'success')
      .map((issue) => issue.fix || issue.description)

    setImprovementPlan(
      fixes.length
        ? fixes
        : [
            'Your resume is in strong ATS shape. Keep tailoring skills and achievements for each role.',
            'Use the builder to create role-specific versions for different applications.',
          ],
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-4">
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-foreground">Choose resume source</h3>
          <p className="mt-1 text-xs text-muted-foreground">Check ATS readiness from your current builder resume or upload an existing resume file.</p>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
            {[
              { id: 'builder', label: 'Built Resume', icon: FileText },
              { id: 'upload', label: 'Upload PDF/DOCX', icon: Upload },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectMode(id as 'builder' | 'upload')}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                  mode === id ? 'bg-card text-indigo-600 shadow-sm dark:text-indigo-200' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {mode === 'builder' ? (
            <div className="mt-5 rounded-2xl border border-border bg-card p-4">
              <p className="text-sm font-semibold text-foreground">Current builder resume</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {hasResumeContent(resume)
                  ? 'Analyze the resume you are building right now.'
                  : 'Your builder resume is empty. Add contact info, summary, experience, and skills first.'}
              </p>
              <button
                onClick={() => analyzeResume(resume)}
                disabled={analyzing || !hasResumeContent(resume)}
                className="btn-primary mt-4 w-full justify-center"
              >
                {analyzing ? <><Loader2 size={14} className="animate-spin" /> Checking resume...</> : <><Zap size={14} /> Check Built Resume</>}
              </button>
            </div>
          ) : (
            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-8 text-center transition-colors hover:border-indigo-300 hover:bg-muted">
              <input className="hidden" type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} />
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-200">
                {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {uploading ? 'Reading resume...' : uploadedName || 'Upload resume file'}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">PDF, DOC, or DOCX. SmartCV AI will parse and score the resume.</p>
            </label>
          )}

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
              {error}
            </div>
          )}
        </div>

        {!result && (
          <div className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">How resume-only ATS scoring works</p>
            <div className="mt-4 space-y-2 text-xs text-muted-foreground">
              {[
                ['30%', 'ATS keyword signal from skills, tools, and resume language'],
                ['30%', 'Resume structure and section completeness'],
                ['15%', 'Contact information completeness'],
                ['15%', 'Action verbs and achievement quality'],
                ['10%', 'Headline/title clarity'],
              ].map(([w, l]) => (
                <div key={w} className="flex gap-2">
                  <span className="w-9 flex-shrink-0 font-semibold text-indigo-600">{w}</span>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && (
          <div className="card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" />
              <h3 className="text-sm font-semibold text-foreground">Improvement plan</h3>
            </div>

            {improvementPlan.length === 0 ? (
              <button onClick={buildImprovementPlan} className="btn-primary w-full justify-center">
                <Sparkles size={14} />
                Create Fix List
              </button>
            ) : (
              <div className="space-y-2">
                {improvementPlan.map((item, index) => (
                  <div key={item} className="flex gap-2.5 rounded-2xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-400/20 dark:bg-indigo-400/10">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">{index + 1}</span>
                    <p className="text-xs leading-5 text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        {result ? (
          <div className="space-y-4 animate-fade-in">
            <div className="card p-5">
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">ATS report</p>
                <h3 className="mt-1 text-lg font-bold text-foreground">{detectedLabel}</h3>
              </div>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <ScoreRing score={result.score.total} />
                <div className="min-w-0 flex-1">
                  <ScoreBar label="Keyword Signal" value={result.score.keywordMatch} weight="30%" />
                  <ScoreBar label="Resume Structure" value={result.score.structure} weight="30%" />
                  <ScoreBar label="Contact Info" value={result.score.contactInfo} weight="15%" />
                  <ScoreBar label="Action Verbs" value={result.score.actionVerbs} weight="15%" />
                  <ScoreBar label="Headline Clarity" value={result.score.titleAlignment} weight="10%" />
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diagnostic checks</p>
              <div className="grid grid-cols-1 gap-2">
                {result.issues.map((issue, index) => <IssueCard key={`${issue.title}-${index}`} issue={issue} />)}
              </div>
            </div>

            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detected ATS keywords</p>
                <span className="text-xs text-muted-foreground">{result.keywords.found.length} found</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.found.length ? result.keywords.found.map((kw) => (
                  <span key={kw} className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
                    {kw}
                  </span>
                )) : (
                  <p className="text-xs text-muted-foreground">No strong skills or ATS keywords detected yet.</p>
                )}
              </div>
              {result.keywords.missing.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Add more role-specific language such as {result.keywords.missing.slice(0, 4).join(', ')}.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="card flex h-full min-h-[360px] flex-col items-center justify-center p-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-200">
              <Zap size={24} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Ready to check resume ATS health</h3>
            <p className="mt-2 max-w-xs text-xs leading-6 text-muted-foreground">
              Analyze your built resume or upload a PDF/DOCX resume to see structure, keyword signal, contact completeness, action verbs, and fixes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
