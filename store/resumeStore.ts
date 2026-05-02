import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ResumeData,
  PersonalInfo,
  Experience,
  Education,
  Project,
  Certification,
  BuilderStep,
  ATSResult,
  TemplateId,
} from '@/types'

// ─── Default empty state ──────────────────────────────────────────────────────

const defaultPersonal: PersonalInfo = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  website: '',
}

const defaultResumeData: ResumeData = {
  personal: defaultPersonal,
  summary: '',
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
  template: 'clean',
}

// ─── Store Interface ──────────────────────────────────────────────────────────

interface ResumeStore {
  // Data
  resume: ResumeData
  activeStep: BuilderStep
  atsResult: ATSResult | null
  jobDescription: string
  isAnalyzing: boolean
  isFetchingSuggestions: boolean

  // Personal info actions
  updatePersonal: (data: Partial<PersonalInfo>) => void
  updateSummary: (summary: string) => void

  // Experience actions
  addExperience: (exp: Experience) => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  removeExperience: (id: string) => void
  reorderExperiences: (ids: string[]) => void

  // Education actions
  addEducation: (edu: Education) => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void

  // Skills actions
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  setSkills: (skills: string[]) => void

  // Project actions
  addProject: (proj: Project) => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void

  // Certification actions
  addCertification: (cert: Certification) => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // Template
  setTemplate: (template: TemplateId) => void

  // Navigation
  setActiveStep: (step: BuilderStep) => void

  // ATS
  setJobDescription: (jd: string) => void
  setATSResult: (result: ATSResult | null) => void
  setIsAnalyzing: (v: boolean) => void
  setIsFetchingSuggestions: (v: boolean) => void

  // Utility
  resetResume: () => void
  getCompletionPercentage: () => number
}

// ─── Store Implementation ─────────────────────────────────────────────────────

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: defaultResumeData,
      activeStep: 'personal',
      atsResult: null,
      jobDescription: '',
      isAnalyzing: false,
      isFetchingSuggestions: false,

      updatePersonal: (data) =>
        set((s) => ({ resume: { ...s.resume, personal: { ...s.resume.personal, ...data } } })),

      updateSummary: (summary) =>
        set((s) => ({ resume: { ...s.resume, summary } })),

      addExperience: (exp) =>
        set((s) => ({ resume: { ...s.resume, experiences: [...s.resume.experiences, exp] } })),

      updateExperience: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experiences: s.resume.experiences.map((e) => (e.id === id ? { ...e, ...data } : e)),
          },
        })),

      removeExperience: (id) =>
        set((s) => ({
          resume: { ...s.resume, experiences: s.resume.experiences.filter((e) => e.id !== id) },
        })),

      reorderExperiences: (ids) =>
        set((s) => ({
          resume: {
            ...s.resume,
            experiences: ids.map((id) => s.resume.experiences.find((e) => e.id === id)!),
          },
        })),

      addEducation: (edu) =>
        set((s) => ({ resume: { ...s.resume, educations: [...s.resume.educations, edu] } })),

      updateEducation: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            educations: s.resume.educations.map((e) => (e.id === id ? { ...e, ...data } : e)),
          },
        })),

      removeEducation: (id) =>
        set((s) => ({
          resume: { ...s.resume, educations: s.resume.educations.filter((e) => e.id !== id) },
        })),

      addSkill: (skill) =>
        set((s) => {
          if (s.resume.skills.includes(skill)) return s
          return { resume: { ...s.resume, skills: [...s.resume.skills, skill] } }
        }),

      removeSkill: (skill) =>
        set((s) => ({ resume: { ...s.resume, skills: s.resume.skills.filter((sk) => sk !== skill) } })),

      setSkills: (skills) =>
        set((s) => ({ resume: { ...s.resume, skills } })),

      addProject: (proj) =>
        set((s) => ({ resume: { ...s.resume, projects: [...s.resume.projects, proj] } })),

      updateProject: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            projects: s.resume.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
          },
        })),

      removeProject: (id) =>
        set((s) => ({
          resume: { ...s.resume, projects: s.resume.projects.filter((p) => p.id !== id) },
        })),

      addCertification: (cert) =>
        set((s) => ({ resume: { ...s.resume, certifications: [...s.resume.certifications, cert] } })),

      updateCertification: (id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            certifications: s.resume.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
          },
        })),

      removeCertification: (id) =>
        set((s) => ({
          resume: { ...s.resume, certifications: s.resume.certifications.filter((c) => c.id !== id) },
        })),

      setTemplate: (template) =>
        set((s) => ({ resume: { ...s.resume, template } })),

      setActiveStep: (step) => set({ activeStep: step }),
      setJobDescription: (jobDescription) => set({ jobDescription }),
      setATSResult: (atsResult) => set({ atsResult }),
      setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
      setIsFetchingSuggestions: (isFetchingSuggestions) => set({ isFetchingSuggestions }),

      resetResume: () =>
        set({ resume: defaultResumeData, atsResult: null, jobDescription: '' }),

      getCompletionPercentage: () => {
        const { resume } = get()
        const checks = [
          resume.personal.firstName.length > 0,
          resume.personal.email.length > 0,
          resume.personal.phone.length > 0,
          resume.experiences.length > 0,
          resume.educations.length > 0,
          resume.skills.length >= 3,
          resume.summary.length > 30,
          resume.projects.length > 0,
        ]
        return Math.round((checks.filter(Boolean).length / checks.length) * 100)
      },
    }),
    {
      name: 'resume-builder-storage',
      partialize: (state) => ({
        resume: state.resume,
        jobDescription: state.jobDescription,
        atsResult: state.atsResult,
      }),
    }
  )
)
