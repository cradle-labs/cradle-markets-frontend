/**
 * Lending Pool Server Actions
 *
 * These server actions handle lending pool operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import { MutationResponseHelpers } from '../cradle-client-ts/cradle-api-client'
import type {
  LendingPool,
  LendingTransaction,
  Loan,
  LendingPoolFilters,
  CreateLendingPoolInput,
  SupplyLiquidityInput,
  BorrowAssetInput,
  RepayBorrowInput,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get a lending pool by UUID
 */
export async function getLendingPool(id: string): Promise<LendingPool> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLendingPool(id))
}

/**
 * Get all lending pools with optional filters
 */
export async function getLendingPools(filters?: LendingPoolFilters): Promise<LendingPool[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLendingPools(filters))
}

/**
 * Get lending transactions for a specific pool
 */
export async function getLendingTransactions(poolId: string): Promise<LendingTransaction[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLendingTransactions(poolId))
}

/**
 * Get lending transactions for a specific wallet
 */
export async function getLendingTransactionsByWallet(
  walletId: string
): Promise<LendingTransaction[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLendingTransactionsByWallet(walletId))
}

/**
 * Get loans for a specific pool
 */
export async function getLoans(poolId: string): Promise<Loan[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLoans(poolId))
}

/**
 * Get loans for a specific wallet
 */
export async function getLoansByWallet(walletId: string): Promise<Loan[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLoansByWallet(walletId))
}

/**
 * Get a specific loan by UUID
 */
export async function getLoan(id: string): Promise<Loan> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLoan(id))
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a lending pool
 *
 * @param input - Lending pool creation input
 * @returns The created pool ID
 */
export async function createLendingPool(input: CreateLendingPoolInput): Promise<{
  success: boolean
  poolId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.createLendingPool(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create lending pool',
      }
    }

    if (!MutationResponseHelpers.isCreateLendingPool(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const poolId = response.data.Pool.CreateLendingPool

    // Revalidate lending pages
    revalidatePath('/lend')

    return {
      success: true,
      poolId,
    }
  } catch (error) {
    console.error('Error creating lending pool:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Supply liquidity to a lending pool
 *
 * @param input - Supply liquidity input
 * @returns The transaction ID
 */
export async function supplyLiquidity(input: SupplyLiquidityInput): Promise<{
  success: boolean
  transactionId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.supplyLiquidity(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to supply liquidity',
      }
    }

    if (!MutationResponseHelpers.isSupplyLiquidity(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const transactionId = response.data.Pool.SupplyLiquidity

    // Revalidate lending pages
    revalidatePath('/lend')
    revalidatePath('/portfolio')
    revalidatePath(`/pool/${input.pool}`)

    return {
      success: true,
      transactionId,
    }
  } catch (error) {
    console.error('Error supplying liquidity:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Borrow an asset from a lending pool
 *
 * @param input - Borrow asset input
 * @returns The loan ID
 */
export async function borrowAsset(input: BorrowAssetInput): Promise<{
  success: boolean
  loanId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.borrowAsset(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to borrow asset',
      }
    }

    if (!MutationResponseHelpers.isBorrowAsset(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const loanId = response.data.Pool.BorrowAsset

    // Revalidate lending pages
    revalidatePath('/lend')
    revalidatePath('/portfolio')
    revalidatePath(`/pool/${input.pool}`)

    return {
      success: true,
      loanId,
    }
  } catch (error) {
    console.error('Error borrowing asset:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Repay a borrowed asset
 *
 * @param input - Repay borrow input
 * @returns Success status
 */
export async function repayBorrow(input: RepayBorrowInput): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.repayBorrow(input)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to repay borrow',
      }
    }

    // Revalidate lending pages
    revalidatePath('/lend')
    revalidatePath('/portfolio')

    return { success: true }
  } catch (error) {
    console.error('Error repaying borrow:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
