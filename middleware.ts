import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIE_NAME = 'smartcv_session'
const protectedPagePrefixes = ['/dashboard', '/builder', '/ats-checker']
const protectedApiPrefixes = [
  '/api/ats',
  '/api/ats-upload',
  '/api/export',
  '/api/parse-resume',
  '/api/ai-suggest',
  '/api/generate-bullet',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE_NAME)?.value)
  const isProtectedPage = protectedPagePrefixes.some((prefix) => pathname.startsWith(prefix))
  const isProtectedApi = protectedApiPrefixes.some((prefix) => pathname.startsWith(prefix))

  if (!hasSession && isProtectedPage) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (!hasSession && isProtectedApi) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (hasSession && pathname.startsWith('/auth')) {
    const dashboardUrl = req.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    dashboardUrl.search = ''
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/builder/:path*',
    '/ats-checker/:path*',
    '/auth/:path*',
    '/api/ats/:path*',
    '/api/ats-upload/:path*',
    '/api/export/:path*',
    '/api/parse-resume/:path*',
    '/api/ai-suggest/:path*',
    '/api/generate-bullet/:path*',
  ],
}
