'use client'

import { createContext, useContext, ReactNode, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import { ListingData } from './ListingCard'
import { useListings } from '@repo/lib/cradle-client-ts/hooks/listings/useListings'
import { useAssets } from '@repo/lib/cradle-client-ts/hooks/assets/useAssets'
import { fetchListingStats } from '@repo/lib/cradle-client-ts/services/fetchers'
import { standardQueryOptions } from '@repo/lib/cradle-client-ts/utils/query-options'
import type { ListingStatus } from '@repo/lib/cradle-client-ts/types'

interface ListingContextType {
  listings: ListingData[]
  loading: boolean
  error: string | null
  refetch: () => void
}

const ListingContext = createContext<ListingContextType | undefined>(undefined)

interface ListingProviderProps {
  children: ReactNode
  statusFilter?: ListingStatus
}

export function ListingProvider({ children, statusFilter }: ListingProviderProps) {
  // Fetch listings with optional status filter
  const {
    data: rawListings = [],
    isLoading: listingsLoading,
    error: listingsError,
    refetch: refetchListings,
  } = useListings({
    filters: statusFilter ? { status: statusFilter } : undefined,
  })
  console.log('rawListings', rawListings)

  // Fetch all assets to enrich listings
  const {
    data: assets = [],
    isLoading: assetsLoading,
    error: assetsError,
    refetch: refetchAssets,
  } = useAssets()

  // Fetch stats for each listing
  const statsQueries = useQueries({
    queries: rawListings.map(listing => ({
      queryKey: ['cradle', 'listings', 'detail', listing.id, 'stats'],
      queryFn: () => fetchListingStats(listing.id),
      enabled: !!listing.id,
      ...standardQueryOptions,
    })),
  })

  const statsLoading = statsQueries.some(query => query.isLoading)
  const loading = listingsLoading || assetsLoading || statsLoading
  const error = listingsError?.message || assetsError?.message || null

  // Enrich listings with asset data and stats
  const enrichedListings: ListingData[] = useMemo(() => {
    if (!rawListings.length) return []

    return rawListings.map((listing, index) => {
      // Find the listed asset
      const listedAsset = assets.find(a => a.id === listing.listed_asset)
      // Find the purchase asset
      const purchaseAsset = assets.find(a => a.id === listing.purchase_with_asset)
      console.log('purchaseAsset', purchaseAsset)
      // Get stats for this listing
      const stats = statsQueries[index]?.data

      return {
        ...listing,
        assetName: listedAsset?.name,
        assetSymbol: listedAsset?.symbol,
        assetIcon: listedAsset?.icon,
        assetDecimals: listedAsset?.decimals != null ? Number(listedAsset.decimals) : undefined,
        purchaseAssetSymbol: purchaseAsset?.symbol,
        purchaseAssetDecimals:
          purchaseAsset?.decimals != null ? Number(purchaseAsset.decimals) : undefined,
        stats,
      }
    })
  }, [rawListings, assets, statsQueries])

  const refetch = () => {
    refetchListings()
    refetchAssets()
    statsQueries.forEach(query => query.refetch())
  }

  return (
    <ListingContext.Provider
      value={{
        listings: enrichedListings,
        loading,
        error,
        refetch,
      }}
    >
      {children}
    </ListingContext.Provider>
  )
}

export function useListingsContext() {
  const context = useContext(ListingContext)
  if (context === undefined) {
    throw new Error('useListingsContext must be used within a ListingProvider')
  }
  return context
}
