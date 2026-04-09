'use client'

import { createContext, PropsWithChildren, useMemo, useState, useCallback } from 'react'
import { TokenizedAssetData } from '../TokenizedAssets/TokenizedAssetCard'
import { useMandatoryContext } from '@repo/lib/shared/utils/contexts'
import { Time } from 'lightweight-charts'
import type { CandlestickDataWithVolume } from '@repo/lib/modules/perps/trading-chart/chart'
import { TimeHistoryDataPoint } from '@repo/lib/actions/time-history'

// Map chart timeframe buttons to time ranges (in seconds)
const TIMEFRAME_RANGES: Record<string, { maxAge: number }> = {
  '1D': { maxAge: 86400 },
  '1W': { maxAge: 604800 },
  '1M': { maxAge: 2592000 },
  '3M': { maxAge: 7776000 },
  '1Y': { maxAge: 31536000 },
  ALL: { maxAge: Infinity },
}

function filterByTimeFrame(
  data: TimeHistoryDataPoint[],
  timeFrame: string
): TimeHistoryDataPoint[] {
  const range = TIMEFRAME_RANGES[timeFrame]
  if (!range || range.maxAge === Infinity) return data

  const cutoff = Date.now() / 1000 - range.maxAge
  const filtered = data.filter(d => d.timestamp >= cutoff)
  // Fallback to all data if no recent data exists
  return filtered.length > 0 ? filtered : data
}

function convertToCandlestickData(
  timeHistoryData: TimeHistoryDataPoint[]
): CandlestickDataWithVolume[] {
  return timeHistoryData
    .filter(
      point =>
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
    .map(point => ({
      time: point.timestamp as Time,
      open: point.open,
      high: point.high,
      low: point.low,
      close: point.close,
      volume: typeof point.volume === 'number' && !isNaN(point.volume) ? point.volume : 0,
    }))
}

function priceHistoryToDataPoints(
  priceHistory: Array<[number, number]>
): TimeHistoryDataPoint[] {
  const grouped = new Map<number, { prices: number[]; timestamp: number }>()
  priceHistory.forEach(([ts, price]) => {
    const daySec = Math.floor(ts / 1000 / 86400) * 86400
    if (!grouped.has(daySec)) grouped.set(daySec, { prices: [], timestamp: daySec })
    grouped.get(daySec)!.prices.push(price)
  })
  const points: TimeHistoryDataPoint[] = []
  grouped.forEach(({ prices, timestamp }) => {
    points.push({
      timestamp,
      open: prices[0],
      high: Math.max(...prices),
      low: Math.min(...prices),
      close: prices[prices.length - 1],
      volume: 0,
    })
  })
  return points.sort((a, b) => a.timestamp - b.timestamp)
}

interface AssetChartContextType {
  candlestickData: CandlestickDataWithVolume[]
  hasChartData: boolean
  symbol: string
  activeTimeFrame: string
  onTimeFrameChange: (tf: string) => void
}

const AssetChartContext = createContext<AssetChartContextType | null>(null)

export function useAssetChartLogic(asset: TokenizedAssetData): AssetChartContextType {
  const [activeTimeFrame, setActiveTimeFrame] = useState('1M')

  const onTimeFrameChange = useCallback((tf: string) => {
    setActiveTimeFrame(tf)
  }, [])

  const candlestickData = useMemo(() => {
    if (asset.timeHistoryData && asset.timeHistoryData.length > 0) {
      const filtered = filterByTimeFrame(asset.timeHistoryData, activeTimeFrame)
      return convertToCandlestickData(filtered)
    }

    if (!asset.priceHistory || asset.priceHistory.length === 0) return []

    const points = priceHistoryToDataPoints(asset.priceHistory)
    const filtered = filterByTimeFrame(points, activeTimeFrame)
    return convertToCandlestickData(filtered)
  }, [asset.priceHistory, asset.timeHistoryData, activeTimeFrame])

  const quote = asset.quoteAssetSymbol ?? 'cpUSD'
  const symbol = `${asset.symbol}/${quote}`

  return {
    candlestickData,
    hasChartData: candlestickData.length > 0,
    symbol,
    activeTimeFrame,
    onTimeFrameChange,
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
