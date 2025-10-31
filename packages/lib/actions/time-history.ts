/**
 * Time History Server Actions
 *
 * Server actions for fetching time series history data
 * directly from the /time-history/history endpoint
 */

'use server'

import axios from 'axios'

export interface TimeHistoryParams {
  market: string
  asset_id: string
  duration_secs: string
  interval: '15secs' | '1min' | '5min' | '15min' | '30min' | '1hr' | '4hr' | '1day' | '1week'
}

export interface TimeHistoryDataPoint {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// API response type (values come as strings from the API)
interface TimeHistoryApiDataPoint {
  id?: string
  market_id?: string
  asset?: string
  timestamp?: number
  start_time: string
  end_time?: string
  open: string | number
  high: string | number
  low: string | number
  close: string | number
  volume: string | number
  interval?: string
  data_provider_type?: string
  data_provider?: string | null
  created_at?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

/**
 * Fetch time history data from the API
 */
export async function getTimeHistory(params: TimeHistoryParams): Promise<TimeHistoryDataPoint[]> {
  const baseUrl = process.env.NEXT_PUBLIC_CRADLE_API_URL
  const apiKey = process.env.CRADLE_API_KEY || process.env.API_SECRET_KEY

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_CRADLE_API_URL is not defined in environment variables')
  }

  if (!apiKey) {
    throw new Error('CRADLE_API_KEY or API_SECRET_KEY is not defined in environment variables')
  }

  try {
    const url = new URL('/time-series/history', baseUrl)
    url.searchParams.append('market', params.market)
    url.searchParams.append('asset_id', params.asset_id)
    url.searchParams.append('duration_secs', params.duration_secs)
    url.searchParams.append('interval', params.interval)

    console.log('Fetching time history:', url.toString())

    const response = await axios.get<ApiResponse<TimeHistoryApiDataPoint[]>>(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 30000,
    })

    console.log('Time history response:', {
      success: response.data.success,
      dataLength: response.data.data?.length || 0,
      error: response.data.error,
    })

    // Extract the actual data array from the API response wrapper
    if (response.data.success && response.data.data) {
      // Convert string values to numbers and parse timestamps
      const parsedData: TimeHistoryDataPoint[] = response.data.data.map(
        (point: TimeHistoryApiDataPoint) => {
          // Parse timestamp from start_time (API returns ISO string)
          const timestamp =
            point.timestamp || Math.floor(new Date(point.start_time).getTime() / 1000)

          return {
            timestamp,
            open: typeof point.open === 'string' ? parseFloat(point.open) : point.open,
            high: typeof point.high === 'string' ? parseFloat(point.high) : point.high,
            low: typeof point.low === 'string' ? parseFloat(point.low) : point.low,
            close: typeof point.close === 'string' ? parseFloat(point.close) : point.close,
            volume: typeof point.volume === 'string' ? parseFloat(point.volume) : point.volume,
          }
        }
      )

      console.log('Parsed time history data:', parsedData.slice(0, 2)) // Log first 2 items for verification
      return parsedData
    }

    // If the response indicates failure, throw an error
    if (!response.data.success) {
      throw new Error(response.data.error || 'API returned unsuccessful response')
    }

    // Return empty array if no data
    return []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Time history fetch failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
      throw new Error(
        error.response?.data?.message || error.message || 'Failed to fetch time history data'
      )
    }

    throw new Error('Unknown error occurred while fetching time history')
  }
}
