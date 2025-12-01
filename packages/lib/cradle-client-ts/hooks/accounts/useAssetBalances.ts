/**
 * useAssetBalances Hook
 *
 * TanStack Query hook for fetching balances for multiple assets using useQueries
 */

'use client'

import { useQueries } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchBalance } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'

export interface BalanceData {
  balance: number
  before_deductions: number
  deductions: number
  decimals: number
  assetId: string
}

export interface UseAssetBalancesOptions {
  /**
   * Wallet ID to fetch balances for
   */
  walletId: string
  /**
   * Array of asset IDs to fetch balances for
   */
  assetIds: string[]
  /**
   * Whether the queries are enabled
   * @default true
   */
  enabled?: boolean
}

/**
 * Hook to fetch balances for multiple assets using useQueries
 *
 * Returns an array of balance results, one for each asset.
 * Each result includes the balance data and the asset ID for easy mapping.
 *
 * @example
 * ```tsx
 * function MyAssetBalances({ walletId, assets }: { walletId: string; assets: Asset[] }) {
 *   const balances = useAssetBalances({
 *     walletId,
 *     assetIds: assets.map(a => a.id),
 *     enabled: !!walletId && assets.length > 0,
 *   })
 *
 *   return (
 *     <div>
 *       {balances.map(({ data, assetId }, index) => (
 *         <div key={assetId}>
 *           Asset: {assetId}, Balance: {data?.balance ?? 0}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAssetBalances({ walletId, assetIds, enabled = true }: UseAssetBalancesOptions) {
  const queries = useQueries({
    queries: assetIds.map(assetId => ({
      queryKey: cradleQueryKeys.balances.byWalletAndAsset(walletId, assetId),
      queryFn: () => fetchBalance(walletId, assetId),
      enabled: enabled && !!walletId && !!assetId,
      ...userDataQueryOptions,
    })),
  })

  // Transform the results to include assetId for easier mapping
  return queries.map((query, index) => ({
    ...query,
    assetId: assetIds[index],
    data: query.data
      ? {
          ...query.data,
          assetId: assetIds[index],
        }
      : undefined,
  }))
}
