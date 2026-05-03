'use client'

import { FormEvent, useState } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Chrome, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrandLogo } from './brand-logo'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from './auth-provider'

export function AuthPanel({ mode }: { mode: 'login' | 'register' }) {
  const isLogin = mode === 'login'
  const { login, register, loginWithGoogle, isLoading, error, clearError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    clearError()
    if (!email || !password) return

    if (isLogin) {
      login(email, password)
    } else {
      register(name, email, password)
    }
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[0.95fr_1.05fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between dark:bg-black">
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

      <section className="relative flex min-h-screen items-center justify-center px-4 py-10">
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md p-6 sm:p-8">
          <div className="mb-8 lg:hidden">
            <BrandLogo />
          </div>
          <Badge variant="neutral">{isLogin ? 'Welcome back' : 'Create workspace'}</Badge>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {isLogin ? 'Log in to SmartCV AI' : 'Start building better resumes'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isLogin ? 'Continue optimizing your resumes and applications.' : 'Create your account and build your first ATS-ready resume.'}
          </p>

          <div className="mt-8 space-y-3">
            <Button type="button" variant="secondary" className="w-full" onClick={loginWithGoogle} disabled={isLoading}>
              <Chrome size={17} />
              Continue with Google
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
            or
            <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Full name</span>
                <input className="input-base mt-2" placeholder="Sophia Bennett" value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email</span>
              <input className="input-base mt-2" placeholder="you@email.com" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Password</span>
              <input className="input-base mt-2" placeholder="••••••••" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && (
              <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  {isLogin ? 'Log in' : 'Create account'}
                  <ArrowRight size={17} />
                </>
              )}
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
