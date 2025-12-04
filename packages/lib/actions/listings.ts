/**
 * Listing Management Server Actions
 *
 * These server actions handle listing operations
 * using the Cradle API client.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { getCradleClient } from '../cradle-client-ts/client'
import { executeCradleOperation } from '../cradle-client-ts/services/api.service'
import type { ListingStatus, AssetType } from '../cradle-client-ts/types'
import type {
  CradleNativeListingRow,
  ActionRouterInput,
  ActionRouterOutput,
  UUID,
  Big,
  ListingStats,
} from '../cradle-client-ts/cradle-api-client'

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Get a listing by UUID
 */
export async function getListing(id: string): Promise<CradleNativeListingRow> {
  const client = getCradleClient()
  return executeCradleOperation(() => client.getListing(id))
}

/**
 * Get all listings with optional filters
 */
export async function getListings(filters?: {
  company?: string
  listed_asset?: string
  purchase_asset?: string
  status?: ListingStatus
}): Promise<CradleNativeListingRow[]> {
  const client = getCradleClient()
  return executeCradleOperation(() =>
    client.listListings({
      company: filters?.company as UUID | undefined,
      listed_asset: filters?.listed_asset as UUID | undefined,
      purchase_asset: filters?.purchase_asset as UUID | undefined,
      status: filters?.status,
    })
  )
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Create a new company
 *
 * @param input - Company creation input
 * @returns The created company ID
 */
export async function createCompany(input: {
  name: string
  description: string
  legal_documents: string
}): Promise<{
  success: boolean
  companyId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Listing: {
        CreateCompany: {
          name: input.name,
          description: input.description,
          legal_documents: input.legal_documents,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create company',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Listing' in output && 'CreateCompany' in output.Listing) {
      const companyId = output.Listing.CreateCompany

      // Revalidate listing pages
      revalidatePath('/listings')

      return {
        success: true,
        companyId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error creating company:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Create a new listing
 *
 * @param input - Listing creation input
 * @returns The created listing ID
 */
export async function createListing(input: {
  name: string
  description: string
  documents: string
  company: string
  asset:
    | { Existing: string }
    | {
        New: { asset_type: AssetType; name: string; symbol: string; decimals: number; icon: string }
      }
  purchase_asset: string
  purchase_price: string
  max_supply: string
}): Promise<{
  success: boolean
  listingId?: string
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Listing: {
        CreateListing: {
          name: input.name,
          description: input.description,
          documents: input.documents,
          company: input.company as UUID,
          asset:
            'Existing' in input.asset
              ? { Existing: input.asset.Existing as UUID }
              : {
                  New: {
                    asset_type: input.asset.New.asset_type,
                    name: input.asset.New.name,
                    symbol: input.asset.New.symbol,
                    decimals: input.asset.New.decimals,
                    icon: input.asset.New.icon,
                  },
                },
          purchase_asset: input.purchase_asset as UUID,
          purchase_price: input.purchase_price as Big,
          max_supply: input.max_supply as Big,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || 'Failed to create listing',
      }
    }

    const output = response.data as ActionRouterOutput
    if ('Listing' in output && 'CreateListing' in output.Listing) {
      const listingId = output.Listing.CreateListing

      // Revalidate listing pages
      revalidatePath('/listings')
      revalidatePath(`/listing/${listingId}`)

      return {
        success: true,
        listingId,
      }
    }

    return {
      success: false,
      error: 'Unexpected response format from API',
    }
  } catch (error) {
    console.error('Error creating listing:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Purchase from a listing
 *
 * @param input - Purchase input
 * @returns Success status
 */
export async function purchaseListing(input: {
  wallet: string
  amount: string
  listing: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Listing: {
        Purchase: {
          wallet: input.wallet as UUID,
          amount: input.amount as Big,
          listing: input.listing as UUID,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to purchase from listing',
      }
    }

    // Revalidate listing and portfolio pages
    revalidatePath('/listings')
    revalidatePath(`/listing/${input.listing}`)
    revalidatePath('/portfolio')

    return { success: true }
  } catch (error) {
    console.error('Error purchasing from listing:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Return asset from a listing
 *
 * @param input - Return asset input
 * @returns Success status
 */
export async function returnAsset(input: {
  wallet: string
  amount: string
  listing: string
}): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const client = getCradleClient()
    const action: ActionRouterInput = {
      Listing: {
        ReturnAsset: {
          wallet: input.wallet as UUID,
          amount: input.amount as Big,
          listing: input.listing as UUID,
        },
      },
    }
    const response = await client.process(action)

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to return asset',
      }
    }

    // Revalidate listing and portfolio pages
    revalidatePath('/listings')
    revalidatePath(`/listing/${input.listing}`)
    revalidatePath('/portfolio')

    return { success: true }
  } catch (error) {
    console.error('Error returning asset:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Get listing statistics
 *
 * @param listingId - Listing ID
 * @returns Listing statistics
 */
export async function getListingStats(listingId: string): Promise<ListingStats> {
  const client = getCradleClient()
  const action: ActionRouterInput = {
    Listing: {
      GetStats: listingId as UUID,
    },
  }
  const response = await client.process(action)

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to get listing stats')
  }

  const output = response.data as ActionRouterOutput
  if ('Listing' in output && 'GetStats' in output.Listing) {
    return output.Listing.GetStats
  }

  throw new Error('Unexpected response format from API')
}

/**
 * Get listing fee
 *
 * @param input - Fee calculation input
 * @returns The fee amount
 */
export async function getListingFee(input: {
  listing_id: string
  amount: string
}): Promise<number> {
  const client = getCradleClient()
  const action: ActionRouterInput = {
    Listing: {
      GetFee: {
        listing_id: input.listing_id as UUID,
        amount: input.amount as Big,
      },
    },
  }
  const response = await client.process(action)

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to get listing fee')
  }

  const output = response.data as ActionRouterOutput
  if ('Listing' in output && 'GetFee' in output.Listing) {
    return output.Listing.GetFee
  }

  throw new Error('Unexpected response format from API')
}
