'use client'

import { createContext, PropsWithChildren, useMemo } from 'react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useMandatoryContext } from '@repo/lib/shared/utils/contexts'
import { CandlestickData, Time } from 'lightweight-charts'
import { TimeHistoryDataPoint } from '@repo/lib/actions/time-history'

/**
 * Convert time history data points to candlestick data format
 */
function convertToCandlestickData(
  priceHistory: Array<[number, number]>,
  timeHistoryData?: TimeHistoryDataPoint[]
): CandlestickData[] {
  // If we have detailed time history data with OHLC, use that
  if (timeHistoryData && timeHistoryData.length > 0) {
    return timeHistoryData
      .filter(point => {
        // Filter out invalid data points
        return (
          typeof point.timestamp === 'number' &&
          typeof point.open === 'number' &&
          typeof point.high === 'number' &&
          typeof point.low === 'number' &&
          typeof point.close === 'number' &&
          !isNaN(point.open) &&
          !isNaN(point.high) &&
          !isNaN(point.low) &&
          !isNaN(point.close)
        )
      })
      .map(point => ({
        time: point.timestamp as Time,
        open: point.open,
        high: point.high,
        low: point.low,
        close: point.close,
      }))
  }

  // Otherwise, convert simple price history to candlestick format
  // Group by day and create OHLC from the available data
  const grouped = new Map<string, number[]>()

  priceHistory.forEach(([timestamp, price]) => {
    const date = new Date(timestamp).toISOString().split('T')[0]
    if (!grouped.has(date)) {
      grouped.set(date, [])
    }
    grouped.get(date)!.push(price)
  })

  const candlesticks: CandlestickData[] = []
  grouped.forEach((prices, date) => {
    if (prices.length > 0) {
      candlesticks.push({
        time: date as Time,
        open: prices[0],
        high: Math.max(...prices),
        low: Math.min(...prices),
        close: prices[prices.length - 1],
      })
    }
  })

  return candlesticks.sort((a, b) => {
    const timeA = typeof a.time === 'string' ? new Date(a.time).getTime() : (a.time as number)
    const timeB = typeof b.time === 'string' ? new Date(b.time).getTime() : (b.time as number)
    return timeA - timeB
  })
}

interface AssetChartContextType {
  candlestickData: CandlestickData[]
  hasChartData: boolean
  symbol: string
}

const AssetChartContext = createContext<AssetChartContextType | null>(null)

export function useAssetChartLogic(asset: TokenizedAssetData): AssetChartContextType {
  console.log('Asset:', asset)
  const candlestickData = useMemo(() => {
    // Prefer timeHistoryData with OHLC if available
    if (asset.timeHistoryData && asset.timeHistoryData.length > 0) {
      return convertToCandlestickData(asset.priceHistory, asset.timeHistoryData)
    }

    // Fallback to price history
    if (!asset.priceHistory || asset.priceHistory.length === 0) return []

    return convertToCandlestickData(asset.priceHistory)
  }, [asset.priceHistory, asset.timeHistoryData])

  const symbol = `${asset.symbol}/cpUSD`

  return {
    candlestickData,
    hasChartData: candlestickData.length > 0,
    symbol,
  }
}

export function AssetChartProvider({
  children,
  asset,
}: PropsWithChildren & { asset: TokenizedAssetData }) {
  const hook = useAssetChartLogic(asset)
  return <AssetChartContext.Provider value={hook}>{children}</AssetChartContext.Provider>
}

export const useAssetChart = (): AssetChartContextType =>
  useMandatoryContext(AssetChartContext, 'AssetChart')
