/**
 * useTimeSeries Hooks
 *
 * TanStack Query hooks for fetching time series data
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchTimeSeriesRecord, fetchTimeSeriesRecords } from '../../services/fetchers'
import { marketDataQueryOptions, standardQueryOptions } from '../../utils/query-options'
import type { TimeSeriesRecord, TimeSeriesFilters } from '../../cradle-api-client'

export interface UseTimeSeriesRecordOptions {
  /**
   * Time series record ID to fetch
   */
  recordId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<TimeSeriesRecord>, 'queryKey' | 'queryFn'>
}

export interface UseTimeSeriesRecordsOptions {
  /**
   * Optional filters for time series records
   */
  filters?: TimeSeriesFilters
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
 * Hook to fetch a single time series record by ID
 *
 * @example
 * ```tsx
 * function RecordDetails({ recordId }: { recordId: string }) {
 *   const { data: record, isLoading } = useTimeSeriesRecord({ recordId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <p>Open: {record?.open}</p>
 *       <p>High: {record?.high}</p>
 *       <p>Low: {record?.low}</p>
 *       <p>Close: {record?.close}</p>
 *       <p>Volume: {record?.volume}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTimeSeriesRecord({
  recordId,
  enabled = true,
  queryOptions,
}: UseTimeSeriesRecordOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.timeSeries.byId(recordId),
    queryFn: () => fetchTimeSeriesRecord(recordId),
    enabled: enabled && !!recordId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch time series records with optional filters
 *
 * @example
 * ```tsx
 * // Fetch hourly data for a market
 * function MarketChart({ marketId, assetId }: { marketId: string, assetId: string }) {
 *   const { data: records, isLoading } = useTimeSeriesRecords({
 *     filters: {
 *       market_id: marketId,
 *       asset: assetId,
 *       interval: '1hr',
 *       start_time: '2024-01-01T00:00:00Z',
 *       end_time: '2024-01-02T00:00:00Z',
 *     }
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   return <Chart data={records} />
 * }
 *
 * // Fetch daily aggregated data
 * function DailyPriceChart({ marketId }: { marketId: string }) {
 *   const { data: records } = useTimeSeriesRecords({
 *     filters: {
 *       market_id: marketId,
 *       interval: '1day',
 *       data_provider_type: 'aggregated'
 *     }
 *   })
 *   return <CandlestickChart data={records} />
 * }
 * ```
 */
export function useTimeSeriesRecords({
  filters,
  enabled = true,
  queryOptions,
}: UseTimeSeriesRecordsOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.timeSeries.list(filters),
    queryFn: () => fetchTimeSeriesRecords(filters),
    enabled,
    ...marketDataQueryOptions,
    ...queryOptions,
  })
}
