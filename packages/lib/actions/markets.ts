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
import { MutationResponseHelpers } from '../cradle-client-ts/cradle-api-client'
import type {
  Market,
  MarketFilters,
  CreateMarketInput,
  UpdateMarketStatusInput,
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
export async function getMarkets(filters?: MarketFilters): Promise<Market[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getMarkets(filters))
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
export async function createMarket(input: CreateMarketInput): Promise<{
  success: boolean
  marketId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.createMarket(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create market',
      }
    }

    if (!MutationResponseHelpers.isCreateMarket(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const marketId = response.data.Markets.CreateMarket

    // Revalidate market pages
    revalidatePath('/trade')
    revalidatePath('/perps')

    return {
      success: true,
      marketId,
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
export async function updateMarketStatus(input: UpdateMarketStatusInput): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.updateMarketStatus(input)

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
