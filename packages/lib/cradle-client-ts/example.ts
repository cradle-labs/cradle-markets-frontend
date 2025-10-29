/**
 * Example usage of the Cradle API Client
 *
 * This file demonstrates various use cases for interacting with the Cradle API
 */

import { CradleApiClient, MutationResponseHelpers } from './cradle-api-client'

// Initialize the client
const client = new CradleApiClient({
  baseUrl: 'http://localhost:3000',
  apiKey: process.env.API_SECRET_KEY || 'your-secret-key',
  timeout: 30000,
})

// ============================================================================
// EXAMPLE 1: Check API Health
// ============================================================================
async function checkHealth() {
  try {
    const health = await client.health()
    console.log('API Health:', health)
  } catch (error) {
    console.error('Health check failed:', error)
  }
}

// ============================================================================
// EXAMPLE 2: Account Management
// ============================================================================
async function manageAccounts() {
  // Create a new account
  const createResponse = await client.createAccount({
    linked_account_id: 'user-12345',
    account_type: 'retail',
  })

  if (createResponse.success && createResponse.data) {
    // Use type guard to safely access the response
    if (MutationResponseHelpers.isCreateAccount(createResponse.data)) {
      const accountId = createResponse.data.Accounts.CreateAccount
      console.log('Created account:', accountId)

      // Get the account
      const account = await client.getAccount(accountId)
      if (account.success) {
        console.log('Account details:', account.data)
      }

      // Update account status
      await client.updateAccountStatus({
        account_id: accountId,
        status: 'verified',
      })

      // Create a wallet for the account
      const walletResponse = await client.createWallet({
        cradle_account_id: accountId,
        address: '0.0.123456',
        contract_id: '0x1a2b3c4d5e6f',
      })

      if (walletResponse.success && walletResponse.data) {
        if (MutationResponseHelpers.isCreateWallet(walletResponse.data)) {
          const walletId = walletResponse.data.Accounts.CreateWallet
          console.log('Created wallet:', walletId)
        }
      }
    }
  }
}

// ============================================================================
// EXAMPLE 3: Asset Management
// ============================================================================
async function manageAssets() {
  // Create a new asset
  const assetResponse = await client.createAsset({
    asset_manager: '0x1234567890abcdef',
    token: '0.0.12345',
    asset_type: 'native',
    name: 'Hedera',
    symbol: 'HBAR',
    decimals: 8,
    icon: 'https://example.com/hbar.png',
  })

  if (assetResponse.success && assetResponse.data) {
    if (MutationResponseHelpers.isCreateAsset(assetResponse.data)) {
      const assetId = assetResponse.data.Assets.CreateAsset
      console.log('Created asset:', assetId)

      // Get asset by ID
      const asset = await client.getAsset(assetId)
      if (asset.success) {
        console.log('Asset details:', asset.data)
      }

      // Get asset by token
      const assetByToken = await client.getAssetByToken('0.0.12345')
      if (assetByToken.success) {
        console.log('Asset by token:', assetByToken.data)
      }
    }
  }
}

// ============================================================================
// EXAMPLE 4: Market Management
// ============================================================================
async function manageMarkets() {
  // Assuming we have two asset IDs
  const assetOneId = '550e8400-e29b-41d4-a716-446655440000'
  const assetTwoId = '650e8400-e29b-41d4-a716-446655440001'

  // Create a market
  const marketResponse = await client.createMarket({
    name: 'HBAR/USDC',
    description: 'Hedera to USD Coin trading pair',
    icon: 'https://example.com/hbar-usdc.png',
    asset_one: assetOneId,
    asset_two: assetTwoId,
    market_type: 'spot',
    market_status: 'active',
    market_regulation: 'regulated',
  })

  if (marketResponse.success && marketResponse.data) {
    if (MutationResponseHelpers.isCreateMarket(marketResponse.data)) {
      const marketId = marketResponse.data.Markets.CreateMarket
      console.log('Created market:', marketId)

      // Get all active spot markets
      const markets = await client.getMarkets({
        market_type: 'spot',
        status: 'active',
      })
      if (markets.success) {
        console.log('Active spot markets:', markets.data)
      }

      // Update market status
      await client.updateMarketStatus({
        market_id: marketId,
        status: 'suspended',
      })
    }
  }
}

// ============================================================================
// EXAMPLE 5: Order Management
// ============================================================================
async function manageOrders() {
  const walletId = '550e8400-e29b-41d4-a716-446655440000'
  const marketId = '750e8400-e29b-41d4-a716-446655440002'
  const bidAssetId = '550e8400-e29b-41d4-a716-446655440000'
  const askAssetId = '650e8400-e29b-41d4-a716-446655440001'

  // Place a limit order
  const orderResponse = await client.placeOrder({
    wallet: walletId,
    market_id: marketId,
    bid_asset: bidAssetId,
    ask_asset: askAssetId,
    bid_amount: '1000.00',
    ask_amount: '500.00',
    price: '2.00',
    mode: 'good-till-cancel',
    order_type: 'limit',
  })

  if (orderResponse.success && orderResponse.data) {
    if (MutationResponseHelpers.isPlaceOrder(orderResponse.data)) {
      const orderResult = orderResponse.data.OrderBook.PlaceOrder
      console.log('Order placed:', {
        id: orderResult.id,
        status: orderResult.status,
        bidFilled: orderResult.bid_amount_filled,
        askFilled: orderResult.ask_amount_filled,
        trades: orderResult.matched_trades,
      })

      // Get all orders for the wallet
      const orders = await client.getOrders({
        wallet: walletId,
        status: 'open',
      })
      if (orders.success) {
        console.log('Open orders:', orders.data)
      }

      // Cancel the order
      await client.cancelOrder(orderResult.id)
    }
  }
}

// ============================================================================
// EXAMPLE 6: Time Series Data
// ============================================================================
async function manageTimeSeries() {
  const marketId = '750e8400-e29b-41d4-a716-446655440002'
  const assetId = '550e8400-e29b-41d4-a716-446655440000'

  // Add a time series record
  const recordResponse = await client.addTimeSeriesRecord({
    market_id: marketId,
    asset: assetId,
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

  if (recordResponse.success && recordResponse.data) {
    if (MutationResponseHelpers.isAddRecord(recordResponse.data)) {
      const recordId = recordResponse.data.MarketTimeSeries.AddRecord
      console.log('Time series record added:', recordId)

      // Query time series data
      const records = await client.getTimeSeriesRecords({
        market_id: marketId,
        asset: assetId,
        interval: '1hr',
        start_time: '2024-01-01T00:00:00Z',
        end_time: '2024-01-02T00:00:00Z',
      })
      if (records.success) {
        console.log('Time series records:', records.data)
      }
    }
  }
}

// ============================================================================
// EXAMPLE 7: Lending Pool Operations
// ============================================================================
async function manageLendingPools() {
  const walletId = '550e8400-e29b-41d4-a716-446655440000'
  const assetId = '550e8400-e29b-41d4-a716-446655440000'
  const collateralAssetId = '650e8400-e29b-41d4-a716-446655440001'

  // Create a lending pool
  const poolResponse = await client.createLendingPool({
    pool_address: '0.0.987654',
    pool_contract_id: '0x1a2b3c4d5e6f',
    reserve_asset: assetId,
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

  if (poolResponse.success && poolResponse.data) {
    if (MutationResponseHelpers.isCreateLendingPool(poolResponse.data)) {
      const poolId = poolResponse.data.Pool.CreateLendingPool
      console.log('Created lending pool:', poolId)

      // Supply liquidity
      const supplyResponse = await client.supplyLiquidity({
        wallet: walletId,
        pool: poolId,
        amount: 10000,
      })
      if (supplyResponse.success && supplyResponse.data) {
        if (MutationResponseHelpers.isSupplyLiquidity(supplyResponse.data)) {
          console.log('Supplied liquidity:', supplyResponse.data.Pool.SupplyLiquidity)
        }
      }

      // Borrow asset
      const borrowResponse = await client.borrowAsset({
        wallet: walletId,
        pool: poolId,
        amount: 5000,
        collateral: collateralAssetId,
      })
      if (borrowResponse.success && borrowResponse.data) {
        if (MutationResponseHelpers.isBorrowAsset(borrowResponse.data)) {
          const loanId = borrowResponse.data.Pool.BorrowAsset
          console.log('Borrowed asset, loan ID:', loanId)

          // Get loan details
          const loan = await client.getLoan(loanId)
          if (loan.success) {
            console.log('Loan details:', loan.data)
          }

          // Repay the loan
          await client.repayBorrow({
            wallet: walletId,
            loan: loanId,
            amount: 5500, // Principal + interest
          })
          console.log('Loan repaid')
        }
      }

      // Get all pools
      const pools = await client.getLendingPools({
        reserve_asset: assetId,
      })
      if (pools.success) {
        console.log('Lending pools:', pools.data)
      }

      // Get transactions for the pool
      const transactions = await client.getLendingTransactions(poolId)
      if (transactions.success) {
        console.log('Pool transactions:', transactions.data)
      }
    }
  }
}

// ============================================================================
// EXAMPLE 8: Error Handling
// ============================================================================
async function demonstrateErrorHandling() {
  // Example of handling a not found error
  const response = await client.getAccount('invalid-uuid')

  if (!response.success) {
    console.error('Error occurred:', response.error)
    // Handle the error appropriately
    // Could be: "Account not found", "Invalid UUID format", etc.
  }

  // Example of handling network errors
  try {
    const result = await client.getMarkets()
    if (result.success) {
      console.log('Markets:', result.data)
    } else {
      console.error('API error:', result.error)
    }
  } catch (error) {
    console.error('Network error:', error)
  }
}

// ============================================================================
// EXAMPLE 9: Complex Workflow
// ============================================================================
async function complexWorkflow() {
  console.log('Starting complex trading workflow...')

  // 1. Create account and wallet
  console.log('Step 1: Creating account...')
  const accountResponse = await client.createAccount({
    linked_account_id: 'trader-001',
    account_type: 'retail',
  })

  if (!accountResponse.success || !accountResponse.data) {
    console.error('Failed to create account')
    return
  }

  if (!MutationResponseHelpers.isCreateAccount(accountResponse.data)) {
    console.error('Unexpected response type')
    return
  }

  const accountId = accountResponse.data.Accounts.CreateAccount

  console.log('Step 2: Creating wallet...')
  const walletResponse = await client.createWallet({
    cradle_account_id: accountId,
    address: '0.0.999999',
    contract_id: '0xabcdef123456',
  })

  if (!walletResponse.success || !walletResponse.data) {
    console.error('Failed to create wallet')
    return
  }

  if (!MutationResponseHelpers.isCreateWallet(walletResponse.data)) {
    console.error('Unexpected response type')
    return
  }

  const walletId = walletResponse.data.Accounts.CreateWallet

  // 2. Get available markets
  console.log('Step 3: Fetching markets...')
  const marketsResponse = await client.getMarkets({
    market_type: 'spot',
    status: 'active',
  })

  if (!marketsResponse.success || !marketsResponse.data || marketsResponse.data.length === 0) {
    console.error('No active markets available')
    return
  }

  const market = marketsResponse.data[0]
  console.log(`Found market: ${market.name}`)

  // 3. Place a limit order
  console.log('Step 4: Placing order...')
  const orderResponse = await client.placeOrder({
    wallet: walletId,
    market_id: market.id,
    bid_asset: market.asset_one,
    ask_asset: market.asset_two,
    bid_amount: '100.00',
    ask_amount: '50.00',
    price: '2.00',
    mode: 'good-till-cancel',
    order_type: 'limit',
  })

  if (orderResponse.success && orderResponse.data) {
    if (MutationResponseHelpers.isPlaceOrder(orderResponse.data)) {
      const orderResult = orderResponse.data.OrderBook.PlaceOrder
      console.log(`Order placed successfully: ${orderResult.id}`)
      console.log(`Order status: ${orderResult.status}`)
      console.log(`Filled: ${orderResult.bid_amount_filled}/${orderResult.ask_amount_filled}`)
    }
  }

  console.log('Workflow completed successfully!')
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

async function main() {
  console.log('=== Cradle API Client Examples ===\n')

  // Uncomment the examples you want to run:

  await checkHealth()
  // await manageAccounts();
  // await manageAssets();
  // await manageMarkets();
  // await manageOrders();
  // await manageTimeSeries();
  // await manageLendingPools();
  // await demonstrateErrorHandling();
  // await complexWorkflow();
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error)
}

export {
  checkHealth,
  manageAccounts,
  manageAssets,
  manageMarkets,
  manageOrders,
  manageTimeSeries,
  manageLendingPools,
  demonstrateErrorHandling,
  complexWorkflow,
}
