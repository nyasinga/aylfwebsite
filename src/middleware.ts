import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import logger from './lib/logger'

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  const { pathname } = request.nextUrl

  // Security headers
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Only add HSTS in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    )
  }

  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    const duration = Date.now() - startTime
    logger.debug('Request', {
      method: request.method,
      path: pathname,
      duration: `${duration}ms`,
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
