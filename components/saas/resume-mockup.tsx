import { BadgeCheck, Mail, MapPin, Phone, Sparkles, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScoreRing } from './score-ring'

const bullets = [
  'Led the design of a SaaS platform used by 120k+ job seekers worldwide.',
  'Improved onboarding completion by 28% through clearer UX flows.',
  'Collaborated with engineering and talent teams to ship ATS-safe exports.',
]

export function ResumeMockup() {
  return (
    <div className="relative mx-auto max-w-[560px]">
      <div className="absolute -left-8 top-28 z-10 hidden w-44 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-glow backdrop-blur md:block">
        <Badge className="mb-3" variant="default">
          <Sparkles size={12} />
          AI Suggestion
        </Badge>
        <p className="text-xs font-semibold text-slate-900">Stronger action verb</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">Try “orchestrated” to show ownership and scope.</p>
        <div className="mt-3 flex items-end gap-1 text-indigo-500">
          <div className="h-3 w-8 rounded-full bg-indigo-100" />
          <TrendingUp size={28} />
        </div>
      </div>

      <div className="absolute -right-4 top-8 z-10 hidden w-44 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-soft backdrop-blur sm:block">
        <p className="text-sm font-bold text-slate-950">ATS Score</p>
        <ScoreRing score={92} size={96} className="mx-auto my-2" />
        {['Keyword match', 'Content quality', 'Format', 'Readability'].map((item) => (
          <div key={item} className="mt-2 flex items-center justify-between text-xs text-slate-600">
            <span>{item}</span>
            <BadgeCheck size={14} className="text-emerald-500" />
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white p-6 shadow-2xl shadow-indigo-950/10">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-gradient-to-br from-indigo-100 to-violet-100" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-950">Sophia Bennett</h3>
              <p className="mt-1 text-sm font-medium text-indigo-600">Senior Product Designer</p>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1"><Mail size={12} /> sophia@email.com</span>
                <span className="inline-flex items-center gap-1"><Phone size={12} /> +1 (555) 123-4567</span>
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> San Francisco</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-slate-200 to-indigo-100 shadow-inner" />
          </div>

          <section className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Summary</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Product designer with 6+ years creating conversion-focused SaaS experiences, design systems, and hiring workflows.
            </p>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Experience</p>
              <Badge variant="success">AI enhanced</Badge>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Senior Product Designer</p>
                  <p className="text-xs text-slate-500">TechNova Inc.</p>
                </div>
                <p className="text-xs font-medium text-slate-400">2021 - Present</p>
              </div>
              <ul className="mt-3 space-y-2">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-xs leading-5 text-slate-600">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3">
            {['UX Strategy', 'Design Systems', 'A/B Testing', 'Figma'].map((skill) => (
              <div key={skill} className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                {skill}
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
