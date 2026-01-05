/**
 * Onramp Server Actions
 *
 * These server actions handle onramp operations
 * using the Cradle API client.
 */

'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { throwIfError } from '../cradle-client-ts/utils/error-handlers'
import type { UUID, Big } from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// ONRAMP
// =============================================================================

/**
 * Request an onramp transaction
 *
 * This function creates an onramp request which allows users to fund their wallet
 * using mobile money or other payment methods.
 *
 * @param input - Object containing wallet ID, asset ID, amount, and result page
 * @param input.walletId - The wallet ID to fund
 * @param input.assetId - The asset UUID to purchase
 * @param input.amount - The amount to fund (in the currency's smallest unit, e.g., KES cents)
 * @param input.resultPage - The URL to redirect to after payment
 * @returns Success status with authorization URL and reference
 */
export async function requestOnramp(input: {
  walletId: string
  assetId: string
  amount: string
  resultPage: string
}): Promise<{
  success: boolean
  data?: {
    reference: string
    authorization_url: string
    access_code: string
  }
  error?: string
}> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return {
        success: false,
        error: 'User not authenticated',
      }
    }

    // Get user email from Clerk
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress

    if (!email) {
      return {
        success: false,
        error: 'User email not found',
      }
    }

    // Verify wallet exists (walletId is already the wallet UUID)
    try {
      const { getWallet } = await import('./wallets')
      const wallet = await getWallet(input.walletId)
      if (!wallet) {
        return {
          success: false,
          error: 'Wallet not found',
        }
      }
    } catch {
      return {
        success: false,
        error: 'Wallet not found',
      }
    }

    const cradleClient = getCradleClient()

    // Prepare the onramp request payload
    // Big is a type alias for string, so we can use the amount string directly
    const onrampPayload = {
      token: input.assetId as UUID,
      amount: input.amount as Big,
      wallet_id: input.walletId as UUID,
      result_page: input.resultPage,
      email: email,
    }

    console.log('=== Onramp API Request Payload ===')
    console.log('Payload:', JSON.stringify(onrampPayload, null, 2))

    // Make the onramp request
    const response = await cradleClient.onrampRequest(onrampPayload)

    throwIfError(response)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create onramp request',
      }
    }

    // Revalidate portfolio page to show updated balances
    revalidatePath('/portfolio')

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Error requesting onramp:', error)

    let errorMessage = 'Unknown error occurred'
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
