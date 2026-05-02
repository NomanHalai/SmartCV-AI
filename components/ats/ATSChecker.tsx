'use client'

import { useState } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Loader2, Zap, CheckCircle2, AlertTriangle, XCircle, Info, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ATSResult, ATSIssue } from '@/types'

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#0d9488' : score >= 55 ? '#f59e0b' : '#ef4444'
  const grade = score >= 93 ? 'A+' : score >= 87 ? 'A' : score >= 82 ? 'B+' : score >= 75 ? 'B' : score >= 68 ? 'C+' : score >= 60 ? 'C' : score >= 50 ? 'D' : 'F'

  return (
    <div className="flex flex-col items-center">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out, stroke 0.4s' }}
        />
        <text x="55" y="50" textAnchor="middle" fontSize="22" fontWeight="700" fill={color} fontFamily="system-ui">{score}</text>
        <text x="55" y="64" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="system-ui">out of 100</text>
        <text x="55" y="78" textAnchor="middle" fontSize="13" fontWeight="700" fill={color} fontFamily="system-ui">{grade}</text>
      </svg>
      <p className="text-xs font-medium text-slate-500 mt-1">
        {score >= 75 ? 'Strong match' : score >= 55 ? 'Needs improvement' : 'Low match — action required'}
      </p>
    </div>
  )
}

// ─── Score Breakdown Bar ──────────────────────────────────────────────────────

function ScoreBar({ label, value, weight }: { label: string; value: number; weight: string }) {
  const color = value >= 75 ? '#0d9488' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{weight} weight</span>
          <span className="text-xs font-semibold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Issue Card ───────────────────────────────────────────────────────────────

const ISSUE_STYLES: Record<ATSIssue['type'], { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
  error:   { bg: 'bg-red-50',     border: 'border-red-200',     icon: XCircle,       iconColor: 'text-red-500' },
  warning: { bg: 'bg-amber-50',   border: 'border-amber-200',   icon: AlertTriangle, iconColor: 'text-amber-500' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2,  iconColor: 'text-emerald-500' },
  info:    { bg: 'bg-blue-50',    border: 'border-blue-200',    icon: Info,          iconColor: 'text-blue-500' },
}

function IssueCard({ issue }: { issue: ATSIssue }) {
  const style = ISSUE_STYLES[issue.type]
  const Icon = style.icon
  return (
    <div className={cn('rounded-xl border p-3', style.bg, style.border)}>
      <div className="flex items-start gap-2">
        <Icon size={14} className={cn('mt-0.5 flex-shrink-0', style.iconColor)} />
        <div>
          <p className="text-xs font-semibold text-slate-700">{issue.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">{issue.description}</p>
          {issue.fix && (
            <p className="text-xs text-slate-600 mt-1 font-medium">→ {issue.fix}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main ATS Checker ─────────────────────────────────────────────────────────

export function ATSChecker() {
  const { resume, jobDescription, setJobDescription, atsResult, setATSResult } = useResumeStore()
  const [analyzing, setAnalyzing] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [bulletRewrites, setBulletRewrites] = useState<{ original: string; improved: string }[]>([])

  async function runAnalysis() {
    if (!jobDescription.trim()) return
    setAnalyzing(true)
    setAiSuggestions([])
    setBulletRewrites([])
    try {
      const res = await fetch('/api/ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription }),
      })
      const data = await res.json()
      if (data.result) setATSResult(data.result)
    } catch (err) {
      console.error(err)
    }
    setAnalyzing(false)
  }

  async function fetchAISuggestions() {
    if (!atsResult) return
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription, atsResult }),
      })
      const data = await res.json()
      if (data.suggestions) setAiSuggestions(data.suggestions)
      if (data.bulletRewrites) setBulletRewrites(data.bulletRewrites)
    } catch {
      setAiSuggestions([
        'Add missing keywords from the job description into your skills section.',
        'Quantify your achievements with specific numbers and percentages.',
        'Mirror the job title exactly in your professional headline.',
        'Expand your summary to address the top 3 requirements in the JD.',
        'Add any missing certifications relevant to this role.',
      ])
    }
    setAiLoading(false)
  }

  const result = atsResult

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: JD Input */}
      <div>
        <div className="card p-5 mb-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Paste Job Description</h3>
          <p className="text-xs text-slate-400 mb-3">The more complete the JD, the more accurate your score</p>
          <textarea
            className="textarea-base min-h-[220px] font-mono text-xs"
            placeholder={`Paste the full job description here...

Example:
We're looking for a Senior React Developer with 4+ years of experience in TypeScript, Node.js, and AWS. You'll lead frontend architecture, write clean scalable code, mentor junior developers, and collaborate with product teams to ship features...`}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <button
            onClick={runAnalysis}
            disabled={analyzing || !jobDescription.trim()}
            className="btn-primary w-full mt-3 justify-center"
          >
            {analyzing ? (
              <><Loader2 size={14} className="animate-spin" /> Analyzing resume...</>
            ) : (
              <><Zap size={14} /> Analyze ATS Compatibility</>
            )}
          </button>
        </div>

        {/* Resume completeness tip */}
        {!result && (
          <div className="card p-4 bg-slate-50 border-slate-100">
            <p className="text-xs font-semibold text-slate-600 mb-2">How scoring works</p>
            <div className="space-y-1.5 text-xs text-slate-500">
              {[
                ['35%', 'Keyword match vs. job description'],
                ['25%', 'Resume structure (summary, sections)'],
                ['15%', 'Contact info completeness'],
                ['15%', 'Action verbs in experience bullets'],
                ['10%', 'Job title alignment with JD'],
              ].map(([w, l]) => (
                <div key={w} className="flex gap-2">
                  <span className="font-semibold text-teal-600 w-8 flex-shrink-0">{w}</span>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {result && (
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-800">AI Improvement Tips</h3>
                <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">Claude AI</span>
              </div>
            </div>

            {aiSuggestions.length === 0 ? (
              <button
                onClick={fetchAISuggestions}
                disabled={aiLoading}
                className="btn-primary w-full justify-center"
              >
                {aiLoading ? <><Loader2 size={14} className="animate-spin" /> Generating suggestions...</> : <><Sparkles size={14} /> Get Personalized Suggestions</>}
              </button>
            ) : (
              <div className="space-y-2">
                {aiSuggestions.map((s, i) => (
                  <div key={i} className="flex gap-2.5 p-2.5 bg-teal-50 rounded-lg border border-teal-100">
                    <span className="text-teal-600 font-semibold text-xs flex-shrink-0 mt-0.5">{i + 1}.</span>
                    <p className="text-xs text-slate-700 leading-relaxed">{s}</p>
                  </div>
                ))}

                {bulletRewrites.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Suggested bullet rewrites:</p>
                    {bulletRewrites.map((rw, i) => (
                      <div key={i} className="mb-3 text-xs">
                        <p className="text-red-600 line-through bg-red-50 px-2 py-1 rounded mb-1">{rw.original}</p>
                        <p className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded border-l-2 border-emerald-500">{rw.improved}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Results */}
      <div>
        {result ? (
          <div className="space-y-4 animate-fade-in">
            {/* Score ring + breakdown */}
            <div className="card p-5">
              <div className="flex gap-6 items-start">
                <ScoreRing score={result.score.total} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Score Breakdown</p>
                  <ScoreBar label="Keyword Match"    value={result.score.keywordMatch}    weight="35%" />
                  <ScoreBar label="Resume Structure" value={result.score.structure}        weight="25%" />
                  <ScoreBar label="Contact Info"     value={result.score.contactInfo}      weight="15%" />
                  <ScoreBar label="Action Verbs"     value={result.score.actionVerbs}      weight="15%" />
                  <ScoreBar label="Title Alignment"  value={result.score.titleAlignment}   weight="10%" />
                </div>
              </div>
            </div>

            {/* Issues */}
            <div className="card p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Diagnostic Checks</p>
              <div className="grid grid-cols-1 gap-2">
                {result.issues.map((issue, i) => <IssueCard key={i} issue={issue} />)}
              </div>
            </div>

            {/* Keywords */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keyword Analysis</p>
                <span className="text-xs text-slate-400">
                  {result.keywords.found.length + result.keywords.partial.length} / {result.keywords.total} matched
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.found.map((kw) => (
                  <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    ✓ {kw}
                  </span>
                ))}
                {result.keywords.partial.map((kw) => (
                  <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    ~ {kw}
                  </span>
                ))}
                {result.keywords.missing.map((kw) => (
                  <span key={kw} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                    ✗ {kw}
                  </span>
                ))}
              </div>
              {result.keywords.missing.length > 0 && (
                <p className="text-xs text-slate-400 mt-3">
                  Add the red keywords naturally to your experience bullets, skills, or summary.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-10 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
              <Zap size={24} className="text-teal-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Ready to analyze</h3>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Paste a job description on the left and click Analyze to see your ATS compatibility score, keyword gaps, and improvement tips.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
