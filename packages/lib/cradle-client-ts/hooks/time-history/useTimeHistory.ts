/**
 * useTimeHistory Hook
 *
 * TanStack Query hook for fetching time history data
 * directly from the /time-history/history endpoint
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { TimeHistoryParams, TimeHistoryDataPoint } from '../../../actions/time-history'

/**
 * Fetcher function that calls the server action
 */
async function fetchTimeHistory(params: TimeHistoryParams): Promise<TimeHistoryDataPoint[]> {
  const { getTimeHistory } = await import('../../../actions/time-history')
  return getTimeHistory(params)
}

export interface UseTimeHistoryOptions {
  /**
   * Market ID
   */
  market: string
  /**
   * Asset ID
   */
  asset_id: string
  /**
   * Duration in seconds
   */
  duration_secs: string
  /**
   * Time interval
   */
  interval: '15secs' | '1min' | '5min' | '15min' | '30min' | '1hr' | '4hr' | '1day' | '1week'
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<TimeHistoryDataPoint[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch time history data for a market
 *
 * @example
 * ```tsx
 * // Fetch 1 day of hourly data
 * function MarketChart({ marketId, assetId }: Props) {
 *   const { data, isLoading } = useTimeHistory({
 *     market: marketId,
 *     asset: assetId,
 *     duration_secs: '86400', // 1 day
 *     interval: '1hr',
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   return <Chart data={data} />
 * }
 *
 * // Fetch 1 week of daily data
 * function WeeklyChart({ marketId, assetId }: Props) {
 *   const { data } = useTimeHistory({
 *     market: marketId,
 *     asset: assetId,
 *     duration_secs: '604800', // 1 week
 *     interval: '1day',
 *   })
 *   return <CandlestickChart data={data} />
 * }
 * ```
 */
export function useTimeHistory({
  market,
  asset_id,
  duration_secs,
  interval,
  enabled = true,
  queryOptions,
}: UseTimeHistoryOptions) {
  return useQuery({
    queryKey: ['time-history', market, asset_id, duration_secs, interval],
    queryFn: () =>
      fetchTimeHistory({
        market,
        asset_id,
        duration_secs,
        interval,
      }),
    enabled: enabled && !!market && !!asset_id,
    staleTime: 1000 * 60 * 30, // Consider data stale after 30 minutes (historical data doesn't change)
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    ...queryOptions,
  })
}
