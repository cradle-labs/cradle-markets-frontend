/**
 * Wallet Query Server Actions
 *
 * These server actions handle wallet queries
 * using the Cradle API client.
 */

'use server'

import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import type { CradleWallet } from '../cradle-client-ts/cradle-api-client'

/**
 * Get a specific wallet by UUID
 */
export async function getWallet(id: string): Promise<CradleWallet> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getWallet(id))
}

/**
 * Get wallet by account ID
 */
export async function getWalletByAccountId(accountId: string): Promise<CradleWallet> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getWalletByAccountId(accountId))
}
