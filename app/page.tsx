'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Crown,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from '@/components/saas/brand-logo'
import { ResumeMockup } from '@/components/saas/resume-mockup'
import { TemplateCard } from '@/components/saas/template-card'
import {
  faqs,
  features,
  navItems,
  pricingPlans,
  stats,
  templates,
  testimonials,
  trustItems,
} from '@/components/saas/product-data'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 px-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between">
          <BrandLogo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex dark:text-slate-300">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition-colors hover:text-indigo-600 dark:hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button href="/auth/login" variant="ghost" className="hidden sm:inline-flex">Log in</Button>
            <Button href="/builder">Get Started <ArrowRight size={16} /></Button>
          </div>
        </div>
      </header>

      <section className="relative px-4 pb-20 pt-14 md:pt-20">
        <div className="absolute inset-x-0 top-0 -z-10 h-[640px] bg-[linear-gradient(115deg,rgba(79,70,229,0.10),transparent_38%,rgba(147,51,234,0.12))]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.55 }}>
            <Badge className="mb-6">
              <Sparkles size={14} />
              AI-powered resume builder
            </Badge>
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
              Build Smarter Resumes <span className="gradient-text">with AI</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Create professional, ATS-friendly resumes in minutes with SmartCV AI. Write stronger content, choose premium templates, and apply with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/builder" size="lg">Create My Resume <ArrowRight size={17} /></Button>
              <Button href="/templates" variant="secondary" size="lg">Explore Templates</Button>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-slate-950 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <ResumeMockup />
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="neutral">Built for serious job seekers</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">Everything your resume needs before a recruiter sees it</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
                <Card className="h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 dark:from-indigo-400/20 dark:to-violet-400/20 dark:text-indigo-200">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-[2rem] border border-white/70 bg-slate-950 p-6 shadow-soft md:grid-cols-[0.9fr_1.1fr] md:p-10">
          <div>
            <Badge className="border-indigo-400/20 bg-white/10 text-indigo-100">ATS optimization</Badge>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">Know exactly why a resume will pass or stall</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Paste a job description and SmartCV AI scores keyword coverage, structure, action verbs, role alignment, and formatting quality.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {trustItems.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-semibold text-white">
                  <Icon size={17} className="text-indigo-200" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white p-5 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">ATS Score Checker</p>
                <p className="text-xs text-slate-500">Senior Product Manager role</p>
              </div>
              <Badge variant="success">92 excellent</Badge>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ['Keyword match', 92],
                ['Content quality', 88],
                ['Format readability', 96],
                ['Recruiter clarity', 84],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
                    <span className="font-bold text-slate-950 dark:text-white">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge variant="neutral">Template gallery</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Resume templates that look polished without breaking parsers</h2>
            </div>
            <Button href="/templates" variant="secondary">View all templates</Button>
          </div>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4">
            {templates.map((template) => (
              <TemplateCard key={template.name} template={template} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.name} className="p-6">
                <Quote className="text-indigo-500" size={24} />
                <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.quote}</p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <Badge><Crown size={14} /> Simple pricing</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Start free, upgrade when your search gets serious</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={plan.featured ? 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50 p-6 ring-2 ring-indigo-500/20' : 'p-6'}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">{plan.name}</h3>
                  {plan.featured && <Badge>Popular</Badge>}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-500">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-950 dark:text-white">{plan.price}</span>
                  <span className="pb-1 text-sm text-slate-500">{plan.cadence}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button href="/pricing" variant={plan.featured ? 'primary' : 'secondary'} className="mt-7 w-full">
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Badge variant="neutral">FAQ</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Questions before you build?</h2>
          </div>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-950 dark:text-white">
                  {faq.question}
                  <ChevronDown className="transition-transform group-open:rotate-180" size={18} />
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200/70 px-4 py-10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <BrandLogo />
          <p className="text-sm text-slate-500">Build Smarter Resumes with AI. Designed for modern job seekers.</p>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <ShieldCheck size={16} className="text-emerald-500" />
            Private, polished, ATS-ready
          </div>
        </div>
      </footer>
    </main>
  )
}
