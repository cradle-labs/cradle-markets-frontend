/**
 * useListing Hook
 *
 * TanStack Query hook for fetching a single listing
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { fetchListing } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { CradleNativeListingRow } from '../../cradle-api-client'

export interface UseListingOptions {
  /**
   * Listing ID to fetch
   */
  listingId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<CradleNativeListingRow>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a listing by its ID
 *
 * @example
 * ```tsx
 * function ListingDetails({ listingId }: { listingId: string }) {
 *   const { data: listing, isLoading } = useListing({ listingId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <h2>{listing?.name}</h2>
 *       <p>{listing?.description}</p>
 *       <p>Price: {listing?.purchase_price}</p>
 *       <p>Status: {listing?.status}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useListing({ listingId, enabled = true, queryOptions }: UseListingOptions) {
  return useQuery({
    queryKey: ['cradle', 'listings', 'detail', listingId],
    queryFn: () => fetchListing(listingId),
    enabled: enabled && !!listingId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
