/**
 * Query Options Presets for TanStack Query
 *
 * Provides reusable query option configurations
 * for common patterns in the application.
 */

import type { UseQueryOptions } from '@tanstack/react-query'

/**
 * Default stale time for queries (5 minutes)
 */
export const DEFAULT_STALE_TIME = 5 * 60 * 1000

/**
 * Short stale time for frequently changing data (30 seconds)
 */
export const SHORT_STALE_TIME = 30 * 1000

/**
 * Long stale time for rarely changing data (30 minutes)
 */
export const LONG_STALE_TIME = 30 * 60 * 1000

/**
 * When you only want a query to refetch when the key changes or refetch is explicitly called.
 *
 * Prevents background refetches that can cause issues in certain scenarios.
 * Based on the existing pattern in packages/lib/shared/utils/queries.ts
 */
export const onlyExplicitRefetch = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
} as const

/**
 * Standard options for most queries
 * - Refetch on window focus
 * - 5 minute stale time
 * - Retry on failure
 */
export const standardQueryOptions = {
  staleTime: DEFAULT_STALE_TIME,
  gcTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  retry: 3,
} as const

/**
 * Options for real-time data that changes frequently
 * - Short stale time
 * - Refetch on focus
 * - More aggressive refetching
 */
export const realtimeQueryOptions = {
  staleTime: SHORT_STALE_TIME,
  gcTime: 2 * 60 * 1000, // 2 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  refetchInterval: 30000, // Poll every 30 seconds
  retry: 2,
} as const

/**
 * Options for static or rarely changing data
 * - Long stale time
 * - Less aggressive refetching
 */
export const staticQueryOptions = {
  staleTime: LONG_STALE_TIME,
  gcTime: 60 * 60 * 1000, // 1 hour
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: 3,
} as const

/**
 * Options for user-specific data
 * - Standard stale time
 * - Refetch on focus (user might have updated in another tab)
 */
export const userDataQueryOptions = {
  staleTime: DEFAULT_STALE_TIME,
  gcTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: true,
  refetchOnMount: true,
  retry: 3,
} as const

/**
 * Options for market data (prices, orders, etc.)
 * - Short stale time
 * - Aggressive refetching
 */
export const marketDataQueryOptions = {
  ...realtimeQueryOptions,
  staleTime: 15000, // 15 seconds
  refetchInterval: 15000, // Poll every 15 seconds
} as const

/**
 * Combine custom options with a preset
 */
export function mergeQueryOptions<T>(
  preset: Partial<UseQueryOptions<T>>,
  custom: Partial<UseQueryOptions<T>>
): Partial<UseQueryOptions<T>> {
  return {
    ...preset,
    ...custom,
  }
}
