/**
 * useTimeSeries Hooks
 *
 * TanStack Query hooks for fetching time series data
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchTimeSeriesHistory } from '../../services/fetchers'
import { marketDataQueryOptions } from '../../utils/query-options'
import type { TimeSeriesRecord, TimeSeriesInterval } from '../../types'

export interface UseTimeSeriesHistoryOptions {
  /**
   * Market ID
   */
  market: string
  /**
   * Duration in seconds
   */
  duration_secs: string | number
  /**
   * Time series interval
   */
  interval: TimeSeriesInterval
  /**
   * Asset ID
   */
  asset_id: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<TimeSeriesRecord[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch time series history
 *
 * @example
 * ```tsx
 * function MarketChart({ marketId, assetId }: { marketId: string; assetId: string }) {
 *   const { data: records, isLoading } = useTimeSeriesHistory({
 *     market: marketId,
 *     duration_secs: 86400, // 1 day
 *     interval: '1hr',
 *     asset_id: assetId,
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   return <Chart data={records} />
 * }
 * ```
 */
export function useTimeSeriesHistory({
  market,
  duration_secs,
  interval,
  asset_id,
  enabled = true,
  queryOptions,
}: UseTimeSeriesHistoryOptions) {
  return useQuery({
    queryKey: [
      ...cradleQueryKeys.timeSeries.all,
      'history',
      market,
      interval,
      asset_id,
      duration_secs,
    ],
    queryFn: () => fetchTimeSeriesHistory({ market, duration_secs, interval, asset_id }),
    enabled: enabled && !!market && !!asset_id,
    ...marketDataQueryOptions,
    ...queryOptions,
  })
}
