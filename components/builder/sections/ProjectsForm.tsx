'use client'

import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { generateId } from '@/lib/utils'
import { FolderKanban, Plus, Trash2 } from 'lucide-react'
import type { Project } from '@/types'

function ProjectCard({ proj }: { proj: Project }) {
  const { updateProject, removeProject } = useResumeStore()
  const update = (key: keyof Project, val: string | string[]) => updateProject(proj.id, { [key]: val })

  const updateBullet = (i: number, val: string) => {
    const bullets = [...proj.bullets]
    bullets[i] = val
    update('bullets', bullets)
  }

  return (
    <div className="card p-4 mb-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-slate-700">{proj.name || 'New Project'}</p>
        <button onClick={() => removeProject(proj.id)} className="btn-ghost text-red-400 p-1"><Trash2 size={13} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project Name</label>
          <input className="input-base" placeholder="E-commerce Platform" value={proj.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tech Stack</label>
          <input className="input-base" placeholder="React, Node.js, MongoDB" value={proj.techStack} onChange={(e) => update('techStack', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Project URL (optional)</label>
          <input className="input-base" placeholder="github.com/username/project" value={proj.url} onChange={(e) => update('url', e.target.value)} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Description</label>
        <textarea className="textarea-base" rows={2} placeholder="Brief overview of the project and its impact" value={proj.description} onChange={(e) => update('description', e.target.value)} />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-2">Key Points</label>
        <div className="space-y-2">
          {proj.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-slate-300 mt-2.5 text-sm">•</span>
              <input className="input-base flex-1" placeholder="Built real-time inventory system handling 10K+ concurrent users" value={bullet} onChange={(e) => updateBullet(i, e.target.value)} />
              <button onClick={() => update('bullets', proj.bullets.filter((_, idx) => idx !== i))} className="btn-ghost text-red-400 mt-1 p-1"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => update('bullets', [...proj.bullets, ''])} className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
          <Plus size={12} /> Add point
        </button>
      </div>
    </div>
  )
}

export function ProjectsForm() {
  const { resume, addProject, setActiveStep } = useResumeStore()

  const handleAdd = () =>
    addProject({ id: generateId(), name: '', techStack: '', url: '', description: '', bullets: [''] })

  return (
    <div>
      <SectionHeader icon={FolderKanban} title="Projects" description="Notable projects you've built or contributed to" />
      {resume.projects.map((proj) => <ProjectCard key={proj.id} proj={proj} />)}
      <button onClick={handleAdd} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 mb-4">
        <Plus size={15} /> Add Project
      </button>
      <div className="flex justify-between mt-2">
        <button className="btn-secondary" onClick={() => setActiveStep('skills')}>← Back</button>
        <button className="btn-primary" onClick={() => setActiveStep('certifications')}>Next: Certifications →</button>
      </div>
    </div>
  )
}
