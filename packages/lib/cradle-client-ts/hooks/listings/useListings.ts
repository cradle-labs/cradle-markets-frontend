/**
 * useListings Hook
 *
 * TanStack Query hook for fetching multiple listings with optional filters
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { fetchListings, fetchListingStats, fetchListingFee } from '../../services/fetchers'
import { standardQueryOptions } from '../../utils/query-options'
import type { CradleNativeListingRow, ListingStatus, ListingStats } from '../../cradle-api-client'

export interface UseListingsOptions {
  /**
   * Optional filters for listings
   */
  filters?: {
    company?: string
    listed_asset?: string
    purchase_asset?: string
    status?: ListingStatus
  }
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<CradleNativeListingRow[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all listings with optional filters
 *
 * @example
 * ```tsx
 * // Fetch all listings
 * function AllListings() {
 *   const { data: listings, isLoading } = useListings()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {listings?.map(listing => (
 *         <ListingCard key={listing.id} listing={listing} />
 *       ))}
 *     </div>
 *   )
 * }
 *
 * // Fetch only open listings
 * function OpenListings() {
 *   const { data: listings } = useListings({
 *     filters: { status: 'open' }
 *   })
 *   return <ListingList listings={listings} />
 * }
 *
 * // Fetch listings for a specific company
 * function CompanyListings({ companyId }: { companyId: string }) {
 *   const { data: listings } = useListings({
 *     filters: { company: companyId }
 *   })
 *   return <div>{listings?.length} listings</div>
 * }
 * ```
 */
export function useListings({ filters, enabled = true, queryOptions }: UseListingsOptions = {}) {
  return useQuery({
    queryKey: ['cradle', 'listings', 'list', filters],
    queryFn: () => fetchListings(filters),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UseListingStatsOptions {
  /**
   * Listing ID to fetch stats for
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
  queryOptions?: Omit<UseQueryOptions<ListingStats>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch listing statistics
 *
 * @example
 * ```tsx
 * function ListingStats({ listingId }: { listingId: string }) {
 *   const { data: stats } = useListingStats({ listingId })
 *
 *   return (
 *     <div>
 *       <p>Total Purchases: {stats?.total_purchases}</p>
 *       <p>Total Volume: {stats?.total_volume}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useListingStats({
  listingId,
  enabled = true,
  queryOptions,
}: UseListingStatsOptions) {
  return useQuery({
    queryKey: ['cradle', 'listings', 'detail', listingId, 'stats'],
    queryFn: () => fetchListingStats(listingId),
    enabled: enabled && !!listingId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UseListingFeeOptions {
  /**
   * Listing ID
   */
  listingId: string
  /**
   * Purchase amount
   */
  amount: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<number>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch listing fee for a purchase amount
 *
 * @example
 * ```tsx
 * function PurchaseForm({ listingId, amount }: { listingId: string; amount: string }) {
 *   const { data: fee } = useListingFee({ listingId, amount })
 *
 *   return (
 *     <div>
 *       <p>Purchase Amount: {amount}</p>
 *       <p>Fee: {fee}</p>
 *       <p>Total: {Number(amount) + (fee || 0)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useListingFee({
  listingId,
  amount,
  enabled = true,
  queryOptions,
}: UseListingFeeOptions) {
  return useQuery({
    queryKey: ['cradle', 'listings', 'detail', listingId, 'fee', amount],
    queryFn: () => fetchListingFee({ listing_id: listingId, amount }),
    enabled: enabled && !!listingId && !!amount,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
