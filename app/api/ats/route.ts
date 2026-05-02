import { NextRequest, NextResponse } from 'next/server'
import { scoreResume, scoreResumeHealth } from '@/lib/ats-engine/scorer'
import type { ResumeData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resume, jobDescription } = body as {
      resume: ResumeData
      jobDescription?: string
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'resume is required' },
        { status: 400 }
      )
    }

    if (jobDescription && jobDescription.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job description is too short. Please paste the full JD.' },
        { status: 400 }
      )
    }

    const result = jobDescription?.trim()
      ? scoreResume(resume, jobDescription)
      : scoreResumeHealth(resume)

    return NextResponse.json({ result })
  } catch (err) {
    console.error('[ATS API Error]', err)
    return NextResponse.json({ error: 'Failed to analyze resume.' }, { status: 500 })
  }
}
