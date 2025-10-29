# Changelog

All notable changes to the Cradle API Client will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-10-27

### Added

- Initial release of TypeScript API client
- Full TypeScript type definitions for all API entities
- Support for all 23 GET endpoints
- Support for POST /process mutations endpoint
- Axios-based HTTP client with:
  - Automatic request/response transformation
  - Built-in timeout support
  - Request/response interceptors
  - Better error handling
- Bearer token authentication
- Comprehensive error handling with standardized `ApiResponse<T>` format
- Query parameter builders for filtering endpoints
- Convenience methods for all mutation types:
  - Account mutations (create, update status, create wallet)
  - Asset mutations (create asset, create existing asset)
  - Market mutations (create market, update status)
  - Order mutations (place order, cancel order)
  - Time series mutations (add record)
  - Lending pool mutations (create pool, supply liquidity, borrow, repay)

### API Coverage

#### Account Endpoints

- `GET /accounts/{id}` - Get account by UUID
- `GET /accounts/linked/{linked_id}` - Get account by linked ID
- `GET /accounts/{account_id}/wallets` - Get account wallets
- `GET /wallets/{id}` - Get wallet by UUID
- `GET /wallets/account/{account_id}` - Get wallet by account ID

#### Asset Endpoints

- `GET /assets/{id}` - Get asset by UUID
- `GET /assets/token/{token}` - Get asset by token
- `GET /assets/manager/{manager}` - Get asset by manager

#### Market Endpoints

- `GET /markets/{id}` - Get market by UUID
- `GET /markets` - Get all markets with optional filters

#### Order Endpoints

- `GET /orders/{id}` - Get order by UUID
- `GET /orders` - Get all orders with optional filters

#### Time Series Endpoints

- `GET /time-series/{id}` - Get time series record by UUID
- `GET /time-series` - Get time series records with optional filters

#### Lending Pool Endpoints

- `GET /lending-pools/{id}` - Get lending pool by UUID
- `GET /lending-pools` - Get all lending pools with optional filters
- `GET /lending-pools/{pool_id}/transactions` - Get pool transactions
- `GET /lending-transactions/wallet/{wallet_id}` - Get wallet transactions
- `GET /lending-pools/{pool_id}/loans` - Get pool loans
- `GET /loans/wallet/{wallet_id}` - Get wallet loans
- `GET /loans/{id}` - Get loan by UUID

#### Mutation Endpoint

- `POST /process` - Process mutations with full type safety

### Type Definitions

#### Enums

- Account: `CradleAccountType`, `CradleAccountStatus`, `CradleWalletStatus`, `WithdrawalType`
- Asset: `AssetType`
- Market: `MarketStatus`, `MarketType`, `MarketRegulation`
- Order: `OrderStatus`, `OrderType`, `FillMode`, `OrderFillStatus`
- Time Series: `TimeSeriesInterval`, `DataProviderType`
- Lending: `LoanStatus`, `PoolTransactionType`

#### Interfaces

- Entities: `CradleAccount`, `CradleWallet`, `Asset`, `Market`, `Order`, `TimeSeriesRecord`,
  `LendingPool`, `Loan`, `LendingTransaction`
- Filters: `MarketFilters`, `OrderFilters`, `TimeSeriesFilters`, `LendingPoolFilters`
- Mutations: All input types and response types for mutations

### Documentation

- Comprehensive README.md with usage examples
- SETUP.md with quick start guide and common patterns
- example.ts with working code examples
- types.ts for type-only imports

### Dependencies

- axios ^1.6.0
- typescript ^5.0.0 (dev)
- @types/node ^20.0.0 (dev)

### Configuration

- Configurable base URL (defaults to http://localhost:3000)
- Configurable timeout (defaults to 30000ms)
- Environment-based API key configuration

## [Unreleased]

### Planned Features

- Request retry logic with exponential backoff
- Rate limiting support
- Batch request support
- WebSocket support for real-time updates
- Response caching layer
- Request cancellation tokens
- Progress tracking for large uploads
- Pagination helpers
- Response validation with Zod/Yup
- Mock client for testing

### Known Issues

- None at this time

## Migration Guide

### From Fetch-based Client

If you were using a previous fetch-based version:

1. Install axios: `npm install axios`
2. Update imports (no changes needed)
3. All APIs remain the same
4. Error handling remains compatible
5. Timeout configuration remains the same

### Breaking Changes

- None (initial release)

## Support

For issues, questions, or contributions:

- GitHub Issues: [Create an issue]
- Documentation: See README.md
- Examples: See example.ts

## License

MIT License - See LICENSE file for details
