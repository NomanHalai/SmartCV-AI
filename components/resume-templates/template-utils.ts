import type { ResumeData } from '@/types'
import type { ReactNode } from 'react'

export const accentMap = {
  indigo: '#4f46e5',
  blue: '#2563eb',
  emerald: '#059669',
  slate: '#0f172a',
  violet: '#7c3aed',
}

export function getResumeName(resume: ResumeData) {
  return [resume.personal.firstName, resume.personal.lastName].filter(Boolean).join(' ') || 'Your Name'
}

export function getContactLine(resume: ResumeData) {
  const { personal } = resume
  return [personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')
}

export function getLinkLine(resume: ResumeData) {
  const { personal } = resume
  return [personal.linkedin, personal.github, personal.website].filter(Boolean).join(' · ')
}

export function getTemplateVars(resume: ResumeData) {
  const theme = resume.theme || { accentColor: 'indigo', font: 'inter', density: 'comfortable' }
  const accent = accentMap[theme.accentColor] || accentMap.indigo
  const fontFamily =
    theme.font === 'serif'
      ? 'Georgia, Cambria, Times New Roman, serif'
      : 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif'
  const dense = theme.density === 'compact'

  return {
    accent,
    fontFamily,
    sectionGap: dense ? '10px' : '14px',
    bodySize: dense ? '10px' : '10.5px',
    lineHeight: dense ? 1.38 : 1.5,
  }
}

export function Section({
  title,
  accent,
  children,
}: {
  title: string
  accent: string
  children: ReactNode
}) {
  return (
    <section style={{ marginBottom: 12 }}>
      <h2
        style={{
          borderBottom: `1px solid ${accent}`,
          color: accent,
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: '0.14em',
          marginBottom: 6,
          paddingBottom: 3,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function BulletList({ bullets, accent }: { bullets: string[]; accent: string }) {
  const filtered = bullets.filter(Boolean)
  if (!filtered.length) return null

  return (
    <ul style={{ margin: '4px 0 0', padding: 0 }}>
      {filtered.map((bullet) => (
        <li key={bullet} style={{ display: 'flex', gap: 5, marginTop: 3 }}>
          <span style={{ color: accent, lineHeight: 1.4 }}>•</span>
          <span style={{ flex: 1 }}>{bullet}</span>
        </li>
      ))}
    </ul>
  )
}
