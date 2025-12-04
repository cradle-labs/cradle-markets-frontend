/**
 * useLendingPools Hook
 *
 * TanStack Query hook for fetching multiple lending pools with optional filters
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchLendingPools } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { LendingPool } from '../../types'

export interface UseLendingPoolsOptions {
  /**
   * Optional filters for lending pools
   */
  filters?: {
    reserve_asset?: string
    min_loan_to_value?: number
    max_loan_to_value?: number
  }
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LendingPool[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all lending pools with optional filters
 *
 * @example
 * ```tsx
 * // Fetch all lending pools
 * function AllPools() {
 *   const { data: pools, isLoading } = useLendingPools()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {pools?.map(pool => (
 *         <PoolCard key={pool.id} pool={pool} />
 *       ))}
 *     </div>
 *   )
 * }
 *
 * // Fetch pools for a specific reserve asset
 * function AssetPools({ assetId }: { assetId: string }) {
 *   const { data: pools } = useLendingPools({
 *     filters: { reserve_asset: assetId }
 *   })
 *   return <PoolList pools={pools} />
 * }
 *
 * // Fetch pools with specific LTV range
 * function HighLTVPools() {
 *   const { data: pools } = useLendingPools({
 *     filters: {
 *       min_loan_to_value: 0.7,
 *       max_loan_to_value: 0.9
 *     }
 *   })
 *   return <div>{pools?.length} high LTV pools</div>
 * }
 * ```
 */
export function useLendingPools({
  filters,
  enabled = true,
  queryOptions,
}: UseLendingPoolsOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.list(filters),
    queryFn: () => fetchLendingPools(),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
