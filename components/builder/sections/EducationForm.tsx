'use client'

import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { generateId } from '@/lib/utils'
import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import type { Education } from '@/types'

function EduCard({ edu }: { edu: Education }) {
  const { updateEducation, removeEducation } = useResumeStore()
  const update = (key: keyof Education, val: string) => updateEducation(edu.id, { [key]: val })

  return (
    <div className="card p-4 mb-3 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-slate-700">{edu.degree || 'New Education'}</p>
        <button onClick={() => removeEducation(edu.id)} className="btn-ghost text-red-400 p-1"><Trash2 size={13} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {([
          ['Degree / Program', 'degree', 'B.Tech Computer Science'],
          ['Institution', 'institution', 'IIT Bombay'],
          ['Graduation Year', 'graduationYear', '2020'],
          ['GPA / Grade', 'gpa', '8.5 / 10'],
          ['Location', 'location', 'Mumbai, India'],
          ['Honors / Achievements', 'honors', 'Dean\'s List, Gold Medalist'],
        ] as [string, keyof Education, string][]).map(([label, key, ph]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
            <input className="input-base" placeholder={ph} value={edu[key] as string} onChange={(e) => update(key, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EducationForm() {
  const { resume, addEducation, setActiveStep } = useResumeStore()

  const handleAdd = () =>
    addEducation({ id: generateId(), degree: '', institution: '', location: '', graduationYear: '', gpa: '', honors: '' })

  return (
    <div>
      <SectionHeader icon={GraduationCap} title="Education" description="Your academic background" />
      {resume.educations.map((edu) => <EduCard key={edu.id} edu={edu} />)}
      <button onClick={handleAdd} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 mb-4">
        <Plus size={15} /> Add Education
      </button>
      <div className="flex justify-between mt-2">
        <button className="btn-secondary" onClick={() => setActiveStep('experience')}>← Back</button>
        <button className="btn-primary" onClick={() => setActiveStep('skills')}>Next: Skills →</button>
      </div>
    </div>
  )
}
