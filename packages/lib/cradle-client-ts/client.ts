/**
 * Global Cradle API Client Instance
 *
 * This file provides a singleton instance of the CradleApiClient
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

import { CradleApiClient, CradleApiConfig } from './cradle-api-client'

let clientInstance: CradleApiClient | null = null

/**
 * Get the global Cradle API client instance
 *
 * This function creates a singleton instance of the CradleApiClient
 * configured with server-side environment variables.
 *
 * @throws {Error} If required environment variables are missing
 * @returns {CradleApiClient} The configured API client instance
 */
export function getCradleClient(): CradleApiClient {
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

  const config: CradleApiConfig = {
    baseUrl,
    apiKey,
    timeout: parseInt('60000', 10),
  }

  clientInstance = new CradleApiClient(config)
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
 * @param config - Custom client configuration
 * @returns {CradleApiClient} A new API client instance
 */
export function createCradleClient(config: CradleApiConfig): CradleApiClient {
  return new CradleApiClient(config)
}
