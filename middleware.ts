import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    // Retrieve session information from cookies
    const token = request.cookies.get('token')?.value;
  
    // Decode or verify the token to get session info (use JWT, for example)
    const session = token
      ? JSON.parse(atob(token.split('.')[1])) // Decode payload (adjust this for your encoding)
      : null;
  
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  
    if (!session && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    if (session && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  
    // Role-based access control
    if (session) {
      const { role } = session;
      const path = request.nextUrl.pathname;
  
      if (path.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
  
      if (path.startsWith('/pantry') && role !== 'PANTRY_STAFF') {
        return NextResponse.redirect(new URL('/', request.url));
      }
  
      if (path.startsWith('/delivery') && role !== 'DELIVERY_STAFF') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  
    return NextResponse.next();
  }
  

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};