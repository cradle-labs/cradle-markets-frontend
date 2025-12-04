/**
 * Type definitions for Cradle API
 * Import this file to get type definitions without importing the client
 *
 * @example
 * import type { CradleAccount, Asset, Market } from './types';
 */

// Re-export all types from the main client
export type {
  // Common types
  ApiResponse,

  // Account types
  CradleAccountType,
  CradleAccountStatus,
  CradleAccountRecord,
  CradleWalletAccountRecord,

  // Asset types
  AssetType,
  AssetBookRecord,

  // Market types
  MarketStatus,
  MarketType,
  MarketRegulation,
  MarketRecord,

  // Order types
  OrderStatus,
  OrderType,
  FillMode,
  OrderFillStatus,
  OrderBookRecord,
  NewOrderBookRecord,

  // Time series types
  TimeSeriesInterval,
  DataProviderType,
  MarketTimeSeriesRecord,

  // Lending pool types
  LoanStatus,
  PoolTransactionType,
  LendingPoolRecord,
  LendingPoolSnapShotRecord,
  LoanRecord,
  LoanRepaymentsRecord,

  // Listing types
  ListingStatus,
  CradleNativeListingRow,
  ListingStats,

  // Action Router types
  ActionRouterInput,
  ActionRouterOutput,

  // Processor types
  MarketTimeSeriesProcessorInput,
  MarketTimeSeriesProcessorOutput,

  // Other types
  GetPoolStatsOutput,
  GetUserBorrowPositionOutput,
  GetUserDepositPositonOutput,
  RepaymentAmount,
  UUID,
  Big,
} from './cradle-api-client'

// Import types for aliases (needed for type aliases to reference exported types)
import type {
  CradleAccountRecord,
  CradleWalletAccountRecord,
  AssetBookRecord,
  MarketRecord,
  OrderBookRecord,
  MarketTimeSeriesRecord,
  LendingPoolRecord,
  LendingPoolSnapShotRecord,
  LoanRecord,
  LoanRepaymentsRecord,
  CradleNativeListingRow,
  PoolTransactionType,
} from './cradle-api-client'

// Type aliases for backward compatibility
export type CradleAccount = CradleAccountRecord
export type CradleWallet = CradleWalletAccountRecord
export type Asset = AssetBookRecord
export type Market = MarketRecord
export type Order = OrderBookRecord
export type TimeSeriesRecord = MarketTimeSeriesRecord
export type LendingPool = LendingPoolRecord
export type LendingPoolSnapshot = LendingPoolSnapShotRecord
export type Loan = LoanRecord
export type LoanRepayment = LoanRepaymentsRecord
export type Listing = CradleNativeListingRow

// LendingTransaction type (not exported from client, so define it here)
export interface LendingTransaction {
  id: string
  transaction_type: PoolTransactionType
  amount: number
  created_at: string
}

// Re-export the client class
export { CradleClient } from './cradle-api-client'

// CradleClientOptions interface (not exported from client, so define it here)
export interface CradleClientOptions {
  baseUrl: string
  apiKey?: string
  axiosInstance?: import('axios').AxiosInstance
  timeoutMs?: number
  userAgent?: string
}

// Legacy config type alias
export interface CradleApiConfig {
  baseUrl: string
  apiKey: string
  timeout?: number
}
