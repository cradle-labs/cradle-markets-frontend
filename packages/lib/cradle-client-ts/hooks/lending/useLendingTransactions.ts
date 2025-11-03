/**
 * useLendingTransactions Hook
 *
 * TanStack Query hooks for fetching lending transactions
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchLendingTransactions, fetchLendingTransactionsByWallet } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { LendingTransaction } from '../../cradle-api-client'

export interface UseLendingTransactionsOptions {
  /**
   * Pool ID to fetch transactions for
   */
  poolId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LendingTransaction[]>, 'queryKey' | 'queryFn'>
}

export interface UseLendingTransactionsByWalletOptions {
  /**
   * Wallet ID to fetch transactions for
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
  queryOptions?: Omit<UseQueryOptions<LendingTransaction[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch lending transactions for a pool
 *
 * @example
 * ```tsx
 * function PoolTransactions({ poolId }: { poolId: string }) {
 *   const { data: transactions, isLoading } = useLendingTransactions({ poolId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {transactions?.map(tx => (
 *         <TransactionRow key={tx.id} transaction={tx} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLendingTransactions({
  poolId,
  enabled = true,
  queryOptions,
}: UseLendingTransactionsOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.transactions(poolId),
    queryFn: () => fetchLendingTransactions(poolId),
    enabled: enabled && !!poolId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch lending transactions for a wallet
 *
 * @example
 * ```tsx
 * function WalletLendingHistory({ walletId }: { walletId: string }) {
 *   const { data: transactions } = useLendingTransactionsByWallet({ walletId })
 *
 *   return (
 *     <div>
 *       <h3>Your Lending History</h3>
 *       {transactions?.map(tx => (
 *         <TransactionCard key={tx.id} transaction={tx} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLendingTransactionsByWallet({
  walletId,
  enabled = true,
  queryOptions,
}: UseLendingTransactionsByWalletOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.transactionsByWallet(walletId),
    queryFn: async () => {
      try {
        return await fetchLendingTransactionsByWallet(walletId)
      } catch (error) {
        // Log the error but return empty array instead of throwing
        console.warn('Failed to fetch lending transactions for wallet:', walletId, error)
        return []
      }
    },
    enabled: enabled && !!walletId,
    ...userDataQueryOptions,
    retry: false, // Don't retry 404 errors
    ...queryOptions,
  })
}
