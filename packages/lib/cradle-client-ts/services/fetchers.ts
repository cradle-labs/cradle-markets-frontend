/**
 * Fetcher Functions for Client-Side Queries
 *
 * These functions are used by TanStack Query hooks to fetch data.
 * They call server-side functions or API routes to keep the API key secure.
 *
 * Note: In Next.js App Router, we can't call server functions directly from client components,
 * so these fetchers will call server actions that we define.
 */

import type {
  CradleAccount,
  CradleWallet,
  Asset,
  Market,
  Order,
  TimeSeriesRecord,
  LendingPool,
  LendingTransaction,
  Loan,
  MarketFilters,
  OrderFilters,
  TimeSeriesFilters,
  LendingPoolFilters,
  HealthResponse,
} from '../cradle-api-client'

// =============================================================================
// HEALTH
// =============================================================================

export async function fetchHealth(): Promise<HealthResponse> {
  const { checkHealth } = await import('../../actions/health')
  return checkHealth()
}

// =============================================================================
// ACCOUNTS
// =============================================================================

export async function fetchAccount(id: string): Promise<CradleAccount> {
  const { getAccount } = await import('../../actions/accounts')
  return getAccount(id)
}

export async function fetchAccountByLinkedId(linkedId: string): Promise<CradleAccount> {
  const { getAccountByLinkedId } = await import('../../actions/accounts')
  return getAccountByLinkedId(linkedId)
}

export async function fetchAccountWallets(accountId: string): Promise<CradleWallet[]> {
  const { getAccountWallets } = await import('../../actions/accounts')
  return getAccountWallets(accountId)
}

// =============================================================================
// WALLETS
// =============================================================================

export async function fetchWallet(id: string): Promise<CradleWallet> {
  const { getWallet } = await import('../../actions/wallets')
  return getWallet(id)
}

export async function fetchWalletByAccountId(accountId: string): Promise<CradleWallet> {
  const { getWalletByAccountId } = await import('../../actions/wallets')
  return getWalletByAccountId(accountId)
}

// =============================================================================
// ASSETS
// =============================================================================

export async function fetchAsset(id: string): Promise<Asset> {
  const { getAsset } = await import('../../actions/assets')
  return getAsset(id)
}

export async function fetchAssetByToken(token: string): Promise<Asset> {
  const { getAssetByToken } = await import('../../actions/assets')
  return getAssetByToken(token)
}

export async function fetchAssetByManager(manager: string): Promise<Asset> {
  const { getAssetByManager } = await import('../../actions/assets')
  return getAssetByManager(manager)
}

export async function fetchAssets(): Promise<Asset[]> {
  const { getAssets } = await import('../../actions/assets')
  return getAssets()
}

// =============================================================================
// MARKETS
// =============================================================================

export async function fetchMarket(id: string): Promise<Market> {
  const { getMarket } = await import('../../actions/markets')
  return getMarket(id)
}

export async function fetchMarkets(filters?: MarketFilters): Promise<Market[]> {
  const { getMarkets } = await import('../../actions/markets')
  return getMarkets(filters)
}

// =============================================================================
// ORDERS
// =============================================================================

export async function fetchOrder(id: string): Promise<Order> {
  const { getOrder } = await import('../../actions/orders')
  return getOrder(id)
}

export async function fetchOrders(filters?: OrderFilters): Promise<Order[]> {
  const { getOrders } = await import('../../actions/orders')
  return getOrders(filters)
}

// =============================================================================
// TIME SERIES
// =============================================================================

export async function fetchTimeSeriesRecord(id: string): Promise<TimeSeriesRecord> {
  const { getTimeSeriesRecord } = await import('../../actions/time-series')
  return getTimeSeriesRecord(id)
}

export async function fetchTimeSeriesRecords(
  filters?: TimeSeriesFilters
): Promise<TimeSeriesRecord[]> {
  const { getTimeSeriesRecords } = await import('../../actions/time-series')
  return getTimeSeriesRecords(filters)
}

// =============================================================================
// LENDING POOLS
// =============================================================================

export async function fetchLendingPool(id: string): Promise<LendingPool> {
  const { getLendingPool } = await import('../../actions/lending')
  return getLendingPool(id)
}

export async function fetchLendingPools(filters?: LendingPoolFilters): Promise<LendingPool[]> {
  const { getLendingPools } = await import('../../actions/lending')
  return getLendingPools(filters)
}

export async function fetchLendingTransactions(poolId: string): Promise<LendingTransaction[]> {
  const { getLendingTransactions } = await import('../../actions/lending')
  return getLendingTransactions(poolId)
}

export async function fetchLendingTransactionsByWallet(
  walletId: string
): Promise<LendingTransaction[]> {
  const { getLendingTransactionsByWallet } = await import('../../actions/lending')
  return getLendingTransactionsByWallet(walletId)
}

// =============================================================================
// LOANS
// =============================================================================

export async function fetchLoans(poolId: string): Promise<Loan[]> {
  const { getLoans } = await import('../../actions/lending')
  return getLoans(poolId)
}

export async function fetchLoansByWallet(walletId: string): Promise<Loan[]> {
  const { getLoansByWallet } = await import('../../actions/lending')
  return getLoansByWallet(walletId)
}

export async function fetchLoan(id: string): Promise<Loan> {
  const { getLoan } = await import('../../actions/lending')
  return getLoan(id)
}
