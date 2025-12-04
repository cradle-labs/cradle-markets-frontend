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
import type { CradleAccount, CradleWallet, CradleAccountStatus } from '../cradle-client-ts/types'
import type {
  ActionRouterInput,
  ActionRouterOutput,
  CradleAccountType,
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
  return executeCradleOperation(() => client.getAccountByLinked(linkedId))
}

/**
 * Get all wallets for an account
 */
export async function getAccountWallets(accountId: string): Promise<CradleWallet[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getWalletsForAccount(accountId)).then(wallet => {
    // The new API returns a single wallet, wrap it in an array for backward compatibility
    return [wallet]
  })
}

/**
 * Get balances for an account
 * Returns an array of token balances with token ID and balance
 */
export async function getBalances(
  accountId: string
): Promise<Array<{ token: string; balance: string }>> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getBalances(accountId))
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new Cradle account and its associated wallet
 *
 * @param input - Account creation input
 * @returns The created account ID and wallet ID
 */
export async function createAccount(input: {
  linked_account_id: string
  account_type?: CradleAccountType
  status?: CradleAccountStatus
}): Promise<{
  success: boolean
  accountId?: string
  walletId?: string
  status?: CradleAccountStatus
  error?: string
}> {
  try {
    const client = getCradleClient()

    // Step 1: Create the account
    const createAccountAction: ActionRouterInput = {
      Accounts: {
        CreateAccount: {
          linked_account_id: input.linked_account_id,
          account_type: input.account_type,
          status: input.status,
        },
      },
    }
    const accountResponse = await client.process(createAccountAction)

    if (!accountResponse.success || !accountResponse.data) {
      return {
        success: false,
        error: accountResponse.error || 'Failed to create account',
      }
    }

    const accountOutput = accountResponse.data as ActionRouterOutput
    if (!('Accounts' in accountOutput) || !('CreateAccount' in accountOutput.Accounts)) {
      return {
        success: false,
        error: 'Unexpected response format from API when creating account',
      }
    }

    const accountResult = accountOutput.Accounts.CreateAccount
    const accountId = accountResult.id
    let walletId = accountResult.wallet_id

    // Step 2: Create wallet for the account (if not already created)
    // Even if CreateAccount returns a wallet_id, we explicitly create the wallet
    // to ensure it exists and get the wallet details
    if (accountId) {
      try {
        const createWalletAction: ActionRouterInput = {
          Accounts: {
            CreateAccountWallet: {
              cradle_account_id: accountId,
            },
          },
        }
        const walletResponse = await client.process(createWalletAction)

        if (walletResponse.success && walletResponse.data) {
          const walletOutput = walletResponse.data as ActionRouterOutput
          if ('Accounts' in walletOutput && 'CreateAccountWallet' in walletOutput.Accounts) {
            // Use the newly created wallet ID, or fall back to the one from CreateAccount
            walletId = walletOutput.Accounts.CreateAccountWallet.id || walletId
          }
        } else {
          // If wallet creation fails but account was created, log warning but don't fail
          console.warn('Account created but wallet creation failed:', walletResponse.error)
          // If we don't have a wallet_id from CreateAccount, this is an error
          if (!walletId) {
            return {
              success: false,
              error: walletResponse.error || 'Account created but failed to create wallet',
            }
          }
        }
      } catch (walletError) {
        // If wallet creation throws an error, log it but continue if we have wallet_id from CreateAccount
        console.warn('Error creating wallet:', walletError)
        if (!walletId) {
          return {
            success: false,
            error:
              walletError instanceof Error
                ? walletError.message
                : 'Account created but failed to create wallet',
          }
        }
      }
    }

    // Revalidate any account-related pages
    revalidatePath('/portfolio')
    revalidatePath('/select-role')

    return {
      success: true,
      accountId,
      walletId,
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
export async function updateAccountStatus(input: {
  account_id: string
  status: CradleAccountStatus
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Accounts: {
        UpdateAccountStatus: {
          cradle_account_id: input.account_id,
          status: input.status,
        },
      },
    }
    const response = await client.process(action)

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
export async function createWallet(input: {
  cradle_account_id: string
  address?: string
  contract_id?: string
}): Promise<{
  success: boolean
  walletId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Accounts: {
        CreateAccountWallet: {
          cradle_account_id: input.cradle_account_id,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create wallet',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Accounts' in output && 'CreateAccountWallet' in output.Accounts) {
      const walletId = output.Accounts.CreateAccountWallet.id

      // Revalidate wallet-related pages
      revalidatePath('/portfolio')
      revalidatePath(`/account/${input.cradle_account_id}`)

      return {
        success: true,
        walletId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error creating wallet:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
