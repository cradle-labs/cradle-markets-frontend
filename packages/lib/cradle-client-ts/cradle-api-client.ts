// Cradle TypeScript client generated from IMPLEMENTATION_SUMMARY.md
// Provides typed helpers for REST endpoints and the Action Router.

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

type UUID = string
type Big = string

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Core enums
type CradleAccountType = 'retail' | 'institutional' | 'system'
type CradleAccountStatus = 'unverified' | 'verified' | 'suspended' | 'closed'
type CradleWalletStatus = 'active' | 'inactive' | 'suspended'
type AssetType = 'bridged' | 'native' | 'yield_bearing' | 'chain_native' | 'stablecoin' | 'volatile'
type MarketStatus = 'active' | 'inactive' | 'suspended'
type MarketType = 'spot' | 'derivative' | 'futures'
type MarketRegulation = 'regulated' | 'unregulated'
type FillMode = 'fill-or-kill' | 'immediate-or-cancel' | 'good-till-cancel'
type OrderStatus = 'open' | 'closed' | 'cancelled'
type OrderType = 'limit' | 'market'
type TimeSeriesInterval =
  | '15secs'
  | '30secs'
  | '45secs'
  | '1min'
  | '5min'
  | '15min'
  | '30min'
  | '1hr'
  | '4hr'
  | '1day'
  | '1week'
type DataProviderType = 'order_book' | 'exchange' | 'aggregated'
type LoanStatus = 'active' | 'repaid' | 'liquidated'
type PoolTransactionType = 'supply' | 'withdraw'
type ListingStatus = 'pending' | 'open' | 'closed' | 'paused' | 'cancelled'
type OrderFillStatus = 'Partial' | 'Filled' | 'Cancelled'

// Records
interface CradleAccountRecord {
  id: UUID
  linked_account_id: string
  created_at: string
  account_type: CradleAccountType
  status: CradleAccountStatus
}

interface CradleWalletAccountRecord {
  id: UUID
  cradle_account_id: UUID
  address: string
  contract_id: string
  created_at: string
  status: CradleWalletStatus
}

interface AssetBookRecord {
  id: UUID
  asset_manager: string
  token: string
  created_at: string
  asset_type: AssetType
  name: string
  symbol: string
  decimals: number
  icon?: string | null
}

interface MarketRecord {
  id: UUID
  name: string
  description?: string | null
  icon?: string | null
  asset_one: UUID
  asset_two: UUID
  created_at: string
  market_type: MarketType
  market_status: MarketStatus
  market_regulation: MarketRegulation
}

interface OrderBookRecord {
  id: UUID
  wallet: UUID
  market_id: UUID
  bid_asset: UUID
  ask_asset: UUID
  bid_amount: Big
  ask_amount: Big
  price: Big
  filled_bid_amount: Big
  filled_ask_amount: Big
  mode: FillMode
  status: OrderStatus
  created_at: string
  filled_at?: string | null
  cancelled_at?: string | null
  expires_at?: string | null
  order_type: OrderType
}

interface NewOrderBookRecord {
  wallet: UUID
  market_id: UUID
  bid_asset: UUID
  ask_asset: UUID
  bid_amount: Big
  ask_amount: Big
  price: Big
  mode?: FillMode
  expires_at?: string | null
  order_type?: OrderType
}

interface MarketTimeSeriesRecord {
  id: UUID
  market_id: UUID
  asset: UUID
  open: Big
  high: Big
  low: Big
  close: Big
  volume: Big
  created_at: string
  start_time: string
  end_time: string
  interval: TimeSeriesInterval
  data_provider_type: DataProviderType
  data_provider?: string | null
}

interface LendingPoolRecord {
  id: UUID
  pool_address: string
  pool_contract_id: string
  reserve_asset: UUID
  yield_asset: UUID
  treasury_wallet: UUID
  reserve_wallet: UUID
  pool_account_id: UUID
  loan_to_value: Big
  base_rate: Big
  slope1: Big
  slope2: Big
  liquidation_threshold: Big
  liquidation_discount: Big
  reserve_factor: Big
  name?: string | null
  title?: string | null
  description?: string | null
  created_at: string
  updated_at: string
}

interface LendingPoolSnapShotRecord {
  id: UUID
  lending_pool_id: UUID
  total_supply: Big
  total_borrow: Big
  available_liquidity: Big
  utilization_rate: Big
  supply_apy: Big
  borrow_apy: Big
  created_at: string
}

interface LoanRecord {
  id: UUID
  account_id: UUID
  wallet_id: UUID
  pool: UUID
  borrow_index: Big
  principal_amount: Big
  created_at: string
  status: LoanStatus
  transaction?: string | null
  collateral_asset: UUID
}

interface LoanRepaymentsRecord {
  id: UUID
  loan_id: UUID
  repayment_amount: Big
  repayment_date: string
  transaction?: string | null
}

// CompanyRow interface - kept for potential future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CompanyRow {
  id: UUID
  name: string
  description: string
  listed_at?: string | null
  legal_documents: string
  beneficiary_wallet: UUID
}

interface CradleNativeListingRow {
  id: UUID
  listing_contract_id: string
  name: string
  description: string
  documents: string
  company: UUID
  status: ListingStatus
  created_at: string
  opened_at?: string | null
  stopped_at?: string | null
  listed_asset: UUID
  purchase_with_asset: UUID
  purchase_price: Big
  max_supply: Big
  treasury: UUID
  shadow_asset: UUID
}

// Unknown shapes from backend; kept permissive for now.
type ListingStats = Record<string, unknown>
type GetPoolStatsOutput = Record<string, unknown>
type GetUserBorrowPositionOutput = Record<string, unknown>
type GetUserDepositPositonOutput = Record<string, unknown>
type RepaymentAmount = Record<string, unknown>

// Onramp types
interface OnRampRequest {
  token: UUID
  amount: Big
  wallet_id: UUID
  result_page: string
  email: string
}

interface OnRampResponse {
  reference: string
  authorization_url: string
  access_code: string
}

// Action Router types
type AccountsProcessorInput =
  | {
      CreateAccount: {
        linked_account_id: string
        account_type?: CradleAccountType
        status?: CradleAccountStatus
      }
    }
  | { CreateAccountWallet: { cradle_account_id: UUID; status?: CradleWalletStatus } }
  | { UpdateAccountStatus: { cradle_account_id: UUID; status: CradleAccountStatus } }
  | { UpdateAccountType: { cradle_account_id: UUID; account_type: CradleAccountType } }
  | { UpdateAccountWalletStatusById: { wallet_id: UUID; status: CradleWalletStatus } }
  | { UpdateAccountWalletStatusByAccount: { cradle_account_id: UUID; status: CradleWalletStatus } }
  | { DeleteAccount: { ById: UUID } | { ByLinkedAccount: string } }
  | { DeleteWallet: { ById: UUID } | { ByOwner: UUID } }
  | { GetAccount: { ByID: UUID } | { ByLinkedAccount: string } }
  | { GetWallet: { ById: UUID } | { ByCradleAccount: UUID } }
  | { GetAccounts: Record<string, never> }
  | { GetWallets: Record<string, never> }
  | { AssociateTokenToWallet: { wallet_id: UUID; token: UUID } }
  | { GrantKYC: { wallet_id: UUID; token: UUID } }
  | {
      WithdrawTokens: {
        withdrawal_type: 'Fiat' | 'Crypto'
        to: string
        amount: Big
        token: string
        from: UUID
      }
    }
  | { HandleAssociateAssets: UUID }
  | { HandleKYCAssets: UUID }

type AccountsProcessorOutput =
  | { CreateAccount: { id: UUID; wallet_id: UUID } }
  | { CreateAccountWallet: { id: UUID } }
  | { UpdateAccountStatus: null }
  | { UpdateAccountType: null }
  | { UpdateAccountWalletStatus: null }
  | { UpdateAccountWalletStatusById: null }
  | { UpdateAccountWalletStatusByAccount: null }
  | { GetAccount: CradleAccountRecord }
  | { GetWallet: CradleWalletAccountRecord }
  | { GetAccounts: null }
  | { GetWallets: null }
  | { DeleteAccount: null }
  | { DeleteWallet: null }
  | { AssociateTokenToWallet: null }
  | { GrantKYC: null }
  | { WithdrawTokens: null }
  | { HandleAssociateAssets: null }
  | { HandleKYCAssets: null }

type AssetBookProcessorInput =
  | {
      CreateNewAsset: {
        asset_type: AssetType
        name: string
        symbol: string
        decimals: number
        icon: string
      }
    }
  | {
      CreateExistingAsset: {
        asset_manager?: string
        token: string
        asset_type: AssetType
        name: string
        symbol: string
        decimals: number
        icon: string
      }
    }
  | { GetAsset: { ById: UUID } | { ByToken: string } | { ByAssetManager: string } }

type AssetBookProcessorOutput =
  | { CreateNewAsset: UUID }
  | { CreateExistingAsset: UUID }
  | { GetAsset: AssetBookRecord }

type MarketProcessorInput =
  | {
      CreateMarket: {
        name: string
        description?: string | null
        icon?: string | null
        asset_one: UUID
        asset_two: UUID
        market_type?: MarketType
        market_status?: MarketStatus
        market_regulation?: MarketRegulation
      }
    }
  | { UpdateMarketStatus: { market_id: UUID; status: MarketStatus } }
  | { UpdateMarketType: { market_id: UUID; market_type: MarketType } }
  | { UpdateMarketRegulation: { market_id: UUID; regulation: MarketRegulation } }
  | { GetMarket: UUID }
  | {
      GetMarkets: { status?: MarketStatus; market_type?: MarketType; regulation?: MarketRegulation }
    }

type MarketProcessorOutput =
  | { CreateMarket: UUID }
  | { UpdateMarketStatus: null }
  | { UpdateMarketType: null }
  | { UpdateMarketRegulation: null }
  | { GetMarket: MarketRecord }
  | { GetMarkets: MarketRecord[] }

type MarketTimeSeriesProcessorInput =
  | {
      AddRecord: {
        market_id: UUID
        asset: UUID
        open: Big
        high: Big
        low: Big
        close: Big
        volume: Big
        start_time: string
        end_time: string
        interval?: TimeSeriesInterval
        data_provider_type?: DataProviderType
        data_provider?: string | null
      }
    }
  | {
      GetHistory: {
        market_id: UUID
        duration_secs: Big
        interval: TimeSeriesInterval
        asset_id: UUID
      }
    }

type MarketTimeSeriesProcessorOutput =
  | { AddRecord: UUID }
  | { GetHistory: MarketTimeSeriesRecord[] }

type OrderBookProcessorInput =
  | { PlaceOrder: NewOrderBookRecord }
  | { GetOrder: UUID }
  | {
      GetOrders: {
        wallet?: UUID
        market_id?: UUID
        status?: OrderStatus
        order_type?: OrderType
        mode?: FillMode
      }
    }

type OrderBookProcessorOutput =
  | {
      PlaceOrder: {
        id: UUID
        status: OrderFillStatus
        bid_amount_filled: Big
        ask_amount_filled: Big
        matched_trades: UUID[]
      }
    }
  | { GetOrder: OrderBookRecord }
  | { GetOrders: OrderBookRecord[] }

type LendingPoolFunctionsInput =
  | {
      CreateLendingPool: {
        pool_address: string
        pool_contract_id: string
        reserve_asset: UUID
        loan_to_value: Big
        base_rate: Big
        slope1: Big
        slope2: Big
        liquidation_threshold: Big
        liquidation_discount: Big
        reserve_factor: Big
        name?: string | null
        title?: string | null
        description?: string | null
        yield_asset: UUID
        treasury_wallet: UUID
        reserve_wallet: UUID
        pool_account_id: UUID
      }
    }
  | { GetLendingPool: { ByName: string } | { ByAddress: string } | { ById: UUID } }
  | { CreateSnapShot: UUID }
  | { GetSnapShot: UUID }
  | { SupplyLiquidity: { wallet: UUID; pool: UUID; amount: number } }
  | { WithdrawLiquidity: { wallet: UUID; pool: UUID; amount: number } }
  | { BorrowAsset: { wallet: UUID; pool: UUID; amount: number; collateral: UUID } }
  | { RepayBorrow: { wallet: UUID; loan: UUID; amount: number } }
  | { LiquidatePosition: { wallet: UUID; loan: UUID; amount: number } }

type LendingPoolFunctionsOutput =
  | { CreateLendingPool: UUID }
  | { GetLendingPool: LendingPoolRecord }
  | { CreateSnapShot: UUID }
  | { GetSnapShot: LendingPoolSnapShotRecord }
  | { SupplyLiquidity: UUID }
  | { WithdrawLiquidity: UUID }
  | { BorrowAsset: UUID }
  | { RepayBorrow: null }
  | { LiquidatePosition: null }

type CradleNativeListingFunctionsInput =
  | { CreateCompany: { name: string; description: string; legal_documents: string } }
  | {
      CreateListing: {
        name: string
        description: string
        documents: string
        company: UUID
        asset:
          | { Existing: UUID }
          | {
              New: {
                asset_type: AssetType
                name: string
                symbol: string
                decimals: number
                icon: string
              }
            }
        purchase_asset: UUID
        purchase_price: Big
        max_supply: Big
      }
    }
  | { Purchase: { wallet: UUID; amount: Big; listing: UUID } }
  | { ReturnAsset: { wallet: UUID; amount: Big; listing: UUID } }
  | { WithdrawToBeneficiary: { amount: Big; listing: UUID } }
  | { GetStats: UUID }
  | { GetFee: { listing_id: UUID; amount: Big } }

type CradleNativeListingFunctionsOutput =
  | { CreateCompany: UUID }
  | { CreateListing: UUID }
  | { Purchase: null }
  | { ReturnAsset: null }
  | { WithdrawToBeneficiary: null }
  | { GetStats: ListingStats }
  | { GetFee: number }

type ActionRouterInput =
  | { Accounts: AccountsProcessorInput }
  | { AssetBook: AssetBookProcessorInput }
  | { Markets: MarketProcessorInput }
  | { MarketTimeSeries: MarketTimeSeriesProcessorInput }
  | { OrderBook: OrderBookProcessorInput }
  | { Pool: LendingPoolFunctionsInput }
  | { Listing: CradleNativeListingFunctionsInput }

type ActionRouterOutput =
  | { Accounts: AccountsProcessorOutput }
  | { AssetBook: AssetBookProcessorOutput }
  | { Markets: MarketProcessorOutput }
  | { MarketTimeSeries: MarketTimeSeriesProcessorOutput }
  | { OrderBook: OrderBookProcessorOutput }
  | { Pool: LendingPoolFunctionsOutput }
  | { Listing: CradleNativeListingFunctionsOutput }

export interface CradleClientOptions {
  baseUrl: string
  apiKey?: string
  axiosInstance?: AxiosInstance
  timeoutMs?: number
  userAgent?: string
}

class CradleClient {
  private readonly apiKey?: string
  private readonly axios: AxiosInstance
  private readonly userAgent?: string

  constructor(options: CradleClientOptions) {
    const baseUrl = options.baseUrl.replace(/\/+$/, '')
    this.apiKey = options.apiKey
    this.userAgent = options.userAgent
    this.axios =
      options.axiosInstance ??
      axios.create({
        baseURL: baseUrl,
        timeout: options.timeoutMs ?? 180000,
      })
  }

  async health(): Promise<ApiResponse<{ status: 'ok' }>> {
    return this.get('/health', { auth: false })
  }

  async process(body: ActionRouterInput): Promise<ApiResponse<ActionRouterOutput>> {
    const keys = Object.keys(body)
    if (keys.length !== 1) {
      throw new Error('Action Router payload must contain exactly one top-level key')
    }
    return this.post('/process', body)
  }

  // Accounts & wallets
  getAccount(id: UUID): Promise<ApiResponse<CradleAccountRecord>> {
    return this.get(`/accounts/${id}`)
  }

  getAccountByLinked(linkedId: string): Promise<ApiResponse<CradleAccountRecord>> {
    return this.get(`/accounts/linked/${linkedId}`)
  }

  getWalletsForAccount(accountId: UUID): Promise<ApiResponse<CradleWalletAccountRecord>> {
    return this.get(`/accounts/${accountId}/wallets`)
  }

  getWallet(id: UUID): Promise<ApiResponse<CradleWalletAccountRecord>> {
    return this.get(`/wallets/${id}`)
  }

  getWalletByAccount(accountId: UUID): Promise<ApiResponse<CradleWalletAccountRecord>> {
    return this.get(`/wallets/account/${accountId}`)
  }

  getBalances(accountId: UUID): Promise<ApiResponse<Array<{ token: string; balance: Big }>>> {
    return this.get(`/balances/${accountId}`)
  }

  getBalance(
    walletId: UUID,
    assetId: UUID
  ): Promise<
    ApiResponse<{
      balance: number
      before_deductions: number
      deductions: number
      decimals: number
    }>
  > {
    return this.get(`/balance/${walletId}/${assetId}`)
  }

  // Assets
  listAssets(): Promise<ApiResponse<AssetBookRecord[]>> {
    return this.get('/assets')
  }

  getAsset(id: UUID): Promise<ApiResponse<AssetBookRecord>> {
    return this.get(`/assets/${id}`)
  }

  getAssetByToken(token: string): Promise<ApiResponse<AssetBookRecord>> {
    return this.get(`/assets/token/${token}`)
  }

  getAssetsByManager(manager: string): Promise<ApiResponse<AssetBookRecord>> {
    return this.get(`/assets/manager/${manager}`)
  }

  // Markets
  listMarkets(): Promise<ApiResponse<MarketRecord[]>> {
    return this.get('/markets')
  }

  getMarket(id: UUID): Promise<ApiResponse<MarketRecord>> {
    return this.get(`/markets/${id}`)
  }

  // Orders
  listOrders(filters?: {
    wallet?: UUID
    market_id?: UUID
    status?: OrderStatus
    order_type?: OrderType
    mode?: FillMode
  }): Promise<ApiResponse<OrderBookRecord[]>> {
    const query = this.queryString(filters)
    return this.get(`/orders${query}`)
  }

  getOrder(id: UUID): Promise<ApiResponse<OrderBookRecord>> {
    return this.get(`/orders/${id}`)
  }

  // Time series
  getTimeSeriesHistory(params: {
    market: UUID
    duration_secs: Big | number
    interval: TimeSeriesInterval
    asset_id: UUID
  }): Promise<ApiResponse<MarketTimeSeriesRecord[]>> {
    const query = this.queryString({
      market: params.market,
      duration_secs: params.duration_secs,
      interval: params.interval,
      asset_id: params.asset_id,
    })
    return this.get(`/time-series/history${query}`)
  }

  // Faucet
  faucet(body: { asset: UUID; account: UUID }): Promise<ApiResponse<void>> {
    return this.post('/faucet', body)
  }

  // Listings
  listListings(filters?: {
    company?: UUID
    listed_asset?: UUID
    purchase_asset?: UUID
    status?: ListingStatus
  }): Promise<ApiResponse<CradleNativeListingRow[]>> {
    const query = this.queryString(filters)
    return this.get(`/listings${query}`)
  }

  getListing(id: UUID): Promise<ApiResponse<CradleNativeListingRow>> {
    return this.get(`/listings/${id}`)
  }

  // Lending
  listPools(): Promise<ApiResponse<LendingPoolRecord[]>> {
    return this.get('/pools')
  }

  getPool(id: UUID): Promise<ApiResponse<LendingPoolRecord>> {
    return this.get(`/pools/${id}`)
  }

  getLoans(walletId: UUID): Promise<ApiResponse<LoanRecord[]>> {
    return this.get(`/loans/${walletId}`)
  }

  getPoolStats(id: UUID): Promise<ApiResponse<GetPoolStatsOutput>> {
    return this.get(`/pool-stats/${id}`)
  }

  getLoanPosition(loanId: UUID): Promise<ApiResponse<GetUserBorrowPositionOutput>> {
    return this.get(`/loan-position/${loanId}`)
  }

  getDepositPosition(
    poolId: UUID,
    walletId: UUID
  ): Promise<ApiResponse<GetUserDepositPositonOutput>> {
    return this.get(`/pools/deposit/${poolId}/${walletId}`)
  }

  getLoanRepayments(loanId: UUID): Promise<ApiResponse<LoanRepaymentsRecord[]>> {
    return this.get(`/loans/repayments/${loanId}`)
  }

  getRepaymentAmount(loanId: UUID): Promise<ApiResponse<RepaymentAmount>> {
    return this.get(`/loan/${loanId}`)
  }

  // Onramp
  onrampRequest(body: OnRampRequest): Promise<ApiResponse<OnRampResponse>> {
    return this.post('/onramp-request', body)
  }

  private async get<T>(path: string, opts?: { auth?: boolean }): Promise<T> {
    return this.request<T>(path, { method: 'GET' }, opts)
  }

  private async post<T>(path: string, body: unknown, opts?: { auth?: boolean }): Promise<T> {
    return this.request<T>(
      path,
      {
        method: 'POST',
        data: body,
      },
      opts
    )
  }

  private async request<T>(
    path: string,
    config: AxiosRequestConfig,
    opts?: { auth?: boolean }
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string> | undefined),
    }

    if (opts?.auth !== false) {
      if (!this.apiKey) {
        throw new Error('API key is required for authenticated requests')
      }
      headers.Authorization = `Bearer ${this.apiKey}`
    }

    if (this.userAgent) {
      headers['User-Agent'] = this.userAgent
    }

    try {
      const response = await this.axios.request<ApiResponse<unknown>>({
        ...config,
        url: path,
        headers,
      })
      const payload = response.data

      // If payload has success field, it's already in ApiResponse format
      if (payload && typeof payload === 'object' && 'success' in payload) {
        if (payload.success === false) {
          throw new Error((payload as ApiResponse<unknown>).error ?? 'Request failed')
        }
        return payload as unknown as T
      }

      // If payload doesn't have success field but HTTP status is 200, wrap it
      // This handles endpoints like /health that return data directly
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          data: payload,
        } as unknown as T
      }

      // If we get here, something unexpected happened
      return payload as unknown as T
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = (error.response?.data as ApiResponse<unknown> | undefined)?.error
        const message = apiError ?? error.message
        const status = error.response?.status
        throw new Error(
          status ? `Request failed (${status}): ${message}` : `Request failed: ${message}`
        )
      }
      throw error as Error
    }
  }

  private queryString(
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    if (!params) return ''
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        search.set(key, String(value))
      }
    })
    const query = search.toString()
    return query ? `?${query}` : ''
  }
}

// Export the client class (not a type)
export { CradleClient }
export default CradleClient

// Export types using 'export type' for isolatedModules compatibility
export type {
  ApiResponse,
  AssetBookRecord,
  AssetType,
  CradleAccountRecord,
  CradleAccountStatus,
  CradleAccountType,
  CradleNativeListingRow,
  CradleWalletAccountRecord,
  DataProviderType,
  FillMode,
  ListingStatus,
  LoanRecord,
  LoanRepaymentsRecord,
  LoanStatus,
  MarketRecord,
  MarketRegulation,
  MarketStatus,
  MarketTimeSeriesRecord,
  MarketTimeSeriesProcessorInput,
  MarketTimeSeriesProcessorOutput,
  MarketType,
  NewOrderBookRecord,
  OrderBookRecord,
  OrderFillStatus,
  OrderStatus,
  OrderType,
  TimeSeriesInterval,
  UUID,
  Big,
  ActionRouterInput,
  ActionRouterOutput,
  ListingStats,
  LendingPoolRecord,
  LendingPoolSnapShotRecord,
  GetPoolStatsOutput,
  GetUserBorrowPositionOutput,
  GetUserDepositPositonOutput,
  RepaymentAmount,
  PoolTransactionType,
  OnRampRequest,
  OnRampResponse,
}
