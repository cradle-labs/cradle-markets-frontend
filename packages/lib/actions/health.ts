/**
 * Health Check Server Actions
 */

'use server'

import { getCradleClient } from '../cradle-client-ts/client'
import type { HealthResponse } from '../cradle-client-ts/cradle-api-client'

/**
 * Check API health status
 */
export async function checkHealth(): Promise<HealthResponse> {
  const client = getCradleClient()
  return client.health()
}
