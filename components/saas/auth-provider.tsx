'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type AuthUser = {
  name: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  isReady: boolean
  login: (email: string, password: string) => void
  register: (name: string, email: string, password: string) => void
  logout: () => void
}

const STORAGE_KEY = 'smartcv-ai-user'
const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser() {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value ? (JSON.parse(value) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setUser(readStoredUser())
    setIsReady(true)
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    function persist(nextUser: AuthUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      router.push('/dashboard')
    }

    return {
      user,
      isReady,
      login: (email) => {
        const name = email.split('@')[0]?.replace(/[._-]/g, ' ') || 'SmartCV User'
        persist({ name: name.replace(/\b\w/g, (char) => char.toUpperCase()), email })
      },
      register: (name, email) => {
        persist({ name: name || 'SmartCV User', email })
      },
      logout: () => {
        window.localStorage.removeItem(STORAGE_KEY)
        setUser(null)
        router.push('/auth/login')
      },
    }
  }, [isReady, router, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
