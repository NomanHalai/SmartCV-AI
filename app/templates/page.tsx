'use client'

import { motion } from 'framer-motion'
import { Filter, LayoutGrid, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from '@/components/saas/brand-logo'
import { TemplateCard } from '@/components/saas/template-card'
import { templates } from '@/components/saas/product-data'
import { ThemeToggle } from '@/components/saas/theme-toggle'

const categories = ['All', 'Executive', 'Engineering', 'Product', 'Design', 'Marketing', 'Graduate']

export default function TemplatesPage() {
  return (
    <main className="min-h-screen px-4 py-6">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href="/dashboard" variant="secondary">Dashboard</Button>
          <Button href="/builder">Use template</Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <Badge><LayoutGrid size={14} /> Templates Gallery</Badge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Premium resume templates for every career story
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
              Choose a recruiter-friendly layout, tune the theme, and keep ATS parsing clean while your resume looks distinctly polished.
            </p>
          </div>
          <Card className="p-4">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                <Search size={16} />
                Search by role, style, or industry
              </div>
              <Button variant="secondary"><SlidersHorizontal size={16} /> Filters</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    index === 0
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                      : 'border-border bg-card text-muted-foreground hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div key={template.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <TemplateCard template={template} />
            </motion.div>
          ))}
        </div>

        <Card className="mt-10 grid gap-6 overflow-hidden p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Badge variant="success"><Sparkles size={14} /> AI template recommendation</Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Not sure which template fits?</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              SmartCV AI can recommend a format based on seniority, target role, industry, and content density.
            </p>
          </div>
          <Button href="/builder"><Filter size={16} /> Match my resume</Button>
        </Card>
      </section>
    </main>
  )
}
