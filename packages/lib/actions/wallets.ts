/**
 * Wallet Query Server Actions
 *
 * These server actions handle wallet queries
 * using the Cradle API client.
 */

'use server'

import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import { CradleApiError } from '../cradle-client-ts/utils/error-handlers'
import type { CradleWallet } from '../cradle-client-ts/types'

/**
 * Get a specific wallet by UUID
 */
export async function getWallet(id: string): Promise<CradleWallet> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getWallet(id))
}

/**
 * Get wallet by account ID
 * Returns null if wallet doesn't exist (404 error)
 */
export async function getWalletByAccountId(accountId: string): Promise<CradleWallet | null> {
  try {
    const client = getCradleClient()
    return await executeCradleOperation(() => client.getWalletByAccount(accountId))
  } catch (error) {
    // Handle 404 errors gracefully - wallet might not exist yet
    if (error instanceof CradleApiError && error.statusCode === 404) {
      return null
    }
    // Also check for 404 in error message as fallback
    if (
      error instanceof Error &&
      (error.message.includes('404') || error.message.includes('not found'))
    ) {
      return null
    }
    // Re-throw other errors
    throw error
  }
}

/**
 * Get balance for a specific wallet and asset
 */
export async function getBalance(
  walletId: string,
  assetId: string
): Promise<{ balance: number; before_deductions: number; deductions: number; decimals: number }> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getBalance(walletId, assetId))
}
