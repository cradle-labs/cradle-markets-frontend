/**
 * useRepayments Hook
 *
 * TanStack Query hooks for fetching loan repayments
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAllRepayments, fetchRepaymentsByLoan } from '../../services/fetchers'
import { standardQueryOptions, userDataQueryOptions } from '../../utils/query-options'
import type { LoanRepayment } from '../../cradle-api-client'

export interface UseAllRepaymentsOptions {
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LoanRepayment[]>, 'queryKey' | 'queryFn'>
}

export interface UseRepaymentsByLoanOptions {
  /**
   * Loan ID to fetch repayments for
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
  queryOptions?: Omit<UseQueryOptions<LoanRepayment[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all loan repayments
 *
 * @example
 * ```tsx
 * function AllRepayments() {
 *   const { data: repayments, isLoading } = useAllRepayments()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {repayments?.map(repayment => (
 *         <RepaymentCard key={repayment.id} repayment={repayment} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAllRepayments({ enabled = true, queryOptions }: UseAllRepaymentsOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.repayments.listAll(),
    queryFn: () => fetchAllRepayments(),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch repayments for a specific loan
 *
 * @example
 * ```tsx
 * function LoanRepayments({ loanId }: { loanId: string }) {
 *   const { data: repayments } = useRepaymentsByLoan({ loanId })
 *
 *   return (
 *     <div>
 *       <h3>Repayment History</h3>
 *       {repayments?.map(repayment => (
 *         <div key={repayment.id}>
 *           <p>Amount: {repayment.repayment_amount}</p>
 *           <p>Date: {repayment.repayment_date}</p>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useRepaymentsByLoan({
  loanId,
  enabled = true,
  queryOptions,
}: UseRepaymentsByLoanOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.repayments.listByLoan(loanId),
    queryFn: () => fetchRepaymentsByLoan(loanId),
    enabled: enabled && !!loanId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
