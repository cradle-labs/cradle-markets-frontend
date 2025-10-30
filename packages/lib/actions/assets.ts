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
import { MutationResponseHelpers } from '../cradle-client-ts/cradle-api-client'
import type { Asset, AssetType, CreateAssetInput } from '../cradle-client-ts/cradle-api-client'

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
  return executeCradleOperation(() => client.getAssetByManager(manager))
}

/**
 * Get all assets with optional filters
 */
export async function getAssets(filters?: { asset_type?: AssetType }): Promise<Asset[]> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getAssets(filters))
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
export async function createAsset(input: CreateAssetInput): Promise<{
  success: boolean
  assetId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.createAsset(input)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create asset',
      }
    }

    if (!MutationResponseHelpers.isCreateAsset(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const assetId = response.data.Assets.CreateAsset

    // Revalidate asset pages
    revalidatePath('/trade')
    revalidatePath('/cash')

    return {
      success: true,
      assetId,
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
 * @param assetId - The existing asset ID
 * @returns Success status
 */
export async function createExistingAsset(assetId: string): Promise<{
  success: boolean
  assetId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const response = await client.createExistingAsset(assetId)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create existing asset',
      }
    }

    if (!MutationResponseHelpers.isCreateExistingAsset(response.data)) {
      return {
        success: false,
        error: 'Unexpected response format from API',
      }
    }

    const createdAssetId = response.data.Assets.CreateExistingAsset

    // Revalidate asset pages
    revalidatePath('/trade')
    revalidatePath('/cash')

    return {
      success: true,
      assetId: createdAssetId,
    }
  } catch (error) {
    console.error('Error creating existing asset:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
