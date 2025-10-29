import { useMemo } from 'react'
import type { StatsData, MarketFilter } from '@repo/lib/shared/types'
import { filterExchangesByMarket, sortExchangesByGroup } from '@repo/lib/shared/utils/calculations'

/**
 * Hook to transform stats data into chart-ready format
 * Memoized for performance
 */
export function useChartData(stats: StatsData, filter: MarketFilter) {
  const chartData05Pct = useMemo(() => {
    const filtered = Object.entries(stats).filter(([exchange]) =>
      filterExchangesByMarket(exchange, filter)
    )
    const sorted = sortExchangesByGroup(filtered)
    return sorted.map(([exchange, stat]) => ({
      exchange,
      bid: parseFloat(stat.bidLiquidity05Pct),
      ask: parseFloat(stat.askLiquidity05Pct),
    }))
  }, [stats, filter])

  const chartData2Pct = useMemo(() => {
    const filtered = Object.entries(stats).filter(([exchange]) =>
      filterExchangesByMarket(exchange, filter)
    )
    const sorted = sortExchangesByGroup(filtered)
    return sorted.map(([exchange, stat]) => ({
      exchange,
      bid: parseFloat(stat.bidLiquidity2Pct),
      ask: parseFloat(stat.askLiquidity2Pct),
    }))
  }, [stats, filter])

  const chartData10Pct = useMemo(() => {
    const filtered = Object.entries(stats).filter(([exchange]) =>
      filterExchangesByMarket(exchange, filter)
    )
    const sorted = sortExchangesByGroup(filtered)
    return sorted.map(([exchange, stat]) => ({
      exchange,
      bid: parseFloat(stat.bidLiquidity10Pct),
      ask: parseFloat(stat.askLiquidity10Pct),
    }))
  }, [stats, filter])

  const chartDataTotal = useMemo(() => {
    const filtered = Object.entries(stats).filter(([exchange]) =>
      filterExchangesByMarket(exchange, filter)
    )
    const sorted = sortExchangesByGroup(filtered)
    return sorted.map(([exchange, stat]) => ({
      exchange,
      bid: parseFloat(stat.totalBidsQty),
      ask: parseFloat(stat.totalAsksQty),
    }))
  }, [stats, filter])

  return {
    chartData05Pct,
    chartData2Pct,
    chartData10Pct,
    chartDataTotal,
  }
}
