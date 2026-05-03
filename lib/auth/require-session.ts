import { cookies } from 'next/headers'
import { getFirebaseAdminAuth } from '@/lib/firebase/admin'

const SESSION_COOKIE_NAME = 'smartcv_session'

export async function requireAuthSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    throw new Error('Authentication required')
  }

  return getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true)
}
