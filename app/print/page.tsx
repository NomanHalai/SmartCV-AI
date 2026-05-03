'use client'

import { ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'
import { TemplateRenderer } from '@/components/resume-templates/TemplateRenderer'
import { ProtectedRoute } from '@/components/saas/protected-route'
import { useResumeStore } from '@/store/resumeStore'

export default function PrintPage() {
  const resume = useResumeStore((state) => state.resume)

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-100 px-4 py-6 dark:bg-slate-950 print:bg-white print:p-0">
        <div className="no-print mx-auto mb-5 flex max-w-4xl items-center justify-between">
          <Link href="/builder" className="btn-secondary">
            <ArrowLeft size={15} />
            Back to Builder
          </Link>
          <button onClick={() => window.print()} className="btn-primary">
            <Download size={15} />
            Save as PDF
          </button>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="resume-paper min-h-[1122px] bg-white p-10 shadow-2xl shadow-slate-950/10 print:min-h-0 print:shadow-none">
            <TemplateRenderer resume={resume} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
