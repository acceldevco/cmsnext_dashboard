// middleware.ts
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

interface RoleBasedAccess {
  [key: string]: string[];
}

// Define role-based access control rules
const roleBasedAccess: RoleBasedAccess = {
  '/admin': ['ADMIN', 'CUSTOMER'],
  '/api/orders': ['ADMIN', 'CUSTOMER'],
  '/api/blogpost': ['ADMIN', 'CUSTOMER'],
  '/api/product': ['ADMIN', 'CUSTOMER'],
  '/api/category': ['ADMIN','CUSTOMER'],
  '/api/coupon': ['ADMIN'],
  '/api/review': ['ADMIN', 'CUSTOMER'],
  '/api/wishlist': ['CUSTOMER'],
  '/api/cart': ['CUSTOMER'],
  // Add other protected routes and their required roles here
};

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req: NextRequestWithAuth) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;
    const homeUrl = new URL('/', req.url);
    // Handle specific GET request rewrites/redirects before auth checks
    if (req.method === "GET") {
      // Rewrite routes that match "/admin/page-builder/edit" to "/admin/page-builder/puck"
      if (pathname.endsWith("/admin/page-builder/edit")) {
        const pathWithoutEdit = pathname.slice(0, -5); // Remove '/edit'
        const newPath = `${pathWithoutEdit}/puck`;
        console.log(`Rewriting ${pathname} to ${newPath}`);
        return NextResponse.rewrite(new URL(newPath, req.url));
      }

      // Redirect direct access to "/admin/page-builder/puck" back to "/edit"
      // This prevents accessing the editor directly without the intended entry point.
      if (pathname.endsWith("/admin/page-builder/puck")) {
        const pathWithEdit = pathname.replace('/puck', '/edit');
        // console.log(`Redirecting direct access from ${pathname} to ${pathWithEdit}`);
        return NextResponse.redirect(new URL(pathWithEdit, req.url));
      }
    }

    // Role-based access control
    let authorized = true;
    for (const routePrefix of Object.keys(roleBasedAccess)) {
      if (pathname.startsWith(routePrefix)) {
    // console.log(token);
        const allowedRoles = roleBasedAccess[routePrefix];
        // console.log(allowedRoles.includes(token.role as string));
        
        // Ensure token exists and has a role before checking
        if (!token || !token.role || !allowedRoles.includes(token.role as string)) {
          authorized = false;
          break;
        }
      }
    }

    if (!authorized) {
      // For API routes, return a 403 Forbidden response
      if (pathname.startsWith('/api/')) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden - Access Denied' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // For page routes, redirect to home or a specific unauthorized page
      // You might want to redirect to a more specific page like '/unauthorized'
      // Or, for simplicity, redirect to the main login page or home page
      const unauthorizedUrl = new URL('/auth?error=unauthorized', req.url);
      return NextResponse.redirect(unauthorizedUrl);
    }

    // If authorized, continue to the requested route
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // If there is a token, the user is authenticated
    },
    pages: {
      signIn: '/auth', // Redirect users to custom login page if not authenticated
      // error: '/auth/error', // Optional: specify an error page
    },
  }
);

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /auth (the login page itself and its subpaths like /auth/error)
     * - / (public home page - adjust if home needs auth)
     * - Public API routes like /api/public/* or specific public endpoints
     */
    // '/((?!api/auth|_next/static|_next/image|favicon.ico|auth(?:/.*)?$|api/public(?:/.*)?$|api/socket$|^/$).*)',
    // Specifically protect admin routes
    '/admin/:path*',
    // Protect most API routes, excluding public ones and auth routes
    '/api/((?!auth|public|socket).*)'
    // '/api/((?!auth|login|register).*)',
  ],
};
