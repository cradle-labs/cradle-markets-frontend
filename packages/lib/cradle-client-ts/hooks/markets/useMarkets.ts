/**
 * useMarkets Hook
 *
 * TanStack Query hook for fetching multiple markets with optional filters
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchMarkets } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { Market, MarketFilters } from '../../cradle-api-client'

export interface UseMarketsOptions {
  /**
   * Optional filters for markets
   */
  filters?: MarketFilters
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Market[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all markets with optional filters
 *
 * @example
 * ```tsx
 * // Fetch all markets
 * function AllMarkets() {
 *   const { data: markets, isLoading } = useMarkets()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {markets?.map(market => (
 *         <MarketCard key={market.id} market={market} />
 *       ))}
 *     </div>
 *   )
 * }
 *
 * // Fetch only active spot markets
 * function ActiveSpotMarkets() {
 *   const { data: markets } = useMarkets({
 *     filters: {
 *       market_type: 'spot',
 *       status: 'active'
 *     }
 *   })
 *   return <div>{markets?.length} active spot markets</div>
 * }
 *
 * // Fetch regulated markets
 * function RegulatedMarkets() {
 *   const { data: markets } = useMarkets({
 *     filters: { regulation: 'regulated' }
 *   })
 *   return <MarketList markets={markets} />
 * }
 * ```
 */
export function useMarkets({ filters, enabled = true, queryOptions }: UseMarketsOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.markets.list(filters),
    queryFn: () => fetchMarkets(filters),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
