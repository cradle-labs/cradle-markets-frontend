/**
 * useMarket Hook
 *
 * TanStack Query hook for fetching a single market
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchMarket } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { Market } from '../../cradle-api-client'

export interface UseMarketOptions {
  /**
   * Market ID to fetch
   */
  marketId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Market>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a market by its ID
 *
 * @example
 * ```tsx
 * function MarketDetails({ marketId }: { marketId: string }) {
 *   const { data: market, isLoading } = useMarket({ marketId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <h2>{market?.name}</h2>
 *       <p>{market?.description}</p>
 *       <span>{market?.market_type}</span>
 *     </div>
 *   )
 * }
 * ```
 */
export function useMarket({ marketId, enabled = true, queryOptions }: UseMarketOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.markets.byId(marketId),
    queryFn: () => fetchMarket(marketId),
    enabled: enabled && !!marketId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
