import type { ResumeData } from '@/types'
import { BulletList, getContactLine, getLinkLine, getResumeName, getTemplateVars, Section } from './template-utils'

export function ExecutiveTemplate({ resume }: { resume: ResumeData }) {
  const vars = getTemplateVars(resume)
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  return (
    <article className="resume-template" style={{ color: '#1e293b', fontFamily: vars.fontFamily, fontSize: vars.bodySize, lineHeight: vars.lineHeight }}>
      <header style={{ borderBottom: '1px solid #cbd5e1', marginBottom: 16, paddingBottom: 13 }}>
        <p style={{ color: vars.accent, fontSize: 8, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Executive resume</p>
        <h1 style={{ color: '#0f172a', fontSize: 27, fontWeight: 800, letterSpacing: 0, margin: '2px 0' }}>{getResumeName(resume)}</h1>
        {personal.jobTitle && <p style={{ color: '#334155', fontSize: 12, fontWeight: 700 }}>{personal.jobTitle}</p>}
        <p style={{ color: '#64748b', marginTop: 6 }}>{[getContactLine(resume), getLinkLine(resume)].filter(Boolean).join(' · ')}</p>
      </header>

      {summary && <Section title="Executive Profile" accent={vars.accent}><p>{summary}</p></Section>}
      {experiences.length > 0 && (
        <Section title="Leadership Experience" accent={vars.accent}>
          {experiences.map((exp) => (
            <div key={exp.id} style={{ marginBottom: vars.sectionGap }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <strong style={{ color: '#0f172a' }}>{exp.jobTitle}{exp.company ? `, ${exp.company}` : ''}</strong>
                <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' - ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.location && <p style={{ color: '#64748b' }}>{exp.location}</p>}
              <BulletList bullets={exp.bullets} accent={vars.accent} />
            </div>
          ))}
        </Section>
      )}
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr 1fr' }}>
        {skills.length > 0 && <Section title="Core Capabilities" accent={vars.accent}><p>{skills.join(' · ')}</p></Section>}
        {educations.length > 0 && <Section title="Education" accent={vars.accent}>{educations.map((edu) => <p key={edu.id}><strong>{edu.degree}</strong><br />{edu.institution} {edu.graduationYear}</p>)}</Section>}
      </div>
      {projects.length > 0 && <Section title="Selected Initiatives" accent={vars.accent}>{projects.map((project) => <p key={project.id}><strong>{project.name}</strong>{project.description ? ` · ${project.description}` : ''}</p>)}</Section>}
      {certifications.length > 0 && <Section title="Credentials" accent={vars.accent}>{certifications.map((cert) => <p key={cert.id}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</p>)}</Section>}
    </article>
  )
}
