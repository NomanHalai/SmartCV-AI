import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

function requireEnv(name: string, fallbackName?: string) {
  const value = process.env[name] || (fallbackName ? process.env[fallbackName] : undefined)
  if (!value) {
    throw new Error(`${name}${fallbackName ? ` or ${fallbackName}` : ''} is required`)
  }
  return value
}

export function getFirebaseAdminApp() {
  if (getApps().length) return getApps()[0]

  return initializeApp({
    credential: cert({
      projectId: requireEnv('project_id', 'FIREBASE_PROJECT_ID'),
      clientEmail: requireEnv('client_email', 'FIREBASE_CLIENT_EMAIL'),
      privateKey: requireEnv('private_key', 'FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
  })
}

export function getFirebaseAdminAuth() {
  return getAuth(getFirebaseAdminApp())
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp(), process.env.database_id || process.env.FIRESTORE_DATABASE_ID || 'smartcvai')
}
