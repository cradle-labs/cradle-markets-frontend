import { LandingV3Layout } from './_lib/landing-page/LandingV3Layout'
import { checkHealth } from '@repo/lib/actions/health'

export default async function Home() {
  // Check API health status
  const healthStatus = await checkHealth()

  console.log('API Health Status:', healthStatus)

  return <LandingV3Layout />
}
