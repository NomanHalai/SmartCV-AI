import type { ResumeData, TemplateId } from '@/types'
import type { ComponentType } from 'react'
import { CleanTemplate } from './CleanTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { ModernTemplate } from './ModernTemplate'
import { TechnicalTemplate } from './TechnicalTemplate'

const templates: Record<TemplateId, ComponentType<{ resume: ResumeData }>> = {
  clean: CleanTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
  technical: TechnicalTemplate,
  minimal: MinimalTemplate,
}

export function TemplateRenderer({ resume }: { resume: ResumeData }) {
  const SelectedTemplate = templates[resume.template || 'clean'] || CleanTemplate

  return <SelectedTemplate resume={resume} />
}
