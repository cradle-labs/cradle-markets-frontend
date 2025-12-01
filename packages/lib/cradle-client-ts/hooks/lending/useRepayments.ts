/**
 * useRepayments Hook
 *
 * TanStack Query hooks for fetching loan repayments
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchLoanRepayments, fetchRepaymentAmount } from '../../services/fetchers'
import { userDataQueryOptions } from '../../utils/query-options'
import type { LoanRepayment } from '../../types'
import type { RepaymentAmount } from '../../cradle-api-client'

export interface UseLoanRepaymentsOptions {
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
 * Hook to fetch repayments for a specific loan
 *
 * @example
 * ```tsx
 * function LoanRepayments({ loanId }: { loanId: string }) {
 *   const { data: repayments } = useLoanRepayments({ loanId })
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
export function useLoanRepayments({
  loanId,
  enabled = true,
  queryOptions,
}: UseLoanRepaymentsOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.repayments.listByLoan(loanId),
    queryFn: () => fetchLoanRepayments(loanId),
    enabled: enabled && !!loanId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}

export interface UseRepaymentAmountOptions {
  /**
   * Loan ID to fetch repayment amount for
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
  queryOptions?: Omit<UseQueryOptions<RepaymentAmount>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch repayment amount for a loan
 */
export function useRepaymentAmount({
  loanId,
  enabled = true,
  queryOptions,
}: UseRepaymentAmountOptions) {
  return useQuery({
    queryKey: [...cradleQueryKeys.loans.byId(loanId), 'repayment-amount'],
    queryFn: () => fetchRepaymentAmount(loanId),
    enabled: enabled && !!loanId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
