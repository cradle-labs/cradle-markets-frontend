import { LandingPageLayout } from './_lib/landing-page/LandingPageLayout'
import { checkHealth } from '@repo/lib/actions/health'

export default async function Home() {
  // Check API health status (fail gracefully if health check fails)
  try {
    const healthStatus = await checkHealth()
    console.log('API Health Status:', healthStatus)
  } catch (error) {
    // Log error but don't block page rendering
    console.error('API health check failed:', error)
  }

  // Note: Middleware handles redirects for authenticated users
  // This page only shows for non-authenticated users
  return <LandingPageLayout />
}
