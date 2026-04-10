'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { TokenizedAssetData } from './TokenizedAssetCard'
import { useMarkets } from '@repo/lib/cradle-client-ts/hooks/markets/useMarkets'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { useOrders } from '@repo/lib/cradle-client-ts/hooks/orders/useOrders'
import type { Order } from '@repo/lib/cradle-client-ts/types'
import type { TimeHistoryDataPoint } from '@repo/lib/actions/time-history'
import { computePriceFromOrders } from '../shared/price-fallback'

// Fetch everything — use 1day interval which is more likely to have aggregated data
// than 1week, while still giving us broad coverage
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
  const { getTimeSeriesHistory } = await import('@repo/lib/actions/time-series')

  const paramPayload = {
    market: params.market,
    asset_id: params.asset_id,
    duration_secs: Number(params.duration_secs),
    interval: params.interval,
  }
  const timeSeriesRecords = await getTimeSeriesHistory(paramPayload)
  return timeSeriesRecords.map(record => {
    const timestamp = Math.floor(new Date(record.start_time).getTime() / 1000)
    return {
      timestamp,
      open: Number(record.open),
      high: Number(record.high),
      low: Number(record.low),
      close: Number(record.close),
      volume: Number(record.volume),
    }
  })
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
 * Transform markets into TokenizedAssetData, using time-series when available
 * and falling back to order book data for markets with no trade history.
 */
function transformMarketsToAssets(
  markets: any[],
  assets: any[],
  timeHistoryResults: Array<{ data?: TimeHistoryDataPoint[]; error: any }>,
  orders: Order[]
): TokenizedAssetData[] {
  const spotMarkets = markets.filter(market => market.market_type?.toLowerCase() === 'spot')

  return spotMarkets
    .map((market, index) => {
      const baseAsset = assets.find(a => a.id === market.asset_one)
      const quoteAsset = assets.find(a => a.id === market.asset_two)

      if (!baseAsset) return null

      const timeHistoryResult = timeHistoryResults[index]
      const timeHistoryData = timeHistoryResult?.data || []

      // Base object
      const base = {
        id: market.id,
        symbol: baseAsset.symbol,
        name: baseAsset.name,
        logo: baseAsset.icon,
        marketName: market.name,
        quoteAssetSymbol: quoteAsset?.symbol,
        quoteAssetDecimals: quoteAsset?.decimals != null ? Number(quoteAsset.decimals) : undefined,
      }

      // If we have time-series data, use it
      if (timeHistoryData.length > 0) {
        const priceHistory: Array<[number, number]> = timeHistoryData.map(point => [
          point.timestamp * 1000,
          point.close,
        ])

        const latestDataPoint = timeHistoryData[timeHistoryData.length - 1]
        const currentPrice = typeof latestDataPoint?.close === 'number' ? latestDataPoint.close : 0

        const dayAgo = Date.now() / 1000 - 86400
        const dayAgoData = timeHistoryData.find(point => point.timestamp >= dayAgo)
        const previousPrice = dayAgoData
          ? typeof dayAgoData.close === 'number'
            ? dayAgoData.close
            : currentPrice
          : timeHistoryData.length > 1
            ? typeof timeHistoryData[0].close === 'number'
              ? timeHistoryData[0].close
              : currentPrice
            : currentPrice

        const dailyChange = currentPrice - previousPrice
        const dailyChangePercent = previousPrice !== 0 ? (dailyChange / previousPrice) * 100 : 0

        return {
          ...base,
          currentPrice,
          dailyChange,
          dailyChangePercent,
          priceHistory,
          timeHistoryData,
        }
      }

      // Fallback: compute price from open orders
      const { currentPrice: fallbackPrice } = computePriceFromOrders(
        orders,
        market.id,
        market.asset_one
      )

      return {
        ...base,
        currentPrice: fallbackPrice,
        dailyChange: 0,
        dailyChangePercent: 0,
        priceHistory: [],
        timeHistoryData: [],
      }
    })
    .filter(Boolean) as TokenizedAssetData[]
}

export function TokenizedAssetProvider({ children }: TokenizedAssetProviderProps) {
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

  // Fetch all orders once as price fallback source
  const {
    data: orders = [],
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useOrders()

  const spotMarkets = useMemo(
    () => markets.filter(market => market.market_type?.toLowerCase() === 'spot'),
    [markets]
  )

  const timeHistoryQueries = useQueries({
    queries: spotMarkets.map(market => ({
      queryKey: [
        'time-history',
        market.id,
        market.asset_one,
        TIME_HISTORY_CONFIG.duration_secs,
        TIME_HISTORY_CONFIG.interval,
      ],
      queryFn: async () => {
        return fetchTimeHistory({
          market: market.id,
          asset_id: market.asset_one,
          duration_secs: TIME_HISTORY_CONFIG.duration_secs,
          interval: TIME_HISTORY_CONFIG.interval,
        })
      },
      enabled: !!market.id && !!market.asset_one && assets.length > 0,
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60,
      retry: false,
    })),
  })

  const timeHistoryLoading = timeHistoryQueries.some(query => query.isLoading)
  const loading = marketsLoading || assetsLoading || ordersLoading || timeHistoryLoading

  const error = marketsError?.message || assetsError?.message || null

  const transformedAssets = useMemo(() => {
    if (!loading && markets.length > 0 && assets.length > 0) {
      const timeHistoryResults = timeHistoryQueries.map(query => ({
        data: query.data,
        error: query.error,
      }))
      return transformMarketsToAssets(markets, assets, timeHistoryResults, orders)
    }
    return []
  }, [markets, assets, timeHistoryQueries, orders, loading])

  const refetch = () => {
    refetchMarkets()
    refetchAssets()
    refetchOrders()
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
