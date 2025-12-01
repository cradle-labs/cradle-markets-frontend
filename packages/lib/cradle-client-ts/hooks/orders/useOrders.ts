/**
 * useOrders Hook
 *
 * TanStack Query hook for fetching multiple orders with optional filters
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchOrders } from '../../services/fetchers'
import { marketDataQueryOptions } from '../../utils/query-options'
import type { Order, OrderStatus, OrderType, FillMode } from '../../types'

export interface UseOrdersOptions {
  /**
   * Optional filters for orders
   */
  filters?: {
    wallet?: string
    market_id?: string
    status?: OrderStatus
    order_type?: OrderType
    mode?: FillMode
  }
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Order[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all orders with optional filters
 *
 * @example
 * ```tsx
 * // Fetch all orders for a wallet
 * function WalletOrders({ walletId }: { walletId: string }) {
 *   const { data: orders, isLoading } = useOrders({
 *     filters: { wallet: walletId }
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {orders?.map(order => (
 *         <OrderCard key={order.id} order={order} />
 *       ))}
 *     </div>
 *   )
 * }
 *
 * // Fetch open orders for a market
 * function MarketOpenOrders({ marketId }: { marketId: string }) {
 *   const { data: orders } = useOrders({
 *     filters: {
 *       market_id: marketId,
 *       status: 'open'
 *     }
 *   })
 *   return <OrderBook orders={orders} />
 * }
 *
 * // Fetch limit orders for a wallet
 * function WalletLimitOrders({ walletId }: { walletId: string }) {
 *   const { data: orders } = useOrders({
 *     filters: {
 *       wallet: walletId,
 *       order_type: 'limit'
 *     }
 *   })
 *   return <OrderList orders={orders} />
 * }
 * ```
 */
export function useOrders({ filters, enabled = true, queryOptions }: UseOrdersOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.orders.list(filters),
    queryFn: () => fetchOrders(filters),
    enabled,
    ...marketDataQueryOptions,
    ...queryOptions,
  })
}
