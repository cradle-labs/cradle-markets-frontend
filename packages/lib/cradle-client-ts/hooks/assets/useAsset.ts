/**
 * useAsset Hook
 *
 * TanStack Query hook for fetching a single asset
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAsset, fetchAssetByToken, fetchAssetByManager } from '../../services/fetchers'
import { staticQueryOptions } from '../../utils/query-options'
import type { Asset } from '../../types'

export interface UseAssetByIdOptions {
  /**
   * Asset ID to fetch
   */
  assetId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Asset>, 'queryKey' | 'queryFn'>
}

export interface UseAssetByTokenOptions {
  /**
   * Token identifier to fetch
   */
  token: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Asset>, 'queryKey' | 'queryFn'>
}

export interface UseAssetByManagerOptions {
  /**
   * Asset manager identifier to fetch
   */
  manager: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Asset>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch an asset by its ID
 *
 * @example
 * ```tsx
 * function AssetDetails({ assetId }: { assetId: string }) {
 *   const { data: asset, isLoading } = useAsset({ assetId })
 *
 *   if (isLoading) return <Spinner />
 *   return <div>{asset?.name} ({asset?.symbol})</div>
 * }
 * ```
 */
export function useAsset({ assetId, enabled = true, queryOptions }: UseAssetByIdOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.assets.byId(assetId),
    queryFn: () => fetchAsset(assetId),
    enabled: enabled && !!assetId,
    ...staticQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch an asset by token identifier
 *
 * @example
 * ```tsx
 * function AssetByToken({ token }: { token: string }) {
 *   const { data: asset } = useAssetByToken({ token: '0.0.12345' })
 *   return <div>{asset?.name}</div>
 * }
 * ```
 */
export function useAssetByToken({ token, enabled = true, queryOptions }: UseAssetByTokenOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.assets.byToken(token),
    queryFn: () => fetchAssetByToken(token),
    enabled: enabled && !!token,
    ...staticQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch an asset by manager identifier
 *
 * @example
 * ```tsx
 * function AssetByManager({ manager }: { manager: string }) {
 *   const { data: asset } = useAssetByManager({ manager: '0x1234567890abcdef' })
 *   return <div>{asset?.name}</div>
 * }
 * ```
 */
export function useAssetByManager({
  manager,
  enabled = true,
  queryOptions,
}: UseAssetByManagerOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.assets.byManager(manager),
    queryFn: () => fetchAssetByManager(manager),
    enabled: enabled && !!manager,
    ...staticQueryOptions,
    ...queryOptions,
  })
}
