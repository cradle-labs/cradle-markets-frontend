# Postman Testing Guide for Cradle API

This guide shows you how to test the Cradle API using Postman with your API key.

## Setup

### 1. Base URL
Set your base URL (from `NEXT_PUBLIC_CRADLE_API_URL` environment variable):
```
https://your-api-domain.com
```

### 2. Authentication
All authenticated requests require a Bearer token in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

### 3. Headers
Required headers for all requests:
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

## Endpoints

### Health Check (No Auth Required)
**GET** `/health`

**Headers:**
```
Accept: application/json
```

**Example Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-29T11:32:08.872282687+00:00"
}
```

---

### Get Account by ID
**GET** `/accounts/{account_id}`

**Example:**
```
GET https://your-api-domain.com/accounts/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "linked_account_id": "user_123",
    "created_at": "2025-01-01T00:00:00Z",
    "account_type": "retail",
    "status": "verified"
  }
}
```

---

### Get Account by Linked ID
**GET** `/accounts/linked/{linked_account_id}`

**Example:**
```
GET https://your-api-domain.com/accounts/linked/user_123
```

---

### Get Wallets for Account
**GET** `/accounts/{account_id}/wallets`

**Example:**
```
GET https://your-api-domain.com/accounts/550e8400-e29b-41d4-a716-446655440000/wallets
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "wallet-uuid",
    "cradle_account_id": "550e8400-e29b-41d4-a716-446655440000",
    "address": "0x123...",
    "contract_id": "contract-123",
    "created_at": "2025-01-01T00:00:00Z",
    "status": "active"
  }
}
```

---

### Get Wallet by ID
**GET** `/wallets/{wallet_id}`

**Example:**
```
GET https://your-api-domain.com/wallets/wallet-uuid
```

---

### Get Wallet by Account ID
**GET** `/wallets/account/{account_id}`

**Example:**
```
GET https://your-api-domain.com/wallets/account/550e8400-e29b-41d4-a716-446655440000
```

---

### List Assets
**GET** `/assets`

**Example:**
```
GET https://your-api-domain.com/assets
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "asset-uuid",
      "asset_manager": "manager-123",
      "token": "token-123",
      "created_at": "2025-01-01T00:00:00Z",
      "asset_type": "native",
      "name": "USDC",
      "symbol": "USDC",
      "decimals": 8,
      "icon": "https://..."
    }
  ]
}
```

---

### Get Asset by ID
**GET** `/assets/{asset_id}`

**Example:**
```
GET https://your-api-domain.com/assets/asset-uuid
```

---

### List Markets
**GET** `/markets`

**Query Parameters (optional):**
- `market_type`: `spot` | `derivative` | `futures`
- `status`: `active` | `inactive` | `suspended`
- `regulation`: `regulated` | `unregulated`

**Example:**
```
GET https://your-api-domain.com/markets?market_type=spot&status=active
```

---

### Get Market by ID
**GET** `/markets/{market_id}`

---

### List Orders
**GET** `/orders`

**Query Parameters (optional):**
- `wallet`: wallet UUID
- `market_id`: market UUID
- `status`: `open` | `closed` | `cancelled`
- `order_type`: `limit` | `market`
- `mode`: `fill-or-kill` | `immediate-or-cancel` | `good-till-cancel`

**Example:**
```
GET https://your-api-domain.com/orders?wallet=wallet-uuid&status=open
```

---

### Get Order by ID
**GET** `/orders/{order_id}`

---

### List Lending Pools
**GET** `/pools`

**Example:**
```
GET https://your-api-domain.com/pools
```

---

### Get Lending Pool by ID
**GET** `/pools/{pool_id}`

---

### Get Pool Stats
**GET** `/pool-stats/{pool_id}`

**Example:**
```
GET https://your-api-domain.com/pool-stats/pool-uuid
```

---

### Get Loans by Wallet
**GET** `/loans?wallet={wallet_id}`

**Example:**
```
GET https://your-api-domain.com/loans?wallet=wallet-uuid
```

---

### Get Time Series History
**GET** `/time-series/history`

**Query Parameters:**
- `market`: market UUID (required)
- `duration_secs`: number (required)
- `interval`: `15secs` | `30secs` | `45secs` | `1min` | `5min` | `15min` | `30min` | `1hr` | `4hr` | `1day` | `1week` (required)
- `asset_id`: asset UUID (required)

**Example:**
```
GET https://your-api-domain.com/time-series/history?market=market-uuid&duration_secs=86400&interval=1hr&asset_id=asset-uuid
```

---

## Action Router (Mutations)

### Endpoint
**POST** `/process`

This endpoint handles all mutations (create, update, delete operations).

### Request Structure
The body must have exactly one top-level key matching a domain:
- `Accounts`
- `AssetBook`
- `Markets`
- `OrderBook`
- `Pool`
- `Listing`
- `MarketTimeSeries`

### Example: Create Account
**POST** `/process`

**Body:**
```json
{
  "Accounts": {
    "CreateAccount": {
      "linked_account_id": "user_123",
      "account_type": "retail",
      "status": "verified"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "Accounts": {
      "CreateAccount": {
        "id": "account-uuid",
        "wallet_id": "wallet-uuid"
      }
    }
  }
}
```

---

### Example: Place Order
**POST** `/process`

**Body:**
```json
{
  "OrderBook": {
    "PlaceOrder": {
      "wallet": "wallet-uuid",
      "market_id": "market-uuid",
      "bid_asset": "asset-uuid",
      "ask_asset": "asset-uuid",
      "bid_amount": "1000000000",
      "ask_amount": "500000000",
      "price": "0.5",
      "mode": "good-till-cancel",
      "order_type": "limit"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "OrderBook": {
      "PlaceOrder": {
        "id": "order-uuid",
        "status": "Filled",
        "bid_amount_filled": "1000000000",
        "ask_amount_filled": "500000000",
        "matched_trades": ["trade-uuid-1", "trade-uuid-2"]
      }
    }
  }
}
```

---

### Example: Create Asset
**POST** `/process`

**Body:**
```json
{
  "AssetBook": {
    "CreateNewAsset": {
      "asset_type": "native",
      "name": "My Token",
      "symbol": "MTK",
      "decimals": 8,
      "icon": "https://example.com/icon.png"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "AssetBook": {
      "CreateNewAsset": "asset-uuid"
    }
  }
}
```

---

## Postman Collection Setup

### 1. Create Environment Variables
In Postman, create an environment with:
- `base_url`: Your API base URL
- `api_key`: Your API key

### 2. Create Collection
Create a new collection and set collection variables:
- `base_url`: `{{base_url}}`
- `api_key`: `{{api_key}}`

### 3. Set Collection Authorization
Go to Collection → Authorization:
- Type: `Bearer Token`
- Token: `{{api_key}}`

This will automatically add the Authorization header to all requests.

### 4. Create Pre-request Script (Optional)
Add this to your collection's pre-request script to automatically set headers:
```javascript
pm.request.headers.add({
  key: 'Accept',
  value: 'application/json'
});

pm.request.headers.add({
  key: 'Content-Type',
  value: 'application/json'
});
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (missing or invalid API key)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error
- `502`: Bad Gateway (API server unavailable)
- `503`: Service Unavailable

---

## Testing Tips

1. **Start with Health Check**: Test `/health` first (no auth required) to verify connectivity
2. **Check Headers**: Ensure `Authorization: Bearer YOUR_API_KEY` is set
3. **Use Environment Variables**: Store your API key in Postman environment variables
4. **Test Error Cases**: Try invalid IDs, missing parameters, etc.
5. **Check Response Format**: Most responses wrap data in `{ success: true, data: ... }`

---

## Quick Test Checklist

- [ ] Health check works (no auth)
- [ ] Get account by ID works
- [ ] Get wallet by account ID works
- [ ] List assets works
- [ ] List markets works
- [ ] Create account via Action Router works
- [ ] Place order via Action Router works

---

## Example Postman Request

**Method:** `GET`  
**URL:** `{{base_url}}/accounts/550e8400-e29b-41d4-a716-446655440000`  
**Headers:**
```
Accept: application/json
Authorization: Bearer {{api_key}}
```

**Method:** `POST`  
**URL:** `{{base_url}}/process`  
**Headers:**
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer {{api_key}}
```
**Body (raw JSON):**
```json
{
  "Accounts": {
    "CreateAccount": {
      "linked_account_id": "test_user_123",
      "account_type": "retail",
      "status": "verified"
    }
  }
}
```

