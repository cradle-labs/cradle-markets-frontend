/**
 * useLoans Hook
 *
 * TanStack Query hooks for fetching loans
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import {
  fetchLoans,
  fetchLoansByWallet,
  fetchLoan,
  fetchAllLoans,
  fetchLoansByPool,
  fetchLoansByStatus,
} from '../../services/fetchers'
import { userDataQueryOptions, standardQueryOptions } from '../../utils/query-options'
import type { Loan, LoanStatus } from '../../cradle-api-client'

export interface UseLoansOptions {
  /**
   * Pool ID to fetch loans for
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
 * Hook to fetch loans for a pool
 *
 * @example
 * ```tsx
 * function PoolLoans({ poolId }: { poolId: string }) {
 *   const { data: loans, isLoading } = useLoans({ poolId })
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
export function useLoans({ poolId, enabled = true, queryOptions }: UseLoansOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.listByPool(poolId),
    queryFn: () => fetchLoans(poolId),
    enabled: enabled && !!poolId,
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

/**
 * Hook to fetch a single loan by ID
 *
 * @example
 * ```tsx
 * function LoanDetails({ loanId }: { loanId: string }) {
 *   const { data: loan, isLoading } = useLoan({ loanId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <p>Amount: {loan?.amount}</p>
 *       <p>Status: {loan?.status}</p>
 *       <p>Collateral: {loan?.collateral}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLoan({ loanId, enabled = true, queryOptions }: UseLoanOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.byId(loanId),
    queryFn: () => fetchLoan(loanId),
    enabled: enabled && !!loanId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

export interface UseAllLoansOptions {
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

/**
 * Hook to fetch all loans
 *
 * @example
 * ```tsx
 * function AllLoans() {
 *   const { data: loans, isLoading } = useAllLoans()
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
export function useAllLoans({ enabled = true, queryOptions }: UseAllLoansOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.listAll(),
    queryFn: () => fetchAllLoans(),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch loans by pool (alternative to useLoans for better naming)
 *
 * @example
 * ```tsx
 * function PoolLoans({ poolId }: { poolId: string }) {
 *   const { data: loans } = useLoansByPool({ poolId })
 *   return <LoansList loans={loans} />
 * }
 * ```
 */
export function useLoansByPool({ poolId, enabled = true, queryOptions }: UseLoansOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.listByPool(poolId),
    queryFn: () => fetchLoansByPool(poolId),
    enabled: enabled && !!poolId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

export interface UseLoansByStatusOptions {
  /**
   * Status to filter loans by
   */
  status: LoanStatus
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

/**
 * Hook to fetch loans by status
 *
 * @example
 * ```tsx
 * function ActiveLoans() {
 *   const { data: loans } = useLoansByStatus({ status: 'active' })
 *
 *   return (
 *     <div>
 *       <h3>Active Loans ({loans?.length})</h3>
 *       {loans?.map(loan => (
 *         <LoanCard key={loan.id} loan={loan} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLoansByStatus({
  status,
  enabled = true,
  queryOptions,
}: UseLoansByStatusOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.loans.listByStatus(status),
    queryFn: () => fetchLoansByStatus(status),
    enabled: enabled && !!status,
    ...standardQueryOptions,
    ...queryOptions,
  })
}
