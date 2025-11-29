// middleware.ts - in root directory (neben package.json)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if we're in production (Vercel)
  if (process.env.NODE_ENV === 'production') {
    const basicAuth = request.headers.get('authorization')
    
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = Buffer.from(authValue, 'base64').toString().split(':')
      
      // Compare with environment variables
      if (user === process.env.BASIC_AUTH_USERNAME && pwd === process.env.BASIC_AUTH_PASSWORD) {
        return NextResponse.next()
      }
    }

    // Return authentication required response
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="SYNTX STREAM", charset="UTF-8"',
      },
    })
  }

  // In development, no auth required
  return NextResponse.next()
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}