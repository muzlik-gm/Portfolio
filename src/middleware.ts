import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware, sanitizationMiddleware } from '@/lib/middleware';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse.status === 429) {
    return rateLimitResponse;
  }

  // Apply input sanitization
  const sanitizationResponse = sanitizationMiddleware(request);
  if (sanitizationResponse.status === 413) {
    return sanitizationResponse;
  }

  // Check if the request is for admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') &&
       !request.nextUrl.pathname.startsWith('/admin/login')) {

     console.log('[MIDDLEWARE] Admin route accessed:', request.nextUrl.pathname);

     // Verify JWT token server-side
     const token = request.headers.get('authorization')?.replace('Bearer ', '');
     if (!token) {
       console.log('[MIDDLEWARE] No token provided, redirecting to login');
       return NextResponse.redirect(new URL('/admin/login', request.url));
     }

     try {
       const user = verifyToken(token);
       if (!user) {
         console.log('[MIDDLEWARE] Invalid token, redirecting to login');
         return NextResponse.redirect(new URL('/admin/login', request.url));
       }

       console.log('[MIDDLEWARE] Token valid for user:', user.email);
       return NextResponse.next();
     } catch (error) {
       console.error('[MIDDLEWARE] Token verification error:', error);
       return NextResponse.redirect(new URL('/admin/login', request.url));
     }
   }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*'
  ]
};