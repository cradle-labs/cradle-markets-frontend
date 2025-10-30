/**
 * useWallet Hook
 *
 * TanStack Query hook for fetching a single wallet by ID or account ID
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchWallet, fetchWalletByAccountId } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { CradleWallet } from '../../cradle-api-client'

export interface UseWalletByIdOptions {
  /**
   * Wallet ID to fetch
   */
  walletId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<CradleWallet>, 'queryKey' | 'queryFn'>
}

export interface UseWalletByAccountIdOptions {
  /**
   * Account ID to fetch wallet for
   */
  accountId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<CradleWallet>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a wallet by its ID
 *
 * @example
 * ```tsx
 * function WalletDetails({ walletId }: { walletId: string }) {
 *   const { data: wallet, isLoading } = useWallet({ walletId })
 *
 *   if (isLoading) return <Spinner />
 *   return <div>{wallet?.address}</div>
 * }
 * ```
 */
export function useWallet({ walletId, enabled = true, queryOptions }: UseWalletByIdOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.wallets.byId(walletId),
    queryFn: () => fetchWallet(walletId),
    enabled: enabled && !!walletId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch a wallet by account ID
 *
 * @example
 * ```tsx
 * function AccountWallet({ accountId }: { accountId: string }) {
 *   const { data: wallet, isLoading } = useWalletByAccountId({ accountId })
 *
 *   if (isLoading) return <Spinner />
 *   return <div>{wallet?.address}</div>
 * }
 * ```
 */
export function useWalletByAccountId({
  accountId,
  enabled = true,
  queryOptions,
}: UseWalletByAccountIdOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.wallets.byAccountId(accountId),
    queryFn: () => fetchWalletByAccountId(accountId),
    enabled: enabled && !!accountId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
