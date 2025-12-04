/**
 * Time Series Server Actions
 *
 * These server actions handle time series data operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import type { TimeSeriesRecord, TimeSeriesInterval } from '../cradle-client-ts/types'
import type {
  ActionRouterInput,
  ActionRouterOutput,
  UUID,
  Big,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get time series history
 */
export async function getTimeSeriesHistory(params: {
  market: string
  duration_secs: Big | number
  interval: TimeSeriesInterval
  asset_id: string
}): Promise<TimeSeriesRecord[]> {
  const client = getCradleClient()
  return executeCradleOperation(() =>
    client.getTimeSeriesHistory({
      market: params.market as UUID,
      duration_secs: params.duration_secs,
      interval: params.interval,
      asset_id: params.asset_id as UUID,
    })
  )
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Add a time series record
 *
 * @param input - Time series record input
 * @returns The created record ID
 */
export async function addTimeSeriesRecord(input: {
  market_id: string
  asset: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  start_time: string
  end_time: string
  interval?: TimeSeriesInterval
  data_provider_type?: 'order_book' | 'exchange' | 'aggregated'
  data_provider?: string | null
}): Promise<{
  success: boolean
  recordId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      MarketTimeSeries: {
        AddRecord: {
          market_id: input.market_id as UUID,
          asset: input.asset as UUID,
          open: input.open as Big,
          high: input.high as Big,
          low: input.low as Big,
          close: input.close as Big,
          volume: input.volume as Big,
          start_time: input.start_time,
          end_time: input.end_time,
          interval: input.interval,
          data_provider_type: input.data_provider_type,
          data_provider: input.data_provider,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to add time series record',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('MarketTimeSeries' in output && 'AddRecord' in output.MarketTimeSeries) {
      const recordId = output.MarketTimeSeries.AddRecord

      // Revalidate market pages with time series data
      revalidatePath('/trade')
      revalidatePath(`/market/${input.market_id}`)

      return {
        success: true,
        recordId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error adding time series record:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
