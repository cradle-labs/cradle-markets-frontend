/**
 * useAssetMultiplier Hook
 *
 * TanStack Query hook for fetching asset price from the pool oracle
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAssetMultiplier } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { PriceOracle } from '../../cradle-api-client'

export interface UseAssetMultiplierOptions {
  /**
   * Pool ID to fetch multiplier for
   */
  poolId: string
  /**
   * Asset ID to fetch multiplier for
   */
  assetId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<PriceOracle>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch asset multiplier (price) from pool oracle
 *
 * @example
 * ```tsx
 * function CollateralPrice({ poolId, assetId }: { poolId: string; assetId: string }) {
 *   const { data: priceOracle, isLoading } = useAssetMultiplier({ poolId, assetId })
 *
 *   if (isLoading) return <Spinner />
 *   return <div>Price: {priceOracle?.price}</div>
 * }
 * ```
 */
export function useAssetMultiplier({
  poolId,
  assetId,
  enabled = true,
  queryOptions,
}: UseAssetMultiplierOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.assetMultiplier(poolId, assetId),
    queryFn: () => fetchAssetMultiplier(poolId, assetId),
    enabled: enabled && !!poolId && !!assetId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
