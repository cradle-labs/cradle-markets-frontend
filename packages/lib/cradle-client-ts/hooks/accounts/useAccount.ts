/**
 * useAccount Hook
 *
 * TanStack Query hook for fetching a single account by ID
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAccount } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { CradleAccount } from '../../cradle-api-client'

export interface UseAccountOptions {
  /**
   * Account ID to fetch
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
  queryOptions?: Omit<UseQueryOptions<CradleAccount>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a Cradle account by ID
 *
 * @example
 * ```tsx
 * function AccountProfile({ accountId }: { accountId: string }) {
 *   const { data: account, isLoading, error } = useAccount({ accountId })
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <ErrorMessage error={error} />
 *   if (!account) return <NotFound />
 *
 *   return <div>{account.account_type}</div>
 * }
 * ```
 */
export function useAccount({ accountId, enabled = true, queryOptions }: UseAccountOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.accounts.byId(accountId),
    queryFn: () => fetchAccount(accountId),
    enabled: enabled && !!accountId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
