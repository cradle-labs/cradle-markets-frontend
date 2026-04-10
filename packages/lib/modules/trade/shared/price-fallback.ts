/**
 * Price calculation utilities for markets with limited trade history
 *
 * When time-series data is empty, we fall back to computing a price
 * from the open order book (mid of best bid/best ask, or last order price).
 */

import type { Order } from '@repo/lib/cradle-client-ts/types'
import { fromTokenDecimals } from '@repo/lib/modules/lend/utils'

export interface MarketPriceInfo {
  currentPrice: number
  source: 'timeseries' | 'orderbook-mid' | 'orderbook-last' | 'none'
}

/**
 * Compute a price estimate for a market from its open orders.
 * Strategy:
 * 1. If both bids and asks exist, return the mid-price (avg of best bid + best ask)
 * 2. If only one side exists, return the best price on that side
 * 3. If there are no open orders but there are closed/cancelled orders, use the most recent
 * 4. Otherwise return 0
 */
export function computePriceFromOrders(
  orders: Order[],
  marketId: string,
  baseAssetId: string
): MarketPriceInfo {
  if (!orders || orders.length === 0) {
    return { currentPrice: 0, source: 'none' }
  }

  const marketOrders = orders.filter(o => o.market_id === marketId)
  if (marketOrders.length === 0) {
    return { currentPrice: 0, source: 'none' }
  }

  const openOrders = marketOrders.filter(o => o.status?.toLowerCase() === 'open')

  // Buy orders have bid_asset = base asset (user wants base)
  const buyOrders = openOrders.filter(o => o.bid_asset === baseAssetId)
  // Sell orders have ask_asset = base asset (user offers base)
  const sellOrders = openOrders.filter(o => o.ask_asset === baseAssetId)

  const bestBid = buyOrders.length
    ? Math.max(...buyOrders.map(o => parseFloat(o.price)).filter(p => !isNaN(p) && p > 0))
    : 0
  const bestAsk = sellOrders.length
    ? Math.min(...sellOrders.map(o => parseFloat(o.price)).filter(p => !isNaN(p) && p > 0))
    : 0

  if (bestBid > 0 && bestAsk > 0) {
    return { currentPrice: (bestBid + bestAsk) / 2, source: 'orderbook-mid' }
  }
  if (bestBid > 0) return { currentPrice: bestBid, source: 'orderbook-mid' }
  if (bestAsk > 0) return { currentPrice: bestAsk, source: 'orderbook-mid' }

  // Fallback: use the most recent order (any status) with a non-zero price
  const sortedByDate = [...marketOrders]
    .filter(o => parseFloat(o.price) > 0)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  if (sortedByDate.length > 0) {
    return { currentPrice: parseFloat(sortedByDate[0].price), source: 'orderbook-last' }
  }

  return { currentPrice: 0, source: 'none' }
}

/**
 * Compute 24h stats (high, low, volume) from orders as a fallback when
 * time-series data is unavailable.
 */
export function compute24hStatsFromOrders(
  orders: Order[],
  marketId: string,
  baseAssetId: string,
  baseDecimals: number
): { high24h: number; low24h: number; volume24h: number } {
  const marketOrders = orders.filter(o => o.market_id === marketId)
  const now = Date.now()
  const dayAgo = now - 86400 * 1000
  const recentFilled = marketOrders.filter(o => {
    if (o.status?.toLowerCase() !== 'closed') return false
    const filledAt = o.filled_at ? new Date(o.filled_at).getTime() : 0
    return filledAt >= dayAgo
  })

  const prices = recentFilled.map(o => parseFloat(o.price)).filter(p => p > 0)
  if (prices.length === 0) {
    return { high24h: 0, low24h: 0, volume24h: 0 }
  }

  const volume24h = recentFilled.reduce((sum, o) => {
    // Volume = filled base amount
    const amount =
      o.bid_asset === baseAssetId
        ? parseFloat(o.filled_bid_amount || '0')
        : parseFloat(o.filled_ask_amount || '0')
    return sum + fromTokenDecimals(amount, baseDecimals)
  }, 0)

  return {
    high24h: Math.max(...prices),
    low24h: Math.min(...prices),
    volume24h,
  }
}
