'use client'

import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { generateId } from '@/lib/utils'
import { Briefcase, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2, Check } from 'lucide-react'
import { useState } from 'react'
import type { Experience } from '@/types'

function BulletAI({ jobTitle, company, onInsert }: { jobTitle: string; company: string; onInsert: (b: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [context, setContext] = useState('')
  const [inserted, setInserted] = useState<number | null>(null)

  async function generate() {
    setLoading(true)
    setSuggestions([])
    try {
      const res = await fetch('/api/generate-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: context || 'general responsibilities', jobTitle, company, action: 'generate' }),
      })
      const data = await res.json()
      setSuggestions(data.bullets || [])
    } catch {
      setSuggestions(['Led key initiatives that improved team productivity by 30%', 'Built and deployed scalable features used by 10K+ users', 'Collaborated with cross-functional teams to deliver projects on time'])
    }
    setLoading(false)
  }

  function handleInsert(b: string, i: number) {
    onInsert(b)
    setInserted(i)
    setTimeout(() => setInserted(null), 1500)
  }

  return (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-lg dark:border-blue-400/20 dark:bg-blue-400/10">
      <p className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1.5">
        <Sparkles size={11} /> AI Bullet Generator
      </p>
      <div className="flex gap-2">
        <input
          className="input-base text-xs flex-1"
          placeholder="Describe what you did (optional context)..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generate()}
        />
        <button onClick={generate} disabled={loading} className="btn-primary text-xs px-3 whitespace-nowrap">
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {loading ? '' : 'Generate'}
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-card rounded border border-blue-100 hover:border-blue-300 transition-colors dark:border-blue-400/20">
              <p className="text-xs text-foreground flex-1 leading-relaxed">{s}</p>
              <button
                onClick={() => handleInsert(s, i)}
                className={`flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium transition-colors ${inserted === i ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                {inserted === i ? <Check size={11} /> : '+ Add'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function BulletImprover({ bullet, jobTitle, company, onReplace }: { bullet: string; jobTitle: string; company: string; onReplace: (b: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [show, setShow] = useState(false)

  async function improve() {
    if (!bullet.trim()) return
    setLoading(true)
    setShow(true)
    try {
      const res = await fetch('/api/generate-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, jobTitle, company, action: 'improve' }),
      })
      const data = await res.json()
      setSuggestions(data.bullets || [])
    } catch {
      setSuggestions(['✨ ' + bullet + ' (improved version would appear here)'])
    }
    setLoading(false)
  }

  if (!bullet.trim()) return null

  return (
    <div className="relative">
      <button
        onClick={improve}
        className="text-xs text-purple-500 hover:text-purple-700 font-medium flex items-center gap-1 mt-0.5"
        title="Improve this bullet with AI"
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
        Improve
      </button>
      {show && suggestions.length > 0 && (
        <div className="absolute left-0 top-6 z-20 w-80 bg-card border border-purple-200 rounded-xl shadow-xl p-3 dark:border-purple-400/20">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-semibold text-purple-700">Improved versions</p>
            <button onClick={() => setShow(false)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
          </div>
          {suggestions.map((s, i) => (
            <div key={i} className="p-2 text-xs text-foreground border border-border rounded-lg mb-1.5 hover:border-purple-300 cursor-pointer transition-colors leading-relaxed"
              onClick={() => { onReplace(s); setShow(false) }}>
              {s}
              <span className="block text-purple-500 text-xs mt-1">Click to use →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ExpCard({ exp }: { exp: Experience }) {
  const { updateExperience, removeExperience } = useResumeStore()
  const [open, setOpen] = useState(true)
  const [showBulletAI, setShowBulletAI] = useState(false)

  const update = (key: keyof Experience, val: string | boolean | string[]) =>
    updateExperience(exp.id, { [key]: val })

  const updateBullet = (i: number, val: string) => {
    const bullets = [...exp.bullets]
    bullets[i] = val
    update('bullets', bullets)
  }

  const addBullet = (text = '') => update('bullets', [...exp.bullets, text])
  const removeBullet = (i: number) => update('bullets', exp.bullets.filter((_, idx) => idx !== i))
  const replaceBullet = (i: number, val: string) => updateBullet(i, val)

  return (
    <div className="card mb-3 overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="text-sm font-medium text-foreground">
            {exp.jobTitle || 'New Experience'}{exp.company ? ` — ${exp.company}` : ''}
          </p>
          {!open && (exp.startDate || exp.endDate) && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); removeExperience(exp.id) }}
            className="btn-ghost text-red-400 hover:text-red-600 p-1"
          >
            <Trash2 size={13} />
          </button>
          {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Job Title</label>
              <input className="input-base" placeholder="Senior Engineer" value={exp.jobTitle}
                onChange={(e) => update('jobTitle', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</label>
              <input className="input-base" placeholder="Infosys" value={exp.company}
                onChange={(e) => update('company', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Start Date</label>
              <input className="input-base" placeholder="Jan 2021" value={exp.startDate}
                onChange={(e) => update('startDate', e.target.value)} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">End Date</label>
              <input className="input-base" placeholder="Present" value={exp.endDate}
                disabled={exp.current} onChange={(e) => update('endDate', e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id={`current-${exp.id}`} checked={exp.current}
              onChange={(e) => { update('current', e.target.checked); if (e.target.checked) update('endDate', '') }}
              className="w-3.5 h-3.5 accent-teal-600" />
            <label htmlFor={`current-${exp.id}`} className="text-xs text-muted-foreground">I currently work here</label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</label>
            <input className="input-base" placeholder="Bengaluru, India" value={exp.location}
              onChange={(e) => update('location', e.target.value)} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Key Achievements
                <span className="ml-1 text-muted-foreground normal-case tracking-normal font-normal">(use numbers + action verbs)</span>
              </label>
              <button
                onClick={() => setShowBulletAI(!showBulletAI)}
                className={`text-xs flex items-center gap-1 font-medium transition-colors ${showBulletAI ? 'text-blue-600' : 'text-muted-foreground hover:text-blue-500'}`}
              >
                <Sparkles size={11} />
                AI Generate
              </button>
            </div>

            <div className="space-y-2">
              {exp.bullets.map((bullet, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="text-muted-foreground/60 mt-2.5 text-sm">•</span>
                  <div className="flex-1">
                    <textarea
                      className="textarea-base w-full"
                      rows={2}
                      placeholder="Led migration of monolith to microservices, reducing latency by 40%"
                      value={bullet}
                      onChange={(e) => updateBullet(i, e.target.value)}
                    />
                    <BulletImprover
                      bullet={bullet}
                      jobTitle={exp.jobTitle}
                      company={exp.company}
                      onReplace={(val) => replaceBullet(i, val)}
                    />
                  </div>
                  <button onClick={() => removeBullet(i)} className="btn-ghost text-red-400 mt-1 p-1">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={() => addBullet()} className="mt-2 text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              <Plus size={12} /> Add bullet point
            </button>

            {showBulletAI && (
              <BulletAI
                jobTitle={exp.jobTitle}
                company={exp.company}
                onInsert={(b) => addBullet(b)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function ExperienceForm() {
  const { resume, addExperience, setActiveStep } = useResumeStore()

  const handleAdd = () =>
    addExperience({
      id: generateId(),
      jobTitle: '', company: '', location: '',
      startDate: '', endDate: '', current: false,
      bullets: [''],
    })

  return (
    <div>
      <SectionHeader icon={Briefcase} title="Work Experience" description="List your roles from most recent to oldest" />
      {resume.experiences.map((exp) => <ExpCard key={exp.id} exp={exp} />)}
      <button
        onClick={handleAdd}
        className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-400/10 transition-all flex items-center justify-center gap-2 mb-4"
      >
        <Plus size={15} /> Add Experience
      </button>
      <div className="flex justify-between mt-2">
        <button className="btn-secondary" onClick={() => setActiveStep('personal')}>← Back</button>
        <button className="btn-primary" onClick={() => setActiveStep('education')}>Next: Education →</button>
      </div>
    </div>
  )
}
