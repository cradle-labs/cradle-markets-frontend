/**
 * Faucet Server Actions
 *
 * These server actions handle faucet/airdrop operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'

// =============================================================================
// AIRDROP/FAUCET
// =============================================================================

/**
 * Request tokens from the faucet (airdrop)
 *
 * @param account - The account ID to receive the tokens
 * @param asset - The asset ID to airdrop
 * @returns Success status with any response data
 */
export async function requestFaucetTokens(input: { account: string; asset: string }): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.airdrop(input)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to request tokens from faucet',
      }
    }

    // Revalidate relevant pages to show updated balances
    revalidatePath('/portfolio')
    revalidatePath('/faucet')

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error requesting faucet tokens:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
