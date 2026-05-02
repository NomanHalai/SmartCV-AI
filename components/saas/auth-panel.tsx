import { ArrowRight, CheckCircle2, Github, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from './brand-logo'

export function AuthPanel({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'

  return (
    <main className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo compact />
          <span className="text-xl font-bold tracking-tight text-white">SmartCV AI</span>
        </div>
        <div>
          <Badge className="border-indigo-400/20 bg-white/10 text-indigo-100">
            <Sparkles size={14} />
            Build Smarter Resumes with AI
          </Badge>
          <h1 className="mt-6 max-w-xl text-5xl font-bold tracking-tight">Turn career history into interview-ready stories.</h1>
          <div className="mt-10 grid gap-4">
            {['ATS-ready templates', 'AI bullet rewrites', 'PDF and DOCX exports'].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-sm font-semibold">
                <CheckCircle2 size={18} className="text-emerald-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <ShieldCheck size={18} className="text-emerald-300" />
          Private workspace for serious job seekers
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10">
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>
          <Badge variant="neutral">{isLogin ? 'Welcome back' : 'Create workspace'}</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {isLogin ? 'Log in to SmartCV AI' : 'Start building better resumes'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isLogin ? 'Continue optimizing your resumes and applications.' : 'Create your account and build your first ATS-ready resume.'}
          </p>

          <div className="mt-8 space-y-3">
            <Button variant="secondary" className="w-full">
              <Github size={17} />
              Continue with GitHub
            </Button>
            <Button variant="secondary" className="w-full">
              <Mail size={17} />
              Continue with Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            or
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <form className="space-y-4">
            {!isLogin && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full name</span>
                <input className="input-base mt-2" placeholder="Sophia Bennett" />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
              <input className="input-base mt-2" placeholder="you@email.com" type="email" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
              <input className="input-base mt-2" placeholder="••••••••" type="password" />
            </label>
            <Button className="w-full" type="button">
              {isLogin ? 'Log in' : 'Create account'}
              <ArrowRight size={17} />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? 'New to SmartCV AI?' : 'Already have an account?'}{' '}
            <a className="font-bold text-indigo-600 hover:text-indigo-700" href={isLogin ? '/auth/register' : '/auth/login'}>
              {isLogin ? 'Create an account' : 'Log in'}
            </a>
          </p>
        </Card>
      </section>
    </main>
  )
}
