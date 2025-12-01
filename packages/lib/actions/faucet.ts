/**
 * Faucet Server Actions
 *
 * These server actions handle faucet/airdrop operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { getWalletByAccountId } from './wallets'
import { throwIfError } from '../cradle-client-ts/utils/error-handlers'

// =============================================================================
// AIRDROP/FAUCET
// =============================================================================

/**
 * Request tokens from the faucet (airdrop)
 *
 * This function uses the new client's faucet method which requires:
 * - asset: UUID of the asset to airdrop (use listAssets to get available assets)
 * - account: UUID of the account to receive tokens (tokens go to the account's wallet)
 *
 * The function first verifies that a wallet exists for the account before attempting
 * to request tokens, providing a clearer error message if the wallet is missing.
 *
 * @param input - Object containing account ID and asset ID
 * @param input.account - The account ID to receive the tokens
 * @param input.asset - The asset ID to airdrop
 * @returns Success status with any response data
 */
export async function requestFaucetTokens(input: { account: string; asset: string }): Promise<{
  success: boolean
  data?: void
  error?: string
}> {
  try {
    const client = getCradleClient()
    // First, verify that a wallet exists for this account
    // The API's faucet endpoint requires the account to have a wallet
    console.log('Getting wallet by account ID:', input.account)
    console.log('Asset:', input.asset)
    const wallet = await getWalletByAccountId(input.account)
    console.log('Wallet:', wallet)

    if (!wallet) {
      return {
        success: false,
        error:
          'No wallet found for this account. Please ensure your account has a wallet set up before requesting tokens.',
      }
    }

    // Use the new client's faucet method
    // The faucet method sends tokens to the wallet associated with the account
    const payload = {
      asset: input.asset,
      account: wallet.id,
    }

    // Handle the faucet response directly since it can return success: true with data: null
    const response = await client.faucet(payload)
    throwIfError(response)

    // For faucet, success: true is sufficient even if data is null
    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to request faucet tokens',
      }
    }

    // Revalidate relevant pages to show updated balances
    revalidatePath('/portfolio')
    revalidatePath('/faucet')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error requesting faucet tokens:', error)

    // Provide more specific error messages
    let errorMessage = 'Unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message

      // Check if the error is about wallet not found
      if (errorMessage.includes('Failed to get wallet') || errorMessage.includes('wallet')) {
        errorMessage =
          'No wallet found for this account. Please ensure your account has a wallet set up before requesting tokens.'
      }
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
