'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useResumeStore } from '@/store/resumeStore'
import { Download, Gauge, LayoutDashboard, RotateCcw, Upload, X } from 'lucide-react'
import { downloadBlob } from '@/lib/utils'
import { UploadResume } from './upload/UploadResume'
import { BrandLogo } from '@/components/saas/brand-logo'
import { ThemeToggle } from '@/components/saas/theme-toggle'

export function BuilderHeader() {
  const { resume, atsResult, resetResume } = useResumeStore()
  const [showUpload, setShowUpload] = useState(false)
  const score = atsResult?.score?.total

  async function handleExport() {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, format: 'docx' }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const name = `${resume.personal.firstName || 'My'}_${resume.personal.lastName || 'Resume'}_Resume.docx`.replace(/\s+/g, '_')
        downloadBlob(blob, name)
      }
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 border-b border-border px-5 py-3 flex items-center justify-between backdrop-blur-xl">
        <BrandLogo className="hidden sm:inline-flex" />
        <BrandLogo compact className="sm:hidden" />

        <div className="flex items-center gap-2">
          {score !== undefined && (
            <Link href="/ats-checker">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border cursor-pointer transition-colors
                ${score >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' :
                  score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' :
                  'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>
                ATS {score}/100
              </span>
        </Link>
      )}

          <ThemeToggle />

          <button
            onClick={() => setShowUpload(true)}
            className="btn-secondary hidden text-xs md:inline-flex"
            title="Import existing resume"
          >
            <Upload size={13} />
            Import Resume
          </button>

          <Link href="/dashboard" className="btn-ghost hidden text-xs lg:inline-flex">
            <LayoutDashboard size={13} />
            Dashboard
          </Link>

          <Link href="/ats-checker" className="btn-ghost hidden text-xs sm:inline-flex">
            <Gauge size={13} />
            Check ATS
          </Link>

          <button onClick={handleExport} className="btn-primary text-xs">
            <Download size={13} />
            Export DOCX
          </button>

          <button
            onClick={() => { if (confirm('Reset your resume? This cannot be undone.')) resetResume() }}
            className="btn-ghost hidden text-xs text-slate-400 sm:inline-flex"
            title="Reset resume"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </header>

      {/* Upload Modal */}
      {showUpload && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowUpload(false) }}
        >
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slide-up border border-border">
            <button
              onClick={() => setShowUpload(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X size={14} className="text-muted-foreground" />
            </button>
            <UploadResume
              onSuccess={() => setShowUpload(false)}
              onClose={() => setShowUpload(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
