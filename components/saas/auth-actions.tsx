'use client'

import { LogOut, UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from './auth-provider'

export function AuthActions() {
  const { user, isReady, logout } = useAuth()

  if (!isReady) return null

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button href="/auth/login" variant="ghost" className="hidden sm:inline-flex">Log in</Button>
        <Button href="/auth/register">Get Started</Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button href="/dashboard" variant="secondary" className="hidden sm:inline-flex">
        <UserRound size={16} />
        Dashboard
      </Button>
      <Button type="button" variant="ghost" size="icon" onClick={logout} aria-label="Log out">
        <LogOut size={17} />
      </Button>
    </div>
  )
}
