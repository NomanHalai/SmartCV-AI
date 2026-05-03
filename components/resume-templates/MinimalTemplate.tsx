import type { ResumeData } from '@/types'
import { BulletList, getContactLine, getLinkLine, getResumeName, getTemplateVars, Section } from './template-utils'

export function MinimalTemplate({ resume }: { resume: ResumeData }) {
  const vars = getTemplateVars(resume)
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  return (
    <article className="resume-template" style={{ color: '#27272a', fontFamily: vars.fontFamily, fontSize: vars.bodySize, lineHeight: vars.lineHeight }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ color: '#18181b', fontSize: 23, fontWeight: 760, margin: 0 }}>{getResumeName(resume)}</h1>
        {personal.jobTitle && <p style={{ color: vars.accent, fontWeight: 700, marginTop: 3 }}>{personal.jobTitle}</p>}
        <p style={{ color: '#71717a', marginTop: 5 }}>{[getContactLine(resume), getLinkLine(resume)].filter(Boolean).join(' · ')}</p>
      </header>

      {summary && <Section title="About" accent={vars.accent}><p>{summary}</p></Section>}
      {experiences.length > 0 && <Section title="Experience" accent={vars.accent}>{experiences.map((exp) => <div key={exp.id} style={{ marginBottom: vars.sectionGap }}><strong style={{ color: '#18181b' }}>{exp.jobTitle}</strong><p style={{ color: '#71717a' }}>{exp.company} · {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' - ' : ''}{exp.current ? 'Present' : exp.endDate}</p><BulletList bullets={exp.bullets} accent={vars.accent} /></div>)}</Section>}
      {skills.length > 0 && <Section title="Skills" accent={vars.accent}><p>{skills.join(', ')}</p></Section>}
      {projects.length > 0 && <Section title="Projects" accent={vars.accent}>{projects.map((project) => <div key={project.id} style={{ marginBottom: 8 }}><strong>{project.name}</strong>{project.techStack && <span style={{ color: '#71717a' }}> · {project.techStack}</span>}{project.description && <p>{project.description}</p>}</div>)}</Section>}
      {educations.length > 0 && <Section title="Education" accent={vars.accent}>{educations.map((edu) => <p key={edu.id}>{edu.degree} · {edu.institution} · {edu.graduationYear}</p>)}</Section>}
      {certifications.length > 0 && <Section title="Certifications" accent={vars.accent}>{certifications.map((cert) => <p key={cert.id}>{cert.name}</p>)}</Section>}
    </article>
  )
}
