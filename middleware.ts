import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server'; // Import NextResponse for handling redirects
import { auth } from '@clerk/nextjs/server'; // Import auth from Clerk

// Define which routes are public
const isPublicRoute = createRouteMatcher([
  '/auth/sign-in(.*)',
  '/auth/sign-up(.*)',
  '/', // Home page is public
]);

export default clerkMiddleware((auth,req) => {
  const { userId } = auth(); // Clerk auth object to get the user ID

  // If the route is public, allow access
  if (isPublicRoute(req)) {
    return NextResponse.next(); // Proceed with the request
  }

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    const signInUrl = new URL('/auth/sign-in', req.nextUrl.origin); // Redirect to your custom sign-in route
    signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname); // Redirect back to the attempted page after sign-in
    return NextResponse.redirect(signInUrl);
  }

  // If the user is authenticated, allow the request to proceed
  return NextResponse.next();
});

// Matcher configuration to define which paths the middleware should apply to
export const config = {
  matcher: [
    // Apply middleware to all routes except for Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
