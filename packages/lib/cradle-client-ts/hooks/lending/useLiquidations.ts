/**
 * useLiquidations Hook
 *
 * TanStack Query hooks for fetching loan liquidations
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import { fetchAllLiquidations, fetchLiquidationsByLoan } from '../../services/fetchers'
import { standardQueryOptions, userDataQueryOptions } from '../../utils/query-options'
import type { LoanLiquidation } from '../../cradle-api-client'

export interface UseAllLiquidationsOptions {
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LoanLiquidation[]>, 'queryKey' | 'queryFn'>
}

export interface UseLiquidationsByLoanOptions {
  /**
   * Loan ID to fetch liquidations for
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
  queryOptions?: Omit<UseQueryOptions<LoanLiquidation[]>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch all loan liquidations
 *
 * @example
 * ```tsx
 * function AllLiquidations() {
 *   const { data: liquidations, isLoading } = useAllLiquidations()
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       {liquidations?.map(liquidation => (
 *         <LiquidationCard key={liquidation.id} liquidation={liquidation} />
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useAllLiquidations({
  enabled = true,
  queryOptions,
}: UseAllLiquidationsOptions = {}) {
  return useQuery({
    queryKey: cradleQueryKeys.liquidations.listAll(),
    queryFn: () => fetchAllLiquidations(),
    enabled,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

/**
 * Hook to fetch liquidations for a specific loan
 *
 * @example
 * ```tsx
 * function LoanLiquidations({ loanId }: { loanId: string }) {
 *   const { data: liquidations } = useLiquidationsByLoan({ loanId })
 *
 *   return (
 *     <div>
 *       <h3>Liquidation History</h3>
 *       {liquidations?.map(liquidation => (
 *         <div key={liquidation.id}>
 *           <p>Amount: {liquidation.liquidation_amount}</p>
 *           <p>Date: {liquidation.liquidation_date}</p>
 *           <p>Liquidator: {liquidation.liquidator_wallet_id}</p>
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLiquidationsByLoan({
  loanId,
  enabled = true,
  queryOptions,
}: UseLiquidationsByLoanOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.liquidations.listByLoan(loanId),
    queryFn: () => fetchLiquidationsByLoan(loanId),
    enabled: enabled && !!loanId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
