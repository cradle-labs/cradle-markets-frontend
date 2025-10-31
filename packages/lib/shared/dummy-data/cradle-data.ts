/**
 * Dummy data for Cradle Platform
 * Mock data for development and testing purposes
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
} from '../../cradle-client-ts/types'

// ============================================================================
// ACCOUNTS
// ============================================================================

export const mockAccounts: CradleAccount[] = [
  {
    id: 'acc-001-retail-john',
    linked_account_id: 'user-john-doe-123',
    created_at: '2024-01-15T10:30:00Z',
    account_type: 'retail',
    status: 'verified',
  },
  {
    id: 'acc-002-retail-jane',
    linked_account_id: 'user-jane-smith-456',
    created_at: '2024-02-20T14:45:00Z',
    account_type: 'retail',
    status: 'verified',
  },
  {
    id: 'acc-003-institutional-blackrock',
    linked_account_id: 'inst-blackrock-789',
    created_at: '2024-01-10T08:00:00Z',
    account_type: 'institutional',
    status: 'verified',
  },
  {
    id: 'acc-004-retail-bob',
    linked_account_id: 'user-bob-wilson-321',
    created_at: '2024-03-05T16:20:00Z',
    account_type: 'retail',
    status: 'unverified',
  },
  {
    id: 'acc-005-institutional-vanguard',
    linked_account_id: 'inst-vanguard-654',
    created_at: '2024-01-25T11:15:00Z',
    account_type: 'institutional',
    status: 'verified',
  },
]

// ============================================================================
// WALLETS
// ============================================================================

export const mockWallets: CradleWallet[] = [
  {
    id: 'wallet-001-john',
    cradle_account_id: 'acc-001-retail-john',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    contract_id: 'CDQWERTYUIOPASDFGHJKLZXCVBNM123456',
    created_at: '2024-01-15T10:35:00Z',
    status: 'active',
  },
  {
    id: 'wallet-002-jane',
    cradle_account_id: 'acc-002-retail-jane',
    address: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
    contract_id: 'CDZXCVBNMASDFGHJKLQWERTYUIOP654321',
    created_at: '2024-02-20T14:50:00Z',
    status: 'active',
  },
  {
    id: 'wallet-003-blackrock',
    cradle_account_id: 'acc-003-institutional-blackrock',
    address: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    contract_id: 'CDASDFGHJKLQWERTYUIOPZXCVBNM789012',
    created_at: '2024-01-10T08:10:00Z',
    status: 'active',
  },
  {
    id: 'wallet-004-bob',
    cradle_account_id: 'acc-004-retail-bob',
    address: '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
    contract_id: 'CDPOIUYTREWQLKJHGFDSAMNBVCXZ345678',
    created_at: '2024-03-05T16:25:00Z',
    status: 'inactive',
  },
  {
    id: 'wallet-005-vanguard',
    cradle_account_id: 'acc-005-institutional-vanguard',
    address: '0xdbF03B407c01E7cD3CBea99509d93f8DDDC8C6FB',
    contract_id: 'CDMNBVCXZASDFGHJKLPOIUYTREWQ901234',
    created_at: '2024-01-25T11:20:00Z',
    status: 'active',
  },
]

// ============================================================================
// ASSETS
// ============================================================================

export const mockAssets: Asset[] = [
  // Stablecoins (used in lending pools)
  {
    id: 'asset-usdc',
    asset_manager: 'CIRCLE',
    token: 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    created_at: '2024-01-01T00:00:00Z',
    asset_type: 'stablecoin',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    icon: '/images/tokens/usdc.svg',
  },
  {
    id: 'asset-usdt',
    asset_manager: 'TETHER',
    token: 'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    created_at: '2024-01-01T00:00:00Z',
    asset_type: 'stablecoin',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    icon: '/images/tokens/usdt.svg',
  },

  // Tokenized NSE Securities
  {
    id: 'asset-safaricom',
    asset_manager: 'SAFARICOM_PLC',
    token: 'SAFSAFSAFSAFSAFSAFSAFSAFSAFSAFSAF',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Safaricom',
    symbol: 'cSAF',
    decimals: 2,
    icon: '/images/tokens/safaricom.svg',
  },
  {
    id: 'asset-equity',
    asset_manager: 'EQUITY_BANK',
    token: 'EQTYEQTYEQTYEQTYEQTYEQTYEQTYEQTY',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Equity Bank',
    symbol: 'cEQTY',
    decimals: 2,
    icon: '/images/tokens/equity.svg',
  },
  {
    id: 'asset-kcb',
    asset_manager: 'KCB_GROUP',
    token: 'KCBKCBKCBKCBKCBKCBKCBKCBKCBKCBKCB',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'KCB Group',
    symbol: 'cKCB',
    decimals: 2,
    icon: '/images/tokens/kcb.svg',
  },
  {
    id: 'asset-eabl',
    asset_manager: 'EABL_LIMITED',
    token: 'EABLEABLEABLEABLEABLEABLEABLEABL',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'EABL',
    symbol: 'cEABL',
    decimals: 2,
    icon: '/images/tokens/eabl.svg',
  },
  {
    id: 'asset-coop',
    asset_manager: 'COOP_BANK',
    token: 'COOPCOOPCOOPCOOPCOOPCOOPCOOPCOCP',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Co-operative Bank',
    symbol: 'cCOOP',
    decimals: 2,
    icon: '/images/tokens/coop.svg',
  },
  {
    id: 'asset-bat',
    asset_manager: 'BAT_KENYA',
    token: 'BATBATBATBATBATBATBATBATBATBATBAT',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'BAT Kenya',
    symbol: 'cBAT',
    decimals: 2,
    icon: '/images/tokens/bat.svg',
  },
  {
    id: 'asset-bamburi',
    asset_manager: 'BAMBURI_CEMENT',
    token: 'BMBBMBBMBBMBBMBBMBBMBBMBBMBBMBBMB',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Bamburi Cement',
    symbol: 'cBMB',
    decimals: 2,
    icon: '/images/tokens/bamburi.svg',
  },
  {
    id: 'asset-ncba',
    asset_manager: 'NCBA_GROUP',
    token: 'NCBANCBANCBANCBANCBANCBANCBANCBA',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'NCBA Group',
    symbol: 'cNCBA',
    decimals: 2,
    icon: '/images/tokens/ncba.svg',
  },
  {
    id: 'asset-stanbic',
    asset_manager: 'STANBIC_HOLDINGS',
    token: 'SBICSBICSBICSBICSBICSBICSBICSBIC',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Stanbic Holdings',
    symbol: 'cSBIC',
    decimals: 2,
    icon: '/images/tokens/stanbic.svg',
  },
  {
    id: 'asset-scb',
    asset_manager: 'STANDARD_CHARTERED_KE',
    token: 'SCBSCBSCBSCBSCBSCBSCBSCBSCBSCBSCB',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Standard Chartered Kenya',
    symbol: 'cSCB',
    decimals: 2,
    icon: '/images/tokens/scb.svg',
  },
  {
    id: 'asset-britam',
    asset_manager: 'BRITAM_HOLDINGS',
    token: 'BRITBRITBRITBRITBRITBRITBRITBRIT',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Britam',
    symbol: 'cBRIT',
    decimals: 2,
    icon: '/images/tokens/britam.svg',
  },
  {
    id: 'asset-absa',
    asset_manager: 'ABSA_BANK_KENYA',
    token: 'ABSAABSAABSAABSAABSAABSAABSAABSA',
    created_at: '2024-01-05T09:00:00Z',
    asset_type: 'native',
    name: 'Absa Bank Kenya',
    symbol: 'cABSA',
    decimals: 2,
    icon: '/images/tokens/absa.svg',
  },
]

// ============================================================================
// MARKETS
// ============================================================================

export const mockMarkets: Market[] = [
  // Tokenized NSE Stock Markets
  {
    id: 'market-safaricom-usdc',
    name: 'cSAF/USDC',
    description: 'Tokenized Safaricom stock traded against USDC',
    icon: '/images/tokens/safaricom.svg',
    asset_one: 'asset-safaricom',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-equity-usdc',
    name: 'cEQTY/USDC',
    description: 'Tokenized Equity Bank stock traded against USDC',
    icon: '/images/tokens/equity.svg',
    asset_one: 'asset-equity',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-kcb-usdc',
    name: 'cKCB/USDC',
    description: 'Tokenized KCB Group stock traded against USDC',
    icon: '/images/tokens/kcb.svg',
    asset_one: 'asset-kcb',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-eabl-usdc',
    name: 'cEABL/USDC',
    description: 'Tokenized EABL stock traded against USDC',
    icon: '/images/tokens/eabl.svg',
    asset_one: 'asset-eabl',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-coop-usdc',
    name: 'cCOOP/USDC',
    description: 'Tokenized Co-operative Bank stock traded against USDC',
    icon: '/images/tokens/coop.svg',
    asset_one: 'asset-coop',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-bat-usdc',
    name: 'cBAT/USDC',
    description: 'Tokenized BAT Kenya stock traded against USDC',
    icon: '/images/tokens/bat.svg',
    asset_one: 'asset-bat',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-bamburi-usdc',
    name: 'cBMB/USDC',
    description: 'Tokenized Bamburi Cement stock traded against USDC',
    icon: '/images/tokens/bamburi.svg',
    asset_one: 'asset-bamburi',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-ncba-usdc',
    name: 'cNCBA/USDC',
    description: 'Tokenized NCBA Group stock traded against USDC',
    icon: '/images/tokens/ncba.svg',
    asset_one: 'asset-ncba',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-stanbic-usdc',
    name: 'cSBIC/USDC',
    description: 'Tokenized Stanbic Holdings stock traded against USDC',
    icon: '/images/tokens/stanbic.svg',
    asset_one: 'asset-stanbic',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-scb-usdc',
    name: 'cSCB/USDC',
    description: 'Tokenized Standard Chartered Kenya stock traded against USDC',
    icon: '/images/tokens/scb.svg',
    asset_one: 'asset-scb',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-britam-usdc',
    name: 'cBRIT/USDC',
    description: 'Tokenized Britam stock traded against USDC',
    icon: '/images/tokens/britam.svg',
    asset_one: 'asset-britam',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-absa-usdc',
    name: 'cABSA/USDC',
    description: 'Tokenized Absa Bank Kenya stock traded against USDC',
    icon: '/images/tokens/absa.svg',
    asset_one: 'asset-absa',
    asset_two: 'asset-usdc',
    created_at: '2024-01-10T09:00:00Z',
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  },

  // Futures & Derivatives
  {
    id: 'market-safaricom-futures',
    name: 'cSAF-FUT-Q1-2025',
    description: 'Safaricom Q1 2025 futures contract',
    icon: '/images/tokens/safaricom.svg',
    asset_one: 'asset-safaricom',
    asset_two: 'asset-usdc',
    created_at: '2024-02-01T09:00:00Z',
    market_type: 'futures',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-equity-perpetual',
    name: 'cEQTY-PERP',
    description: 'Equity Bank perpetual futures',
    icon: '/images/tokens/equity.svg',
    asset_one: 'asset-equity',
    asset_two: 'asset-usdc',
    created_at: '2024-01-15T14:00:00Z',
    market_type: 'derivative',
    market_status: 'active',
    market_regulation: 'regulated',
  },
  {
    id: 'market-kcb-perpetual',
    name: 'cKCB-PERP',
    description: 'KCB Group perpetual futures',
    icon: '/images/tokens/kcb.svg',
    asset_one: 'asset-kcb',
    asset_two: 'asset-usdc',
    created_at: '2024-01-15T14:00:00Z',
    market_type: 'derivative',
    market_status: 'active',
    market_regulation: 'regulated',
  },
]

// ============================================================================
// ORDERS
// ============================================================================

export const mockOrders: Order[] = [
  {
    id: 'order-001',
    wallet: 'wallet-001-john',
    market_id: 'market-safaricom-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-safaricom',
    bid_amount: '2650.00',
    ask_amount: '100.00',
    price: '26.50',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T10:30:00Z',
  },
  {
    id: 'order-002',
    wallet: 'wallet-002-jane',
    market_id: 'market-equity-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-equity',
    bid_amount: '6587.50',
    ask_amount: '125.00',
    price: '52.70',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T11:15:00Z',
  },
  {
    id: 'order-003',
    wallet: 'wallet-003-blackrock',
    market_id: 'market-kcb-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-kcb',
    bid_amount: '382500.00',
    ask_amount: '10000.00',
    price: '38.25',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'closed',
    created_at: '2024-03-14T09:00:00Z',
  },
  {
    id: 'order-004',
    wallet: 'wallet-001-john',
    market_id: 'market-eabl-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-eabl',
    bid_amount: '21050.00',
    ask_amount: '100.00',
    price: '210.50',
    mode: 'immediate-or-cancel',
    order_type: 'market',
    status: 'closed',
    created_at: '2024-03-14T14:20:00Z',
  },
  {
    id: 'order-005',
    wallet: 'wallet-005-vanguard',
    market_id: 'market-stanbic-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-stanbic',
    bid_amount: '125000.00',
    ask_amount: '1000.00',
    price: '125.00',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T08:30:00Z',
  },
  {
    id: 'order-006',
    wallet: 'wallet-002-jane',
    market_id: 'market-bat-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-bat',
    bid_amount: '48500.00',
    ask_amount: '100.00',
    price: '485.00',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T13:45:00Z',
  },
  {
    id: 'order-007',
    wallet: 'wallet-003-blackrock',
    market_id: 'market-scb-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-scb',
    bid_amount: '1685000.00',
    ask_amount: '10000.00',
    price: '168.50',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T09:20:00Z',
  },
  {
    id: 'order-008',
    wallet: 'wallet-001-john',
    market_id: 'market-coop-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-coop',
    bid_amount: '1645.00',
    ask_amount: '100.00',
    price: '16.45',
    mode: 'fill-or-kill',
    order_type: 'market',
    status: 'cancelled',
    created_at: '2024-03-14T16:30:00Z',
  },
  {
    id: 'order-009',
    wallet: 'wallet-005-vanguard',
    market_id: 'market-equity-perpetual',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-equity',
    bid_amount: '1054000.00',
    ask_amount: '20000.00',
    price: '52.70',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T07:00:00Z',
  },
  {
    id: 'order-010',
    wallet: 'wallet-002-jane',
    market_id: 'market-kcb-perpetual',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-kcb',
    bid_amount: '191250.00',
    ask_amount: '5000.00',
    price: '38.25',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T12:00:00Z',
  },
  {
    id: 'order-011',
    wallet: 'wallet-001-john',
    market_id: 'market-bamburi-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-bamburi',
    bid_amount: '5825.00',
    ask_amount: '100.00',
    price: '58.25',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T14:10:00Z',
  },
  {
    id: 'order-012',
    wallet: 'wallet-003-blackrock',
    market_id: 'market-ncba-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-ncba',
    bid_amount: '455000.00',
    ask_amount: '10000.00',
    price: '45.50',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T15:20:00Z',
  },
  {
    id: 'order-013',
    wallet: 'wallet-002-jane',
    market_id: 'market-britam-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-britam',
    bid_amount: '895.00',
    ask_amount: '100.00',
    price: '8.95',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'open',
    created_at: '2024-03-15T16:00:00Z',
  },
  {
    id: 'order-014',
    wallet: 'wallet-005-vanguard',
    market_id: 'market-absa-usdc',
    bid_asset: 'asset-usdc',
    ask_asset: 'asset-absa',
    bid_amount: '148000.00',
    ask_amount: '10000.00',
    price: '14.80',
    mode: 'good-till-cancel',
    order_type: 'limit',
    status: 'closed',
    created_at: '2024-03-14T10:45:00Z',
  },
]

// ============================================================================
// TIME SERIES DATA
// ============================================================================

export const mockTimeSeriesRecords: TimeSeriesRecord[] = [
  // Safaricom - Recent 1hr data
  {
    id: 'ts-safaricom-001',
    market_id: 'market-safaricom-usdc',
    asset: 'asset-safaricom',
    open: '26.20',
    high: '26.50',
    low: '26.15',
    close: '26.45',
    volume: '125000.00',
    start_time: '2024-03-15T09:00:00Z',
    end_time: '2024-03-15T10:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  {
    id: 'ts-safaricom-002',
    market_id: 'market-safaricom-usdc',
    asset: 'asset-safaricom',
    open: '26.45',
    high: '26.70',
    low: '26.40',
    close: '26.50',
    volume: '98000.00',
    start_time: '2024-03-15T10:00:00Z',
    end_time: '2024-03-15T11:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // Equity Bank - Recent 1hr data
  {
    id: 'ts-equity-001',
    market_id: 'market-equity-usdc',
    asset: 'asset-equity',
    open: '53.00',
    high: '53.20',
    low: '52.50',
    close: '52.75',
    volume: '85000.00',
    start_time: '2024-03-15T09:00:00Z',
    end_time: '2024-03-15T10:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  {
    id: 'ts-equity-002',
    market_id: 'market-equity-usdc',
    asset: 'asset-equity',
    open: '52.75',
    high: '53.00',
    low: '52.60',
    close: '52.80',
    volume: '72000.00',
    start_time: '2024-03-15T10:00:00Z',
    end_time: '2024-03-15T11:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // KCB Group - Recent 15min data
  {
    id: 'ts-kcb-001',
    market_id: 'market-kcb-usdc',
    asset: 'asset-kcb',
    open: '37.90',
    high: '38.30',
    low: '37.80',
    close: '38.25',
    volume: '45000.00',
    start_time: '2024-03-15T10:00:00Z',
    end_time: '2024-03-15T10:15:00Z',
    interval: '15min',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  {
    id: 'ts-kcb-002',
    market_id: 'market-kcb-usdc',
    asset: 'asset-kcb',
    open: '38.25',
    high: '38.50',
    low: '38.20',
    close: '38.40',
    volume: '38000.00',
    start_time: '2024-03-15T10:15:00Z',
    end_time: '2024-03-15T10:30:00Z',
    interval: '15min',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // EABL - Daily data
  {
    id: 'ts-eabl-001',
    market_id: 'market-eabl-usdc',
    asset: 'asset-eabl',
    open: '207.00',
    high: '211.50',
    low: '206.50',
    close: '210.50',
    volume: '95000.00',
    start_time: '2024-03-14T00:00:00Z',
    end_time: '2024-03-15T00:00:00Z',
    interval: '1day',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  {
    id: 'ts-eabl-002',
    market_id: 'market-eabl-usdc',
    asset: 'asset-eabl',
    open: '210.50',
    high: '212.00',
    low: '209.75',
    close: '211.25',
    volume: '102000.00',
    start_time: '2024-03-15T00:00:00Z',
    end_time: '2024-03-16T00:00:00Z',
    interval: '1day',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // BAT Kenya - 4hr data
  {
    id: 'ts-bat-001',
    market_id: 'market-bat-usdc',
    asset: 'asset-bat',
    open: '475.00',
    high: '487.00',
    low: '473.00',
    close: '485.00',
    volume: '28000.00',
    start_time: '2024-03-15T04:00:00Z',
    end_time: '2024-03-15T08:00:00Z',
    interval: '4hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  {
    id: 'ts-bat-002',
    market_id: 'market-bat-usdc',
    asset: 'asset-bat',
    open: '485.00',
    high: '490.00',
    low: '483.00',
    close: '487.50',
    volume: '31000.00',
    start_time: '2024-03-15T08:00:00Z',
    end_time: '2024-03-15T12:00:00Z',
    interval: '4hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // Stanbic Holdings - 1hr data
  {
    id: 'ts-stanbic-001',
    market_id: 'market-stanbic-usdc',
    asset: 'asset-stanbic',
    open: '122.50',
    high: '125.50',
    low: '122.00',
    close: '125.00',
    volume: '42000.00',
    start_time: '2024-03-15T09:00:00Z',
    end_time: '2024-03-15T10:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  {
    id: 'ts-stanbic-002',
    market_id: 'market-stanbic-usdc',
    asset: 'asset-stanbic',
    open: '125.00',
    high: '126.00',
    low: '124.50',
    close: '125.75',
    volume: '38000.00',
    start_time: '2024-03-15T10:00:00Z',
    end_time: '2024-03-15T11:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // Co-operative Bank - Weekly data
  {
    id: 'ts-coop-001',
    market_id: 'market-coop-usdc',
    asset: 'asset-coop',
    open: '16.60',
    high: '16.85',
    low: '16.30',
    close: '16.45',
    volume: '520000.00',
    start_time: '2024-03-08T00:00:00Z',
    end_time: '2024-03-15T00:00:00Z',
    interval: '1week',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // Bamburi Cement - Daily data
  {
    id: 'ts-bamburi-001',
    market_id: 'market-bamburi-usdc',
    asset: 'asset-bamburi',
    open: '57.50',
    high: '58.50',
    low: '57.25',
    close: '58.25',
    volume: '65000.00',
    start_time: '2024-03-14T00:00:00Z',
    end_time: '2024-03-15T00:00:00Z',
    interval: '1day',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
  // NCBA Group - 1hr data
  {
    id: 'ts-ncba-001',
    market_id: 'market-ncba-usdc',
    asset: 'asset-ncba',
    open: '46.00',
    high: '46.20',
    low: '45.40',
    close: '45.50',
    volume: '72000.00',
    start_time: '2024-03-15T09:00:00Z',
    end_time: '2024-03-15T10:00:00Z',
    interval: '1hr',
    data_provider_type: 'order_book',
    data_provider: 'cradle-orderbook',
  },
]

// ============================================================================
// LENDING POOLS
// ============================================================================

export const mockLendingPools: LendingPool[] = [
  // Blue-chip NSE Stock Lending Pools
  {
    id: 'pool-safaricom-001',
    pool_address: '0x7890abcdef1234567890abcdef1234567890abcd',
    pool_contract_id: 'CDPOOLSAF0001POOLSAF0001POOLSAF0',
    reserve_asset: 'asset-safaricom',
    loan_to_value: '0.70',
    base_rate: '0.03',
    slope1: '0.05',
    slope2: '0.80',
    liquidation_threshold: '0.75',
    liquidation_discount: '0.08',
    reserve_factor: '0.15',
    name: 'Safaricom Lending Pool',
    title: 'Safaricom Stock Lending',
    description:
      "Lend or borrow tokenized Safaricom (cSAF) shares. Kenya's most liquid blue-chip stock now available for DeFi lending.",
    created_at: '2024-01-22T10:00:00Z',
  },
  {
    id: 'pool-equity-001',
    pool_address: '0xfedcba0987654321fedcba0987654321fedcba09',
    pool_contract_id: 'CDPOOLEQTY001POOLEQTY001POOLEQTY',
    reserve_asset: 'asset-equity',
    loan_to_value: '0.70',
    base_rate: '0.035',
    slope1: '0.055',
    slope2: '0.75',
    liquidation_threshold: '0.75',
    liquidation_discount: '0.08',
    reserve_factor: '0.15',
    name: 'Equity Bank Lending Pool',
    title: 'Equity Bank Stock Lending',
    description:
      'Earn yield by lending your tokenized Equity Bank (cEQTY) shares or borrow them for short positions and trading strategies.',
    created_at: '2024-01-22T11:00:00Z',
  },
  {
    id: 'pool-kcb-001',
    pool_address: '0x9876543210fedcba9876543210fedcba98765432',
    pool_contract_id: 'CDPOOLKCB0001POOLKCB0001POOLKCB0',
    reserve_asset: 'asset-kcb',
    loan_to_value: '0.68',
    base_rate: '0.04',
    slope1: '0.06',
    slope2: '0.85',
    liquidation_threshold: '0.73',
    liquidation_discount: '0.09',
    reserve_factor: '0.15',
    name: 'KCB Group Lending Pool',
    title: 'KCB Group Stock Lending',
    description:
      'Lend or borrow tokenized KCB Group (cKCB) shares with competitive rates and institutional-grade security.',
    created_at: '2024-01-25T14:00:00Z',
  },

  // Banking Sector Pool
  {
    id: 'pool-banking-basket-001',
    pool_address: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890',
    pool_contract_id: 'CDPOOLBNK0001POOLBNK0001POOLBNK0',
    reserve_asset: 'asset-equity', // Using Equity as the primary reserve
    loan_to_value: '0.65',
    base_rate: '0.045',
    slope1: '0.07',
    slope2: '0.90',
    liquidation_threshold: '0.70',
    liquidation_discount: '0.10',
    reserve_factor: '0.18',
    name: 'NSE Banking Sector Pool',
    title: 'Banking Stocks Lending Pool',
    description:
      'Diversified lending pool accepting multiple NSE banking stocks (Equity, KCB, Co-op, NCBA, Stanbic) as collateral. Ideal for sector-based strategies.',
    created_at: '2024-02-01T09:00:00Z',
  },

  // Blue-chip Premium Pool
  {
    id: 'pool-eabl-001',
    pool_address: '0x1111222233334444555566667777888899990000',
    pool_contract_id: 'CDPOOLEABL001POOLEABL001POOLEABL',
    reserve_asset: 'asset-eabl',
    loan_to_value: '0.72',
    base_rate: '0.038',
    slope1: '0.058',
    slope2: '0.78',
    liquidation_threshold: '0.77',
    liquidation_discount: '0.07',
    reserve_factor: '0.12',
    name: 'EABL Lending Pool',
    title: 'EABL Stock Lending',
    description:
      'Lend or borrow tokenized East African Breweries Limited (cEABL) shares. Premium blue-chip stock with stable dividends.',
    created_at: '2024-02-05T11:00:00Z',
  },

  // Institutional Pool
  {
    id: 'pool-stanbic-001',
    pool_address: '0xaaaa1111bbbb2222cccc3333dddd4444eeee5555',
    pool_contract_id: 'CDPOOLSBIC001POOLSBIC001POOLSBIC',
    reserve_asset: 'asset-stanbic',
    loan_to_value: '0.69',
    base_rate: '0.042',
    slope1: '0.062',
    slope2: '0.82',
    liquidation_threshold: '0.74',
    liquidation_discount: '0.09',
    reserve_factor: '0.16',
    name: 'Stanbic Holdings Lending Pool',
    title: 'Stanbic Stock Lending',
    description:
      'Institutional-grade lending pool for tokenized Stanbic Holdings (cSBIC). High liquidity and competitive rates for large positions.',
    created_at: '2024-02-08T13:30:00Z',
  },
]

// ============================================================================
// LENDING TRANSACTIONS
// ============================================================================

export const mockLendingTransactions: LendingTransaction[] = [
  // USDC Pool Transactions
  {
    id: 'ltx-001',
    wallet: 'wallet-001-john',
    pool: 'pool-usdc-001',
    amount: 50000,
    transaction_type: 'supply',
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'ltx-002',
    wallet: 'wallet-002-jane',
    pool: 'pool-usdc-001',
    amount: 100000,
    transaction_type: 'supply',
    created_at: '2024-02-02T14:30:00Z',
  },
  {
    id: 'ltx-003',
    wallet: 'wallet-003-blackrock',
    pool: 'pool-usdc-001',
    amount: 5000000,
    transaction_type: 'supply',
    created_at: '2024-02-03T09:00:00Z',
  },
  {
    id: 'ltx-004',
    wallet: 'wallet-005-vanguard',
    pool: 'pool-usdt-001',
    amount: 3000000,
    transaction_type: 'supply',
    created_at: '2024-02-05T11:15:00Z',
  },

  // NSE Stock Pool Transactions - Safaricom
  {
    id: 'ltx-005',
    wallet: 'wallet-001-john',
    pool: 'pool-safaricom-001',
    amount: 2000,
    transaction_type: 'supply',
    created_at: '2024-02-10T13:20:00Z',
  },
  {
    id: 'ltx-006',
    wallet: 'wallet-003-blackrock',
    pool: 'pool-safaricom-001',
    amount: 50000,
    transaction_type: 'supply',
    created_at: '2024-02-12T15:45:00Z',
  },

  // Equity Bank Pool Transactions
  {
    id: 'ltx-007',
    wallet: 'wallet-002-jane',
    pool: 'pool-equity-001',
    amount: 1500,
    transaction_type: 'supply',
    created_at: '2024-02-15T10:00:00Z',
  },
  {
    id: 'ltx-008',
    wallet: 'wallet-005-vanguard',
    pool: 'pool-equity-001',
    amount: 30000,
    transaction_type: 'supply',
    created_at: '2024-02-18T16:30:00Z',
  },

  // KCB Group Pool Transactions
  {
    id: 'ltx-009',
    wallet: 'wallet-001-john',
    pool: 'pool-kcb-001',
    amount: 1000,
    transaction_type: 'supply',
    created_at: '2024-02-20T09:00:00Z',
  },
  {
    id: 'ltx-010',
    wallet: 'wallet-003-blackrock',
    pool: 'pool-kcb-001',
    amount: 25000,
    transaction_type: 'supply',
    created_at: '2024-02-22T11:00:00Z',
  },

  // EABL Pool Transactions
  {
    id: 'ltx-011',
    wallet: 'wallet-002-jane',
    pool: 'pool-eabl-001',
    amount: 500,
    transaction_type: 'supply',
    created_at: '2024-02-25T14:20:00Z',
  },
  {
    id: 'ltx-012',
    wallet: 'wallet-005-vanguard',
    pool: 'pool-eabl-001',
    amount: 10000,
    transaction_type: 'supply',
    created_at: '2024-02-27T10:45:00Z',
  },

  // Stanbic Pool Transactions
  {
    id: 'ltx-013',
    wallet: 'wallet-001-john',
    pool: 'pool-stanbic-001',
    amount: 800,
    transaction_type: 'supply',
    created_at: '2024-03-01T09:30:00Z',
  },
  {
    id: 'ltx-014',
    wallet: 'wallet-003-blackrock',
    pool: 'pool-stanbic-001',
    amount: 15000,
    transaction_type: 'supply',
    created_at: '2024-03-03T13:15:00Z',
  },

  // Banking Sector Pool Transactions
  {
    id: 'ltx-015',
    wallet: 'wallet-005-vanguard',
    pool: 'pool-banking-basket-001',
    amount: 20000,
    transaction_type: 'supply',
    created_at: '2024-03-05T11:00:00Z',
  },

  // Withdrawals
  {
    id: 'ltx-016',
    wallet: 'wallet-001-john',
    pool: 'pool-usdc-001',
    amount: 10000,
    transaction_type: 'withdraw',
    created_at: '2024-03-08T10:00:00Z',
  },
  {
    id: 'ltx-017',
    wallet: 'wallet-002-jane',
    pool: 'pool-safaricom-001',
    amount: 500,
    transaction_type: 'withdraw',
    created_at: '2024-03-10T11:00:00Z',
  },
  {
    id: 'ltx-018',
    wallet: 'wallet-003-blackrock',
    pool: 'pool-equity-001',
    amount: 5000,
    transaction_type: 'withdraw',
    created_at: '2024-03-12T15:20:00Z',
  },
]

// ============================================================================
// LOANS
// ============================================================================

export const mockLoans: Loan[] = [
  // Loans from USDC Pool (using NSE stocks as collateral)
  {
    id: 'loan-001',
    account_id: 'acc-001-retail-john',
    wallet_id: 'wallet-001-john',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '30000',
    status: 'active',
    created_at: '2024-02-15T10:30:00Z',
  },
  {
    id: 'loan-002',
    account_id: 'acc-002-retail-jane',
    wallet_id: 'wallet-002-jane',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '75000',
    status: 'active',
    created_at: '2024-02-18T14:20:00Z',
  },
  {
    id: 'loan-003',
    account_id: 'acc-001-retail-john',
    wallet_id: 'wallet-001-john',
    pool: 'pool-usdt-001',
    borrow_index: '1.0',
    principal_amount: '20000',
    status: 'repaid',
    created_at: '2024-01-25T09:00:00Z',
  },
  {
    id: 'loan-004',
    account_id: 'acc-003-institutional-blackrock',
    wallet_id: 'wallet-003-blackrock',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '2000000',
    status: 'active',
    created_at: '2024-02-20T11:00:00Z',
  },
  {
    id: 'loan-005',
    account_id: 'acc-005-institutional-vanguard',
    wallet_id: 'wallet-005-vanguard',
    pool: 'pool-usdt-001',
    borrow_index: '1.0',
    principal_amount: '1500000',
    status: 'active',
    created_at: '2024-02-22T13:45:00Z',
  },
  {
    id: 'loan-006',
    account_id: 'acc-002-retail-jane',
    wallet_id: 'wallet-002-jane',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '50000',
    status: 'active',
    created_at: '2024-03-01T10:15:00Z',
  },
  {
    id: 'loan-007',
    account_id: 'acc-001-retail-john',
    wallet_id: 'wallet-001-john',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '15000',
    status: 'liquidated',
    created_at: '2024-01-20T08:30:00Z',
  },
  {
    id: 'loan-008',
    account_id: 'acc-003-institutional-blackrock',
    wallet_id: 'wallet-003-blackrock',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '500000',
    status: 'active',
    created_at: '2024-03-05T12:00:00Z',
  },

  // Loans from NSE Stock Pools (borrowing tokenized stocks)
  {
    id: 'loan-009',
    account_id: 'acc-002-retail-jane',
    wallet_id: 'wallet-002-jane',
    pool: 'pool-safaricom-001',
    borrow_index: '1.0',
    principal_amount: '1000', // Borrowing 1000 cSAF shares
    status: 'active',
    created_at: '2024-02-25T09:30:00Z',
  },
  {
    id: 'loan-010',
    account_id: 'acc-001-retail-john',
    wallet_id: 'wallet-001-john',
    pool: 'pool-equity-001',
    borrow_index: '1.0',
    principal_amount: '800', // Borrowing 800 cEQTY shares
    status: 'active',
    created_at: '2024-03-01T15:20:00Z',
  },
  {
    id: 'loan-011',
    account_id: 'acc-005-institutional-vanguard',
    wallet_id: 'wallet-005-vanguard',
    pool: 'pool-kcb-001',
    borrow_index: '1.0',
    principal_amount: '5000', // Borrowing 5000 cKCB shares
    status: 'active',
    created_at: '2024-03-05T11:45:00Z',
  },
  {
    id: 'loan-012',
    account_id: 'acc-003-institutional-blackrock',
    wallet_id: 'wallet-003-blackrock',
    pool: 'pool-eabl-001',
    borrow_index: '1.0',
    principal_amount: '2000', // Borrowing 2000 cEABL shares
    status: 'active',
    created_at: '2024-03-08T09:20:00Z',
  },
  {
    id: 'loan-013',
    account_id: 'acc-002-retail-jane',
    wallet_id: 'wallet-002-jane',
    pool: 'pool-stanbic-001',
    borrow_index: '1.0',
    principal_amount: '1200', // Borrowing 1200 cSBIC shares
    status: 'active',
    created_at: '2024-03-10T14:30:00Z',
  },

  // Banking Sector Pool Loans
  {
    id: 'loan-014',
    account_id: 'acc-001-retail-john',
    wallet_id: 'wallet-001-john',
    pool: 'pool-banking-basket-001',
    borrow_index: '1.0',
    principal_amount: '1500',
    status: 'active',
    created_at: '2024-03-12T10:00:00Z',
  },
  {
    id: 'loan-015',
    account_id: 'acc-005-institutional-vanguard',
    wallet_id: 'wallet-005-vanguard',
    pool: 'pool-banking-basket-001',
    borrow_index: '1.0',
    principal_amount: '10000',
    status: 'active',
    created_at: '2024-03-14T13:15:00Z',
  },

  // Additional USDT Pool Loans
  {
    id: 'loan-016',
    account_id: 'acc-002-retail-jane',
    wallet_id: 'wallet-002-jane',
    pool: 'pool-usdt-001',
    borrow_index: '1.0',
    principal_amount: '45000',
    status: 'active',
    created_at: '2024-03-08T15:20:00Z',
  },
  {
    id: 'loan-017',
    account_id: 'acc-003-institutional-blackrock',
    wallet_id: 'wallet-003-blackrock',
    pool: 'pool-usdt-001',
    borrow_index: '1.0',
    principal_amount: '1200000',
    status: 'repaid',
    created_at: '2024-02-28T09:20:00Z',
  },
  {
    id: 'loan-018',
    account_id: 'acc-001-retail-john',
    wallet_id: 'wallet-001-john',
    pool: 'pool-usdc-001',
    borrow_index: '1.0',
    principal_amount: '35000',
    status: 'active',
    created_at: '2024-03-10T11:45:00Z',
  },
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get account by ID
 */
export function getAccountById(id: string): CradleAccount | undefined {
  return mockAccounts.find(acc => acc.id === id)
}

/**
 * Get wallet by ID
 */
export function getWalletById(id: string): CradleWallet | undefined {
  return mockWallets.find(wallet => wallet.id === id)
}

/**
 * Get wallets for an account
 */
export function getWalletsByAccountId(accountId: string): CradleWallet[] {
  return mockWallets.filter(wallet => wallet.cradle_account_id === accountId)
}

/**
 * Get asset by ID
 */
export function getAssetById(id: string): Asset | undefined {
  return mockAssets.find(asset => asset.id === id)
}

/**
 * Get asset by symbol
 */
export function getAssetBySymbol(symbol: string): Asset | undefined {
  return mockAssets.find(asset => asset.symbol === symbol)
}

/**
 * Get market by ID
 */
export function getMarketById(id: string): Market | undefined {
  return mockMarkets.find(market => market.id === id)
}

/**
 * Get markets by type
 */
export function getMarketsByType(type: 'spot' | 'derivative' | 'futures'): Market[] {
  return mockMarkets.filter(market => market.market_type === type)
}

/**
 * Get orders for a wallet
 */
export function getOrdersByWallet(walletId: string): Order[] {
  return mockOrders.filter(order => order.wallet === walletId)
}

/**
 * Get orders for a market
 */
export function getOrdersByMarket(marketId: string): Order[] {
  return mockOrders.filter(order => order.market_id === marketId)
}

/**
 * Get open orders for a wallet
 */
export function getOpenOrdersByWallet(walletId: string): Order[] {
  return mockOrders.filter(order => order.wallet === walletId && order.status === 'open')
}

/**
 * Get time series records for a market
 */
export function getTimeSeriesByMarket(marketId: string): TimeSeriesRecord[] {
  return mockTimeSeriesRecords.filter(record => record.market_id === marketId)
}

/**
 * Get lending pool by ID
 */
export function getLendingPoolById(id: string): LendingPool | undefined {
  return mockLendingPools.find(pool => pool.id === id)
}

/**
 * Get lending transactions for a wallet
 */
export function getLendingTransactionsByWallet(walletId: string): LendingTransaction[] {
  return mockLendingTransactions.filter(tx => tx.wallet === walletId)
}

/**
 * Get lending transactions for a pool
 */
export function getLendingTransactionsByPool(poolId: string): LendingTransaction[] {
  return mockLendingTransactions.filter(tx => tx.pool === poolId)
}

/**
 * Get loans for a wallet
 */
export function getLoansByWallet(walletId: string): Loan[] {
  return mockLoans.filter(loan => loan.wallet_id === walletId)
}

/**
 * Get active loans for a wallet
 */
export function getActiveLoansByWallet(walletId: string): Loan[] {
  return mockLoans.filter(loan => loan.wallet_id === walletId && loan.status === 'active')
}

/**
 * Get loans for a pool
 */
export function getLoansByPool(poolId: string): Loan[] {
  return mockLoans.filter(loan => loan.pool === poolId)
}

/**
 * Calculate total supplied to a pool
 */
export function getTotalSuppliedToPool(poolId: string): number {
  return mockLendingTransactions
    .filter(tx => tx.pool === poolId)
    .reduce((total, tx) => {
      return tx.transaction_type === 'supply' ? total + tx.amount : total - tx.amount
    }, 0)
}

/**
 * Calculate total borrowed from a pool
 */
export function getTotalBorrowedFromPool(poolId: string): number {
  return mockLoans
    .filter(loan => loan.pool === poolId && loan.status === 'active')
    .reduce((total, loan) => total + parseFloat(loan.principal_amount), 0)
}

/**
 * Get pool utilization rate
 */
export function getPoolUtilizationRate(poolId: string): number {
  const totalSupplied = getTotalSuppliedToPool(poolId)
  const totalBorrowed = getTotalBorrowedFromPool(poolId)

  if (totalSupplied === 0) return 0
  return totalBorrowed / totalSupplied
}

/**
 * Get user portfolio value (simplified calculation)
 */
export function getUserPortfolioValue(walletId: string): {
  supplied: number
  borrowed: number
  netValue: number
} {
  const supplied = mockLendingTransactions
    .filter(tx => tx.wallet === walletId)
    .reduce((total, tx) => {
      return tx.transaction_type === 'supply' ? total + tx.amount : total - tx.amount
    }, 0)

  const borrowed = mockLoans
    .filter(loan => loan.wallet_id === walletId && loan.status === 'active')
    .reduce((total, loan) => total + parseFloat(loan.principal_amount), 0)

  return {
    supplied,
    borrowed,
    netValue: supplied - borrowed,
  }
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export const mockData = {
  accounts: mockAccounts,
  wallets: mockWallets,
  assets: mockAssets,
  markets: mockMarkets,
  orders: mockOrders,
  timeSeriesRecords: mockTimeSeriesRecords,
  lendingPools: mockLendingPools,
  lendingTransactions: mockLendingTransactions,
  loans: mockLoans,
}
