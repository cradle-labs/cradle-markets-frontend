/**
 * useAssets Hook
 *
 * TanStack Query hook for fetching multiple assets with optional filters
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAssets } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { Asset, AssetType } from '../../cradle-api-client'

export interface UseAssetsOptions {
  /**
   * Optional filters for assets
   */
  filters?: {
    asset_type?: AssetType
  }
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Asset[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all assets with optional filters
 *
 * @example
 * ```tsx
 * // Fetch all assets
 * function AllAssets() {
 *   const { data: assets, isLoading } = useAssets()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {assets?.map(asset => (
 *         <AssetCard key={asset.id} asset={asset} />
 *       ))}
 *     </div>
 *   )
 * }
 *
 * // Fetch only stablecoins
 * function Stablecoins() {
 *   const { data: stablecoins } = useAssets({
 *     filters: { asset_type: 'stablecoin' }
 *   })
 *   return <div>{stablecoins?.length} stablecoins</div>
 * }
 * ```
 */
export function useAssets({ enabled = true, queryOptions }: UseAssetsOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.assets.list(),
    queryFn: () => fetchAssets(),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
