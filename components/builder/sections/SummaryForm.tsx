'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { SectionHeader } from '../SectionHeader'
import { AlignLeft, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

export function SummaryForm() {
  const { resume, updateSummary, setActiveStep } = useResumeStore()
  const [generating, setGenerating] = useState(false)

  const charCount = resume.summary.length
  const isGood = charCount >= 100 && charCount <= 600

  async function generateWithAI() {
    setGenerating(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: 'You are a professional resume writer. Write a compelling 3-sentence professional summary. Return only the summary text, no quotes, no labels.',
          messages: [{
            role: 'user',
            content: `Write a professional summary for:
Name: ${resume.personal.firstName} ${resume.personal.lastName}
Title: ${resume.personal.jobTitle}
Skills: ${resume.skills.slice(0, 8).join(', ')}
Experience: ${resume.experiences.map(e => `${e.jobTitle} at ${e.company}`).join(', ')}
Education: ${resume.educations.map(e => `${e.degree} from ${e.institution}`).join(', ')}`
          }]
        })
      })
      const data = await res.json()
      if (data.content?.[0]?.text) updateSummary(data.content[0].text)
    } catch {
      updateSummary(`Results-driven ${resume.personal.jobTitle || 'professional'} with expertise in ${resume.skills.slice(0, 3).join(', ')}. Proven track record of delivering high-impact solutions and collaborating across teams. Passionate about building scalable systems and driving measurable outcomes.`)
    }
    setGenerating(false)
  }

  return (
    <div>
      <SectionHeader icon={AlignLeft} title="Professional Summary" description="A 2–4 sentence pitch about your career and value" />
      <div className="card p-5 mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summary</label>
          <button onClick={generateWithAI} disabled={generating} className="btn-ghost text-xs text-teal-600 hover:text-teal-700 gap-1">
            {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {generating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
        <textarea
          className="textarea-base"
          rows={6}
          placeholder="Results-driven software engineer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud infrastructure. Passionate about clean code and developer experience."
          value={resume.summary}
          onChange={(e) => updateSummary(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2">
          <p className={`text-xs ${isGood ? 'text-emerald-600' : charCount > 0 ? 'text-amber-500' : 'text-muted-foreground'}`}>
            {charCount === 0 ? 'Aim for 100–600 characters' : isGood ? `✓ ${charCount} characters — great length` : `${charCount} characters — ${charCount < 100 ? 'too short' : 'consider trimming'}`}
          </p>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg border border-border">
          <p className="text-xs font-medium text-foreground mb-1.5">✓ ATS tips for your summary:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Include your exact job title from the target role</li>
            <li>• Mention 2–3 of your strongest technical skills</li>
            <li>• Add one quantified achievement or career highlight</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={() => setActiveStep('certifications')}>← Back</button>
        <Link href="/ats-checker" className="btn-primary">
          Check ATS Score →
        </Link>
      </div>
    </div>
  )
}
