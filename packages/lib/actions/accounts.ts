/**
 * Account Management Server Actions
 *
 * These server actions handle account and wallet operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import { MutationResponseHelpers } from '../cradle-client-ts/cradle-api-client'
import type {
  CradleAccount,
  CradleWallet,
  CreateAccountInput,
  UpdateAccountStatusInput,
  CreateWalletInput,
  CradleAccountStatus,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get a cradle account by UUID
 */
export async function getAccount(id: string): Promise<CradleAccount> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAccount(id))
}

/**
 * Get account by linked account identifier (e.g., Clerk user ID)
 */
export async function getAccountByLinkedId(linkedId: string): Promise<CradleAccount> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAccountByLinkedId(linkedId))
}

/**
 * Get all wallets for an account
 */
export async function getAccountWallets(accountId: string): Promise<CradleWallet[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAccountWallets(accountId))
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new Cradle account
 *
 * @param input - Account creation input
 * @returns The created account ID
 */
export async function createAccount(input: CreateAccountInput): Promise<{
  success: boolean
  accountId?: string
  status?: CradleAccountStatus
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.createAccount(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create account',
      }
    }

    if (!MutationResponseHelpers.isCreateAccount(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const accountId = response.data.Accounts.CreateAccount

    // Revalidate any account-related pages
    revalidatePath('/portfolio')
    revalidatePath('/select-role')

    return {
      success: true,
      accountId,
    }
  } catch (error) {
    console.error('Error creating account:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Update account status
 *
 * @param input - Account status update input
 * @returns Success status
 */
export async function updateAccountStatus(input: UpdateAccountStatusInput): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.updateAccountStatus(input)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to update account status',
      }
    }

    // Revalidate account pages
    revalidatePath('/portfolio')
    revalidatePath(`/account/${input.account_id}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating account status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Create a new wallet for an account
 *
 * @param input - Wallet creation input
 * @returns The created wallet ID
 */
export async function createWallet(input: CreateWalletInput): Promise<{
  success: boolean
  walletId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.createWallet(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create wallet',
      }
    }

    if (!MutationResponseHelpers.isCreateWallet(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const walletId = response.data.Accounts.CreateWallet

    // Revalidate wallet-related pages
    revalidatePath('/portfolio')
    revalidatePath(`/account/${input.cradle_account_id}`)

    return {
      success: true,
      walletId,
    }
  } catch (error) {
    console.error('Error creating wallet:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
