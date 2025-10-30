import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/3rd-party-services(.*)',
  '/components(.*)',
  '/cookies-policy(.*)',
  '/privacy-policy(.*)',
  '/risks(.*)',
  '/terms-of-use(.*)',
  '/access-denied',
])

const isInstitutionRoute = createRouteMatcher(['/institution(.*)'])
const isRetailRoute = createRouteMatcher(['/retail(.*)'])

// Institution-only pages: only perps
const isInstitutionOnlyRoute = createRouteMatcher(['/perps(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Protect all non-public routes
  if (!isPublicRoute(req)) {
    await auth.protect()

    // Get session claims and extract role from metadata (via custom JWT claims)
    const { sessionClaims, userId } = await auth()
    // Try to get role from metadata (custom JWT claim)
    const userRole = sessionClaims?.metadata?.role as string | undefined

    // Debug logging
    console.log('Middleware check:', {
      path: req.nextUrl.pathname,
      userRole,
      userId,
      hasMetadata: !!sessionClaims?.metadata,
      metadata: sessionClaims?.metadata,
    })

    // If user is authenticated but has no role, redirect to role selection
    // BUT: Allow access to /select-role and also don't block other routes
    // The RoleGuard in individual pages will handle the actual access control
    if (!userRole && req.nextUrl.pathname !== '/select-role') {
      // Only redirect to role selection, don't block access
      // Individual pages with RoleGuard will handle access control
      // console.log('No role found in session claims, redirecting to /select-role')
      const url = new URL('/select-role', req.url)
      return Response.redirect(url)
    }

    // Check institution-only routes (perps)
    if (isInstitutionOnlyRoute(req)) {
      if (userRole !== 'institution') {
        const url = new URL('/access-denied', req.url)
        return Response.redirect(url)
      }
    }

    // Check institution routes
    if (isInstitutionRoute(req)) {
      if (userRole !== 'institution') {
        const url = new URL('/access-denied', req.url)
        return Response.redirect(url)
      }
    }

    // Check retail routes
    if (isRetailRoute(req)) {
      if (userRole !== 'retail') {
        const url = new URL('/access-denied', req.url)
        return Response.redirect(url)
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
