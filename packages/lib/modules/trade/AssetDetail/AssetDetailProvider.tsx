'use client'

import { createContext, useContext, ReactNode, useMemo, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useMarket } from '@repo/lib/cradle-client-ts/hooks/markets/useMarket'
import { useAsset } from '@repo/lib/cradle-client-ts/hooks/assets/useAsset'
import { useOrders } from '@repo/lib/cradle-client-ts/hooks/orders/useOrders'
import type { Market, Order } from '@repo/lib/cradle-client-ts/types'
import type { TimeHistoryDataPoint } from '@repo/lib/actions/time-history'
import { computePriceFromOrders } from '../shared/price-fallback'

// Fetch all-time data with a 1-day interval — gives us good coverage
// without needing multiple queries. The chart filters client-side per timeframe.
const TIME_HISTORY_CONFIG = {
  duration_secs: '94608000', // ~3 years
  interval: '1day' as const,
}

async function fetchTimeHistory(params: {
  market: string
  asset_id: string
  duration_secs: string
  interval: '15secs' | '1min' | '5min' | '15min' | '30min' | '1hr' | '4hr' | '1day' | '1week'
}): Promise<TimeHistoryDataPoint[]> {
  const { getTimeHistory } = await import('@repo/lib/actions/time-history')
  return getTimeHistory(params)
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
  /** Price selected from order book click — forms should use this as limit price */
  selectedOrderBookPrice: number | null
  setSelectedOrderBookPrice: (price: number | null) => void
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

  // Single all-time query — chart filters client-side per timeframe
  const {
    data: timeHistoryData = [],
    isLoading: timeHistoryLoading,
    refetch: refetchTimeHistory,
  } = useQuery({
    queryKey: [
      'time-history',
      marketId,
      market?.asset_one,
      TIME_HISTORY_CONFIG.duration_secs,
      TIME_HISTORY_CONFIG.interval,
    ],
    queryFn: async () => {
      return fetchTimeHistory({
        market: marketId,
        asset_id: market?.asset_one || '',
        duration_secs: TIME_HISTORY_CONFIG.duration_secs,
        interval: TIME_HISTORY_CONFIG.interval,
      })
    },
    enabled: !!market?.asset_one,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  })

  // Sort by timestamp ascending
  const allTimeHistoryData = useMemo(() => {
    if (!timeHistoryData || !Array.isArray(timeHistoryData)) return []
    return [...timeHistoryData].sort((a, b) => a.timestamp - b.timestamp)
  }, [timeHistoryData])

  // Fetch orders for this market
  const {
    data: orders = [],
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrders({
    filters: { market_id: marketId },
  })

  // Aggregate loading states
  const loading =
    marketLoading || assetOneLoading || assetTwoLoading || timeHistoryLoading || ordersLoading

  // Aggregate error states (time history and orders are optional)
  const error = marketError?.message || assetOneError?.message || assetTwoError?.message || null

  // Transform data into TokenizedAssetData format
  const asset = useMemo((): TokenizedAssetData | null => {
    if (!market || !primaryAsset) return null

    // If no time history data, fall back to order book price
    if (allTimeHistoryData.length === 0) {
      const { currentPrice: fallbackPrice } = computePriceFromOrders(
        orders,
        market.id,
        market.asset_one
      )
      return {
        id: market.id,
        symbol: primaryAsset.symbol,
        name: primaryAsset.name,
        logo: primaryAsset.icon ?? '',
        currentPrice: fallbackPrice,
        dailyChange: 0,
        dailyChangePercent: 0,
        priceHistory: [],
        quoteAssetSymbol: secondaryAsset?.symbol,
        quoteAssetDecimals:
          secondaryAsset?.decimals != null ? Number(secondaryAsset.decimals) : undefined,
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
      logo: primaryAsset.icon ?? '',
      currentPrice,
      dailyChange,
      dailyChangePercent,
      priceHistory,
      quoteAssetSymbol: secondaryAsset?.symbol,
      quoteAssetDecimals:
        secondaryAsset?.decimals != null ? Number(secondaryAsset.decimals) : undefined,
      timeHistoryData: allTimeHistoryData, // Pass full OHLC data for candlestick chart
    }
  }, [market, primaryAsset, secondaryAsset, allTimeHistoryData, orders, marketId])

  // Order book click-to-fill state
  const [selectedOrderBookPrice, setSelectedOrderBookPrice] = useState<number | null>(null)
  const handleSetSelectedOrderBookPrice = useCallback((price: number | null) => {
    setSelectedOrderBookPrice(price)
  }, [])

  const refetch = () => {
    refetchMarket()
    refetchAssetOne()
    refetchAssetTwo()
    refetchTimeHistory()
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
    selectedOrderBookPrice,
    setSelectedOrderBookPrice: handleSetSelectedOrderBookPrice,
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
