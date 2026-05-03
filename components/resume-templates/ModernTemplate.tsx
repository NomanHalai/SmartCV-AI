import type { ResumeData } from '@/types'
import { BulletList, getContactLine, getLinkLine, getResumeName, getTemplateVars, Section } from './template-utils'

export function ModernTemplate({ resume }: { resume: ResumeData }) {
  const vars = getTemplateVars(resume)
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  return (
    <article className="resume-template" style={{ color: '#334155', fontFamily: vars.fontFamily, fontSize: vars.bodySize, lineHeight: vars.lineHeight }}>
      <header style={{ background: '#0f172a', borderRadius: 14, color: 'white', marginBottom: 14, padding: '18px 20px' }}>
        <h1 style={{ fontSize: 25, fontWeight: 850, letterSpacing: 0, margin: 0 }}>{getResumeName(resume)}</h1>
        {personal.jobTitle && <p style={{ color: '#c7d2fe', fontSize: 12, fontWeight: 700, marginTop: 4 }}>{personal.jobTitle}</p>}
        <p style={{ color: '#cbd5e1', marginTop: 8 }}>{[getContactLine(resume), getLinkLine(resume)].filter(Boolean).join(' · ')}</p>
      </header>

      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1.55fr 0.85fr' }}>
        <main>
          {summary && <Section title="Profile" accent={vars.accent}><p>{summary}</p></Section>}
          {experiences.length > 0 && (
            <Section title="Experience" accent={vars.accent}>
              {experiences.map((exp) => (
                <div key={exp.id} style={{ marginBottom: vars.sectionGap }}>
                  <strong style={{ color: '#0f172a' }}>{exp.jobTitle}</strong>
                  <p style={{ color: vars.accent, fontWeight: 700 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <p style={{ color: '#64748b' }}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' - ' : ''}{exp.current ? 'Present' : exp.endDate}</p>
                  <BulletList bullets={exp.bullets} accent={vars.accent} />
                </div>
              ))}
            </Section>
          )}
          {projects.length > 0 && (
            <Section title="Projects" accent={vars.accent}>
              {projects.map((project) => (
                <div key={project.id} style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#0f172a' }}>{project.name}</strong>
                  {project.techStack && <span style={{ color: vars.accent }}> · {project.techStack}</span>}
                  {project.description && <p>{project.description}</p>}
                  <BulletList bullets={project.bullets} accent={vars.accent} />
                </div>
              ))}
            </Section>
          )}
        </main>

        <aside>
          {skills.length > 0 && <Section title="Skills" accent={vars.accent}><p>{skills.join(' · ')}</p></Section>}
          {educations.length > 0 && <Section title="Education" accent={vars.accent}>{educations.map((edu) => <p key={edu.id} style={{ marginBottom: 8 }}><strong style={{ color: '#0f172a' }}>{edu.degree}</strong><br />{edu.institution}<br />{edu.graduationYear}</p>)}</Section>}
          {certifications.length > 0 && <Section title="Certifications" accent={vars.accent}>{certifications.map((cert) => <p key={cert.id} style={{ marginBottom: 6 }}>{cert.name}{cert.issuer ? ` · ${cert.issuer}` : ''}</p>)}</Section>}
        </aside>
      </div>
    </article>
  )
}
