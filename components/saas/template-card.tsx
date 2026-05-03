'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { templates } from './product-data'
import { useResumeStore } from '@/store/resumeStore'
import type { TemplateId } from '@/types'

export function TemplateCard({ template }: { template: (typeof templates)[number] }) {
  const selected = useResumeStore((state) => state.resume.template === template.id)
  const setTemplate = useResumeStore((state) => state.setTemplate)

  return (
    <div className={`group w-[min(260px,78vw)] shrink-0 overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${selected ? 'border-indigo-400 ring-2 ring-indigo-500/20' : 'border-border'}`}>
      <div className="p-4">
        <div className="aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted p-4">
          <div className={`h-3 w-24 rounded-full bg-gradient-to-r ${template.accent}`} />
          <div className="mt-5 grid grid-cols-[0.8fr_1.2fr] gap-4">
            <div className="space-y-2">
              <div className={`h-16 rounded-xl bg-gradient-to-br ${template.accent} opacity-90`} />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-4/5 rounded-full bg-slate-200" />
              <div className="h-2 w-2/3 rounded-full bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-slate-300" />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-5/6 rounded-full bg-slate-200" />
              <div className="mt-4 h-3 w-1/2 rounded-full bg-slate-300" />
              <div className="h-2 rounded-full bg-slate-200" />
              <div className="h-2 w-3/4 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 p-4 dark:border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-foreground">{template.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{template.role}</p>
          </div>
          <Badge variant="success">{template.score}%</Badge>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-slate-500">{template.layout}</span>
          <Button
            href="/builder"
            variant={selected ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setTemplate(template.id as TemplateId)}
          >
            {selected ? 'Selected' : 'Use'}
          </Button>
        </div>
      </div>
    </div>
  )
}
