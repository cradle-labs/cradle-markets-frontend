'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useMarket } from '@repo/lib/cradle-client-ts/hooks/markets/useMarket'
import { useAsset } from '@repo/lib/cradle-client-ts/hooks/assets/useAsset'
import { useOrders } from '@repo/lib/cradle-client-ts/hooks/orders/useOrders'
import type { Market, Order } from '@repo/lib/cradle-client-ts/types'
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

// Configuration for different time periods
interface TimeConfig {
  duration_secs: string
  interval: '15secs' | '1min' | '5min' | '15min' | '30min' | '1hr' | '4hr' | '1day' | '1week'
}

const TIME_CONFIGS: Record<string, TimeConfig> = {
  REALTIME: { duration_secs: '900', interval: '15secs' }, // 15 minutes: 15-second intervals for live chart
  '1D': { duration_secs: '86400', interval: '15min' }, // 1 day: 15-minute intervals
  '1W': { duration_secs: '604800', interval: '15min' }, // 1 week: 15-minute intervals
  '1M': { duration_secs: '2592000', interval: '4hr' }, // 1 month: 4-hour intervals
  '3M': { duration_secs: '7776000', interval: '1day' }, // 3 months: daily intervals
  '1Y': { duration_secs: '31536000', interval: '1week' }, // 1 year: weekly intervals
  ALL: { duration_secs: '94608000', interval: '1week' }, // 3 years: weekly intervals
}

interface AssetDetailContextType {
  asset: TokenizedAssetData | null
  market: Market | null
  assetOne: any | null // The primary asset (e.g., SAF)
  assetTwo: any | null // The quote asset (e.g., cpUSD)
  orders: Order[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const AssetDetailContext = createContext<AssetDetailContextType | undefined>(undefined)

interface AssetDetailProviderProps {
  children: ReactNode
  marketId: string
}

export function AssetDetailProvider({ children, marketId }: AssetDetailProviderProps) {
  // Fetch market data
  const {
    data: market,
    isLoading: marketLoading,
    error: marketError,
    refetch: refetchMarket,
  } = useMarket({ marketId })

  console.log('Market:', market)
  // Fetch primary asset data (asset_one from the market)
  const {
    data: primaryAsset,
    isLoading: assetOneLoading,
    error: assetOneError,
    refetch: refetchAssetOne,
  } = useAsset({
    assetId: market?.asset_one || '',
    enabled: !!market?.asset_one,
  })

  // Fetch secondary asset data (asset_two from the market)
  const {
    data: secondaryAsset,
    isLoading: assetTwoLoading,
    error: assetTwoError,
    refetch: refetchAssetTwo,
  } = useAsset({
    assetId: market?.asset_two || '',
    enabled: !!market?.asset_two,
  })

  // Fetch time history data for all chart periods
  const timeHistoryQueries = useQueries({
    queries: Object.entries(TIME_CONFIGS).map(([period, config]) => ({
      queryKey: [
        'time-history',
        marketId,
        market?.asset_one,
        config.duration_secs,
        config.interval,
      ],
      queryFn: () =>
        fetchTimeHistory({
          market: marketId,
          asset_id: market?.asset_one || '',
          duration_secs: config.duration_secs,
          interval: config.interval,
        }),
      enabled: !!market?.asset_one,
      // For REALTIME data, refetch every 15 seconds
      refetchInterval: (period === 'REALTIME' ? 15000 : false) as number | false,
      staleTime: period === 'REALTIME' ? 0 : 1000 * 60 * 2, // No stale time for realtime, 2 minutes for others
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: false,
    })),
  })

  // Combine all time history data and sort by timestamp
  const allTimeHistoryData = useMemo(() => {
    const allData: TimeHistoryDataPoint[] = []
    timeHistoryQueries.forEach(query => {
      if (query.data && Array.isArray(query.data)) {
        allData.push(...query.data)
      }
    })

    // Remove duplicates and sort by timestamp
    const uniqueData = Array.from(
      new Map(allData.map(item => [item.timestamp, item])).values()
    ).sort((a, b) => a.timestamp - b.timestamp)

    console.log('Combined time history data:', uniqueData.length, 'data points')
    return uniqueData
  }, [timeHistoryQueries])

  // Fetch orders for this market
  const {
    data: orders = [],
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrders({
    filters: { market_id: marketId },
  })

  // Aggregate loading states
  const timeHistoryLoading = timeHistoryQueries.some(q => q.isLoading)
  const loading =
    marketLoading || assetOneLoading || assetTwoLoading || timeHistoryLoading || ordersLoading

  // Aggregate error states (time history and orders are optional)
  const error = marketError?.message || assetOneError?.message || assetTwoError?.message || null

  // Log time history errors as warnings
  const timeHistoryErrors = timeHistoryQueries.filter(q => q.error)
  if (timeHistoryErrors.length > 0) {
    console.warn(`Time history fetch failed for market ${marketId}:`, timeHistoryErrors)
  }

  // Transform data into TokenizedAssetData format
  const asset = useMemo((): TokenizedAssetData | null => {
    if (!market || !primaryAsset) return null

    console.log('Transforming asset detail data:')
    console.log('- Market:', market)
    console.log('- Primary Asset:', primaryAsset)
    console.log('- Combined Time History:', allTimeHistoryData.length, 'data points')

    // If no time history data, return asset with empty chart data
    if (allTimeHistoryData.length === 0) {
      console.warn(
        'No time history data available for market:',
        marketId,
        '- showing details without chart'
      )
      return {
        id: market.id,
        symbol: primaryAsset.symbol,
        name: primaryAsset.name,
        logo: primaryAsset.icon,
        currentPrice: 0,
        dailyChange: 0,
        dailyChangePercent: 0,
        priceHistory: [], // Empty array = no chart
        timeHistoryData: [],
      }
    }

    // Convert time history to price history format
    const priceHistory: Array<[number, number]> = allTimeHistoryData.map(point => [
      point.timestamp * 1000,
      point.close,
    ])

    // Calculate current price from the latest data
    const latestDataPoint = allTimeHistoryData[allTimeHistoryData.length - 1]
    const currentPrice = typeof latestDataPoint?.close === 'number' ? latestDataPoint.close : 0

    // Find data point from ~24 hours ago for daily change
    const dayAgo = Date.now() / 1000 - 86400
    const dayAgoData = allTimeHistoryData.find(point => point.timestamp >= dayAgo)
    const previousPrice = dayAgoData
      ? typeof dayAgoData.close === 'number'
        ? dayAgoData.close
        : currentPrice
      : allTimeHistoryData.length > 1
        ? typeof allTimeHistoryData[0].close === 'number'
          ? allTimeHistoryData[0].close
          : currentPrice
        : currentPrice

    const dailyChange = currentPrice - previousPrice
    const dailyChangePercent = previousPrice !== 0 ? (dailyChange / previousPrice) * 100 : 0

    return {
      id: market.id,
      symbol: primaryAsset.symbol,
      name: primaryAsset.name,
      logo: primaryAsset.icon,
      currentPrice,
      dailyChange,
      dailyChangePercent,
      priceHistory,
      timeHistoryData: allTimeHistoryData, // Pass full OHLC data for candlestick chart
    }
  }, [market, primaryAsset, allTimeHistoryData, marketId])

  const refetch = () => {
    refetchMarket()
    refetchAssetOne()
    refetchAssetTwo()
    timeHistoryQueries.forEach(query => query.refetch())
    refetchOrders()
  }

  const value: AssetDetailContextType = {
    asset,
    market: market || null,
    assetOne: primaryAsset || null,
    assetTwo: secondaryAsset || null,
    orders,
    loading,
    error,
    refetch,
  }

  return <AssetDetailContext.Provider value={value}>{children}</AssetDetailContext.Provider>
}

export function useAssetDetail(): AssetDetailContextType {
  const context = useContext(AssetDetailContext)
  if (context === undefined) {
    throw new Error('useAssetDetail must be used within an AssetDetailProvider')
  }
  return context
}
