'use client'

import { CheckCircle2, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from '@/components/saas/brand-logo'
import { pricingPlans } from '@/components/saas/product-data'
import { ThemeToggle } from '@/components/saas/theme-toggle'

export default function PricingPage() {
  return (
    <main className="min-h-screen px-4 py-6">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href="/auth/login" variant="ghost">Log in</Button>
          <Button href="/builder">Start free</Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Badge><Crown size={14} /> SmartCV AI Pricing</Badge>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            Flexible plans for every stage of your job search
          </h1>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Build for free, then upgrade when you need unlimited AI rewrites, premium templates, and deeper ATS optimization.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 ${plan.featured ? 'border-indigo-200 bg-gradient-to-br from-card via-indigo-50 to-violet-50 ring-2 ring-indigo-500/20 dark:via-indigo-950/40 dark:to-violet-950/40' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{plan.description}</p>
                </div>
                {plan.featured && <Badge>Best value</Badge>}
              </div>
              <div className="mt-7 flex items-end gap-2">
                <span className="text-5xl font-bold tracking-tight text-foreground">{plan.price}</span>
                <span className="pb-2 text-sm font-medium text-slate-500">{plan.cadence}</span>
              </div>
              <Button href="/auth/register" className="mt-7 w-full" variant={plan.featured ? 'primary' : 'secondary'}>
                {plan.cta}
              </Button>
              <ul className="mt-7 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 size={17} className="text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'Secure exports', text: 'Control resume versions and downloads across every application.' },
            { icon: Sparkles, title: 'AI that stays relevant', text: 'Suggestions are grounded in your target job and existing experience.' },
            { icon: Zap, title: 'Fast optimization', text: 'Improve a resume and rerun ATS checks in the same focused workflow.' },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5">
              <Icon size={22} className="text-indigo-600" />
              <h3 className="mt-4 font-bold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
