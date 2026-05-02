'use client'

import { useResumeStore } from '@/store/resumeStore'

export function ResumePreview() {
  const { resume } = useResumeStore()
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(' ')
  const contact = [personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')
  const links = [personal.linkedin, personal.github, personal.website].filter(Boolean).join(' · ')

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Preview</p>
        <span className="text-xs text-slate-300">ATS-safe template</span>
      </div>

      {/* Paper */}
      <div className="flex-1 overflow-y-auto">
        <div
          className="resume-paper bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden"
          style={{ fontFamily: 'Georgia, serif', fontSize: '8.5px', lineHeight: 1.45 }}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3" style={{ background: '#0f172a', color: 'white' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'system-ui, sans-serif', marginBottom: 2 }}>
              {fullName || 'Your Name'}
            </p>
            {personal.jobTitle && (
              <p style={{ fontSize: '10px', color: '#5eead4', fontFamily: 'system-ui', marginBottom: 4 }}>
                {personal.jobTitle}
              </p>
            )}
            {contact && (
              <p style={{ fontSize: '7.5px', color: '#94a3b8', fontFamily: 'system-ui' }}>{contact}</p>
            )}
            {links && (
              <p style={{ fontSize: '7.5px', color: '#5eead4', fontFamily: 'system-ui', marginTop: 2 }}>{links}</p>
            )}
          </div>

          <div style={{ padding: '12px 20px' }}>
            {/* Summary */}
            {summary && (
              <Section title="Summary">
                <p style={{ color: '#475569' }}>{summary}</p>
              </Section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <Section title="Experience">
                {experiences.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontFamily: 'system-ui', color: '#1e293b', fontSize: 9 }}>
                        {exp.jobTitle}{exp.company ? ` — ${exp.company}` : ''}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: 7.5, fontFamily: 'system-ui', whiteSpace: 'nowrap', marginLeft: 8 }}>
                        {exp.startDate}{(exp.startDate && (exp.endDate || exp.current)) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.location && <p style={{ color: '#94a3b8', fontSize: 7, fontStyle: 'italic', marginBottom: 2 }}>{exp.location}</p>}
                    {exp.bullets.filter(Boolean).map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: 4, marginTop: 2 }}>
                        <span style={{ color: '#0d9488', marginTop: 1 }}>•</span>
                        <p style={{ color: '#475569', flex: 1 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <Section title="Education">
                {educations.map((edu) => (
                  <div key={edu.id} style={{ marginBottom: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontFamily: 'system-ui', color: '#1e293b', fontSize: 9 }}>
                        {edu.degree}
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: 7.5, fontFamily: 'system-ui' }}>{edu.graduationYear}</span>
                    </div>
                    <p style={{ color: '#64748b', fontFamily: 'system-ui' }}>
                      {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                      {edu.gpa ? `  ·  GPA: ${edu.gpa}` : ''}
                    </p>
                    {edu.honors && <p style={{ color: '#0d9488', fontFamily: 'system-ui' }}>{edu.honors}</p>}
                  </div>
                ))}
              </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <Section title="Skills">
                <p style={{ color: '#475569' }}>{skills.join('  ·  ')}</p>
              </Section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <Section title="Projects">
                {projects.map((proj) => (
                  <div key={proj.id} style={{ marginBottom: 6 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontFamily: 'system-ui', color: '#1e293b', fontSize: 9 }}>{proj.name}</span>
                      {proj.techStack && <span style={{ color: '#0d9488', fontSize: 7.5, fontFamily: 'system-ui' }}>{proj.techStack}</span>}
                    </div>
                    {proj.description && <p style={{ color: '#475569', marginTop: 1 }}>{proj.description}</p>}
                    {proj.bullets.filter(Boolean).map((b, i) => (
                      <div key={i} style={{ display: 'flex', gap: 4, marginTop: 1.5 }}>
                        <span style={{ color: '#0d9488' }}>•</span>
                        <p style={{ color: '#475569', flex: 1 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <Section title="Certifications">
                {certifications.map((cert) => (
                  <p key={cert.id} style={{ color: '#475569', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontFamily: 'system-ui', color: '#1e293b' }}>{cert.name}</span>
                    {cert.issuer ? ` — ${cert.issuer}` : ''}
                    {cert.date ? `  (${cert.date})` : ''}
                  </p>
                ))}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{
        fontSize: 7,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: '#0d9488',
        borderBottom: '0.5px solid #e2e8f0',
        paddingBottom: 3,
        marginBottom: 5,
        fontFamily: 'system-ui, sans-serif',
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}
