'use client'

import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { User } from 'lucide-react'

export function PersonalForm() {
  const { resume, updatePersonal, setActiveStep } = useResumeStore()
  const p = resume.personal

  const field = (
    label: string,
    key: keyof typeof p,
    placeholder: string,
    type = 'text'
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={p[key]}
        onChange={(e) => updatePersonal({ [key]: e.target.value })}
        placeholder={placeholder}
        className="input-base"
      />
    </div>
  )

  return (
    <div>
      <SectionHeader
        icon={User}
        title="Personal Information"
        description="Your contact details and professional headline"
      />
      <div className="card p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {field('First Name', 'firstName', 'Arjun')}
          {field('Last Name', 'lastName', 'Mehta')}
        </div>
        {field('Job Title / Headline', 'jobTitle', 'Senior Software Engineer')}
        <div className="grid grid-cols-2 gap-4">
          {field('Email', 'email', 'arjun@example.com', 'email')}
          {field('Phone', 'phone', '+91 98765 43210', 'tel')}
        </div>
        {field('Location', 'location', 'Bengaluru, India')}
        <div className="grid grid-cols-2 gap-4">
          {field('LinkedIn URL', 'linkedin', 'linkedin.com/in/arjunmehta')}
          {field('GitHub / Portfolio', 'github', 'github.com/arjunmehta')}
        </div>
        {field('Website (optional)', 'website', 'arjunmehta.dev')}
      </div>
      <div className="flex justify-end mt-4">
        <button className="btn-primary" onClick={() => setActiveStep('experience')}>
          Next: Experience →
        </button>
      </div>
    </div>
  )
}
