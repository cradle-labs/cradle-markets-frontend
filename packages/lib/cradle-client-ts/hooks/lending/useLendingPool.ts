/**
 * useLendingPool Hook
 *
 * TanStack Query hook for fetching a single lending pool
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import {
  fetchLendingPool,
  fetchPoolStats,
  fetchLoanPosition,
  fetchDepositPosition,
} from '../../services/fetchers'
import { standardQueryOptions, userDataQueryOptions } from '../../utils/query-options'
import type { LendingPool } from '../../types'
import type {
  GetPoolStatsOutput,
  GetUserBorrowPositionOutput,
  GetUserDepositPositonOutput,
} from '../../cradle-api-client'

export interface UseLendingPoolOptions {
  /**
   * Lending pool ID to fetch
   */
  poolId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LendingPool>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a lending pool by its ID
 *
 * @example
 * ```tsx
 * function PoolDetails({ poolId }: { poolId: string }) {
 *   const { data: pool, isLoading } = useLendingPool({ poolId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <h2>{pool?.name}</h2>
 *       <p>{pool?.description}</p>
 *       <p>LTV: {pool?.loan_to_value}</p>
 *       <p>Base Rate: {pool?.base_rate}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLendingPool({ poolId, enabled = true, queryOptions }: UseLendingPoolOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.byId(poolId),
    queryFn: () => fetchLendingPool(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UsePoolStatsOptions {
  /**
   * Pool ID to fetch stats for
   */
  poolId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<GetPoolStatsOutput>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch pool statistics
 */
export function usePoolStats({ poolId, enabled = true, queryOptions }: UsePoolStatsOptions) {
  return useQuery({
    queryKey: [...cradleQueryKeys.lendingPools.byId(poolId), 'stats'],
    queryFn: () => fetchPoolStats(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UseLoanPositionOptions {
  /**
   * Loan ID to fetch position for
   */
  loanId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<GetUserBorrowPositionOutput>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch loan position
 */
export function useLoanPosition({ loanId, enabled = true, queryOptions }: UseLoanPositionOptions) {
  return useQuery({
    queryKey: [...cradleQueryKeys.loans.byId(loanId), 'position'],
    queryFn: () => fetchLoanPosition(loanId),
    enabled: enabled && !!loanId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

export interface UseDepositPositionOptions {
  /**
   * Pool ID
   */
  poolId: string
  /**
   * Wallet ID
   */
  walletId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<GetUserDepositPositonOutput>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch deposit position
 */
export function useDepositPosition({
  poolId,
  walletId,
  enabled = true,
  queryOptions,
}: UseDepositPositionOptions) {
  return useQuery({
    queryKey: [...cradleQueryKeys.lendingPools.byId(poolId), 'deposit', walletId],
    queryFn: () => fetchDepositPosition(poolId, walletId),
    enabled: enabled && !!poolId && !!walletId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
