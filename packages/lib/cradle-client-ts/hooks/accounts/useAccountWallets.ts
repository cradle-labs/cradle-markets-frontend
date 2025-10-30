/**
 * useAccountWallets Hook
 *
 * TanStack Query hook for fetching all wallets for an account
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAccountWallets } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { CradleWallet } from '../../cradle-api-client'

export interface UseAccountWalletsOptions {
  /**
   * Account ID to fetch wallets for
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
  queryOptions?: Omit<UseQueryOptions<CradleWallet[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all wallets for a Cradle account
 *
 * @example
 * ```tsx
 * function AccountWallets({ accountId }: { accountId: string }) {
 *   const { data: wallets, isLoading } = useAccountWallets({ accountId })
 *
 *   if (isLoading) return <Spinner />
 *
 *   return (
 *     <div>
 *       {wallets?.map(wallet => (
 *         <WalletCard key={wallet.id} wallet={wallet} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAccountWallets({
  accountId,
  enabled = true,
  queryOptions,
}: UseAccountWalletsOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.accounts.wallets(accountId),
    queryFn: () => fetchAccountWallets(accountId),
    enabled: enabled && !!accountId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
