/**
 * Query Keys Factory for TanStack Query
 *
 * This file provides a centralized, type-safe way to generate query keys
 * for all Cradle API queries. Using a factory pattern ensures consistency
 * and makes it easy to invalidate related queries.
 *
 * @example
 * ```ts
 * import { cradleQueryKeys } from './queryKeys'
 *
 * // In a hook
 * const queryKey = cradleQueryKeys.accounts.byId(accountId)
 *
 * // Invalidate all account queries
 * queryClient.invalidateQueries({ queryKey: cradleQueryKeys.accounts.all })
 *
 * // Invalidate specific account
 * queryClient.invalidateQueries({ queryKey: cradleQueryKeys.accounts.byId(accountId) })
 * ```
 */

import type {
  AssetType,
  MarketType,
  MarketStatus,
  MarketRegulation,
  OrderStatus,
  OrderType,
  FillMode,
} from './types'

/**
 * Query key factory for Cradle API queries
 *
 * Organized hierarchically:
 * - all: ['resource'] - matches ALL queries for a resource
 * - lists: ['resource', 'list'] - matches all list queries
 * - list: ['resource', 'list', filters] - specific list query
 * - details: ['resource', 'detail'] - matches all detail queries
 * - detail: ['resource', 'detail', id] - specific detail query
 */
export const cradleQueryKeys = {
  // Health check
  health: {
    all: ['cradle', 'health'] as const,
    check: () => [...cradleQueryKeys.health.all, 'check'] as const,
  },

  // Accounts
  accounts: {
    all: ['cradle', 'accounts'] as const,
    lists: () => [...cradleQueryKeys.accounts.all, 'list'] as const,
    details: () => [...cradleQueryKeys.accounts.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.accounts.details(), id] as const,
    byLinkedId: (linkedId: string) =>
      [...cradleQueryKeys.accounts.details(), 'linked', linkedId] as const,
    wallets: (accountId: string) =>
      [...cradleQueryKeys.accounts.byId(accountId), 'wallets'] as const,
  },

  // Wallets
  wallets: {
    all: ['cradle', 'wallets'] as const,
    lists: () => [...cradleQueryKeys.wallets.all, 'list'] as const,
    details: () => [...cradleQueryKeys.wallets.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.wallets.details(), id] as const,
    byAccountId: (accountId: string) =>
      [...cradleQueryKeys.wallets.details(), 'account', accountId] as const,
  },

  // Balances
  balances: {
    all: ['cradle', 'balances'] as const,
    lists: () => [...cradleQueryKeys.balances.all, 'list'] as const,
    byAccountId: (accountId: string) =>
      [...cradleQueryKeys.balances.lists(), 'account', accountId] as const,
    byWalletAndAsset: (walletId: string, assetId: string) =>
      [...cradleQueryKeys.balances.all, 'wallet', walletId, 'asset', assetId] as const,
  },

  // Assets
  assets: {
    all: ['cradle', 'assets'] as const,
    lists: () => [...cradleQueryKeys.assets.all, 'list'] as const,
    list: (filters?: { asset_type?: AssetType }) =>
      [...cradleQueryKeys.assets.lists(), filters] as const,
    details: () => [...cradleQueryKeys.assets.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.assets.details(), id] as const,
    byToken: (token: string) => [...cradleQueryKeys.assets.details(), 'token', token] as const,
    byManager: (manager: string) =>
      [...cradleQueryKeys.assets.details(), 'manager', manager] as const,
  },

  // Markets
  markets: {
    all: ['cradle', 'markets'] as const,
    lists: () => [...cradleQueryKeys.markets.all, 'list'] as const,
    list: (filters?: {
      market_type?: MarketType
      status?: MarketStatus
      regulation?: MarketRegulation
    }) => [...cradleQueryKeys.markets.lists(), filters] as const,
    details: () => [...cradleQueryKeys.markets.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.markets.details(), id] as const,
  },

  // Orders
  orders: {
    all: ['cradle', 'orders'] as const,
    lists: () => [...cradleQueryKeys.orders.all, 'list'] as const,
    list: (filters?: {
      wallet?: string
      market_id?: string
      status?: OrderStatus
      order_type?: OrderType
      mode?: FillMode
    }) => [...cradleQueryKeys.orders.lists(), filters] as const,
    details: () => [...cradleQueryKeys.orders.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.orders.details(), id] as const,
  },

  // Time Series
  timeSeries: {
    all: ['cradle', 'time-series'] as const,
    lists: () => [...cradleQueryKeys.timeSeries.all, 'list'] as const,
    list: (filters?: {
      market?: string
      duration_secs?: string | number
      interval?: string
      asset_id?: string
    }) => [...cradleQueryKeys.timeSeries.lists(), filters] as const,
    details: () => [...cradleQueryKeys.timeSeries.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.timeSeries.details(), id] as const,
  },

  // Lending Pools
  lendingPools: {
    all: ['cradle', 'lending-pools'] as const,
    lists: () => [...cradleQueryKeys.lendingPools.all, 'list'] as const,
    list: (filters?: {
      reserve_asset?: string
      min_loan_to_value?: number
      max_loan_to_value?: number
    }) => [...cradleQueryKeys.lendingPools.lists(), filters] as const,
    details: () => [...cradleQueryKeys.lendingPools.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.lendingPools.details(), id] as const,
    byName: (name: string) => [...cradleQueryKeys.lendingPools.details(), 'name', name] as const,
    byAddress: (address: string) =>
      [...cradleQueryKeys.lendingPools.details(), 'address', address] as const,
    snapshot: (poolId: string) =>
      [...cradleQueryKeys.lendingPools.byId(poolId), 'snapshot'] as const,
    transactions: (poolId: string) =>
      [...cradleQueryKeys.lendingPools.byId(poolId), 'transactions'] as const,
    transactionsByWallet: (walletId: string) =>
      [...cradleQueryKeys.lendingPools.all, 'transactions', 'wallet', walletId] as const,
    interestRates: (poolId: string) =>
      [...cradleQueryKeys.lendingPools.byId(poolId), 'interest-rates'] as const,
    collateralInfo: (poolId: string) =>
      [...cradleQueryKeys.lendingPools.byId(poolId), 'collateral-info'] as const,
    statistics: (poolId: string) =>
      [...cradleQueryKeys.lendingPools.byId(poolId), 'statistics'] as const,
    userPositions: (poolId: string, walletId: string) =>
      [...cradleQueryKeys.lendingPools.byId(poolId), 'user-positions', walletId] as const,
  },

  // Loans
  loans: {
    all: ['cradle', 'loans'] as const,
    lists: () => [...cradleQueryKeys.loans.all, 'list'] as const,
    listAll: () => [...cradleQueryKeys.loans.lists(), 'all'] as const,
    listByPool: (poolId: string) => [...cradleQueryKeys.loans.lists(), 'pool', poolId] as const,
    listByWallet: (walletId: string) =>
      [...cradleQueryKeys.loans.lists(), 'wallet', walletId] as const,
    listByStatus: (status: string) => [...cradleQueryKeys.loans.lists(), 'status', status] as const,
    details: () => [...cradleQueryKeys.loans.all, 'detail'] as const,
    byId: (id: string) => [...cradleQueryKeys.loans.details(), id] as const,
  },

  // Loan Repayments
  repayments: {
    all: ['cradle', 'repayments'] as const,
    lists: () => [...cradleQueryKeys.repayments.all, 'list'] as const,
    listAll: () => [...cradleQueryKeys.repayments.lists(), 'all'] as const,
    listByLoan: (loanId: string) =>
      [...cradleQueryKeys.repayments.lists(), 'loan', loanId] as const,
  },

  // Loan Liquidations
  liquidations: {
    all: ['cradle', 'liquidations'] as const,
    lists: () => [...cradleQueryKeys.liquidations.all, 'list'] as const,
    listAll: () => [...cradleQueryKeys.liquidations.lists(), 'all'] as const,
    listByLoan: (loanId: string) =>
      [...cradleQueryKeys.liquidations.lists(), 'loan', loanId] as const,
  },
} as const

/**
 * Type-safe query key type extraction
 * Extracts all possible query key array types from the query keys factory
 */
type QueryKeyFactoryValue<T> = T extends (...args: any[]) => infer R ? R : T

export type CradleQueryKey = {
  [K in keyof typeof cradleQueryKeys]: {
    [P in keyof (typeof cradleQueryKeys)[K]]: QueryKeyFactoryValue<(typeof cradleQueryKeys)[K][P]>
  }[keyof (typeof cradleQueryKeys)[K]]
}[keyof typeof cradleQueryKeys]
