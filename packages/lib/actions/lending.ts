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
import type { LendingPool, Loan, LoanRepayment } from '../cradle-client-ts/types'
import type {
  ActionRouterInput,
  ActionRouterOutput,
  UUID,
  Big,
  GetPoolStatsOutput,
  GetUserBorrowPositionOutput,
  GetUserDepositPositonOutput,
  RepaymentAmount,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get a lending pool by UUID
 */
export async function getLendingPool(id: string): Promise<LendingPool> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getPool(id))
}

/**
 * Get all lending pools with optional filters
 */
export async function getLendingPools(): Promise<LendingPool[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.listPools())
}

/**
 * Get loans for a specific wallet
 */
export async function getLoansByWallet(walletId: string): Promise<Loan[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLoans(walletId))
}

/**
 * Get pool statistics
 */
export async function getPoolStats(poolId: string): Promise<GetPoolStatsOutput> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getPoolStats(poolId))
}

/**
 * Get loan position
 */
export async function getLoanPosition(loanId: string): Promise<GetUserBorrowPositionOutput> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLoanPosition(loanId))
}

/**
 * Get deposit position
 */
export async function getDepositPosition(
  poolId: string,
  walletId: string
): Promise<GetUserDepositPositonOutput> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getDepositPosition(poolId, walletId))
}

/**
 * Get loan repayments
 */
export async function getLoanRepayments(loanId: string): Promise<LoanRepayment[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getLoanRepayments(loanId))
}

/**
 * Get repayment amount
 */
export async function getRepaymentAmount(loanId: string): Promise<RepaymentAmount> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getRepaymentAmount(loanId))
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
export async function createLendingPool(input: {
  pool_address: string
  pool_contract_id: string
  reserve_asset: string
  loan_to_value: string
  base_rate: string
  slope1: string
  slope2: string
  liquidation_threshold: string
  liquidation_discount: string
  reserve_factor: string
  name?: string | null
  title?: string | null
  description?: string | null
  yield_asset: string
  treasury_wallet: string
  reserve_wallet: string
  pool_account_id: string
}): Promise<{
  success: boolean
  poolId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Pool: {
        CreateLendingPool: {
          pool_address: input.pool_address,
          pool_contract_id: input.pool_contract_id,
          reserve_asset: input.reserve_asset as UUID,
          loan_to_value: input.loan_to_value as Big,
          base_rate: input.base_rate as Big,
          slope1: input.slope1 as Big,
          slope2: input.slope2 as Big,
          liquidation_threshold: input.liquidation_threshold as Big,
          liquidation_discount: input.liquidation_discount as Big,
          reserve_factor: input.reserve_factor as Big,
          name: input.name,
          title: input.title,
          description: input.description,
          yield_asset: input.yield_asset as UUID,
          treasury_wallet: input.treasury_wallet as UUID,
          reserve_wallet: input.reserve_wallet as UUID,
          pool_account_id: input.pool_account_id as UUID,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create lending pool',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Pool' in output && 'CreateLendingPool' in output.Pool) {
      const poolId = output.Pool.CreateLendingPool

      // Revalidate lending pages
      revalidatePath('/lend')

      return {
        success: true,
        poolId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
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
export async function supplyLiquidity(input: {
  wallet: string
  pool: string
  amount: number
}): Promise<{
  success: boolean
  transactionId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Pool: {
        SupplyLiquidity: {
          wallet: input.wallet as UUID,
          pool: input.pool as UUID,
          amount: input.amount,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to supply liquidity',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Pool' in output && 'SupplyLiquidity' in output.Pool) {
      const transactionId = output.Pool.SupplyLiquidity

      // Revalidate lending pages
      revalidatePath('/lend')
      revalidatePath('/portfolio')
      revalidatePath(`/pool/${input.pool}`)

      return {
        success: true,
        transactionId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
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
export async function borrowAsset(input: {
  wallet: string
  pool: string
  amount: number
  collateral: string
}): Promise<{
  success: boolean
  loanId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Pool: {
        BorrowAsset: {
          wallet: input.wallet as UUID,
          pool: input.pool as UUID,
          amount: input.amount,
          collateral: input.collateral as UUID,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to borrow asset',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Pool' in output && 'BorrowAsset' in output.Pool) {
      const loanId = output.Pool.BorrowAsset

      // Revalidate lending pages
      revalidatePath('/lend')
      revalidatePath('/portfolio')
      revalidatePath(`/lend/${input.pool}`)

      return {
        success: true,
        loanId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
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
export async function repayBorrow(input: {
  wallet: string
  loan: string
  amount: number
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Pool: {
        RepayBorrow: {
          wallet: input.wallet as UUID,
          loan: input.loan as UUID,
          amount: input.amount,
        },
      },
    }
    const response = await client.process(action)

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
