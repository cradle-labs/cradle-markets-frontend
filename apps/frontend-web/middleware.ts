import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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
  '/perps(.*)',
  '/faucet(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  try {
    // Handle root path redirects for authenticated users
    if (req.nextUrl.pathname === '/') {
      const { sessionClaims, userId } = await auth()

      if (userId) {
        // User is authenticated, check role from session claims first
        // Try both metadata and public_metadata paths
        let userRole = ((sessionClaims?.metadata as any)?.role ||
          (sessionClaims?.public_metadata as any)?.role) as string | undefined

        // Debug logging for root path
        console.log('Root path middleware check:', {
          userId,
          sessionClaimsRole: userRole,
          hasSessionClaims: !!sessionClaims,
          sessionClaimsMetadata: sessionClaims?.metadata,
          sessionClaimsPublicMetadata: sessionClaims?.public_metadata,
          allSessionClaims: sessionClaims,
        })

        // If no role in session claims, check user metadata directly (important for fresh sign-ups)
        if (!userRole) {
          try {
            const { clerkClient } = await import('@clerk/nextjs/server')
            const client = await clerkClient()
            const user = await client.users.getUser(userId)
            userRole = user.publicMetadata?.role as string | undefined

            console.log('Fetched user metadata:', {
              publicMetadata: user.publicMetadata,
              userRole,
            })
          } catch (error) {
            console.error('Error fetching user metadata:', error)
            // Continue execution even if user fetch fails
          }
        }

        console.log('Final role decision:', {
          userRole,
          redirecting: userRole ? '/trade' : '/select-role',
        })

        if (userRole) {
          // User has a role, redirect to trade page
          return NextResponse.redirect(new URL('/trade', req.url))
        } else {
          // User doesn't have a role, redirect to select-role
          return NextResponse.redirect(new URL('/select-role', req.url))
        }
      }
      // If not authenticated, continue to show landing page
      return NextResponse.next()
    }

    // Protect all non-public routes
    if (!isPublicRoute(req)) {
      // Get session claims first to check if user is authenticated
      const { sessionClaims, userId } = await auth()

      // If no userId, redirect to sign-in instead of calling protect()
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }

      // Try to get role from metadata (custom JWT claim) or public_metadata
      let userRole = ((sessionClaims?.metadata as any)?.role ||
        (sessionClaims?.public_metadata as any)?.role) as string | undefined

      // Debug logging
      console.log('Middleware check:', {
        path: req.nextUrl.pathname,
        userRole,
        userId,
        hasMetadata: !!sessionClaims?.metadata,
        metadata: sessionClaims?.metadata,
      })

      // If no role in session claims, fetch from Clerk API directly
      // This handles the case where role was just set but session hasn't refreshed yet
      if (!userRole && userId) {
        try {
          const { clerkClient } = await import('@clerk/nextjs/server')
          const client = await clerkClient()
          const user = await client.users.getUser(userId)
          userRole = user.publicMetadata?.role as string | undefined
          console.log('Fetched fresh role from Clerk API:', { userRole })
        } catch (error) {
          console.error('Error fetching user metadata:', error)
          // Continue execution even if user fetch fails
        }
      }

      // If on /select-role and role already exists, redirect to /trade
      if (req.nextUrl.pathname === '/select-role' && userId) {
        if (userRole === 'institutional' || userRole === 'retail') {
          return NextResponse.redirect(new URL('/trade', req.url))
        }
      }

      // If user is authenticated but has no role, redirect to role selection
      // BUT: Allow access to /select-role and also don't block other routes
      // The RoleGuard in individual pages will handle the actual access control
      if (!userRole && req.nextUrl.pathname !== '/select-role') {
        // Only redirect to role selection, don't block access
        // Individual pages with RoleGuard will handle access control
        return NextResponse.redirect(new URL('/select-role', req.url))
      }

      // Check institutional-only routes (perps)
      // if (isInstitutionalOnlyRoute(req)) {
      //   if (userRole !== 'institutional') {
      //     return NextResponse.redirect(new URL('/access-denied', req.url))
      //   }
      // }

      // Check shared routes (trade, lend, portfolio, cash)
      // Allow both institutional and retail users
      if (isSharedRoute(req)) {
        if (userRole !== 'institutional' && userRole !== 'retail') {
          return NextResponse.redirect(new URL('/access-denied', req.url))
        }
        // Allow access for both institutional and retail users
        return NextResponse.next()
      }

      // Check institutional routes
      if (isInstitutionalRoute(req)) {
        if (userRole !== 'institutional') {
          return NextResponse.redirect(new URL('/access-denied', req.url))
        }
      }

      // Check retail routes
      if (isRetailRoute(req)) {
        if (userRole !== 'retail') {
          return NextResponse.redirect(new URL('/access-denied', req.url))
        }
      }
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Return a proper response instead of letting the error bubble up
    return NextResponse.next()
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
