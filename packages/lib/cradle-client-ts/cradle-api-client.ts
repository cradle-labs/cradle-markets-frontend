/**
 * Cradle Back-End REST API Client
 * TypeScript module for interacting with the Cradle Back-End REST API
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios'

// ============================================================================
// COMMON TYPES
// ============================================================================

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: string
  timestamp: string
}

// ============================================================================
// ACCOUNT TYPES
// ============================================================================

export type CradleAccountType = 'retail' | 'institutional'
export type CradleAccountStatus = 'unverified' | 'verified' | 'suspended' | 'closed'
export type CradleWalletStatus = 'active' | 'inactive' | 'suspended'
export type WithdrawalType = 'fiat' | 'crypto'

export interface CradleAccount {
  id: string
  linked_account_id: string
  created_at: string
  account_type: CradleAccountType
  status: CradleAccountStatus
}

export interface CradleWallet {
  id: string
  cradle_account_id: string
  address: string
  contract_id: string
  created_at: string
  status: CradleWalletStatus
}

// ============================================================================
// ASSET TYPES
// ============================================================================

export type AssetType =
  | 'bridged'
  | 'native'
  | 'yield_breaking'
  | 'chain_native'
  | 'stablecoin'
  | 'volatile'

export interface Asset {
  id: string
  asset_manager: string
  token: string
  created_at: string
  asset_type: AssetType
  name: string
  symbol: string
  decimals: number
  icon: string
}

// ============================================================================
// MARKET TYPES
// ============================================================================

export type MarketStatus = 'active' | 'inactive' | 'suspended'
export type MarketType = 'spot' | 'derivative' | 'futures'
export type MarketRegulation = 'regulated' | 'unregulated'

export interface Market {
  id: string
  name: string
  description: string
  icon: string
  asset_one: string
  asset_two: string
  created_at: string
  market_type: MarketType
  market_status: MarketStatus
  market_regulation: MarketRegulation
}

export interface MarketFilters {
  market_type?: MarketType
  status?: MarketStatus
  regulation?: MarketRegulation
}

// ============================================================================
// ORDER TYPES
// ============================================================================

export type OrderStatus = 'open' | 'closed' | 'cancelled'
export type OrderType = 'limit' | 'market'
export type FillMode = 'fill-or-kill' | 'immediate-or-cancel' | 'good-till-cancel'
export type OrderFillStatus = 'partial' | 'filled' | 'cancelled'

export interface Order {
  id: string
  wallet: string
  market_id: string
  bid_asset: string
  ask_asset: string
  bid_amount: string
  ask_amount: string
  price: string
  mode: FillMode
  order_type: OrderType
  status: OrderStatus
  created_at: string
}

export interface OrderFilters {
  wallet?: string
  market_id?: string
  status?: OrderStatus
  order_type?: OrderType
  from_date?: string
  to_date?: string
}

// ============================================================================
// TIME SERIES TYPES
// ============================================================================

export type TimeSeriesInterval =
  | '1min'
  | '5min'
  | '15min'
  | '30min'
  | '1hr'
  | '4hr'
  | '1day'
  | '1week'

export type DataProviderType = 'order_book' | 'exchange' | 'aggregated'

export interface TimeSeriesRecord {
  id: string
  market_id: string
  asset: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  start_time: string
  end_time: string
  interval: TimeSeriesInterval
  data_provider_type: DataProviderType
  data_provider: string
}

export interface TimeSeriesFilters {
  market_id?: string
  asset?: string
  interval?: TimeSeriesInterval
  start_time?: string
  end_time?: string
  data_provider?: string
}

// ============================================================================
// LENDING POOL TYPES
// ============================================================================

export type LoanStatus = 'active' | 'repaid' | 'liquidated'
export type PoolTransactionType = 'supply' | 'withdraw'

export interface LendingPool {
  id: string
  pool_address: string
  pool_contract_id: string
  reserve_asset: string
  loan_to_value: string
  base_rate: string
  slope1: string
  slope2: string
  liquidation_threshold: string
  liquidation_discount: string
  reserve_factor: string
  name: string
  title: string
  description: string
  created_at: string
}

export interface LendingTransaction {
  id: string
  wallet: string
  pool: string
  amount: number
  transaction_type: PoolTransactionType
  created_at: string
}

export interface Loan {
  id: string
  wallet: string
  pool: string
  amount: number
  collateral: string
  status: LoanStatus
  created_at: string
}

export interface LendingPoolFilters {
  reserve_asset?: string
  min_loan_to_value?: number
  max_loan_to_value?: number
}

// ============================================================================
// MUTATION TYPES
// ============================================================================

// Account Mutations
export interface CreateAccountInput {
  linked_account_id: string
  account_type: CradleAccountType
  status: CradleAccountStatus
}

export interface UpdateAccountStatusInput {
  account_id: string
  status: CradleAccountStatus
}

export interface CreateWalletInput {
  cradle_account_id: string
  address: string
  contract_id: string
}

// Asset Mutations
export interface CreateAssetInput {
  asset_manager: string
  token: string
  asset_type: AssetType
  name: string
  symbol: string
  decimals: number
  icon: string
}

// Market Mutations
export interface CreateMarketInput {
  name: string
  description: string
  icon: string
  asset_one: string
  asset_two: string
  market_type: MarketType
  market_status: MarketStatus
  market_regulation: MarketRegulation
}

export interface UpdateMarketStatusInput {
  market_id: string
  status: MarketStatus
}

// Order Mutations
export interface PlaceOrderInput {
  wallet: string
  market_id: string
  bid_asset: string
  ask_asset: string
  bid_amount: string
  ask_amount: string
  price: string
  mode: FillMode
  order_type: OrderType
}

export interface PlaceOrderResult {
  id: string
  status: OrderFillStatus
  bid_amount_filled: string
  ask_amount_filled: string
  matched_trades: string[]
}

// Time Series Mutations
export interface AddTimeSeriesRecordInput {
  market_id: string
  asset: string
  open: string
  high: string
  low: string
  close: string
  volume: string
  start_time: string
  end_time: string
  interval: TimeSeriesInterval
  data_provider_type: DataProviderType
  data_provider: string
}

// Lending Pool Mutations
export interface CreateLendingPoolInput {
  pool_address: string
  pool_contract_id: string
  reserve_asset: string
  loan_to_value: string
  base_rate: string
  slope1: string
  slope2: string
  liquidation_threshold: string
  liquidation_discount: string
  reserve_factor: string
  name: string
  title: string
  description: string
}

export interface SupplyLiquidityInput {
  wallet: string
  pool: string
  amount: number
}

export interface BorrowAssetInput {
  wallet: string
  pool: string
  amount: number
  collateral: string
}

export interface RepayBorrowInput {
  wallet: string
  loan: string
  amount: number
}

// Mutation Action Types
export type MutationAction =
  | { Accounts: { CreateAccount: CreateAccountInput } }
  | { Accounts: { UpdateAccountStatus: UpdateAccountStatusInput } }
  | { Accounts: { CreateWallet: CreateWalletInput } }
  | { Assets: { CreateAsset: CreateAssetInput } }
  | { Assets: { CreateExistingAsset: string } }
  | { Markets: { CreateMarket: CreateMarketInput } }
  | { Markets: { UpdateMarketStatus: UpdateMarketStatusInput } }
  | { OrderBook: { PlaceOrder: PlaceOrderInput } }
  | { OrderBook: { CancelOrder: string } }
  | { MarketTimeSeries: { AddRecord: AddTimeSeriesRecordInput } }
  | { Pool: { CreateLendingPool: CreateLendingPoolInput } }
  | { Pool: { SupplyLiquidity: SupplyLiquidityInput } }
  | { Pool: { BorrowAsset: BorrowAssetInput } }
  | { Pool: { RepayBorrow: RepayBorrowInput } }

export type MutationResponse =
  | { Accounts: { CreateAccount: string } }
  | { Accounts: { UpdateAccountStatus: null } }
  | { Accounts: { CreateWallet: string } }
  | { Assets: { CreateAsset: string } }
  | { Assets: { CreateExistingAsset: string } }
  | { Markets: { CreateMarket: string } }
  | { Markets: { UpdateMarketStatus: null } }
  | { OrderBook: { PlaceOrder: PlaceOrderResult } }
  | { OrderBook: { CancelOrder: null } }
  | { MarketTimeSeries: { AddRecord: string } }
  | { Pool: { CreateLendingPool: string } }
  | { Pool: { SupplyLiquidity: string } }
  | { Pool: { BorrowAsset: string } }
  | { Pool: { RepayBorrow: null } }

// ============================================================================
// TYPE GUARD HELPERS
// ============================================================================

/**
 * Type guard helpers for safely accessing mutation responses
 */
export const MutationResponseHelpers = {
  // Account helpers
  isCreateAccount(response: MutationResponse): response is { Accounts: { CreateAccount: string } } {
    return 'Accounts' in response && 'CreateAccount' in response.Accounts
  },
  isUpdateAccountStatus(
    response: MutationResponse
  ): response is { Accounts: { UpdateAccountStatus: null } } {
    return 'Accounts' in response && 'UpdateAccountStatus' in response.Accounts
  },
  isCreateWallet(response: MutationResponse): response is { Accounts: { CreateWallet: string } } {
    return 'Accounts' in response && 'CreateWallet' in response.Accounts
  },

  // Asset helpers
  isCreateAsset(response: MutationResponse): response is { Assets: { CreateAsset: string } } {
    return 'Assets' in response && 'CreateAsset' in response.Assets
  },
  isCreateExistingAsset(
    response: MutationResponse
  ): response is { Assets: { CreateExistingAsset: string } } {
    return 'Assets' in response && 'CreateExistingAsset' in response.Assets
  },

  // Market helpers
  isCreateMarket(response: MutationResponse): response is { Markets: { CreateMarket: string } } {
    return 'Markets' in response && 'CreateMarket' in response.Markets
  },
  isUpdateMarketStatus(
    response: MutationResponse
  ): response is { Markets: { UpdateMarketStatus: null } } {
    return 'Markets' in response && 'UpdateMarketStatus' in response.Markets
  },

  // Order helpers
  isPlaceOrder(
    response: MutationResponse
  ): response is { OrderBook: { PlaceOrder: PlaceOrderResult } } {
    return 'OrderBook' in response && 'PlaceOrder' in response.OrderBook
  },
  isCancelOrder(response: MutationResponse): response is { OrderBook: { CancelOrder: null } } {
    return 'OrderBook' in response && 'CancelOrder' in response.OrderBook
  },

  // Time series helpers
  isAddRecord(response: MutationResponse): response is { MarketTimeSeries: { AddRecord: string } } {
    return 'MarketTimeSeries' in response && 'AddRecord' in response.MarketTimeSeries
  },

  // Lending pool helpers
  isCreateLendingPool(
    response: MutationResponse
  ): response is { Pool: { CreateLendingPool: string } } {
    return 'Pool' in response && 'CreateLendingPool' in response.Pool
  },
  isSupplyLiquidity(response: MutationResponse): response is { Pool: { SupplyLiquidity: string } } {
    return 'Pool' in response && 'SupplyLiquidity' in response.Pool
  },
  isBorrowAsset(response: MutationResponse): response is { Pool: { BorrowAsset: string } } {
    return 'Pool' in response && 'BorrowAsset' in response.Pool
  },
  isRepayBorrow(response: MutationResponse): response is { Pool: { RepayBorrow: null } } {
    return 'Pool' in response && 'RepayBorrow' in response.Pool
  },
}

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

export interface CradleApiConfig {
  baseUrl?: string
  apiKey: string
  timeout?: number
}

// ============================================================================
// API CLIENT
// ============================================================================

export class CradleApiClient {
  private axiosInstance: AxiosInstance

  constructor(config: CradleApiConfig) {
    const baseUrl = config.baseUrl || 'http://localhost:3000'
    const timeout = config.timeout || 30000

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
    })

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * Make an authenticated HTTP request
   */
  private async request<T>(
    method: 'GET' | 'POST',
    path: string,
    body?: unknown,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: path,
        data: body,
      }

      // Remove auth header if not required
      if (!requiresAuth) {
        config.headers = {
          ...config.headers,
          Authorization: '',
        }
      }

      const response = await this.axiosInstance.request<ApiResponse<T>>(config)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // If we got a response with error data, return it
        if (error.response?.data) {
          return error.response.data as ApiResponse<T>
        }

        // Otherwise create error response
        return {
          success: false,
          data: null,
          error: error.message || 'Request failed',
        }
      }

      // Handle non-axios errors
      if (error instanceof Error) {
        return {
          success: false,
          data: null,
          error: error.message,
        }
      }

      return {
        success: false,
        data: null,
        error: 'Unknown error occurred',
      }
    }
  }

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  /**
   * Check API health status (no authentication required)
   */
  async health(): Promise<HealthResponse> {
    try {
      const response = await axios.get<HealthResponse>(
        `${this.axiosInstance.defaults.baseURL}/health`
      )
      return response.data
    } catch {
      throw new Error('Health check failed')
    }
  }

  // ============================================================================
  // ACCOUNTS API
  // ============================================================================

  /**
   * Get a cradle account by UUID
   */
  async getAccount(id: string): Promise<ApiResponse<CradleAccount>> {
    return this.request<CradleAccount>('GET', `/accounts/${id}`)
  }

  /**
   * Get account by linked account identifier
   */
  async getAccountByLinkedId(linkedId: string): Promise<ApiResponse<CradleAccount>> {
    return this.request<CradleAccount>('GET', `/accounts/linked/${linkedId}`)
  }

  /**
   * Get all wallets for an account (not yet implemented)
   */
  async getAccountWallets(accountId: string): Promise<ApiResponse<CradleWallet[]>> {
    return this.request<CradleWallet[]>('GET', `/accounts/${accountId}/wallets`)
  }

  // ============================================================================
  // WALLETS API
  // ============================================================================

  /**
   * Get a specific wallet by UUID
   */
  async getWallet(id: string): Promise<ApiResponse<CradleWallet>> {
    return this.request<CradleWallet>('GET', `/wallets/${id}`)
  }

  /**
   * Get wallet by account ID
   */
  async getWalletByAccountId(accountId: string): Promise<ApiResponse<CradleWallet>> {
    return this.request<CradleWallet>('GET', `/accounts/${accountId}/wallets`)
  }

  // ============================================================================
  // ASSETS API
  // ============================================================================

  /**
   * Get an asset by UUID
   */
  async getAsset(id: string): Promise<ApiResponse<Asset>> {
    return this.request<Asset>('GET', `/assets/${id}`)
  }

  async getAssets(): Promise<ApiResponse<Array<Asset>>> {
    return this.request<Array<Asset>>('GET', '/assets')
  }

  /**
   * Get asset by token identifier
   */
  async getAssetByToken(token: string): Promise<ApiResponse<Asset>> {
    return this.request<Asset>('GET', `/assets/token/${token}`)
  }

  /**
   * Get asset by asset manager identifier
   */
  async getAssetByManager(manager: string): Promise<ApiResponse<Asset>> {
    return this.request<Asset>('GET', `/assets/manager/${manager}`)
  }

  // ============================================================================
  // MARKETS API
  // ============================================================================

  /**
   * Get a market by UUID
   */
  async getMarket(id: string): Promise<ApiResponse<Market>> {
    return this.request<Market>('GET', `/markets/${id}`)
  }

  /**
   * Get all markets with optional filters
   */
  async getMarkets(filters?: MarketFilters): Promise<ApiResponse<Market[]>> {
    const params = new URLSearchParams()
    if (filters?.market_type) params.append('market_type', filters.market_type)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.regulation) params.append('regulation', filters.regulation)

    const query = params.toString()
    const path = query ? `/markets?${query}` : '/markets'
    return this.request<Market[]>('GET', path)
  }

  // ============================================================================
  // ORDERS API
  // ============================================================================

  /**
   * Get an order by UUID
   */
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>('GET', `/orders/${id}`)
  }

  /**
   * Get all orders with optional filters
   */
  async getOrders(filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    const params = new URLSearchParams()
    if (filters?.wallet) params.append('wallet', filters.wallet)
    if (filters?.market_id) params.append('market_id', filters.market_id)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.order_type) params.append('order_type', filters.order_type)
    if (filters?.from_date) params.append('from_date', filters.from_date)
    if (filters?.to_date) params.append('to_date', filters.to_date)

    const query = params.toString()
    const path = query ? `/orders?${query}` : '/orders'
    return this.request<Order[]>('GET', path)
  }

  // ============================================================================
  // TIME SERIES API
  // ============================================================================

  /**
   * Get a time series record by UUID
   */
  async getTimeSeriesRecord(id: string): Promise<ApiResponse<TimeSeriesRecord>> {
    return this.request<TimeSeriesRecord>('GET', `/time-series/${id}`)
  }

  /**
   * Get time series records with optional filters
   */
  async getTimeSeriesRecords(
    filters?: TimeSeriesFilters
  ): Promise<ApiResponse<TimeSeriesRecord[]>> {
    const params = new URLSearchParams()
    if (filters?.market_id) params.append('market_id', filters.market_id)
    if (filters?.asset) params.append('asset', filters.asset)
    if (filters?.interval) params.append('interval', filters.interval)
    if (filters?.start_time) params.append('start_time', filters.start_time)
    if (filters?.end_time) params.append('end_time', filters.end_time)
    if (filters?.data_provider) params.append('data_provider', filters.data_provider)

    const query = params.toString()
    const path = query ? `/time-series?${query}` : '/time-series'
    return this.request<TimeSeriesRecord[]>('GET', path)
  }

  // ============================================================================
  // LENDING POOLS API
  // ============================================================================

  /**
   * Get a lending pool by UUID
   */
  async getLendingPool(id: string): Promise<ApiResponse<LendingPool>> {
    return this.request<LendingPool>('GET', `/lending-pools/${id}`)
  }

  /**
   * Get all lending pools with optional filters
   */
  async getLendingPools(filters?: LendingPoolFilters): Promise<ApiResponse<LendingPool[]>> {
    const params = new URLSearchParams()
    if (filters?.reserve_asset) params.append('reserve_asset', filters.reserve_asset)
    if (filters?.min_loan_to_value !== undefined) {
      params.append('min_loan_to_value', filters.min_loan_to_value.toString())
    }
    if (filters?.max_loan_to_value !== undefined) {
      params.append('max_loan_to_value', filters.max_loan_to_value.toString())
    }

    const query = params.toString()
    const path = query ? `/lending-pools?${query}` : '/lending-pools'
    return this.request<LendingPool[]>('GET', path)
  }

  /**
   * Get lending transactions for a specific pool
   */
  async getLendingTransactions(poolId: string): Promise<ApiResponse<LendingTransaction[]>> {
    return this.request<LendingTransaction[]>('GET', `/lending-pools/${poolId}/transactions`)
  }

  /**
   * Get lending transactions for a specific wallet
   */
  async getLendingTransactionsByWallet(
    walletId: string
  ): Promise<ApiResponse<LendingTransaction[]>> {
    return this.request<LendingTransaction[]>('GET', `/lending-transactions/wallet/${walletId}`)
  }

  /**
   * Get loans for a specific pool
   */
  async getLoans(poolId: string): Promise<ApiResponse<Loan[]>> {
    return this.request<Loan[]>('GET', `/lending-pools/${poolId}/loans`)
  }

  /**
   * Get loans for a specific wallet
   */
  async getLoansByWallet(walletId: string): Promise<ApiResponse<Loan[]>> {
    return this.request<Loan[]>('GET', `/loans/wallet/${walletId}`)
  }

  /**
   * Get a specific loan by UUID
   */
  async getLoan(id: string): Promise<ApiResponse<Loan>> {
    return this.request<Loan>('GET', `/loans/${id}`)
  }

  // ============================================================================
  // MUTATIONS API
  // ============================================================================

  /**
   * Process a mutation action
   */
  async processMutation(action: MutationAction): Promise<ApiResponse<MutationResponse>> {
    return this.request<MutationResponse>('POST', '/process', action)
  }

  // ============================================================================
  // CONVENIENCE MUTATION METHODS
  // ============================================================================

  /**
   * Create a new account
   */
  async createAccount(input: CreateAccountInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Accounts: { CreateAccount: input },
    })
  }

  /**
   * Update account status
   */
  async updateAccountStatus(
    input: UpdateAccountStatusInput
  ): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Accounts: { UpdateAccountStatus: input },
    })
  }

  /**
   * Create a new wallet
   */
  async createWallet(input: CreateWalletInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Accounts: { CreateWallet: input },
    })
  }

  /**
   * Create a new asset
   */
  async createAsset(input: CreateAssetInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Assets: { CreateAsset: input },
    })
  }

  /**
   * Create an existing asset
   */
  async createExistingAsset(assetId: string): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Assets: { CreateExistingAsset: assetId },
    })
  }

  /**
   * Create a new market
   */
  async createMarket(input: CreateMarketInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Markets: { CreateMarket: input },
    })
  }

  /**
   * Update market status
   */
  async updateMarketStatus(input: UpdateMarketStatusInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Markets: { UpdateMarketStatus: input },
    })
  }

  /**
   * Place an order
   */
  async placeOrder(input: PlaceOrderInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      OrderBook: { PlaceOrder: input },
    })
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      OrderBook: { CancelOrder: orderId },
    })
  }

  /**
   * Add a time series record
   */
  async addTimeSeriesRecord(
    input: AddTimeSeriesRecordInput
  ): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      MarketTimeSeries: { AddRecord: input },
    })
  }

  /**
   * Create a lending pool
   */
  async createLendingPool(input: CreateLendingPoolInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Pool: { CreateLendingPool: input },
    })
  }

  /**
   * Supply liquidity to a lending pool
   */
  async supplyLiquidity(input: SupplyLiquidityInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Pool: { SupplyLiquidity: input },
    })
  }

  /**
   * Borrow an asset from a lending pool
   */
  async borrowAsset(input: BorrowAssetInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Pool: { BorrowAsset: input },
    })
  }

  /**
   * Repay a borrowed asset
   */
  async repayBorrow(input: RepayBorrowInput): Promise<ApiResponse<MutationResponse>> {
    return this.processMutation({
      Pool: { RepayBorrow: input },
    })
  }
}

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default CradleApiClient
