# Cradle API Client - TypeScript

A fully-typed TypeScript client for interacting with the Cradle Back-End REST API.

## Features

- ✅ Full TypeScript support with comprehensive type definitions
- ✅ Built with Axios for robust HTTP requests
- ✅ All API endpoints covered (23 GET endpoints + 1 POST mutations endpoint)
- ✅ Bearer token authentication
- ✅ Standardized error handling
- ✅ Request timeout support
- ✅ Automatic request/response interceptors
- ✅ Type-safe mutation operations
- ✅ Query parameter builders for filtering

## Installation

```bash
# Install dependencies
npm install axios

# Or if using the package
npm install cradle-api-client

# For development
npm install --save-dev typescript @types/node
```

## Quick Start

```typescript
import { CradleApiClient } from './cradle-api-client'

// Initialize the client
const client = new CradleApiClient({
  baseUrl: 'http://localhost:3000', // Optional, defaults to http://localhost:3000
  apiKey: 'your-secret-api-key',
  timeout: 30000, // Optional, defaults to 30000ms
})

// Check API health
const health = await client.health()
console.log(health) // { status: 'ok', timestamp: '...' }

// Get an account
const accountResponse = await client.getAccount('550e8400-e29b-41d4-a716-446655440000')
if (accountResponse.success) {
  console.log(accountResponse.data)
} else {
  console.error(accountResponse.error)
}
```

## API Reference

### Health Check

```typescript
// Check API status (no authentication required)
const health = await client.health()
```

### Accounts API

```typescript
// Get account by UUID
const account = await client.getAccount('account-uuid')

// Get account by linked ID
const account = await client.getAccountByLinkedId('external-account-123')

// Get all wallets for an account
const wallets = await client.getAccountWallets('account-uuid')
```

### Wallets API

```typescript
// Get wallet by UUID
const wallet = await client.getWallet('wallet-uuid')

// Get wallet by account ID
const wallet = await client.getWalletByAccountId('account-uuid')
```

### Assets API

```typescript
// Get asset by UUID
const asset = await client.getAsset('asset-uuid')

// Get asset by token
const asset = await client.getAssetByToken('0.0.12345')

// Get asset by manager
const asset = await client.getAssetByManager('0x1234567890abcdef')
```

### Markets API

```typescript
// Get market by UUID
const market = await client.getMarket('market-uuid')

// Get all markets with optional filters
const markets = await client.getMarkets({
  market_type: 'spot',
  status: 'active',
  regulation: 'regulated',
})
```

### Orders API

```typescript
// Get order by UUID
const order = await client.getOrder('order-uuid')

// Get all orders with optional filters
const orders = await client.getOrders({
  wallet: 'wallet-uuid',
  market_id: 'market-uuid',
  status: 'open',
  order_type: 'limit',
  from_date: '2024-01-01T00:00:00Z',
  to_date: '2024-12-31T23:59:59Z',
})
```

### Time Series API

```typescript
// Get time series record by UUID
const record = await client.getTimeSeriesRecord('record-uuid')

// Get time series records with filters
const records = await client.getTimeSeriesRecords({
  market_id: 'market-uuid',
  asset: 'asset-uuid',
  interval: '1hr',
  start_time: '2024-01-01T00:00:00Z',
  end_time: '2024-01-02T00:00:00Z',
})
```

### Lending Pools API

```typescript
// Get lending pool by UUID
const pool = await client.getLendingPool('pool-uuid')

// Get all lending pools with filters
const pools = await client.getLendingPools({
  reserve_asset: 'asset-uuid',
  min_loan_to_value: 0.5,
  max_loan_to_value: 0.8,
})

// Get transactions for a pool
const transactions = await client.getLendingTransactions('pool-uuid')

// Get transactions for a wallet
const transactions = await client.getLendingTransactionsByWallet('wallet-uuid')

// Get loans
const loans = await client.getLoans('pool-uuid')
const loan = await client.getLoan('loan-uuid')
const walletLoans = await client.getLoansByWallet('wallet-uuid')
```

## Mutations API

All mutations are processed through the `/process` endpoint. You can use either the generic
`processMutation` method or the convenience methods.

### Handling Mutation Responses

Due to TypeScript's discriminated union types, you need to use type guards to safely access mutation
response data. The client provides `MutationResponseHelpers` for this:

```typescript
import { CradleApiClient, MutationResponseHelpers } from './cradle-api-client'

// Example: Create account
const response = await client.createAccount({
  linked_account_id: 'external-123',
  account_type: 'retail',
})

if (response.success && response.data) {
  // Use type guard to safely access the response
  if (MutationResponseHelpers.isCreateAccount(response.data)) {
    const accountId = response.data.Accounts.CreateAccount
    console.log('Created account:', accountId)
  }
}
```

### Available Type Guards

The following type guard helpers are available:

- **Account mutations**:
  - `MutationResponseHelpers.isCreateAccount()`
  - `MutationResponseHelpers.isUpdateAccountStatus()`
  - `MutationResponseHelpers.isCreateWallet()`

- **Asset mutations**:
  - `MutationResponseHelpers.isCreateAsset()`
  - `MutationResponseHelpers.isCreateExistingAsset()`

- **Market mutations**:
  - `MutationResponseHelpers.isCreateMarket()`
  - `MutationResponseHelpers.isUpdateMarketStatus()`

- **Order mutations**:
  - `MutationResponseHelpers.isPlaceOrder()`
  - `MutationResponseHelpers.isCancelOrder()`

- **Time series mutations**:
  - `MutationResponseHelpers.isAddRecord()`

- **Lending pool mutations**:
  - `MutationResponseHelpers.isCreateLendingPool()`
  - `MutationResponseHelpers.isSupplyLiquidity()`
  - `MutationResponseHelpers.isBorrowAsset()`
  - `MutationResponseHelpers.isRepayBorrow()`

### Account Mutations

```typescript
// Create account
const response = await client.createAccount({
  linked_account_id: 'external-123',
  account_type: 'retail',
})

if (response.success && response.data) {
  if (MutationResponseHelpers.isCreateAccount(response.data)) {
    const accountId = response.data.Accounts.CreateAccount
    console.log('Created account:', accountId)
  }
}

// Update account status
await client.updateAccountStatus({
  account_id: 'account-uuid',
  status: 'verified',
})

// Create wallet
const walletResponse = await client.createWallet({
  cradle_account_id: 'account-uuid',
  address: '0.0.123456',
  contract_id: '0x1a2b3c4d5e6f',
})

if (walletResponse.success && walletResponse.data) {
  if (MutationResponseHelpers.isCreateWallet(walletResponse.data)) {
    const walletId = walletResponse.data.Accounts.CreateWallet
    console.log('Created wallet:', walletId)
  }
}
```

### Asset Mutations

```typescript
// Create asset
const assetResponse = await client.createAsset({
  asset_manager: '0x1234567890abcdef',
  token: '0.0.12345',
  asset_type: 'native',
  name: 'Hedera',
  symbol: 'HBAR',
  decimals: 8,
  icon: 'https://example.com/hbar.png',
})

// Create existing asset
await client.createExistingAsset('asset-uuid')
```

### Market Mutations

```typescript
// Create market
const marketResponse = await client.createMarket({
  name: 'HBAR/USDC',
  description: 'Hedera to USD Coin trading pair',
  icon: 'https://example.com/hbar-usdc.png',
  asset_one: 'asset-uuid-1',
  asset_two: 'asset-uuid-2',
  market_type: 'spot',
  market_status: 'active',
  market_regulation: 'regulated',
})

// Update market status
await client.updateMarketStatus({
  market_id: 'market-uuid',
  status: 'suspended',
})
```

### Order Mutations

```typescript
// Place order
const orderResponse = await client.placeOrder({
  wallet: 'wallet-uuid',
  market_id: 'market-uuid',
  bid_asset: 'asset-uuid-1',
  ask_asset: 'asset-uuid-2',
  bid_amount: '1000.00',
  ask_amount: '500.00',
  price: '2.00',
  mode: 'fill-or-kill',
  order_type: 'limit',
})

if (orderResponse.success && orderResponse.data) {
  if (MutationResponseHelpers.isPlaceOrder(orderResponse.data)) {
    const result = orderResponse.data.OrderBook.PlaceOrder
    console.log('Order ID:', result.id)
    console.log('Status:', result.status)
    console.log('Filled:', result.bid_amount_filled)
  }
}

// Cancel order
await client.cancelOrder('order-uuid')
```

### Time Series Mutations

```typescript
// Add time series record
const recordResponse = await client.addTimeSeriesRecord({
  market_id: 'market-uuid',
  asset: 'asset-uuid',
  open: '2.00',
  high: '2.50',
  low: '1.95',
  close: '2.25',
  volume: '10000.00',
  start_time: '2024-01-01T12:00:00Z',
  end_time: '2024-01-01T13:00:00Z',
  interval: '1hr',
  data_provider_type: 'order_book',
  data_provider: 'cradle-market',
})
```

### Lending Pool Mutations

```typescript
// Create lending pool
const poolResponse = await client.createLendingPool({
  pool_address: '0.0.987654',
  pool_contract_id: '0x1a2b3c4d5e6f',
  reserve_asset: 'asset-uuid',
  loan_to_value: '0.75',
  base_rate: '0.02',
  slope1: '0.05',
  slope2: '0.20',
  liquidation_threshold: '0.85',
  liquidation_discount: '0.10',
  reserve_factor: '0.10',
  name: 'USDC Lending Pool',
  title: 'Stable Coin Lending',
  description: 'A lending pool for USDC stable coin',
})

// Supply liquidity
await client.supplyLiquidity({
  wallet: 'wallet-uuid',
  pool: 'pool-uuid',
  amount: 10000,
})

// Borrow asset
const borrowResponse = await client.borrowAsset({
  wallet: 'wallet-uuid',
  pool: 'pool-uuid',
  amount: 5000,
  collateral: 'collateral-asset-uuid',
})

// Repay borrow
await client.repayBorrow({
  wallet: 'wallet-uuid',
  loan: 'loan-uuid',
  amount: 5500,
})
```

## Generic Mutation Method

If you prefer more control, you can use the generic `processMutation` method:

```typescript
const response = await client.processMutation({
  Accounts: {
    CreateAccount: {
      linked_account_id: 'external-123',
      account_type: 'retail',
    },
  },
})
```

## Error Handling

All API methods return a standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
}
```

Always check the `success` field before accessing `data`:

```typescript
const response = await client.getAccount('account-uuid')

if (response.success) {
  // Safe to access response.data
  console.log('Account:', response.data)
} else {
  // Handle error
  console.error('Error:', response.error)
}
```

## Type Definitions

The client includes comprehensive TypeScript types for all entities:

### Enums

- `CradleAccountType`: `'retail' | 'institutional'`
- `CradleAccountStatus`: `'unverified' | 'verified' | 'suspended' | 'closed'`
- `CradleWalletStatus`: `'active' | 'inactive' | 'suspended'`
- `AssetType`:
  `'bridged' | 'native' | 'yield_breaking' | 'chain_native' | 'stablecoin' | 'volatile'`
- `MarketStatus`: `'active' | 'inactive' | 'suspended'`
- `MarketType`: `'spot' | 'derivative' | 'futures'`
- `MarketRegulation`: `'regulated' | 'unregulated'`
- `OrderStatus`: `'open' | 'closed' | 'cancelled'`
- `OrderType`: `'limit' | 'market'`
- `FillMode`: `'fill-or-kill' | 'immediate-or-cancel' | 'good-till-cancel'`
- `OrderFillStatus`: `'partial' | 'filled' | 'cancelled'`
- `TimeSeriesInterval`: `'1min' | '5min' | '15min' | '30min' | '1hr' | '4hr' | '1day' | '1week'`
- `DataProviderType`: `'order_book' | 'exchange' | 'aggregated'`
- `LoanStatus`: `'active' | 'repaid' | 'liquidated'`
- `PoolTransactionType`: `'supply' | 'withdraw'`

### Interfaces

All entity interfaces are exported and available for use in your code:

```typescript
import type {
  CradleAccount,
  CradleWallet,
  Asset,
  Market,
  Order,
  TimeSeriesRecord,
  LendingPool,
  Loan,
  LendingTransaction,
} from './cradle-api-client'
```

## Configuration

### Base URL

By default, the client connects to `http://localhost:3000`. You can override this:

```typescript
const client = new CradleApiClient({
  baseUrl: 'https://api.cradle.example.com',
  apiKey: 'your-api-key',
})
```

### Timeout

The default request timeout is 30 seconds. You can customize it:

```typescript
const client = new CradleApiClient({
  apiKey: 'your-api-key',
  timeout: 60000, // 60 seconds
})
```

## Axios Features

This client is built with Axios, which provides:

- Automatic request/response transformation
- Request and response interceptors
- Timeout support with automatic cancellation
- Better error handling with typed error objects
- Progress tracking support (can be extended)
- Request cancellation support

### Advanced Axios Usage

If you need to access the underlying axios instance for advanced configurations:

```typescript
// The axios instance is used internally with:
// - Automatic JSON serialization
// - Bearer token authentication
// - Timeout configuration
// - Response interceptors for error handling
```

### Error Handling with Axios

Axios errors are automatically caught and transformed into the standard `ApiResponse` format:

```typescript
const response = await client.getAccount('invalid-id')

if (!response.success) {
  // Error message from server or network error
  console.error(response.error)
}
```

## HTTP Status Codes

The API uses standard HTTP status codes:

- `200 OK` - Successful request
- `400 Bad Request` - Invalid input parameters
- `401 Unauthorized` - Missing or invalid authentication token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## License

MIT

## Contributing

Contributions are welcome! Please ensure all types are properly defined and methods are documented.
