/**
 * Order Management Server Actions
 *
 * These server actions handle order operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import { MutationResponseHelpers } from '../cradle-client-ts/cradle-api-client'
import type {
  Order,
  OrderFilters,
  PlaceOrderInput,
  PlaceOrderResult,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get an order by UUID
 */
export async function getOrder(id: string): Promise<Order> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getOrder(id))
}

/**
 * Get all orders with optional filters
 */
export async function getOrders(filters?: OrderFilters): Promise<Order[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getOrders(filters))
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Place an order
 *
 * @param input - Order placement input
 * @returns The order placement result
 */
export async function placeOrder(input: PlaceOrderInput): Promise<{
  success: boolean
  result?: PlaceOrderResult
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.placeOrder(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to place order',
      }
    }

    if (!MutationResponseHelpers.isPlaceOrder(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const result = response.data.OrderBook.PlaceOrder

    // Revalidate order and market pages
    revalidatePath('/trade')
    revalidatePath('/portfolio')
    revalidatePath(`/market/${input.market_id}`)

    return {
      success: true,
      result,
    }
  } catch (error) {
    console.error('Error placing order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Cancel an order
 *
 * @param orderId - The order ID to cancel
 * @returns Success status
 */
export async function cancelOrder(orderId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.cancelOrder(orderId)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to cancel order',
      }
    }

    // Revalidate order pages
    revalidatePath('/trade')
    revalidatePath('/portfolio')

    return { success: true }
  } catch (error) {
    console.error('Error canceling order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
