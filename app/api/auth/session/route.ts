import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getFirebaseAdminAuth, getFirebaseAdminDb } from '@/lib/firebase/admin'

export const runtime = 'nodejs'

const SESSION_COOKIE_NAME = 'smartcv_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE,
  }
}

export async function POST(req: NextRequest) {
  try {
    const { idToken, name, provider } = await req.json() as {
      idToken?: string
      name?: string
      provider?: 'password' | 'google'
    }

    if (!idToken) {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 })
    }

    const auth = getFirebaseAdminAuth()
    const decoded = await auth.verifyIdToken(idToken)
    const expiresIn = SESSION_MAX_AGE * 1000
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn })

    const db = getFirebaseAdminDb()
    const userRef = db.collection('users').doc(decoded.uid)
    const snapshot = await userRef.get()

    await userRef.set(
      {
        uid: decoded.uid,
        name: name || decoded.name || decoded.email?.split('@')[0] || 'SmartCV User',
        email: decoded.email || '',
        photoURL: decoded.picture || '',
        provider: provider || decoded.firebase?.sign_in_provider || 'password',
        createdAt: snapshot.exists ? snapshot.get('createdAt') : FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    )

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, cookieOptions())
    return response
  } catch (err) {
    console.error('[Auth Session Error]', err)
    return NextResponse.json({ error: 'Failed to create auth session.' }, { status: 401 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...cookieOptions(),
    maxAge: 0,
  })
  return response
}
