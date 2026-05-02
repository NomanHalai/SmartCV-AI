'use client'

import { useResumeStore } from '@/store/resumeStore'
import { cn } from '@/lib/utils'
import {
  User, Briefcase, GraduationCap, Wrench,
  FolderKanban, Award, AlignLeft, CheckCircle2, GripVertical
} from 'lucide-react'
import type { BuilderStep } from '@/types'
import { Progress } from '@/components/ui/progress'

const STEPS: { id: BuilderStep; label: string; icon: React.ElementType }[] = [
  { id: 'personal',       label: 'Personal Info',    icon: User },
  { id: 'experience',     label: 'Experience',        icon: Briefcase },
  { id: 'education',      label: 'Education',         icon: GraduationCap },
  { id: 'skills',         label: 'Skills',            icon: Wrench },
  { id: 'projects',       label: 'Projects',          icon: FolderKanban },
  { id: 'certifications', label: 'Certifications',    icon: Award },
  { id: 'summary',        label: 'Summary',           icon: AlignLeft },
]

function isStepComplete(step: BuilderStep, resume: ReturnType<typeof useResumeStore.getState>['resume']): boolean {
  switch (step) {
    case 'personal': return Boolean(resume.personal.firstName && resume.personal.email)
    case 'experience': return resume.experiences.length > 0
    case 'education': return resume.educations.length > 0
    case 'skills': return resume.skills.length >= 3
    case 'projects': return resume.projects.length > 0
    case 'certifications': return resume.certifications.length > 0
    case 'summary': return resume.summary.length > 30
    default: return false
  }
}

export function BuilderSidebar() {
  const { activeStep, setActiveStep, resume, getCompletionPercentage } = useResumeStore()
  const pct = getCompletionPercentage()

  return (
    <nav className="hidden w-64 min-w-64 border-r border-slate-200 bg-white/90 flex-col py-5 backdrop-blur-xl lg:flex overflow-y-auto">
      <div className="px-3 mb-4">
        <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Drag sections</div>
      </div>

      <div className="flex-1 px-2 space-y-0.5">
        {STEPS.map(({ id, label, icon: Icon }) => {
          const done = isStepComplete(id, resume)
          const active = activeStep === id
          return (
            <button
              key={id}
              onClick={() => setActiveStep(id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-sm text-left transition-all duration-150',
                active
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              )}
            >
              <GripVertical size={14} className="text-slate-300" />
              {done && !active ? (
                <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
              ) : (
                <Icon size={15} className={cn('flex-shrink-0', active ? 'text-indigo-600' : 'text-slate-400')} />
              )}
              {label}
            </button>
          )
        })}
      </div>

      {/* Progress */}
      <div className="px-4 mt-4 pt-4 border-t border-slate-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400">Profile complete</span>
          <span className="text-xs font-semibold text-indigo-600">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>
    </nav>
  )
}
