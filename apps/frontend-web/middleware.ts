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

const isInstitutionalRoute = createRouteMatcher(['/institutional(.*)'])
const isRetailRoute = createRouteMatcher(['/retail(.*)'])

// Institutional-only pages: only perps
// const isInstitutionalOnlyRoute = createRouteMatcher(['/perps(.*)'])

// Shared routes accessible by both institutional and retail users
const isSharedRoute = createRouteMatcher([
  '/trade(.*)',
  '/lend(.*)',
  '/portfolio(.*)',
  '/cash(.*)',
  '/perps(.*)',
  '/faucet(.*)',
])

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

    // Check institutional-only routes (perps)
    // if (isInstitutionalOnlyRoute(req)) {
    //   if (userRole !== 'institutional') {
    //     const url = new URL('/access-denied', req.url)
    //     return Response.redirect(url)
    //   }
    // }

    // Check shared routes (trade, lend, portfolio, cash)
    // Allow both institutional and retail users
    if (isSharedRoute(req)) {
      if (userRole !== 'institutional' && userRole !== 'retail') {
        const url = new URL('/access-denied', req.url)
        return Response.redirect(url)
      }
      // Allow access for both institutional and retail users
      return
    }

    // Check institutional routes
    if (isInstitutionalRoute(req)) {
      if (userRole !== 'institutional') {
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
