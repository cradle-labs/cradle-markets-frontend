/**
 * useLendingPool Hook
 *
 * TanStack Query hook for fetching a single lending pool
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchLendingPool } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { LendingPool } from '../../cradle-api-client'

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
