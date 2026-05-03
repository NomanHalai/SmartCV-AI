'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { Wrench, X, Plus } from 'lucide-react'

const SUGGESTED_SKILLS: Record<string, string[]> = {
  'Frontend': ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Tailwind CSS', 'HTML/CSS'],
  'Backend': ['Node.js', 'Python', 'Java', 'Go', 'REST API', 'GraphQL'],
  'Database': ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'DynamoDB'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux'],
  'Tools': ['Git', 'Jira', 'Figma', 'Agile/Scrum', 'VS Code'],
}

export function SkillsForm() {
  const { resume, addSkill, removeSkill, setActiveStep } = useResumeStore()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const vals = input.split(',').map((s) => s.trim()).filter(Boolean)
    vals.forEach(addSkill)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  return (
    <div>
      <SectionHeader icon={Wrench} title="Skills" description="Technical and professional skills — add individual or comma-separated" />

      <div className="card p-5 mb-4">
        <div className="flex gap-2 mb-4">
          <input
            className="input-base flex-1"
            placeholder="e.g. React, Node.js, AWS, Agile"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAdd} className="btn-primary px-3">
            <Plus size={15} />
          </button>
        </div>

        {resume.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resume.skills.map((skill) => (
              <span key={skill} className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-medium dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-200">
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors ml-0.5">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Quick add suggestions</p>
          <div className="space-y-3">
            {Object.entries(SUGGESTED_SKILLS).map(([category, suggestions]) => (
              <div key={category}>
                <p className="text-xs text-muted-foreground font-medium mb-1.5">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => {
                    const added = resume.skills.includes(s)
                    return (
                      <button
                        key={s}
                        onClick={() => added ? removeSkill(s) : addSkill(s)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          added
                            ? 'bg-teal-50 text-teal-700 border-teal-300 font-medium'
                            : 'bg-card text-muted-foreground border-border hover:border-teal-300 hover:text-teal-600'
                        }`}
                      >
                        {added ? '✓ ' : '+ '}{s}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setActiveStep('education')}>← Back</button>
        <button className="btn-primary" onClick={() => setActiveStep('projects')}>Next: Projects →</button>
      </div>
    </div>
  )
}
