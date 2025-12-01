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
  Loan,
  LoanRepayment,
  TimeSeriesInterval,
  ListingStatus,
  OrderStatus,
  OrderType,
  FillMode,
} from '../types'
import type {
  GetPoolStatsOutput,
  GetUserBorrowPositionOutput,
  GetUserDepositPositonOutput,
  RepaymentAmount,
  CradleNativeListingRow,
  ListingStats,
} from '../cradle-api-client'

// =============================================================================
// HEALTH
// =============================================================================

export async function fetchHealth(): Promise<{ status: 'ok' }> {
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

export async function fetchWalletByAccountId(accountId: string): Promise<CradleWallet | null> {
  const { getWalletByAccountId } = await import('../../actions/wallets')
  return getWalletByAccountId(accountId)
}

export async function fetchBalances(
  accountId: string
): Promise<Array<{ token: string; balance: string }>> {
  const { getBalances } = await import('../../actions/accounts')
  return getBalances(accountId)
}

export async function fetchBalance(
  walletId: string,
  assetId: string
): Promise<{ balance: number; before_deductions: number; deductions: number; decimals: number }> {
  const { getBalance } = await import('../../actions/wallets')
  return getBalance(walletId, assetId)
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

export async function fetchMarkets(): Promise<Market[]> {
  const { getMarkets } = await import('../../actions/markets')
  return getMarkets()
}

// =============================================================================
// ORDERS
// =============================================================================

export async function fetchOrder(id: string): Promise<Order> {
  const { getOrder } = await import('../../actions/orders')
  return getOrder(id)
}

export async function fetchOrders(filters?: {
  wallet?: string
  market_id?: string
  status?: OrderStatus
  order_type?: OrderType
  mode?: FillMode
}): Promise<Order[]> {
  const { getOrders } = await import('../../actions/orders')
  return getOrders(filters)
}

// =============================================================================
// TIME SERIES
// =============================================================================

export async function fetchTimeSeriesHistory(params: {
  market: string
  duration_secs: string | number
  interval: TimeSeriesInterval
  asset_id: string
}): Promise<TimeSeriesRecord[]> {
  const { getTimeSeriesHistory } = await import('../../actions/time-series')
  return getTimeSeriesHistory(params)
}

// =============================================================================
// LENDING POOLS
// =============================================================================

export async function fetchLendingPool(id: string): Promise<LendingPool> {
  const { getLendingPool } = await import('../../actions/lending')
  return getLendingPool(id)
}

export async function fetchLendingPools(): Promise<LendingPool[]> {
  const { getLendingPools } = await import('../../actions/lending')
  return getLendingPools()
}

// =============================================================================
// LOANS
// =============================================================================

export async function fetchLoansByWallet(walletId: string): Promise<Loan[]> {
  const { getLoansByWallet } = await import('../../actions/lending')
  return getLoansByWallet(walletId)
}

export async function fetchPoolStats(poolId: string): Promise<GetPoolStatsOutput> {
  const { getPoolStats } = await import('../../actions/lending')
  return getPoolStats(poolId)
}

export async function fetchLoanPosition(loanId: string): Promise<GetUserBorrowPositionOutput> {
  const { getLoanPosition } = await import('../../actions/lending')
  return getLoanPosition(loanId)
}

export async function fetchDepositPosition(
  poolId: string,
  walletId: string
): Promise<GetUserDepositPositonOutput> {
  const { getDepositPosition } = await import('../../actions/lending')
  return getDepositPosition(poolId, walletId)
}

export async function fetchLoanRepayments(loanId: string): Promise<LoanRepayment[]> {
  const { getLoanRepayments } = await import('../../actions/lending')
  return getLoanRepayments(loanId)
}

export async function fetchRepaymentAmount(loanId: string): Promise<RepaymentAmount> {
  const { getRepaymentAmount } = await import('../../actions/lending')
  return getRepaymentAmount(loanId)
}

// =============================================================================
// LISTINGS
// =============================================================================

export async function fetchListing(id: string): Promise<CradleNativeListingRow> {
  const { getListing } = await import('../../actions/listings')
  return getListing(id)
}

export async function fetchListings(filters?: {
  company?: string
  listed_asset?: string
  purchase_asset?: string
  status?: ListingStatus
}): Promise<CradleNativeListingRow[]> {
  const { getListings } = await import('../../actions/listings')
  return getListings(filters)
}

export async function fetchListingStats(listingId: string): Promise<ListingStats> {
  const { getListingStats } = await import('../../actions/listings')
  return getListingStats(listingId)
}

export async function fetchListingFee(input: {
  listing_id: string
  amount: string
}): Promise<number> {
  const { getListingFee } = await import('../../actions/listings')
  return getListingFee(input)
}
