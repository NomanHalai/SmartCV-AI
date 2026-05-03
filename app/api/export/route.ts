import { NextRequest, NextResponse } from 'next/server'
import { requireAuthSession } from '@/lib/auth/require-session'
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
  ShadingType,
} from 'docx'
import type { ResumeData } from '@/types'

export const runtime = 'nodejs'

function buildDocx(resume: ResumeData): Document {
  const { personal, summary, experiences, educations, skills, projects, certifications } = resume

  const sectionHeading = (text: string) =>
    new Paragraph({
      text: text.toUpperCase(),
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '0D9488' },
      },
    })

  const bullet = (text: string) =>
    new Paragraph({
      text: `• ${text}`,
      spacing: { after: 60 },
      indent: { left: 360 },
    })

  const children: Paragraph[] = [
    // Header
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${personal.firstName} ${personal.lastName}`,
          bold: true,
          size: 36,
          color: '0F172A',
        }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: personal.jobTitle,
          size: 24,
          color: '0D9488',
        }),
      ],
      spacing: { after: 60 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: [personal.email, personal.phone, personal.location]
            .filter(Boolean)
            .join('  |  '),
          size: 18,
          color: '64748B',
        }),
      ],
      spacing: { after: 40 },
    }),
    ...(personal.linkedin || personal.github
      ? [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: [personal.linkedin, personal.github].filter(Boolean).join('  |  '),
                size: 18,
                color: '0D9488',
              }),
            ],
            spacing: { after: 200 },
          }),
        ]
      : []),

    // Summary
    ...(summary
      ? [
          sectionHeading('Professional Summary'),
          new Paragraph({ text: summary, spacing: { after: 120 } }),
        ]
      : []),

    // Experience
    ...(experiences.length > 0
      ? [
          sectionHeading('Work Experience'),
          ...experiences.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.jobTitle, bold: true, size: 22 }),
                new TextRun({ text: `  —  ${exp.company}`, size: 22, color: '475569' }),
                new TextRun({
                  text: `   ${exp.startDate}${exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}`,
                  size: 20,
                  color: '94A3B8',
                }),
              ],
              spacing: { before: 120, after: 40 },
            }),
            ...(exp.location
              ? [new Paragraph({ text: exp.location, spacing: { after: 40 }, children: [new TextRun({ text: exp.location, size: 18, color: '94A3B8', italics: true })] })]
              : []),
            ...exp.bullets.filter(Boolean).map(bullet),
          ]),
        ]
      : []),

    // Education
    ...(educations.length > 0
      ? [
          sectionHeading('Education'),
          ...educations.flatMap((edu) => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true, size: 22 }),
                new TextRun({ text: `  —  ${edu.institution}`, size: 22, color: '475569' }),
                ...(edu.graduationYear
                  ? [new TextRun({ text: `   ${edu.graduationYear}`, size: 20, color: '94A3B8' })]
                  : []),
              ],
              spacing: { before: 80, after: 40 },
            }),
            ...(edu.gpa || edu.honors
              ? [new Paragraph({
                  children: [new TextRun({ text: [edu.gpa && `GPA: ${edu.gpa}`, edu.honors].filter(Boolean).join('  ·  '), size: 18, color: '64748B' })],
                  spacing: { after: 80 },
                })]
              : []),
          ]),
        ]
      : []),

    // Skills
    ...(skills.length > 0
      ? [
          sectionHeading('Skills'),
          new Paragraph({
            text: skills.join('  ·  '),
            spacing: { after: 120 },
          }),
        ]
      : []),

    // Projects
    ...(projects.length > 0
      ? [
          sectionHeading('Projects'),
          ...projects.flatMap((proj) => [
            new Paragraph({
              children: [
                new TextRun({ text: proj.name, bold: true, size: 22 }),
                ...(proj.techStack ? [new TextRun({ text: `  ·  ${proj.techStack}`, size: 20, color: '0D9488' })] : []),
              ],
              spacing: { before: 80, after: 40 },
            }),
            ...(proj.description ? [new Paragraph({ text: proj.description, spacing: { after: 40 } })] : []),
            ...proj.bullets.filter(Boolean).map(bullet),
          ]),
        ]
      : []),

    // Certifications
    ...(certifications.length > 0
      ? [
          sectionHeading('Certifications'),
          ...certifications.map(
            (cert) =>
              new Paragraph({
                children: [
                  new TextRun({ text: cert.name, bold: true }),
                  new TextRun({ text: `  —  ${cert.issuer}`, color: '64748B' }),
                  ...(cert.date ? [new TextRun({ text: `  (${cert.date})`, color: '94A3B8' })] : []),
                ],
                spacing: { after: 60 },
              })
          ),
        ]
      : []),
  ]

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 1080, bottom: 720, left: 1080 },
          },
        },
        children,
      },
    ],
  })
}

export async function POST(req: NextRequest) {
  try {
    await requireAuthSession()
    const { resume, format } = await req.json() as {
      resume: ResumeData
      format: 'docx' | 'pdf'
    }

    if (!resume) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 })
    }

    if (format === 'docx') {
      const doc = buildDocx(resume)
      const buffer = await Packer.toBuffer(doc)
      const body = new Uint8Array(buffer)
      const name = `${resume.personal.firstName}_${resume.personal.lastName}_Resume.docx`
        .replace(/\s+/g, '_')

      return new NextResponse(body, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${name}"`,
        },
      })
    }

    return NextResponse.json({ error: 'Unsupported format. Use docx.' }, { status: 400 })
  } catch (err) {
    console.error('[Export API Error]', err)
    return NextResponse.json({ error: 'Export failed.' }, { status: 500 })
  }
}
