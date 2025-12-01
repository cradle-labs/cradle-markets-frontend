/**
 * useBalances Hook
 *
 * TanStack Query hook for fetching account balances
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchBalances } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'

export interface UseBalancesOptions {
  /**
   * Account ID to fetch balances for
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
  queryOptions?: Omit<
    UseQueryOptions<Array<{ token: string; balance: string }>>,
    'queryKey' | 'queryFn'
  >
}

/**
 * Hook to fetch balances for an account
 *
 * Returns an array of token balances with token ID and balance.
 * The balance is returned as a string (Big number) representing
 * the smallest unit (e.g., "10000000" for 0.1 tokens with 8 decimals).
 *
 * @example
 * ```tsx
 * function MyBalances() {
 *   const { data: balances, isLoading } = useBalances({
 *     accountId: accountId,
 *     enabled: !!accountId,
 *   })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {balances?.map(({ token, balance }) => (
 *         <div key={token}>
 *           Token: {token}, Balance: {balance}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useBalances({ accountId, enabled = true, queryOptions }: UseBalancesOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.balances.byAccountId(accountId),
    queryFn: () => fetchBalances(accountId),
    enabled: enabled && !!accountId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
