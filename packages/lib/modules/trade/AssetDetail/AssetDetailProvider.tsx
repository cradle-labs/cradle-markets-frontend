'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import {
  mockMarkets,
  getOrdersByMarket,
  getTimeSeriesByMarket,
  getAssetById,
} from '@repo/lib/shared/dummy-data/cradle-data'
import type { Market, Order, TimeSeriesRecord } from '@repo/lib/cradle-client-ts/types'

interface AssetDetailContextType {
  asset: TokenizedAssetData | null
  market: Market | null
  orders: Order[]
  timeSeriesData: TimeSeriesRecord[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const AssetDetailContext = createContext<AssetDetailContextType | undefined>(undefined)

interface AssetDetailProviderProps {
  children: ReactNode
  marketId: string
}

// Mock data - in a real app this would come from an API
// Using Nairobi Securities Exchange (NSE) stocks
const mockAssets: TokenizedAssetData[] = [
  {
    id: 'safaricom',
    symbol: 'cSAF',
    name: 'Safaricom',
    logo: '/images/tokens/safaricom.svg',
    currentPrice: 26.5,
    dailyChange: 0.75,
    dailyChangePercent: 2.91,
    priceHistory: [
      [1696320000, 25.2], // Oct 3
      [1696406400, 25.45], // Oct 4
      [1696492800, 25.1], // Oct 5
      [1696579200, 25.8], // Oct 6
      [1696665600, 26.0], // Oct 7
      [1696752000, 25.65], // Oct 8
      [1696838400, 26.15], // Oct 9
      [1696924800, 26.3], // Oct 10
      [1697011200, 26.45], // Oct 11
      [1697097600, 26.2], // Oct 12
      [1697184000, 25.75], // Oct 13
      [1697270400, 26.5], // Oct 14
    ],
  },
  {
    id: 'equity',
    symbol: 'cEQTY',
    name: 'Equity Bank',
    logo: '/images/tokens/equity.svg',
    currentPrice: 52.75,
    dailyChange: -1.25,
    dailyChangePercent: -2.31,
    priceHistory: [
      [1696320000, 54.0],
      [1696406400, 54.5],
      [1696492800, 53.75],
      [1696579200, 53.25],
      [1696665600, 54.1],
      [1696752000, 53.5],
      [1696838400, 54.25],
      [1696924800, 53.8],
      [1697011200, 54.35],
      [1697097600, 54.0],
      [1697184000, 53.5],
      [1697270400, 52.75],
    ],
  },
  {
    id: 'kcb',
    symbol: 'cKCB',
    name: 'KCB Group',
    logo: '/images/tokens/kcb.svg',
    currentPrice: 38.25,
    dailyChange: 1.5,
    dailyChangePercent: 4.08,
    priceHistory: [
      [1696320000, 36.5],
      [1696406400, 36.85],
      [1696492800, 36.2],
      [1696579200, 37.0],
      [1696665600, 37.45],
      [1696752000, 36.9],
      [1696838400, 37.75],
      [1696924800, 38.25],
    ],
  },
]

export function AssetDetailProvider({ children, marketId }: AssetDetailProviderProps) {
  const [asset, setAsset] = useState<TokenizedAssetData | null>(null)
  const [market, setMarket] = useState<Market | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Find the market by ID
      const foundMarket = mockMarkets.find(m => m.id === marketId)
      if (!foundMarket) {
        setError(`Market with ID "${marketId}" not found`)
        return
      }

      setMarket(foundMarket)

      // Get the primary asset for the market (asset_one)
      const primaryAsset = getAssetById(foundMarket.asset_one)

      // Convert market data to TokenizedAssetData format for compatibility
      if (primaryAsset) {
        // Find matching mock asset data (from the old mockAssets) for price history
        const matchingMockAsset = mockAssets.find(
          a => a.symbol === primaryAsset.symbol || a.name === primaryAsset.name
        )

        // Get time series data for chart
        const marketTimeSeries = getTimeSeriesByMarket(marketId)

        // Convert time series to price history format
        const priceHistory: [number, number][] = marketTimeSeries.map(ts => [
          new Date(ts.start_time).getTime() / 1000,
          parseFloat(ts.close),
        ])

        // Use last close price as current price, or fall back to mock data
        const currentPrice =
          marketTimeSeries.length > 0
            ? parseFloat(marketTimeSeries[marketTimeSeries.length - 1].close)
            : matchingMockAsset?.currentPrice || 0

        // Calculate daily change if we have at least 2 data points
        let dailyChange = 0
        let dailyChangePercent = 0
        if (marketTimeSeries.length >= 2) {
          const latest = parseFloat(marketTimeSeries[marketTimeSeries.length - 1].close)
          const previous = parseFloat(marketTimeSeries[marketTimeSeries.length - 2].close)
          dailyChange = latest - previous
          dailyChangePercent = (dailyChange / previous) * 100
        } else if (matchingMockAsset) {
          dailyChange = matchingMockAsset.dailyChange
          dailyChangePercent = matchingMockAsset.dailyChangePercent
        }

        setAsset({
          id: foundMarket.id,
          symbol: primaryAsset.symbol,
          name: primaryAsset.name,
          logo: primaryAsset.icon,
          currentPrice,
          dailyChange,
          dailyChangePercent,
          priceHistory:
            priceHistory.length > 0 ? priceHistory : matchingMockAsset?.priceHistory || [],
        })

        setTimeSeriesData(marketTimeSeries)
      }

      // Get orders for this market
      const marketOrders = getOrdersByMarket(marketId)
      setOrders(marketOrders)
    } catch (err) {
      setError('Failed to load market details')
      console.error('Error fetching market:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
  }, [marketId])

  const refetch = () => {
    fetchMarketData()
  }

  const value: AssetDetailContextType = {
    asset,
    market,
    orders,
    timeSeriesData,
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
