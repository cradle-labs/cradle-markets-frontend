/**
 * Type definitions for Cradle API
 * Import this file to get type definitions without importing the client
 *
 * @example
 * import type { CradleAccount, Asset, Market } from './types';
 * import { MutationResponseHelpers } from './types';
 */

// Re-export all types from the main client
export type {
  // Common types
  ApiResponse,
  HealthResponse,

  // Account types
  CradleAccountType,
  CradleAccountStatus,
  CradleWalletStatus,
  WithdrawalType,
  CradleAccount,
  CradleWallet,

  // Asset types
  AssetType,
  Asset,

  // Market types
  MarketStatus,
  MarketType,
  MarketRegulation,
  Market,
  MarketFilters,

  // Order types
  OrderStatus,
  OrderType,
  FillMode,
  OrderFillStatus,
  Order,
  OrderFilters,

  // Time series types
  TimeSeriesInterval,
  DataProviderType,
  TimeSeriesRecord,
  TimeSeriesFilters,

  // Lending pool types
  LoanStatus,
  PoolTransactionType,
  LendingPool,
  LendingTransaction,
  Loan,
  LendingPoolFilters,

  // Mutation types
  CreateAccountInput,
  UpdateAccountStatusInput,
  CreateWalletInput,
  CreateAssetInput,
  CreateMarketInput,
  UpdateMarketStatusInput,
  PlaceOrderInput,
  PlaceOrderResult,
  AddTimeSeriesRecordInput,
  CreateLendingPoolInput,
  SupplyLiquidityInput,
  BorrowAssetInput,
  RepayBorrowInput,
  MutationAction,
  MutationResponse,

  // Config types
  CradleApiConfig,
} from './cradle-api-client'

// Re-export the mutation response helpers (not a type, so regular export)
export { MutationResponseHelpers } from './cradle-api-client'
