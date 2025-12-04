# Cradle API Client (TypeScript)

Typed helper for the Cradle REST API and Action Router. This client wraps Axios and ships the type
definitions from `cradle-api-client.ts`.

## Install

- add github repo link to package.json

## Create a client

```ts
import { CradleClient } from 'cradle-api-client'

const client = new CradleClient({
  baseUrl: 'https://api.cradle.example', // trailing slashes trimmed for you
  apiKey: process.env.CRADLE_API_KEY, // required for authenticated calls
  timeoutMs: 15_000, // optional (defaults to 2mins)
  userAgent: 'my-app/1.0.0', // optional
  // axiosInstance: axios.create({ baseURL: "..." }), // inject your own instance if you want interceptors
})
```

The client returns `ApiResponse<T>` objects (`{ success: boolean; data?: T; error?: string }`).
Requests throw if the server responds with `success: false`, a non-2xx status, or a missing API key
on authenticated endpoints.

## Quick checks

- Health check (no auth required):
  ```ts
  await client.health() // -> { success: true, data: { status: "ok" } }
  ```
- Simple authenticated read:
  ```ts
  const account = await client.getAccount('account-uuid')
  ```

## Action Router

Send one top-level action per request:

```ts
const response = await client.process({
  Accounts: { CreateAccount: { linked_account_id: 'cust-123', account_type: 'retail' } },
})
```

Valid top-level keys: `Accounts`, `AssetBook`, `Markets`, `MarketTimeSeries`, `OrderBook`, `Pool`,
`Listing`. Each key accepts the corresponding input union defined in `ActionRouterInput` and returns
an `ActionRouterOutput`.

## REST helpers

Examples of the convenience methods that map to REST endpoints:

- Accounts & wallets: `getAccount(id)`, `getAccountByLinked(linkedId)`, `getWallet(id)`,
  `getWalletByAccount(accountId)`, `getWalletsForAccount(accountId)`, `getBalances(accountId)`,
  `getBalance(walletId, assetId)`.
- Assets: `listAssets()`, `getAsset(id)`, `getAssetByToken(token)`, `getAssetsByManager(manager)`.
- Markets & orders: `listMarkets()`, `getMarket(id)`, `listOrders(filters?)`, `getOrder(id)`.
- Time series: `getTimeSeriesHistory({ market, duration_secs, interval, asset_id })`.
- Listings: `listListings(filters?)`, `getListing(id)`.
- Lending: `listPools()`, `getPool(id)`, `getLoans(walletId)`, `getPoolStats(id)`,
  `getLoanPosition(loanId)`, `getDepositPosition(poolId, walletId)`, `getLoanRepayments(loanId)`,
  `getRepaymentAmount(loanId)`.

## Typed responses

All domain models and enums are exported from `cradle-api-client.ts`, including:

- Account & wallet records: `CradleAccountRecord`, `CradleWalletAccountRecord`, `CradleAccountType`,
  `CradleAccountStatus`, `CradleWalletStatus`.
- Assets: `AssetBookRecord`, `AssetType`.
- Markets & orders: `MarketRecord`, `MarketStatus`, `MarketType`, `MarketRegulation`,
  `OrderBookRecord`, `OrderStatus`, `OrderType`, `FillMode`, `OrderFillStatus`.
- Time series: `MarketTimeSeriesRecord`, `TimeSeriesInterval`, `DataProviderType`.
- Lending: `LendingPoolRecord`, `LendingPoolSnapShotRecord`, `LoanRecord`, `LoanRepaymentsRecord`,
  `LoanStatus`, `GetPoolStatsOutput`, `GetUserBorrowPositionOutput`, `GetUserDepositPositonOutput`,
  `RepaymentAmount`, `PoolTransactionType`.
- Listings: `CradleNativeListingRow`, `ListingStatus`, `ListingStats`.
