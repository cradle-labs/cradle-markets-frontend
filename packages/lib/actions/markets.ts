/**
 * Market Management Server Actions
 *
 * These server actions handle market operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import type { Market, MarketStatus, MarketType, MarketRegulation } from '../cradle-client-ts/types'
import type {
  ActionRouterInput,
  ActionRouterOutput,
  UUID,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get a market by UUID
 */
export async function getMarket(id: string): Promise<Market> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getMarket(id))
}

/**
 * Get all markets with optional filters
 */
export async function getMarkets(): Promise<Market[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.listMarkets())
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new market
 *
 * @param input - Market creation input
 * @returns The created market ID
 */
export async function createMarket(input: {
  name: string
  description?: string | null
  icon?: string | null
  asset_one: string
  asset_two: string
  market_type?: MarketType
  market_status?: MarketStatus
  market_regulation?: MarketRegulation
}): Promise<{
  success: boolean
  marketId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Markets: {
        CreateMarket: {
          name: input.name,
          description: input.description,
          icon: input.icon,
          asset_one: input.asset_one as UUID,
          asset_two: input.asset_two as UUID,
          market_type: input.market_type,
          market_status: input.market_status,
          market_regulation: input.market_regulation,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create market',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Markets' in output && 'CreateMarket' in output.Markets) {
      const marketId = output.Markets.CreateMarket

      // Revalidate market pages
      revalidatePath('/trade')
      revalidatePath('/perps')

      return {
        success: true,
        marketId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error creating market:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Update market status
 *
 * @param input - Market status update input
 * @returns Success status
 */
export async function updateMarketStatus(input: {
  market_id: string
  status: MarketStatus
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Markets: {
        UpdateMarketStatus: {
          market_id: input.market_id as UUID,
          status: input.status,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to update market status',
      }
    }

    // Revalidate market pages
    revalidatePath('/trade')
    revalidatePath('/perps')
    revalidatePath(`/market/${input.market_id}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating market status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
