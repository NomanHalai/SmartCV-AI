import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { bullet, jobTitle, company, action } = await req.json() as {
      bullet: string
      jobTitle?: string
      company?: string
      action: 'improve' | 'generate'
    }

    const system = `You are an expert resume writer specializing in ATS-optimized bullet points.
Rules for strong bullets:
1. Start with a strong action verb (Led, Built, Designed, Increased, Reduced, etc.)
2. Include quantifiable metrics (%, $, numbers, time saved)
3. Show impact, not just tasks
4. Keep it concise (1-2 lines max)
5. Use past tense
Return ONLY a JSON array of 3 improved bullet point strings. No labels, no markdown.`

    const userMessage = action === 'improve'
      ? `Improve this resume bullet point for a ${jobTitle || 'professional'} at ${company || 'a company'}:
"${bullet}"
Return 3 improved versions as a JSON array of strings.`
      : `Generate 3 strong resume bullet points for a ${jobTitle || 'professional'} role${company ? ` at ${company}` : ''}.
Context: ${bullet}
Return as a JSON array of 3 strings.`

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 600,
      system,
      messages: [{ role: 'user', content: userMessage }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : '[]'
    const clean = raw.replace(/```json\n?|```\n?/g, '').trim()

    let bullets: string[]
    try {
      bullets = JSON.parse(clean)
    } catch {
      const match = clean.match(/\[[\s\S]*\]/)
      bullets = match ? JSON.parse(match[0]) : [clean]
    }

    return NextResponse.json({ bullets })
  } catch (err: any) {
    console.error('[Generate Bullet Error]', err)
    return NextResponse.json({ error: err.message || 'Failed to generate bullet.' }, { status: 500 })
  }
}
