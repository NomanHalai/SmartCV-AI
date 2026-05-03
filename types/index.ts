// ─── Resume Data Types ────────────────────────────────────────────────────────

export interface PersonalInfo {
  firstName: string
  lastName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
}

export interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location: string
  graduationYear: string
  gpa: string
  honors: string
}

export interface Project {
  id: string
  name: string
  techStack: string
  url: string
  description: string
  bullets: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  url: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  experiences: Experience[]
  educations: Education[]
  skills: string[]
  projects: Project[]
  certifications: Certification[]
  template: TemplateId
  theme: ResumeTheme
}

export type TemplateId = 'clean' | 'modern' | 'executive' | 'technical' | 'minimal'

export interface ResumeTheme {
  accentColor: 'indigo' | 'blue' | 'emerald' | 'slate' | 'violet'
  font: 'inter' | 'serif'
  density: 'compact' | 'comfortable'
}

// ─── ATS Types ────────────────────────────────────────────────────────────────

export interface ATSScoreBreakdown {
  keywordMatch: number      // 35% weight
  structure: number         // 25% weight
  contactInfo: number       // 15% weight
  actionVerbs: number       // 15% weight
  titleAlignment: number    // 10% weight
  total: number
  grade: ATSGrade
}

export type ATSGrade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'

export interface KeywordAnalysis {
  found: string[]
  missing: string[]
  partial: string[]
  total: number
  score: number
}

export interface ATSIssue {
  type: 'error' | 'warning' | 'success' | 'info'
  title: string
  description: string
  fix?: string
}

export interface ATSResult {
  score: ATSScoreBreakdown
  keywords: KeywordAnalysis
  issues: ATSIssue[]
  suggestions: string[]
  timestamp: number
}

// ─── Builder Step Types ───────────────────────────────────────────────────────

export type BuilderStep =
  | 'personal'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'summary'

export interface BuilderStepConfig {
  id: BuilderStep
  label: string
  description: string
  icon: string
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ATSAPIResponse {
  result: ATSResult
  error?: string
}

export interface AISuggestionsResponse {
  suggestions: string[]
  bulletRewrites?: { original: string; improved: string }[]
  error?: string
}

export interface ExportResponse {
  url?: string
  error?: string
}
