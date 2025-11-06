'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { TokenizedAssetData } from './TokenizedAssetCard'
import { useMarkets } from '@repo/lib/cradle-client-ts/hooks/markets/useMarkets'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import type { TimeHistoryDataPoint } from '@repo/lib/actions/time-history'

// Import the fetcher function
async function fetchTimeHistory(params: {
  market: string
  asset_id: string
  duration_secs: string
  interval: '15secs' | '1min' | '5min' | '15min' | '30min' | '1hr' | '4hr' | '1day' | '1week'
}): Promise<TimeHistoryDataPoint[]> {
  const { getTimeHistory } = await import('@repo/lib/actions/time-history')
  return getTimeHistory(params)
}

interface TokenizedAssetContextType {
  assets: TokenizedAssetData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const TokenizedAssetContext = createContext<TokenizedAssetContextType | undefined>(undefined)

interface TokenizedAssetProviderProps {
  children: ReactNode
}

/**
 * Transform markets and assets data from real API into TokenizedAssetData format
 */
function transformMarketsToAssets(
  markets: any[],
  assets: any[],
  timeHistoryResults: Array<{ data?: TimeHistoryDataPoint[]; error: any }>
): TokenizedAssetData[] {
  console.log('Markets from API:', markets)
  console.log('Assets from API:', assets)
  console.log('Time history results:', timeHistoryResults)

  // Only get spot markets (not futures or derivatives) for the main trading page
  const spotMarkets = markets.filter(market => market.market_type === 'spot')
  console.log('Spot markets:', spotMarkets)

  return spotMarkets
    .map((market, index) => {
      // Find the primary asset (asset_one) for this market
      const asset = assets.find(a => a.id === market.asset_one)

      if (!asset) {
        console.warn(`Asset not found for market ${market.id}`)
        return null
      }

      // Get time history data for this market (matches by index)
      const timeHistoryResult = timeHistoryResults[index]
      const timeHistoryData = timeHistoryResult?.data || []

      if (timeHistoryResult?.error) {
        console.warn(`Time history fetch failed for market ${market.id}:`, timeHistoryResult.error)
      }

      // If no time history data, show market without chart data
      if (timeHistoryData.length === 0) {
        console.warn(`No time history data for market ${market.id} - showing without chart`)
        return {
          id: market.id,
          symbol: asset.symbol,
          name: asset.name,
          logo: asset.icon,
          currentPrice: 0,
          dailyChange: 0,
          dailyChangePercent: 0,
          priceHistory: [], // Empty array = no chart
          timeHistoryData: [],
        }
      }

      // Convert time history to price history format
      const priceHistory: Array<[number, number]> = timeHistoryData.map(point => [
        point.timestamp * 1000,
        point.close,
      ])

      // Calculate current price and daily change from real data
      const latestDataPoint = timeHistoryData[timeHistoryData.length - 1]
      const currentPrice = typeof latestDataPoint?.close === 'number' ? latestDataPoint.close : 0

      const previousDataPoint =
        timeHistoryData.length > 1 ? timeHistoryData[timeHistoryData.length - 2] : null
      const previousPrice =
        previousDataPoint && typeof previousDataPoint.close === 'number'
          ? previousDataPoint.close
          : currentPrice

      const dailyChange = currentPrice - previousPrice
      const dailyChangePercent = previousPrice !== 0 ? (dailyChange / previousPrice) * 100 : 0

      return {
        id: market.id,
        symbol: asset.symbol,
        name: asset.name,
        logo: asset.icon,
        currentPrice,
        dailyChange,
        dailyChangePercent,
        priceHistory,
        timeHistoryData,
      }
    })
    .filter(Boolean) as TokenizedAssetData[]
}

export function TokenizedAssetProvider({ children }: TokenizedAssetProviderProps) {
  // Fetch real data from API using TanStack Query hooks
  const {
    data: markets = [],
    isLoading: marketsLoading,
    error: marketsError,
    refetch: refetchMarkets,
  } = useMarkets()
  const {
    data: assets = [],
    isLoading: assetsLoading,
    error: assetsError,
    refetch: refetchAssets,
  } = useAssets()

  // Filter spot markets for time history fetching
  const spotMarkets = useMemo(
    () => markets.filter(market => market.market_type === 'spot'),
    [markets]
  )

  // Fetch time history for each spot market using useQueries
  const timeHistoryQueries = useQueries({
    queries: spotMarkets.map(market => ({
      queryKey: ['time-history', market.id, market.asset_one, '86400', '15secs'],
      queryFn: () =>
        fetchTimeHistory({
          market: market.id,
          asset_id: market.asset_one,
          duration_secs: '86400', // 1 day
          interval: '15secs' as const,
        }),
      enabled: !!market.id && !!market.asset_one && assets.length > 0,
      staleTime: 1000 * 60 * 30, // 30 minutes - historical data doesn't change
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: false, // Don't retry on failure, just use fallback
    })),
  })

  console.log(
    'timeHistoryQueries',
    timeHistoryQueries.map(query => query.data)
  )

  // Aggregate loading states
  const timeHistoryLoading = timeHistoryQueries.some(query => query.isLoading)
  const loading = marketsLoading || assetsLoading || timeHistoryLoading

  // Aggregate error states (only for markets and assets - time history is optional)
  const error = marketsError?.message || assetsError?.message || null

  // Transform data using useMemo - no useEffect needed with TanStack Query
  const transformedAssets = useMemo(() => {
    if (!loading && markets.length > 0 && assets.length > 0) {
      console.log('Raw data received:')
      console.log('- Markets:', markets)
      console.log('- Assets:', assets)
      console.log(
        '- Time history queries:',
        timeHistoryQueries.map(q => ({
          isLoading: q.isLoading,
          isError: q.isError,
          dataLength: q.data?.length || 0,
        }))
      )

      // Extract time history results
      const timeHistoryResults = timeHistoryQueries.map(query => ({
        data: query.data,
        error: query.error,
      }))

      const transformed = transformMarketsToAssets(markets, assets, timeHistoryResults)
      console.log('Transformed assets:', transformed)
      return transformed
    }
    return []
  }, [markets, assets, timeHistoryQueries, loading])

  const refetch = () => {
    refetchMarkets()
    refetchAssets()
    timeHistoryQueries.forEach(query => query.refetch())
  }

  return (
    <TokenizedAssetContext.Provider
      value={{
        assets: transformedAssets,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </TokenizedAssetContext.Provider>
  )
}

export function useTokenizedAssets() {
  const context = useContext(TokenizedAssetContext)
  if (context === undefined) {
    throw new Error('useTokenizedAssets must be used within a TokenizedAssetProvider')
  }
  return context
}
