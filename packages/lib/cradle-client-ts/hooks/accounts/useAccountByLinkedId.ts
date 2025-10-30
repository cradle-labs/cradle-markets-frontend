/**
 * useAccountByLinkedId Hook
 *
 * TanStack Query hook for fetching an account by linked account ID (e.g., Clerk user ID)
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAccountByLinkedId } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { CradleAccount } from '../../cradle-api-client'

export interface UseAccountByLinkedIdOptions {
  /**
   * Linked account ID (e.g., Clerk user ID)
   */
  linkedAccountId: string
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
 * Hook to fetch a Cradle account by linked account ID
 *
 * This is useful for fetching a user's Cradle account using their
 * authentication provider ID (e.g., Clerk user ID).
 *
 * @example
 * ```tsx
 * import { useAuth } from '@clerk/nextjs'
 *
 * function MyAccount() {
 *   const { userId } = useAuth()
 *   const { data: account, isLoading } = useAccountByLinkedId({
 *     linkedAccountId: userId!,
 *     enabled: !!userId,
 *   })
 *
 *   return <div>{account?.account_type}</div>
 * }
 * ```
 */
export function useAccountByLinkedId({
  linkedAccountId,
  enabled = true,
  queryOptions,
}: UseAccountByLinkedIdOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.accounts.byLinkedId(linkedAccountId),
    queryFn: () => fetchAccountByLinkedId(linkedAccountId),
    enabled: enabled && !!linkedAccountId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
