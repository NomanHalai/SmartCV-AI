import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

// ─── PDF text extraction ───────────────────────────────────────────────────
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid build-time issues
    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(buffer)
    return data.text || ''
  } catch (err) {
    console.error('PDF parse error:', err)
    throw new Error('Failed to extract text from PDF. Make sure the file is not password-protected.')
  }
}

// ─── DOCX text extraction ──────────────────────────────────────────────────
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (err) {
    console.error('DOCX parse error:', err)
    throw new Error('Failed to extract text from DOCX.')
  }
}

// ─── Claude structured parsing ─────────────────────────────────────────────
async function parseResumeWithClaude(rawText: string) {
  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4000,
    system: `You are an expert resume parser. Extract all information from the resume text and return a STRICTLY valid JSON object.
Return ONLY the JSON object, no markdown fences, no explanation, no extra text.
Every field must be a string unless specified. Missing fields should be empty strings "".
Bullets arrays should have the actual bullet text as strings.`,
    messages: [
      {
        role: 'user',
        content: `Parse this resume into the exact JSON structure below. Extract every piece of information accurately.

RESUME TEXT:
${rawText.slice(0, 6000)}

Return this EXACT JSON structure (fill in all values from the resume):
{
  "personal": {
    "firstName": "",
    "lastName": "",
    "jobTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "github": "",
    "website": ""
  },
  "summary": "",
  "experiences": [
    {
      "id": "exp1",
      "jobTitle": "",
      "company": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "current": false,
      "bullets": ["achievement 1", "achievement 2"]
    }
  ],
  "educations": [
    {
      "id": "edu1",
      "degree": "",
      "institution": "",
      "location": "",
      "graduationYear": "",
      "gpa": "",
      "honors": ""
    }
  ],
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "id": "proj1",
      "name": "",
      "techStack": "",
      "url": "",
      "description": "",
      "bullets": []
    }
  ],
  "certifications": [
    {
      "id": "cert1",
      "name": "",
      "issuer": "",
      "date": "",
      "url": ""
    }
  ]
}`,
      },
    ],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''
  const clean = raw.replace(/```json\n?|```\n?/g, '').trim()

  try {
    return JSON.parse(clean)
  } catch {
    // Try to extract JSON from the response
    const match = clean.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Failed to parse Claude response as JSON')
  }
}

// ─── Route handler ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const fileSize = file.size

    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    let rawText = ''
    if (fileName.endsWith('.pdf')) {
      rawText = await extractPdfText(buffer)
    } else {
      rawText = await extractDocxText(buffer)
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from the file. The file may be image-based or corrupted.' },
        { status: 422 }
      )
    }

    const parsed = await parseResumeWithClaude(rawText)

    // Ensure IDs are unique
    const generateId = () => Math.random().toString(36).slice(2, 10)
    if (parsed.experiences) {
      parsed.experiences = parsed.experiences.map((e: any, i: number) => ({
        ...e,
        id: e.id || generateId(),
        bullets: Array.isArray(e.bullets) ? e.bullets.filter(Boolean) : [],
        current: e.current || false,
      }))
    }
    if (parsed.educations) {
      parsed.educations = parsed.educations.map((e: any) => ({ ...e, id: e.id || generateId() }))
    }
    if (parsed.projects) {
      parsed.projects = parsed.projects.map((p: any) => ({
        ...p,
        id: p.id || generateId(),
        bullets: Array.isArray(p.bullets) ? p.bullets.filter(Boolean) : [],
      }))
    }
    if (parsed.certifications) {
      parsed.certifications = parsed.certifications.map((c: any) => ({ ...c, id: c.id || generateId() }))
    }
    if (!Array.isArray(parsed.skills)) {
      parsed.skills = []
    }

    return NextResponse.json({ resume: parsed, rawText: rawText.slice(0, 500) })
  } catch (err: any) {
    console.error('[Parse Resume Error]', err)
    return NextResponse.json(
      { error: err.message || 'Failed to parse resume. Please try again.' },
      { status: 500 }
    )
  }
}
