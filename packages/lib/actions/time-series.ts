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
import { MutationResponseHelpers } from '../cradle-client-ts/cradle-api-client'
import type {
  TimeSeriesRecord,
  TimeSeriesFilters,
  AddTimeSeriesRecordInput,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get a time series record by UUID
 */
export async function getTimeSeriesRecord(id: string): Promise<TimeSeriesRecord> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getTimeSeriesRecord(id))
}

/**
 * Get time series records with optional filters
 */
export async function getTimeSeriesRecords(
  filters?: TimeSeriesFilters
): Promise<TimeSeriesRecord[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getTimeSeriesRecords(filters))
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
export async function addTimeSeriesRecord(input: AddTimeSeriesRecordInput): Promise<{
  success: boolean
  recordId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.addTimeSeriesRecord(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to add time series record',
      }
    }

    if (!MutationResponseHelpers.isAddRecord(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const recordId = response.data.MarketTimeSeries.AddRecord

    // Revalidate market pages with time series data
    revalidatePath('/trade')
    revalidatePath(`/market/${input.market_id}`)

    return {
      success: true,
      recordId,
    }
  } catch (error) {
    console.error('Error adding time series record:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
