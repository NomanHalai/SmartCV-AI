'use client'

import { ATSChecker } from '@/components/ats/ATSChecker'
import Link from 'next/link'
import { ArrowLeft, LayoutDashboard, Sparkles } from 'lucide-react'
import { BrandLogo } from '@/components/saas/brand-logo'
import { Badge } from '@/components/ui/badge'
import { ProtectedRoute } from '@/components/saas/protected-route'
import { ThemeToggle } from '@/components/saas/theme-toggle'

export default function ATSPage() {
  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/90 border-b border-border px-6 py-3 flex items-center justify-between gap-4 backdrop-blur-xl">
        <BrandLogo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/dashboard" className="btn-ghost hidden sm:inline-flex">
            <LayoutDashboard size={15} />
            Dashboard
          </Link>
          <Link href="/builder" className="btn-secondary">
            <ArrowLeft size={15} />
            Back to Builder
          </Link>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Badge><Sparkles size={14} /> ATS Score Checker</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Check resume ATS health</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">Scan your built resume or upload a PDF/DOCX resume to check structure, keyword signal, contact details, action verbs, and formatting readiness.</p>
        </div>
        <ATSChecker />
      </div>
    </div>
    </ProtectedRoute>
  )
}
