'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { TokenizedAssetData } from './TokenizedAssetCard'
import {
  mockMarkets,
  mockAssets,
  mockTimeSeriesRecords,
} from '@repo/lib/shared/dummy-data/cradle-data'

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
 * Transform markets and assets data from cradle-data into TokenizedAssetData format
 */
function transformMarketsToAssets(): TokenizedAssetData[] {
  // Only get spot markets (not futures or derivatives) for the main trading page
  const spotMarkets = mockMarkets.filter(market => market.market_type === 'spot')
  console.log('spotMarkets:', spotMarkets)

  return spotMarkets
    .map(market => {
      // Find the primary asset (asset_one) for this market
      const asset = mockAssets.find(a => a.id === market.asset_one)

      if (!asset) {
        console.warn(`Asset not found for market ${market.id}`)
        return null
      }

      // Get time series data for this market to calculate prices
      const timeSeriesData = mockTimeSeriesRecords.filter(ts => ts.market_id === market.id)

      // Sort by end_time to get chronological order
      const sortedTimeSeries = timeSeriesData.sort(
        (a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime()
      )

      // Generate price history from time series data
      const priceHistory: Array<[number, number]> =
        sortedTimeSeries.length > 0
          ? sortedTimeSeries.map(ts => [new Date(ts.end_time).getTime(), parseFloat(ts.close)])
          : generateMockPriceHistory() // Fallback to mock data if no time series

      // Calculate current price and daily change
      const currentPrice =
        sortedTimeSeries.length > 0
          ? parseFloat(sortedTimeSeries[sortedTimeSeries.length - 1].close)
          : generateRandomPrice(asset.symbol)

      const previousPrice =
        sortedTimeSeries.length > 1
          ? parseFloat(sortedTimeSeries[sortedTimeSeries.length - 2].close)
          : currentPrice * 0.98 // Default to -2% if no history

      const dailyChange = currentPrice - previousPrice
      const dailyChangePercent = (dailyChange / previousPrice) * 100

      return {
        id: market.id,
        symbol: asset.symbol,
        name: asset.name,
        logo: asset.icon,
        currentPrice,
        dailyChange,
        dailyChangePercent,
        priceHistory,
      }
    })
    .filter(Boolean) as TokenizedAssetData[]
}

/**
 * Generate mock price history when no time series data is available
 */
function generateMockPriceHistory(): Array<[number, number]> {
  const history: Array<[number, number]> = []
  const now = Date.now()
  const basePrice = 100 + Math.random() * 200

  for (let i = 11; i >= 0; i--) {
    const timestamp = now - i * 3600000 // 1 hour intervals
    const variance = (Math.random() - 0.5) * 10
    const price = basePrice + variance
    history.push([timestamp, price])
  }

  return history
}

/**
 * Generate a realistic random price based on asset symbol
 */
function generateRandomPrice(symbol: string): number {
  // Different price ranges for different types of assets
  const priceRanges: Record<string, [number, number]> = {
    cSAF: [25, 30],
    cEQTY: [50, 60],
    cKCB: [35, 45],
    cEABL: [200, 220],
    cCOOP: [15, 20],
    cBAT: [470, 500],
    cBMB: [55, 65],
    cNCBA: [40, 50],
    cSBIC: [120, 130],
    cSCB: [165, 175],
    cBRIT: [8, 10],
    cABSA: [14, 16],
  }

  const [min, max] = priceRanges[symbol] || [10, 100]
  return min + Math.random() * (max - min)
}

export function TokenizedAssetProvider({ children }: TokenizedAssetProviderProps) {
  const [assets, setAssets] = useState<TokenizedAssetData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Transform markets data from cradle-data into tokenized assets
      const transformedAssets = transformMarketsToAssets()

      setAssets(transformedAssets)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAssets()
  }, [])

  const refetch = () => {
    fetchAssets()
  }

  return (
    <TokenizedAssetContext.Provider
      value={{
        assets,
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
