/**
 * useLoans Hook
 *
 * TanStack Query hooks for fetching loans
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchLoansByWallet } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { Loan } from '../../types'

export interface UseLoansOptions {
  /**
   * Wallet ID to fetch loans for
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
  queryOptions?: Omit<UseQueryOptions<Loan[]>, 'queryKey' | 'queryFn'>
}

export interface UseLoansByWalletOptions {
  /**
   * Wallet ID to fetch loans for
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
  queryOptions?: Omit<UseQueryOptions<Loan[]>, 'queryKey' | 'queryFn'>
}

export interface UseLoanOptions {
  /**
   * Loan ID to fetch
   */
  loanId: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<Loan>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch loans for a wallet
 *
 * @example
 * ```tsx
 * function WalletLoans({ walletId }: { walletId: string }) {
 *   const { data: loans, isLoading } = useLoans({ walletId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {loans?.map(loan => (
 *         <LoanCard key={loan.id} loan={loan} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLoans({ walletId, enabled = true, queryOptions }: UseLoansOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.listByWallet(walletId),
    queryFn: () => fetchLoansByWallet(walletId),
    enabled: enabled && !!walletId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch loans for a wallet
 *
 * @example
 * ```tsx
 * function MyLoans({ walletId }: { walletId: string }) {
 *   const { data: loans } = useLoansByWallet({ walletId })
 *
 *   return (
 *     <div>
 *       <h3>Your Active Loans</h3>
 *       {loans?.filter(l => l.status === 'active').map(loan => (
 *         <LoanCard key={loan.id} loan={loan} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLoansByWallet({
  walletId,
  enabled = true,
  queryOptions,
}: UseLoansByWalletOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.listByWallet(walletId),
    queryFn: () => fetchLoansByWallet(walletId),
    enabled: enabled && !!walletId,
    ...userDataQueryOptions,
    retry: false,
    ...queryOptions,
  })
}
