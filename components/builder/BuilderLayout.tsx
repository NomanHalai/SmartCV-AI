'use client'

import { useResumeStore } from '@/store/resumeStore'
import { BuilderSidebar } from './BuilderSidebar'
import { BuilderHeader } from './BuilderHeader'
import { ResumePreview } from '../preview/ResumePreview'
import { PersonalForm } from './sections/PersonalForm'
import { ExperienceForm } from './sections/ExperienceForm'
import { EducationForm } from './sections/EducationForm'
import { SkillsForm } from './sections/SkillsForm'
import { ProjectsForm } from './sections/ProjectsForm'
import { SummaryForm } from './sections/SummaryForm'
import { CertificationsForm } from './sections/CertificationsForm'
import type { BuilderStep } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { builderSteps } from '@/components/saas/product-data'
import { CheckCircle2, Palette, Sparkles, WandSparkles } from 'lucide-react'
import type { TemplateId, ResumeTheme } from '@/types'

const SECTIONS: Record<BuilderStep, React.ComponentType> = {
  personal: PersonalForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  projects: ProjectsForm,
  certifications: CertificationsForm,
  summary: SummaryForm,
}

export function BuilderLayout() {
  const { activeStep, resume, setTemplate, setTheme } = useResumeStore()
  const ActiveSection = SECTIONS[activeStep]
  const templateOptions: { id: TemplateId; label: string }[] = [
    { id: 'clean', label: 'Clean' },
    { id: 'modern', label: 'Modern' },
    { id: 'executive', label: 'Executive' },
    { id: 'technical', label: 'Technical' },
    { id: 'minimal', label: 'Minimal' },
  ]
  const accentOptions: { id: ResumeTheme['accentColor']; className: string }[] = [
    { id: 'indigo', className: 'bg-indigo-600' },
    { id: 'blue', className: 'bg-blue-600' },
    { id: 'emerald', className: 'bg-emerald-600' },
    { id: 'slate', className: 'bg-slate-900' },
    { id: 'violet', className: 'bg-violet-600' },
  ]

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <BuilderHeader />
      <div className="flex flex-1 overflow-hidden">
        <BuilderSidebar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0 animate-slide-up">
              <div className="mb-5 rounded-3xl border border-border bg-card/80 p-4 shadow-soft backdrop-blur">
                <div className="flex flex-wrap gap-2">
                  {builderSteps.map(({ label, icon: Icon, complete }) => (
                    <div key={label} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">
                      {complete ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Icon size={14} className="text-indigo-500" />}
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <ActiveSection />
            </div>
            <aside className="hidden space-y-5 xl:block">
              <Card className="p-5">
                <Badge><Sparkles size={13} /> AI content suggestions</Badge>
                <h3 className="mt-4 font-bold text-foreground">Enhance experience</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Rewrite bullets with stronger action verbs, scope, metrics, and recruiter-friendly outcomes.</p>
                <div className="mt-4 space-y-2">
                  {['Add measurable impact', 'Tighten summary', 'Suggest role keywords'].map((item) => (
                    <button key={item} className="flex w-full items-center gap-2 rounded-2xl bg-indigo-50 p-3 text-left text-xs font-semibold text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200">
                      <WandSparkles size={14} />
                      {item}
                    </button>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <Badge variant="neutral"><Palette size={13} /> Theme customization</Badge>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Template</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {templateOptions.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setTemplate(template.id)}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                        resume.template === template.id
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-400/10 dark:text-indigo-200'
                          : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accent</p>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {accentOptions.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setTheme({ accentColor: color.id })}
                      aria-label={`Choose ${color.id} theme color`}
                      className={`h-9 rounded-2xl ${color.className} ${resume.theme?.accentColor === color.id ? 'ring-2 ring-offset-2 ring-indigo-500 ring-offset-background' : ''}`}
                    />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={resume.theme?.font === 'serif' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setTheme({ font: resume.theme?.font === 'serif' ? 'inter' : 'serif' })}
                  >
                    {resume.theme?.font === 'serif' ? 'Serif' : 'Inter'}
                  </Button>
                  <Button
                    type="button"
                    variant={resume.theme?.density === 'compact' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setTheme({ density: resume.theme?.density === 'compact' ? 'comfortable' : 'compact' })}
                  >
                    {resume.theme?.density === 'compact' ? 'Compact' : 'Comfort'}
                  </Button>
                </div>
              </Card>
            </aside>
          </div>
        </main>
        <aside className="hidden w-[380px] min-w-[380px] border-l border-border bg-card overflow-y-auto 2xl:block">
          <ResumePreview />
        </aside>
      </div>
    </div>
  )
}
