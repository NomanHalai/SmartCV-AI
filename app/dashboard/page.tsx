'use client'

import {
  Bell,
  ChevronRight,
  Download,
  FileText,
  Home,
  LayoutTemplate,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Sparkles,
  UploadCloud,
  UserRound,
  WandSparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { BrandLogo } from '@/components/saas/brand-logo'
import { ProtectedRoute } from '@/components/saas/protected-route'
import { ThemeToggle } from '@/components/saas/theme-toggle'
import { useAuth } from '@/components/saas/auth-provider'
import { ScoreRing } from '@/components/saas/score-ring'
import { TemplateCard } from '@/components/saas/template-card'
import { assistantActions, dashboardMetrics, recentResumes, templates } from '@/components/saas/product-data'

const nav = [
  { label: 'Dashboard', icon: Home, href: '/dashboard', active: true },
  { label: 'My Resumes', icon: FileText, href: '/builder' },
  { label: 'Templates', icon: LayoutTemplate, href: '/templates' },
  { label: 'ATS Score Checker', icon: Sparkles, href: '/ats-checker' },
  { label: 'Settings', icon: Settings, href: '#' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <ProtectedRoute>
    <main className="min-h-screen overflow-x-hidden bg-background">
      <div className="grid min-h-screen min-w-0 lg:grid-cols-[240px_minmax(0,1fr)] 2xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden min-w-0 overflow-hidden border-r border-border bg-card/90 p-4 backdrop-blur-xl lg:block 2xl:p-5">
          <BrandLogo />
          <Button href="/builder" className="mt-8 w-full px-3">
            <Plus size={16} />
            <span className="truncate">Create New Resume</span>
          </Button>
          <nav className="mt-6 space-y-2">
            {nav.map(({ label, icon: Icon, href, active }) => (
              <a
                key={label}
                href={href}
                className={`flex min-w-0 items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-400/20 dark:text-indigo-200'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon size={17} className="shrink-0" />
                <span className="truncate">{label}</span>
              </a>
            ))}
          </nav>
          <Card className="mt-8 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                <WandSparkles size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">Go Pro</p>
                <p className="truncate text-xs text-muted-foreground">Unlock premium AI tools</p>
              </div>
            </div>
            <Button href="/pricing" size="sm" className="mt-4 w-full">Upgrade</Button>
          </Card>
        </aside>

        <section className="min-w-0 overflow-x-hidden">
          <header className="sticky top-0 z-40 border-b border-border bg-card/80 px-4 py-4 backdrop-blur-xl">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="flex items-center gap-3 lg:hidden">
                <Button variant="secondary" size="icon" aria-label="Open navigation"><Menu size={18} /></Button>
                <BrandLogo compact />
              </div>
              <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground lg:flex">
                <Search size={16} className="shrink-0" />
                <span className="truncate">Search resumes, templates, keywords...</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="secondary" className="hidden px-3 xl:inline-flex"><UploadCloud size={16} /> Import</Button>
                <ThemeToggle />
                <Button variant="secondary" size="icon" aria-label="Notifications"><Bell size={18} /></Button>
                <div className="hidden max-w-[170px] items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 xl:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-200">
                    <UserRound size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">{user?.name || 'SmartCV User'}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{user?.email || 'user@email.com'}</p>
                  </div>
                </div>
                <Button type="button" variant="ghost" onClick={logout} className="hidden px-3 2xl:inline-flex">Log out</Button>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1180px] px-4 py-8 2xl:max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <Badge>
                  <Sparkles size={14} />
                  AI career workspace
                </Badge>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Dashboard</h1>
                <p className="mt-2 text-sm text-muted-foreground">Welcome back, {user?.name?.split(' ')[0] || 'there'}. Your resume pipeline is getting sharper.</p>
              </div>
              <Button href="/builder">Create resume <Plus size={16} /></Button>
            </div>

            <div className="mt-8 grid min-w-0 gap-5 md:grid-cols-2 2xl:grid-cols-4">
              {dashboardMetrics.map(({ label, value, change, icon: Icon }, index) => (
                <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</p>
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/20 dark:text-indigo-200">
                        <Icon size={20} />
                      </div>
                    </div>
                    <p className="mt-4 text-xs font-semibold text-emerald-600">{change}</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="min-w-0 space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-foreground">Recent resumes</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Track score changes and export status.</p>
                    </div>
                    <Button href="/builder" variant="secondary" size="sm">View all</Button>
                  </div>
                  <div className="mt-5 divide-y divide-slate-100 dark:divide-white/10">
                    {recentResumes.map((resume) => (
                      <div key={resume.title} className="flex items-center gap-4 py-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-400/20">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">{resume.title}</p>
                          <p className="text-xs text-muted-foreground">{resume.updated}</p>
                        </div>
                        <Badge variant={resume.score >= 85 ? 'success' : 'warning'}>{resume.score}</Badge>
                        <Button variant="ghost" size="icon" aria-label={`Open actions for ${resume.title}`}><MoreVertical size={17} /></Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="overflow-hidden p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-foreground">Professional templates</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Recently recommended for your target roles.</p>
                    </div>
                    <Button href="/templates" variant="secondary" size="sm">Browse</Button>
                  </div>
                  <div className="mt-5 flex max-w-full gap-4 overflow-x-auto pb-3">
                    {templates.slice(0, 4).map((template) => (
                      <TemplateCard key={template.name} template={template} />
                    ))}
                  </div>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="p-6">
                    <h2 className="font-bold text-foreground">Export options</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Prepare every application format.</p>
                    <div className="mt-5 grid gap-3">
                      {['PDF for recruiter share', 'DOCX for job portals', 'TXT for ATS parsing'].map((label) => (
                        <button key={label} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-left text-sm font-semibold text-foreground transition-colors hover:border-indigo-200 hover:bg-muted">
                          <span className="flex items-center gap-3"><Download size={16} className="text-indigo-600" /> {label}</span>
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="font-bold text-foreground">Skeleton states</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Loading cards match the final layout.</p>
                    <div className="mt-5 space-y-3">
                      <Skeleton className="h-12" />
                      <Skeleton className="h-20" />
                      <Skeleton className="h-12 w-4/5" />
                    </div>
                  </Card>
                </div>
              </div>

              <aside className="min-w-0 space-y-6">
                <Card className="p-6 text-center">
                  <h2 className="text-left font-bold text-foreground">ATS score widget</h2>
                  <ScoreRing score={92} className="mx-auto my-4" />
                  <p className="text-sm text-muted-foreground">Your strongest resume is ready for product design roles.</p>
                  <Button href="/ats-checker" className="mt-5 w-full">Run new scan</Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-foreground">AI Assistant</h2>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
                      <Sparkles size={18} />
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    {assistantActions.map(({ label, icon: Icon }) => (
                      <button key={label} className="flex w-full items-center gap-3 rounded-2xl bg-indigo-50 p-3 text-left text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-400/10 dark:text-indigo-200">
                        <Icon size={16} />
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border bg-card p-2">
                    <input className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-slate-400" placeholder="Ask anything..." />
                    <Button size="icon" aria-label="Send assistant message"><ChevronRight size={17} /></Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-foreground">Profile completion</h2>
                    <Badge variant="success">90%</Badge>
                  </div>
                  <Progress value={90} className="mt-5" />
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5 text-center dark:border-white/10">
                    <FileText className="mx-auto text-slate-400" size={28} />
                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No cover letter yet</p>
                    <p className="mt-1 text-xs text-slate-500">Create one from your best resume in seconds.</p>
                  </div>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
    </ProtectedRoute>
  )
}
