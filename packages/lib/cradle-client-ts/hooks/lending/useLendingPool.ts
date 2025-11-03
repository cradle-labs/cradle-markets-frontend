/**
 * useLendingPool Hook
 *
 * TanStack Query hook for fetching a single lending pool
 */

'use client'

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { cradleQueryKeys } from '../../queryKeys'
import {
  fetchLendingPool,
  fetchLendingPoolByName,
  fetchLendingPoolByAddress,
  fetchPoolSnapshot,
  fetchPoolInterestRates,
  fetchPoolCollateralInfo,
  fetchPoolStatistics,
  fetchUserPositions,
} from '../../services/fetchers'
import { standardQueryOptions, userDataQueryOptions } from '../../utils/query-options'
import type {
  LendingPool,
  LendingPoolSnapshot,
  InterestRates,
  CollateralInfo,
  PoolStatistics,
  UserPositions,
} from '../../cradle-api-client'

export interface UseLendingPoolOptions {
  /**
   * Lending pool ID to fetch
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
  queryOptions?: Omit<UseQueryOptions<LendingPool>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a lending pool by its ID
 *
 * @example
 * ```tsx
 * function PoolDetails({ poolId }: { poolId: string }) {
 *   const { data: pool, isLoading } = useLendingPool({ poolId })
 *
 *   if (isLoading) return <Spinner />
 *   return (
 *     <div>
 *       <h2>{pool?.name}</h2>
 *       <p>{pool?.description}</p>
 *       <p>LTV: {pool?.loan_to_value}</p>
 *       <p>Base Rate: {pool?.base_rate}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useLendingPool({ poolId, enabled = true, queryOptions }: UseLendingPoolOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.byId(poolId),
    queryFn: () => fetchLendingPool(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UseLendingPoolByNameOptions {
  /**
   * Pool name to fetch
   */
  poolName: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LendingPool>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a lending pool by its name
 *
 * @example
 * ```tsx
 * function PoolByName() {
 *   const { data: pool } = useLendingPoolByName({ poolName: 'USDC Lending Pool' })
 *   return <PoolDetails pool={pool} />
 * }
 * ```
 */
export function useLendingPoolByName({
  poolName,
  enabled = true,
  queryOptions,
}: UseLendingPoolByNameOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.byName(poolName),
    queryFn: () => fetchLendingPoolByName(poolName),
    enabled: enabled && !!poolName,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UseLendingPoolByAddressOptions {
  /**
   * Pool address to fetch
   */
  poolAddress: string
  /**
   * Whether the query is enabled
   * @default true
   */
  enabled?: boolean
  /**
   * Custom query options
   */
  queryOptions?: Omit<UseQueryOptions<LendingPool>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch a lending pool by its contract address
 *
 * @example
 * ```tsx
 * function PoolByAddress({ address }: { address: string }) {
 *   const { data: pool } = useLendingPoolByAddress({ poolAddress: address })
 *   return <PoolDetails pool={pool} />
 * }
 * ```
 */
export function useLendingPoolByAddress({
  poolAddress,
  enabled = true,
  queryOptions,
}: UseLendingPoolByAddressOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.byAddress(poolAddress),
    queryFn: () => fetchLendingPoolByAddress(poolAddress),
    enabled: enabled && !!poolAddress,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UsePoolSnapshotOptions {
  /**
   * Pool ID to fetch snapshot for
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
  queryOptions?: Omit<UseQueryOptions<LendingPoolSnapshot>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch the latest snapshot (metrics) for a lending pool
 *
 * @example
 * ```tsx
 * function PoolMetrics({ poolId }: { poolId: string }) {
 *   const { data: snapshot } = usePoolSnapshot({ poolId })
 *
 *   return (
 *     <div>
 *       <p>Total Supply: {snapshot?.total_supply}</p>
 *       <p>Total Borrow: {snapshot?.total_borrow}</p>
 *       <p>Utilization: {snapshot?.utilization_rate}%</p>
 *       <p>Supply APY: {snapshot?.supply_apy}%</p>
 *       <p>Borrow APY: {snapshot?.borrow_apy}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePoolSnapshot({ poolId, enabled = true, queryOptions }: UsePoolSnapshotOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.snapshot(poolId),
    queryFn: () => fetchPoolSnapshot(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UsePoolInterestRatesOptions {
  /**
   * Pool ID to fetch interest rates for
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
  queryOptions?: Omit<UseQueryOptions<InterestRates>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch interest rate configuration for a lending pool
 *
 * @example
 * ```tsx
 * function PoolRates({ poolId }: { poolId: string }) {
 *   const { data: rates } = usePoolInterestRates({ poolId })
 *
 *   return (
 *     <div>
 *       <p>Base Rate: {rates?.base_rate}%</p>
 *       <p>Slope 1: {rates?.slope1}%</p>
 *       <p>Slope 2: {rates?.slope2}%</p>
 *       <p>Reserve Factor: {rates?.reserve_factor}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePoolInterestRates({
  poolId,
  enabled = true,
  queryOptions,
}: UsePoolInterestRatesOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.interestRates(poolId),
    queryFn: () => fetchPoolInterestRates(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UsePoolCollateralInfoOptions {
  /**
   * Pool ID to fetch collateral info for
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
  queryOptions?: Omit<UseQueryOptions<CollateralInfo>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch collateral configuration and risk parameters for a lending pool
 *
 * @example
 * ```tsx
 * function PoolCollateral({ poolId }: { poolId: string }) {
 *   const { data: info } = usePoolCollateralInfo({ poolId })
 *
 *   return (
 *     <div>
 *       <p>LTV: {info?.loan_to_value}%</p>
 *       <p>Liquidation Threshold: {info?.liquidation_threshold}%</p>
 *       <p>Liquidation Discount: {info?.liquidation_discount}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePoolCollateralInfo({
  poolId,
  enabled = true,
  queryOptions,
}: UsePoolCollateralInfoOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.collateralInfo(poolId),
    queryFn: () => fetchPoolCollateralInfo(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UsePoolStatisticsOptions {
  /**
   * Pool ID to fetch statistics for
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
  queryOptions?: Omit<UseQueryOptions<PoolStatistics>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch comprehensive statistics and metrics for a lending pool
 *
 * @example
 * ```tsx
 * function PoolStats({ poolId }: { poolId: string }) {
 *   const { data: stats } = usePoolStatistics({ poolId })
 *
 *   return (
 *     <div>
 *       <h3>{stats?.pool_name}</h3>
 *       <p>Total Supply: {stats?.metrics.total_supply}</p>
 *       <p>Total Borrow: {stats?.metrics.total_borrow}</p>
 *       <p>Utilization: {stats?.metrics.utilization_rate}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePoolStatistics({
  poolId,
  enabled = true,
  queryOptions,
}: UsePoolStatisticsOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.statistics(poolId),
    queryFn: () => fetchPoolStatistics(poolId),
    enabled: enabled && !!poolId,
    ...standardQueryOptions,
    ...queryOptions,
  })
}

export interface UseUserPositionsOptions {
  /**
   * Pool ID
   */
  poolId: string
  /**
   * Wallet ID
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
  queryOptions?: Omit<UseQueryOptions<UserPositions>, 'queryKey' | 'queryFn'>
}

/**
 * Hook to fetch detailed borrow position and repayment history for a user in a specific pool
 *
 * @example
 * ```tsx
 * function UserPoolPosition({ poolId, walletId }: { poolId: string; walletId: string }) {
 *   const { data: positions } = useUserPositions({ poolId, walletId })
 *
 *   return (
 *     <div>
 *       <h3>Your Position</h3>
 *       <p>Active Loans: {positions?.borrow_position.active_loans_count}</p>
 *       <p>Total Borrowed: {positions?.borrow_position.total_borrow_amount}</p>
 *       <p>Total Repaid: {positions?.repayment_history.total_repaid}</p>
 *       <p>Repayments Made: {positions?.repayment_history.repayment_count}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useUserPositions({
  poolId,
  walletId,
  enabled = true,
  queryOptions,
}: UseUserPositionsOptions) {
  return useQuery({
    queryKey: cradleQueryKeys.lendingPools.userPositions(poolId, walletId),
    queryFn: () => fetchUserPositions(poolId, walletId),
    enabled: enabled && !!poolId && !!walletId,
    ...userDataQueryOptions,
    ...queryOptions,
  })
}
