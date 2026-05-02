import type { ResumeData, ATSResult, ATSScoreBreakdown, KeywordAnalysis, ATSIssue, ATSGrade } from '@/types'

// ─── Skill Taxonomies ─────────────────────────────────────────────────────────

const TECH_SKILLS = new Set([
  'react','reactjs','react.js','angular','angularjs','vue','vuejs','vue.js',
  'next.js','nextjs','nuxt','svelte','typescript','javascript','es6','html','css',
  'python','java','golang','go','rust','c++','c#','ruby','php','swift','kotlin',
  'node','nodejs','node.js','express','fastapi','django','flask','spring','rails',
  'aws','azure','gcp','google cloud','cloud','serverless','lambda',
  'docker','kubernetes','k8s','terraform','ansible','helm','jenkins','ci/cd',
  'sql','postgresql','mysql','mongodb','redis','elasticsearch','dynamodb','firebase',
  'graphql','rest','restful','grpc','websocket','kafka','rabbitmq','celery',
  'git','github','gitlab','jira','confluence','agile','scrum','kanban',
  'machine learning','deep learning','nlp','tensorflow','pytorch','scikit-learn',
  'data science','pandas','numpy','spark','hadoop','airflow',
  'linux','bash','shell','unix','windows','macos',
  'microservices','api','sdk','ci','devops','devsecops','sre',
  'jest','cypress','selenium','pytest','junit','testing','tdd','bdd',
  'figma','sketch','adobe','ux','ui','design system',
  'tableau','power bi','looker','analytics','data visualization',
  'salesforce','sap','erp','crm','zendesk',
])

const SOFT_SKILLS = new Set([
  'leadership','communication','collaboration','teamwork','problem solving',
  'analytical','critical thinking','mentoring','coaching','presentations',
  'stakeholder management','cross-functional','strategic','initiative',
  'detail-oriented','organized','adaptable','creative','innovative',
  'project management','time management','prioritization',
])

const ACTION_VERBS = new Set([
  'led','built','designed','developed','managed','implemented','improved',
  'increased','reduced','created','launched','delivered','achieved','optimized',
  'automated','scaled','mentored','architected','drove','established','spearheaded',
  'streamlined','deployed','migrated','refactored','integrated','collaborated',
  'negotiated','coordinated','facilitated','oversaw','directed','produced',
  'generated','grew','saved','cut','boosted','enhanced','accelerated',
])

const STOP_WORDS = new Set([
  'and','the','for','with','that','this','have','will','your','they','from',
  'are','but','not','you','all','can','her','was','one','our','out','day',
  'get','has','him','his','how','its','may','new','now','than','then','them',
  'been','into','more','most','over','also','both','each','such','when','where',
  'which','while','about','after','before','being','between','during','other',
  'their','there','these','those','through','under','used','using','what','who',
  'why','would','year','years','able','work','team','use','role','strong',
  'experience','skills','knowledge','ability','including','required','preferred',
  'must','should','join','help','great','good','excellent','looking','seeking',
  'candidate','position','opportunity','company','business','environment',
])

// ─── Text Utilities ───────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s.#+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(/\s+/).filter((w) => w.length > 2)
}

function extractNgrams(text: string, n: number): string[] {
  const tokens = tokenize(text)
  const ngrams: string[] = []
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '))
  }
  return ngrams
}

// ─── Resume text flattener ────────────────────────────────────────────────────

export function flattenResumeText(resume: ResumeData): string {
  const parts: string[] = [
    resume.personal.firstName,
    resume.personal.lastName,
    resume.personal.jobTitle,
    resume.personal.location,
    resume.summary,
    ...resume.skills,
    ...resume.experiences.flatMap((e) => [
      e.jobTitle, e.company, e.location, ...e.bullets,
    ]),
    ...resume.educations.flatMap((e) => [
      e.degree, e.institution, e.honors,
    ]),
    ...resume.projects.flatMap((p) => [
      p.name, p.techStack, p.description, ...p.bullets,
    ]),
    ...resume.certifications.map((c) => c.name),
  ]
  return parts.join(' ').toLowerCase()
}

// ─── Keyword Extraction from JD ──────────────────────────────────────────────

export function extractJDKeywords(jd: string): string[] {
  const text = normalizeText(jd)
  const keywords: Set<string> = new Set()

  // 1. Match known tech/soft skills (including multi-word)
  for (const skill of [...TECH_SKILLS, ...SOFT_SKILLS]) {
    if (text.includes(skill)) keywords.add(skill)
  }

  // 2. Extract high-frequency meaningful tokens
  const tokens = tokenize(jd)
  const freq: Record<string, number> = {}
  tokens.forEach((t) => {
    if (!STOP_WORDS.has(t) && t.length > 3) freq[t] = (freq[t] || 0) + 1
  })

  // 3. Add bigrams from requirements sections
  const reqSection = jd.match(/(?:requirements?|qualifications?|skills?)[:\n]([\s\S]*?)(?:\n\n|\n[A-Z]|$)/gi)?.join(' ') || jd
  const bigrams = extractNgrams(reqSection, 2)
  const bigramFreq: Record<string, number> = {}
  bigrams.forEach((bg) => {
    const words = bg.split(' ')
    if (!STOP_WORDS.has(words[0]) && !STOP_WORDS.has(words[1])) {
      bigramFreq[bg] = (bigramFreq[bg] || 0) + 1
    }
  })

  // Top single tokens
  Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([w]) => keywords.add(w))

  // Top bigrams
  Object.entries(bigramFreq)
    .filter(([, v]) => v >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([bg]) => keywords.add(bg))

  return [...keywords].slice(0, 30)
}

// ─── Scoring Functions ────────────────────────────────────────────────────────

function scoreKeywords(resumeText: string, jdKeywords: string[]): KeywordAnalysis {
  const found: string[] = []
  const missing: string[] = []
  const partial: string[] = []

  jdKeywords.forEach((kw) => {
    if (resumeText.includes(kw)) {
      found.push(kw)
    } else {
      // Check partial match (e.g. "react" matches "reactjs")
      const root = kw.replace(/[.js]+$/, '').replace(/[^a-z0-9]/g, '')
      const hasPartial = resumeText.replace(/[^a-z0-9\s]/g, ' ').includes(root)
      if (hasPartial && root.length > 3) partial.push(kw)
      else missing.push(kw)
    }
  })

  const score = Math.round(
    ((found.length + partial.length * 0.5) / Math.max(jdKeywords.length, 1)) * 100
  )

  return { found, missing, partial, total: jdKeywords.length, score }
}

function scoreStructure(resume: ResumeData): number {
  const checks = [
    resume.summary.length > 50,
    resume.experiences.length > 0,
    resume.educations.length > 0,
    resume.skills.length >= 3,
    resume.experiences.some((e) => e.bullets.some((b) => b.length > 20)),
    resume.personal.linkedin.length > 0 || resume.personal.github.length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function scoreContactInfo(resume: ResumeData): number {
  const { personal } = resume
  const checks = [
    personal.firstName.length > 0,
    personal.lastName.length > 0,
    personal.email.includes('@'),
    personal.phone.length > 6,
    personal.location.length > 0,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

function scoreActionVerbs(resume: ResumeData): number {
  const bulletText = resume.experiences
    .flatMap((e) => e.bullets)
    .join(' ')
    .toLowerCase()

  const found = [...ACTION_VERBS].filter((v) => bulletText.includes(v))
  if (resume.experiences.length === 0) return 50
  return Math.min(100, Math.round((found.length / 8) * 100))
}

function scoreTitleAlignment(resume: ResumeData, jd: string): number {
  const jobTitle = resume.personal.jobTitle.toLowerCase()
  const jdLower = jd.toLowerCase()

  if (!jobTitle) return 0

  const titleWords = jobTitle
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

  if (titleWords.length === 0) return 0

  const matches = titleWords.filter((w) => jdLower.includes(w))
  return Math.round((matches.length / titleWords.length) * 100)
}

function calculateGrade(score: number): ATSGrade {
  if (score >= 93) return 'A+'
  if (score >= 87) return 'A'
  if (score >= 82) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 68) return 'C+'
  if (score >= 60) return 'C'
  if (score >= 50) return 'D'
  return 'F'
}

// ─── Issue Detection ──────────────────────────────────────────────────────────

function detectIssues(resume: ResumeData, keywords: KeywordAnalysis): ATSIssue[] {
  const issues: ATSIssue[] = []

  // Contact info
  if (!resume.personal.email || !resume.personal.phone) {
    issues.push({
      type: 'error',
      title: 'Incomplete contact information',
      description: 'ATS systems require email and phone to process your application.',
      fix: 'Add your email address and phone number in the Personal Info section.',
    })
  } else {
    issues.push({ type: 'success', title: 'Contact info complete', description: 'Name, email, and phone detected.' })
  }

  // Summary
  if (resume.summary.length < 50) {
    issues.push({
      type: 'warning',
      title: 'Missing professional summary',
      description: 'Summaries are parsed first by ATS — missing one hurts your score.',
      fix: 'Write a 2–4 sentence summary tailored to the target role.',
    })
  } else {
    issues.push({ type: 'success', title: 'Professional summary present', description: 'Summary section detected and will be parsed.' })
  }

  // Keywords
  if (keywords.score < 40) {
    issues.push({
      type: 'error',
      title: 'Critical keyword gaps',
      description: `Only ${keywords.found.length} of ${keywords.total} required keywords found.`,
      fix: `Add these missing skills: ${keywords.missing.slice(0, 5).join(', ')}`,
    })
  } else if (keywords.score < 70) {
    issues.push({
      type: 'warning',
      title: 'Keyword coverage needs improvement',
      description: `${keywords.missing.length} keywords from the JD are missing from your resume.`,
      fix: 'Incorporate missing keywords naturally in your experience bullets and skills.',
    })
  } else {
    issues.push({ type: 'success', title: 'Strong keyword coverage', description: `${keywords.found.length}/${keywords.total} job keywords matched.` })
  }

  // Quantification
  const allBullets = resume.experiences.flatMap((e) => e.bullets).join(' ')
  const hasNumbers = /\d+/.test(allBullets)
  if (resume.experiences.length > 0 && !hasNumbers) {
    issues.push({
      type: 'warning',
      title: 'No quantified achievements',
      description: 'Bullets without numbers score lower on ATS ranking algorithms.',
      fix: 'Add metrics: percentages, dollar amounts, team sizes, time saved.',
    })
  } else if (hasNumbers) {
    issues.push({ type: 'success', title: 'Quantified achievements detected', description: 'Good — metrics improve ATS ranking.' })
  }

  // ATS format safety
  issues.push({
    type: 'info',
    title: 'ATS-safe format',
    description: 'Plain text format — no tables, columns, or graphics that confuse parsers.',
  })

  // LinkedIn
  if (!resume.personal.linkedin) {
    issues.push({
      type: 'warning',
      title: 'No LinkedIn URL',
      description: '87% of recruiters check LinkedIn — include it.',
      fix: 'Add your LinkedIn profile URL.',
    })
  }

  return issues.slice(0, 6)
}

// ─── Main ATS Scorer ──────────────────────────────────────────────────────────

export function scoreResume(resume: ResumeData, jobDescription: string): ATSResult {
  const resumeText = flattenResumeText(resume)
  const jdKeywords = extractJDKeywords(jobDescription)

  const keywordAnalysis = scoreKeywords(resumeText, jdKeywords)
  const structureScore = scoreStructure(resume)
  const contactScore = scoreContactInfo(resume)
  const actionVerbScore = scoreActionVerbs(resume)
  const titleScore = scoreTitleAlignment(resume, jobDescription)

  const total = Math.round(
    keywordAnalysis.score * 0.35 +
    structureScore * 0.25 +
    contactScore * 0.15 +
    actionVerbScore * 0.15 +
    titleScore * 0.10
  )

  const scoreBreakdown: ATSScoreBreakdown = {
    keywordMatch: keywordAnalysis.score,
    structure: structureScore,
    contactInfo: contactScore,
    actionVerbs: actionVerbScore,
    titleAlignment: titleScore,
    total,
    grade: calculateGrade(total),
  }

  const issues = detectIssues(resume, keywordAnalysis)

  return {
    score: scoreBreakdown,
    keywords: keywordAnalysis,
    issues,
    suggestions: [],
    timestamp: Date.now(),
  }
}
