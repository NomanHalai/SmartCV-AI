import type { ResumeData } from '@/types'
import { BulletList, getContactLine, getLinkLine, getResumeName, getTemplateVars, Section } from './template-utils'

export function CleanTemplate({ resume }: { resume: ResumeData }) {
  const vars = getTemplateVars(resume)
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  return (
    <article className="resume-template" style={{ color: '#1f2937', fontFamily: vars.fontFamily, fontSize: vars.bodySize, lineHeight: vars.lineHeight }}>
      <header style={{ borderBottom: `2px solid ${vars.accent}`, paddingBottom: 12, textAlign: 'center' }}>
        <h1 style={{ color: '#111827', fontSize: 24, fontWeight: 800, letterSpacing: 0, margin: 0 }}>{getResumeName(resume)}</h1>
        {personal.jobTitle && <p style={{ color: vars.accent, fontSize: 12, fontWeight: 700, marginTop: 3 }}>{personal.jobTitle}</p>}
        {getContactLine(resume) && <p style={{ color: '#64748b', marginTop: 5 }}>{getContactLine(resume)}</p>}
        {getLinkLine(resume) && <p style={{ color: vars.accent, marginTop: 2 }}>{getLinkLine(resume)}</p>}
      </header>

      <div style={{ paddingTop: 14 }}>
        {summary && <Section title="Summary" accent={vars.accent}><p>{summary}</p></Section>}
        {experiences.length > 0 && (
          <Section title="Experience" accent={vars.accent}>
            {experiences.map((exp) => (
              <div key={exp.id} style={{ marginBottom: vars.sectionGap }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong style={{ color: '#111827' }}>{exp.jobTitle}{exp.company ? ` · ${exp.company}` : ''}</strong>
                  <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' - ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <p style={{ color: '#64748b', fontStyle: 'italic' }}>{exp.location}</p>}
                <BulletList bullets={exp.bullets} accent={vars.accent} />
              </div>
            ))}
          </Section>
        )}
        {skills.length > 0 && <Section title="Skills" accent={vars.accent}><p>{skills.join(' · ')}</p></Section>}
        {projects.length > 0 && (
          <Section title="Projects" accent={vars.accent}>
            {projects.map((project) => (
              <div key={project.id} style={{ marginBottom: vars.sectionGap }}>
                <strong style={{ color: '#111827' }}>{project.name}</strong>
                {project.techStack && <span style={{ color: vars.accent }}> · {project.techStack}</span>}
                {project.description && <p>{project.description}</p>}
                <BulletList bullets={project.bullets} accent={vars.accent} />
              </div>
            ))}
          </Section>
        )}
        {educations.length > 0 && (
          <Section title="Education" accent={vars.accent}>
            {educations.map((edu) => (
              <p key={edu.id}><strong style={{ color: '#111827' }}>{edu.degree}</strong>{edu.institution ? ` · ${edu.institution}` : ''}{edu.graduationYear ? ` · ${edu.graduationYear}` : ''}</p>
            ))}
          </Section>
        )}
        {certifications.length > 0 && <Section title="Certifications" accent={vars.accent}>{certifications.map((cert) => <p key={cert.id}><strong>{cert.name}</strong>{cert.issuer ? ` · ${cert.issuer}` : ''}{cert.date ? ` · ${cert.date}` : ''}</p>)}</Section>}
      </div>
    </article>
  )
}
