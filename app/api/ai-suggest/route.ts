import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { ResumeData, ATSResult } from '@/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { resume, jobDescription, atsResult } = await req.json() as {
      resume: ResumeData
      jobDescription: string
      atsResult: ATSResult
    }

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resumeSummary = `
Name: ${resume.personal.firstName} ${resume.personal.lastName}
Title: ${resume.personal.jobTitle}
Summary: ${resume.summary}
Skills: ${resume.skills.join(', ')}
Experience: ${resume.experiences.map((e) => `${e.jobTitle} at ${e.company} — ${e.bullets.join('; ')}`).join('\n')}
Education: ${resume.educations.map((e) => `${e.degree} from ${e.institution}`).join(', ')}
    `.trim()

    const missingKeywords = atsResult?.keywords?.missing?.slice(0, 10).join(', ') || 'N/A'
    const currentScore = atsResult?.score?.total || 0

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system: `You are an expert ATS resume consultant and career coach. 
Analyze the resume against the job description and provide highly specific, actionable advice.
Return ONLY a valid JSON object with this exact shape:
{
  "suggestions": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"],
  "bulletRewrites": [
    { "original": "original bullet text", "improved": "improved bullet with metrics and action verb" }
  ]
}
No markdown, no extra text. Pure JSON only.`,
      messages: [
        {
          role: 'user',
          content: `Resume Data:
${resumeSummary}

Job Description:
${jobDescription.slice(0, 1000)}

Current ATS Score: ${currentScore}/100
Missing Keywords: ${missingKeywords}

Provide 5 specific improvement tips and rewrite 2 experience bullets from the resume to be stronger. 
Focus on: incorporating missing keywords naturally, quantifying achievements, and stronger action verbs.`,
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

    let parsed
    try {
      const clean = rawText.replace(/```json|```/g, '').trim()
      parsed = JSON.parse(clean)
    } catch {
      parsed = {
        suggestions: [
          `Add these missing keywords to your resume: ${missingKeywords}`,
          'Quantify your achievements with specific percentages, dollar amounts, or team sizes.',
          'Tailor your professional summary to directly mirror the job title and core requirements.',
          'Use stronger action verbs: "Architected", "Spearheaded", "Optimized", "Scaled".',
          'Add a LinkedIn profile URL and ensure it matches your resume content.',
        ],
        bulletRewrites: [],
      }
    }

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('[AI Suggest API Error]', err)
    return NextResponse.json({ error: 'Failed to generate suggestions.' }, { status: 500 })
  }
}
