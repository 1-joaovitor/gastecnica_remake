import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;


    const token = request.cookies.get('access-token');

    const protectedRoutes = ['/home','/budget','/budget-list'];

    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {

        return NextResponse.redirect(new URL('/login', request.url));

    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/home/:path*', '/budget/:path*', '/home/:path*'],
};
