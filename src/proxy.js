import { NextResponse } from 'next/server'
import { decrypt } from '@/features/auth/lib/auth'
import { ROUTES } from '@/features/shared/config/navigation/navigation.config'

// ── Route classification derived from ROUTES (single source of truth) ──────
const LOGIN_PATH = ROUTES.AUTH.LOGIN.path
const DASHBOARD_PATH = ROUTES.DASHBOARD.path

// Public routes — no session required
const PUBLIC_PATHS = [LOGIN_PATH, '/turnos', '/tomar-turno']

// Protected prefix — any path starting with this requires a session
// (fine-grained permission checks happen server-side via checkPageAccess)
const PROTECTED_PREFIX = DASHBOARD_PATH

function isPublicPath(path) {
  return PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/') || path.startsWith(p + '?'))
}

export async function proxy(req) {
  const path = req.nextUrl.pathname

  // Skip static files and Next.js internals
  if (path.startsWith('/_next') || path.startsWith('/static') || path.includes('.')) {
    return NextResponse.next()
  }

  const isProtected = path.startsWith(PROTECTED_PREFIX) && !isPublicPath(path)
  const isLoginPage = path === LOGIN_PATH

  const cookie = req.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // No session → redirect to login (protected routes only)
  if (isProtected && !session) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.nextUrl))
  }

  // Already authenticated → redirect away from login page
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
