/**
 * Global Cradle API Client Instance
 *
 * This file provides a singleton instance of the CradleClient
 * configured with environment variables for server-side use.
 *
 * @example Server Action
 * ```ts
 * import { getCradleClient } from '@repo/lib/cradle-client-ts/client'
 *
 * export async function myServerAction() {
 *   'use server'
 *   const client = getCradleClient()
 *   const response = await client.getAccount(accountId)
 *   return response
 * }
 * ```
 */

import { CradleClient, type CradleClientOptions } from './cradle-api-client'
import type { CradleApiConfig } from './types'

let clientInstance: CradleClient | null = null

/**
 * Get the global Cradle API client instance
 *
 * This function creates a singleton instance of the CradleClient
 * configured with server-side environment variables.
 *
 * @throws {Error} If required environment variables are missing
 * @returns {CradleClient} The configured API client instance
 */
export function getCradleClient(): CradleClient {
  if (clientInstance) {
    return clientInstance
  }

  const apiKey = process.env.CRADLE_API_KEY || process.env.API_SECRET_KEY
  const baseUrl = process.env.NEXT_PUBLIC_CRADLE_API_URL

  if (!baseUrl) {
    throw new Error(
      'NEXT_PUBLIC_CRADLE_API_URL is not defined in environment variables. ' +
        'Please add it to your .env.local file.'
    )
  }

  if (!apiKey) {
    throw new Error(
      'CRADLE_API_KEY or API_SECRET_KEY is not defined in environment variables. ' +
        'Please add it to your .env.local file.'
    )
  }

  const config: CradleClientOptions = {
    baseUrl,
    apiKey,
    timeoutMs: parseInt('180000', 10), // 3 minutes timeout for order placement
  }

  clientInstance = new CradleClient(config)
  return clientInstance
}

/**
 * Reset the client instance (useful for testing)
 */
export function resetCradleClient(): void {
  clientInstance = null
}

/**
 * Create a new Cradle API client with custom configuration
 *
 * Use this when you need a client with different settings than the global instance.
 *
 * @param config - Custom client configuration (CradleApiConfig for backward compatibility)
 * @returns {CradleClient} A new API client instance
 */
export function createCradleClient(config: CradleApiConfig | CradleClientOptions): CradleClient {
  const clientOptions: CradleClientOptions = {
    baseUrl: config.baseUrl,
    apiKey: config.apiKey,
    timeoutMs:
      'timeoutMs' in config ? config.timeoutMs : 'timeout' in config ? config.timeout : undefined,
  }
  return new CradleClient(clientOptions)
}
