'use client'

import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { generateId } from '@/lib/utils'
import { Award, Plus, Trash2 } from 'lucide-react'
import type { Certification } from '@/types'

function CertCard({ cert }: { cert: Certification }) {
  const { updateCertification, removeCertification } = useResumeStore()
  const update = (key: keyof Certification, val: string) => updateCertification(cert.id, { [key]: val })

  return (
    <div className="card p-4 mb-3">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-medium text-slate-700">{cert.name || 'New Certification'}</p>
        <button onClick={() => removeCertification(cert.id)} className="btn-ghost text-red-400 p-1"><Trash2 size={13} /></button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {([
          ['Certification Name', 'name', 'AWS Solutions Architect'],
          ['Issuer', 'issuer', 'Amazon Web Services'],
          ['Date', 'date', 'Dec 2023'],
          ['Credential URL', 'url', 'credly.com/badges/...'],
        ] as [string, keyof Certification, string][]).map(([label, key, ph]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
            <input className="input-base" placeholder={ph} value={cert[key]} onChange={(e) => update(key, e.target.value)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CertificationsForm() {
  const { resume, addCertification, setActiveStep } = useResumeStore()

  const handleAdd = () =>
    addCertification({ id: generateId(), name: '', issuer: '', date: '', url: '' })

  return (
    <div>
      <SectionHeader icon={Award} title="Certifications" description="Professional certifications and licenses" />
      {resume.certifications.map((cert) => <CertCard key={cert.id} cert={cert} />)}
      <button onClick={handleAdd} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 mb-4">
        <Plus size={15} /> Add Certification
      </button>
      <div className="flex justify-between mt-2">
        <button className="btn-secondary" onClick={() => setActiveStep('projects')}>← Back</button>
        <button className="btn-primary" onClick={() => setActiveStep('summary')}>Next: Summary →</button>
      </div>
    </div>
  )
}
