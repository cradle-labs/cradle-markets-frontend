/**
 * Asset Management Server Actions
 *
 * These server actions handle asset operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import type { Asset, AssetType } from '../cradle-client-ts/types'
import type { ActionRouterInput, ActionRouterOutput } from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get an asset by UUID
 */
export async function getAsset(id: string): Promise<Asset> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAsset(id))
}

/**
 * Get asset by token identifier
 */
export async function getAssetByToken(token: string): Promise<Asset> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAssetByToken(token))
}

/**
 * Get asset by asset manager identifier
 */
export async function getAssetByManager(manager: string): Promise<Asset> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAssetsByManager(manager))
}

/**
 * Get all assets with optional filters
 */
export async function getAssets(): Promise<Asset[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.listAssets())
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new asset
 *
 * @param input - Asset creation input
 * @returns The created asset ID
 */
export async function createAsset(input: {
  asset_manager: string
  token: string
  asset_type: AssetType
  name: string
  symbol: string
  decimals: number
  icon: string
}): Promise<{
  success: boolean
  assetId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      AssetBook: {
        CreateNewAsset: {
          asset_type: input.asset_type,
          name: input.name,
          symbol: input.symbol,
          decimals: input.decimals,
          icon: input.icon,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create asset',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('AssetBook' in output && 'CreateNewAsset' in output.AssetBook) {
      const assetId = output.AssetBook.CreateNewAsset

      // Revalidate asset pages
      revalidatePath('/trade')
      revalidatePath('/cash')

      return {
        success: true,
        assetId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error creating asset:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Create an existing asset reference
 *
 * @param input - Asset creation input with token and manager
 * @returns Success status
 */
export async function createExistingAsset(input: {
  asset_manager?: string
  token: string
  asset_type: AssetType
  name: string
  symbol: string
  decimals: number
  icon: string
}): Promise<{
  success: boolean
  assetId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      AssetBook: {
        CreateExistingAsset: {
          asset_manager: input.asset_manager,
          token: input.token,
          asset_type: input.asset_type,
          name: input.name,
          symbol: input.symbol,
          decimals: input.decimals,
          icon: input.icon,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create existing asset',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('AssetBook' in output && 'CreateExistingAsset' in output.AssetBook) {
      const assetId = output.AssetBook.CreateExistingAsset

      // Revalidate asset pages
      revalidatePath('/trade')
      revalidatePath('/cash')

      return {
        success: true,
        assetId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error creating existing asset:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
