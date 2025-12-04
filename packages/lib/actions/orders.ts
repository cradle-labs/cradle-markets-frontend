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
import type {
  Order,
  OrderStatus,
  OrderType,
  FillMode,
  OrderFillStatus,
} from '../cradle-client-ts/types'
import type {
  ActionRouterInput,
  ActionRouterOutput,
  UUID,
  Big,
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
export async function getOrders(filters?: {
  wallet?: string
  market_id?: string
  status?: OrderStatus
  order_type?: OrderType
  mode?: FillMode
}): Promise<Order[]> {
  const client = getCradleClient()
  return executeCradleOperation(() =>
    client.listOrders({
      wallet: filters?.wallet as UUID | undefined,
      market_id: filters?.market_id as UUID | undefined,
      status: filters?.status,
      order_type: filters?.order_type,
      mode: filters?.mode,
    })
  )
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
export async function placeOrder(input: {
  wallet: string
  market_id: string
  bid_asset: string
  ask_asset: string
  bid_amount: string
  ask_amount: string
  price: string
  mode: FillMode
  order_type: OrderType
}): Promise<{
  success: boolean
  result?: {
    id: string
    status: OrderFillStatus
    bid_amount_filled: string
    ask_amount_filled: string
    matched_trades: string[]
  }
  error?: string
}> {
  try {
    console.log('=== Server Action: placeOrder ===')
    console.log('Input:', JSON.stringify(input, null, 2))

    const client = getCradleClient()
    const action: ActionRouterInput = {
      OrderBook: {
        PlaceOrder: {
          wallet: input.wallet as UUID,
          market_id: input.market_id as UUID,
          bid_asset: input.bid_asset as UUID,
          ask_asset: input.ask_asset as UUID,
          bid_amount: input.bid_amount as Big,
          ask_amount: input.ask_amount as Big,
          price: input.price as Big,
          mode: input.mode,
          order_type: input.order_type,
        },
      },
    }
    const response = await client.process(action)

    console.log('API Response:', JSON.stringify(response, null, 2))

    if (!response.success || !response.data) {
      console.error('Order placement failed:', response.error)

      // Provide more user-friendly error messages
      let userError = response.error || 'Failed to place order'

      if (response.error?.includes('502') || response.error?.includes('failed to respond')) {
        userError = 'The trading system is temporarily unavailable. Please try again in a moment.'
      }

      return {
        success: false,
        error: userError,
      }
    }

    const output = response.data as ActionRouterOutput
    if ('OrderBook' in output && 'PlaceOrder' in output.OrderBook) {
      const result = output.OrderBook.PlaceOrder

      // Revalidate order and market pages
      revalidatePath('/trade')
      revalidatePath('/portfolio')
      revalidatePath(`/market/${input.market_id}`)

      return {
        success: true,
        result: {
          id: result.id,
          status: result.status,
          bid_amount_filled: result.bid_amount_filled,
          ask_amount_filled: result.ask_amount_filled,
          matched_trades: result.matched_trades,
        },
      }
    }

    console.error('Unexpected response format:', response.data)
    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error placing order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
