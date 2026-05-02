'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from './auth-provider'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isReady && !user) {
      router.replace('/auth/login')
    }
  }, [isReady, router, user])

  if (!isReady || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <Skeleton className="h-12 w-12" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-20" />
        </div>
      </main>
    )
  }

  return children
}
