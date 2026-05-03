'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { firebaseAuth, googleProvider } from '@/lib/firebase/client'

type AuthUser = {
  uid: string
  name: string
  email: string
  photoURL: string
}

type AuthContextValue = {
  user: AuthUser | null
  isReady: boolean
  isLoading: boolean
  error: string
  clearError: () => void
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'SmartCV User',
    email: user.email || '',
    photoURL: user.photoURL || '',
  }
}

function getErrorMessage(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code?: string }).code) : ''

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.'
    default:
      return 'Authentication failed. Please try again.'
  }
}

async function createSession(user: User, provider: 'password' | 'google') {
  const idToken = await user.getIdToken()
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idToken,
      name: user.displayName,
      provider,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create secure session.')
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setUser(nextUser ? mapFirebaseUser(nextUser) : null)
      setIsReady(true)
    })

    return unsubscribe
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    async function finishAuth(firebaseUser: User, provider: 'password' | 'google') {
      try {
        await createSession(firebaseUser, provider)
      } catch (err) {
        await signOut(firebaseAuth)
        throw err
      }
      setUser(mapFirebaseUser(firebaseUser))
      const nextUrl = new URLSearchParams(window.location.search).get('next')
      router.push(nextUrl || '/dashboard')
      router.refresh()
    }

    async function runAuth(action: () => Promise<void>) {
      setIsLoading(true)
      setError('')
      try {
        await action()
      } catch (err) {
        setError(err instanceof Error && err.message === 'Failed to create secure session.' ? err.message : getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }

    return {
      user,
      isReady,
      isLoading,
      error,
      clearError: () => setError(''),
      login: (email, password) =>
        runAuth(async () => {
          const credential = await signInWithEmailAndPassword(firebaseAuth, email, password)
          await finishAuth(credential.user, 'password')
        }),
      register: (name, email, password) =>
        runAuth(async () => {
          const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
          if (name) {
            await updateProfile(credential.user, { displayName: name })
          }
          await finishAuth(credential.user, 'password')
        }),
      loginWithGoogle: () =>
        runAuth(async () => {
          const credential = await signInWithPopup(firebaseAuth, googleProvider)
          await finishAuth(credential.user, 'google')
        }),
      logout: async () => {
        setIsLoading(true)
        setError('')
        try {
          await fetch('/api/auth/session', { method: 'DELETE' })
          await signOut(firebaseAuth)
          setUser(null)
          router.push('/auth/login')
          router.refresh()
        } finally {
          setIsLoading(false)
        }
      },
    }
  }, [error, isLoading, isReady, router, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
