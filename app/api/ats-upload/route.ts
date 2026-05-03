import { NextRequest, NextResponse } from 'next/server'
import { requireAuthSession } from '@/lib/auth/require-session'
import { scoreResumeHealth } from '@/lib/ats-engine/scorer'
import type { ResumeData } from '@/types'

export const runtime = 'nodejs'

const COMMON_SKILLS = [
  'react',
  'next.js',
  'typescript',
  'javascript',
  'node.js',
  'python',
  'java',
  'sql',
  'postgresql',
  'mongodb',
  'aws',
  'azure',
  'gcp',
  'docker',
  'kubernetes',
  'firebase',
  'tailwind',
  'figma',
  'analytics',
  'leadership',
  'communication',
  'project management',
  'agile',
  'scrum',
]

async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdfParse = (await import('pdf-parse')).default
  const data = await pdfParse(buffer)
  return data.text || ''
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value || ''
}

function toResumeData(rawText: string): ResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const text = rawText.toLowerCase()
  const email = rawText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || ''
  const phone = rawText.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] || ''
  const firstLine = lines.find((line) => !line.includes('@') && !/\d{4,}/.test(line)) || ''
  const [firstName = '', ...lastParts] = firstLine.split(/\s+/)
  const jobTitle = lines.find((line) =>
    /(engineer|developer|designer|manager|analyst|specialist|consultant|lead|director|intern)/i.test(line),
  ) || ''

  const skills = COMMON_SKILLS.filter((skill) => text.includes(skill))
  const bullets = lines
    .filter((line) => /^[-•*]/.test(line) || /\b(led|built|managed|created|improved|increased|reduced|developed|designed|launched)\b/i.test(line))
    .map((line) => line.replace(/^[-•*]\s*/, ''))
    .slice(0, 8)

  return {
    personal: {
      firstName,
      lastName: lastParts.join(' '),
      jobTitle,
      email,
      phone,
      location: '',
      linkedin: rawText.match(/linkedin\.com\/[^\s)]+/i)?.[0] || '',
      github: rawText.match(/github\.com\/[^\s)]+/i)?.[0] || '',
      website: '',
    },
    summary: lines.slice(0, 8).join(' ').slice(0, 700),
    experiences: bullets.length
      ? [
          {
            id: 'uploaded-exp',
            jobTitle,
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            bullets,
          },
        ]
      : [],
    educations: /(bachelor|master|degree|university|college|b\.tech|m\.tech|mba)/i.test(rawText)
      ? [
          {
            id: 'uploaded-edu',
            degree: 'Education detected',
            institution: '',
            location: '',
            graduationYear: '',
            gpa: '',
            honors: '',
          },
        ]
      : [],
    skills,
    projects: [],
    certifications: /(certified|certification|certificate)/i.test(rawText)
      ? [
          {
            id: 'uploaded-cert',
            name: 'Certification detected',
            issuer: '',
            date: '',
            url: '',
          },
        ]
      : [],
    template: 'clean',
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuthSession()
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const rawText = fileName.endsWith('.pdf') ? await extractPdfText(buffer) : await extractDocxText(buffer)

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from this resume. Try a text-based PDF or DOCX.' },
        { status: 422 },
      )
    }

    const resume = toResumeData(rawText)
    const result = scoreResumeHealth(resume)

    return NextResponse.json({ result, resume })
  } catch (err) {
    console.error('[ATS Upload API Error]', err)
    return NextResponse.json({ error: 'Failed to analyze uploaded resume.' }, { status: 500 })
  }
}
