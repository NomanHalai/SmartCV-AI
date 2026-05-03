import type { ResumeData } from '@/types'
import { BulletList, getContactLine, getLinkLine, getResumeName, getTemplateVars, Section } from './template-utils'

export function TechnicalTemplate({ resume }: { resume: ResumeData }) {
  const vars = getTemplateVars(resume)
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  return (
    <article className="resume-template" style={{ color: '#334155', fontFamily: vars.fontFamily, fontSize: vars.bodySize, lineHeight: vars.lineHeight }}>
      <header style={{ display: 'grid', gap: 12, gridTemplateColumns: '1.1fr 0.9fr', marginBottom: 14 }}>
        <div>
          <h1 style={{ color: '#0f172a', fontSize: 24, fontWeight: 850, margin: 0 }}>{getResumeName(resume)}</h1>
          {personal.jobTitle && <p style={{ color: vars.accent, fontSize: 12, fontWeight: 800, marginTop: 3 }}>{personal.jobTitle}</p>}
        </div>
        <div style={{ color: '#64748b', textAlign: 'right' }}>
          <p>{getContactLine(resume)}</p>
          <p style={{ color: vars.accent }}>{getLinkLine(resume)}</p>
        </div>
      </header>

      {skills.length > 0 && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, marginBottom: 13, padding: 10 }}>
          <strong style={{ color: '#0f172a' }}>Technical Skills: </strong>{skills.join(' · ')}
        </div>
      )}
      {summary && <Section title="Summary" accent={vars.accent}><p>{summary}</p></Section>}
      {experiences.length > 0 && <Section title="Engineering Experience" accent={vars.accent}>{experiences.map((exp) => <div key={exp.id} style={{ marginBottom: vars.sectionGap }}><strong style={{ color: '#0f172a' }}>{exp.jobTitle} · {exp.company}</strong><p style={{ color: '#64748b' }}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' - ' : ''}{exp.current ? 'Present' : exp.endDate}</p><BulletList bullets={exp.bullets} accent={vars.accent} /></div>)}</Section>}
      {projects.length > 0 && <Section title="Technical Projects" accent={vars.accent}>{projects.map((project) => <div key={project.id} style={{ marginBottom: 10 }}><strong style={{ color: '#0f172a' }}>{project.name}</strong>{project.techStack && <span style={{ color: vars.accent }}> · {project.techStack}</span>}{project.description && <p>{project.description}</p>}<BulletList bullets={project.bullets} accent={vars.accent} /></div>)}</Section>}
      {educations.length > 0 && <Section title="Education" accent={vars.accent}>{educations.map((edu) => <p key={edu.id}><strong>{edu.degree}</strong> · {edu.institution} · {edu.graduationYear}</p>)}</Section>}
      {certifications.length > 0 && <Section title="Certifications" accent={vars.accent}>{certifications.map((cert) => <p key={cert.id}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</p>)}</Section>}
    </article>
  )
}
