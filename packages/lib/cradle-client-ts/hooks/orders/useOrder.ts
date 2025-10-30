/**
 * useOrder Hook
 *
 * TanStack Query hook for fetching a single order
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchOrder } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { Order } from '../../cradle-api-client'

export interface UseOrderOptions {
  /**
   * Order ID to fetch
   */
  orderId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch an order by its ID
 *
 * @example
 * ```tsx
 * function OrderDetails({ orderId }: { orderId: string }) {
 *   const { data: order, isLoading } = useOrder({ orderId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <p>Type: {order?.order_type}</p>
 *       <p>Status: {order?.status}</p>
 *       <p>Price: {order?.price}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useOrder({ orderId, enabled = true, queryOptions }: UseOrderOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.orders.byId(orderId),
    queryFn: () => fetchOrder(orderId),
    enabled: enabled && !!orderId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
