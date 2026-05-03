'use client'

import { useResumeStore } from '@/store/resumeStore'
import { TemplateRenderer } from '@/components/resume-templates/TemplateRenderer'

export function ResumePreview() {
  const { resume } = useResumeStore()

  return (
    <div className="flex h-full flex-col p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</p>
        <span className="text-xs text-muted-foreground">{resume.template || 'clean'} template</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          className="resume-paper min-h-[640px] overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          style={{ color: '#111827' }}
        >
          <TemplateRenderer resume={resume} />
        </div>
      </div>
    </div>
  )
}
