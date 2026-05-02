'use client'

import { BuilderLayout } from '@/components/builder/BuilderLayout'
import { ProtectedRoute } from '@/components/saas/protected-route'

export default function BuilderPage() {
  return (
    <ProtectedRoute>
      <BuilderLayout />
    </ProtectedRoute>
  )
}
