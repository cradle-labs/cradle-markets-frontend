/**
 * Health Check Server Actions
 */

'use server'

import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'

/**
 * Check API health status
 */
export async function checkHealth(): Promise<{ status: 'ok' }> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.health())
}
