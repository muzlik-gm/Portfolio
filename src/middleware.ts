import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware, sanitizationMiddleware } from '@/lib/middleware';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
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

     // Check for token in httpOnly cookie
     const token = request.cookies.get('adminToken')?.value;
     console.log('[MIDDLEWARE] Token cookie present:', !!token);
     if (!token) {
       console.log('[MIDDLEWARE] No token cookie found, redirecting to login');
       return NextResponse.redirect(new URL('/admin/login', request.url));
     }

     try {
        console.log('[MIDDLEWARE] Attempting to verify token:', token.substring(0, 10) + '...');
       const user = await verifyToken(token);
       if (!user) {
         console.log('[MIDDLEWARE] Invalid token in cookie, redirecting to login');
         const response = NextResponse.redirect(new URL('/admin/login', request.url));
         response.cookies.delete('adminToken');
         return response;
       }

       console.log('[MIDDLEWARE] Token valid for user:', user.email, 'role:', user.role);
       return NextResponse.next();
     } catch (error) {
       console.error('[MIDDLEWARE] Token verification error:', error);
       const response = NextResponse.redirect(new URL('/admin/login', request.url));
       response.cookies.delete('adminToken');
       return response;
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