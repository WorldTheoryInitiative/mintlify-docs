# Orderbook API v2

The Orderbook API provides real-time bid/ask order book data and order depth for prediction markets. This endpoint supports both Polymarket and Kalshi platforms, returning a unified format with normalized price data.

## Base Endpoint

```
GET /markets/{market_id}/orderbook
```

## Overview

The Orderbook API offers:

- **Real-Time Order Book Data** - Live bid/ask prices and sizes

- **Unified Response Format** - Consistent structure across Polymarket and Kalshi

- **Normalized Prices** - All prices in decimal format (0.01-1.00) for consistency

- **Order Depth** - Total depth calculations for YES and NO sides

- **Platform Auto-Detection** - Automatically detects platform from market ID

- **Metadata** - Platform-specific metadata (min order size, tick size, etc.)

## Platform Support

| Platform | Market ID Format | Example |
|----------|-----------------|---------|
| **Polymarket** | Numeric market ID | `524153` |
| **Kalshi** | Market ticker symbol | `KXBALANCE-29` |

### Platform-Specific Details

#### Polymarket

- **Market IDs**: Uses Polymarket's numeric market IDs (e.g., `524153`)

- **Price Format**: Decimal prices (0.001-0.999)

- **Data Source**: Fetches market data first to extract CLOB token IDs, then queries CLOB books API

- **Metadata**: Includes `min_order_size`, `tick_size`, `neg_risk`

- **Order Book**: Full order book with all bids and asks

#### Kalshi

- **Market IDs**: Uses Kalshi market ticker symbols (e.g., `KXBALANCE-29`)

- **Price Format**: Prices normalized from cents to decimals (0.01-1.00)

- **Authentication**: Requires `KALSHI_ACCESS_KEY` and `KALSHI_PRIVATE_KEY` environment variables

- **Data Source**: Direct authenticated API call to Kalshi orderbook endpoint

- **Metadata**: Minimal metadata (Kalshi doesn't provide trading parameters in orderbook response)

- **Order Book**: Full order book with all bids and asks

## Endpoint

```
GET /markets/{market_id}/orderbook
```

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `market_id` | string | Yes | Platform-native market identifier (Polymarket numeric ID or Kalshi ticker) |

### Example Requests

#### Polymarket Orderbook

```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/524153/orderbook" \
  -H "X-API-Key: your-api-key"
```

#### Kalshi Orderbook

```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/KXBALANCE-29/orderbook" \
  -H "X-API-Key: your-api-key"
```

**Note:** Kalshi orderbook requires environment variables `KALSHI_ACCESS_KEY` and `KALSHI_PRIVATE_KEY` to be set in Supabase Edge Functions configuration.

## Response Format

```json
{
  "data": {
    "market_id": "524153",
    "platform": "polymarket",
    "timestamp": "2025-10-30T17:33:49.595Z",
    "yes": {
      "bids": [
        {
          "price": 0.001,
          "size": 4564.05
        },
        {
          "price": 0.002,
          "size": 31.88
        }
      ],
      "asks": [
        {
          "price": 0.999,
          "size": 9573
        },
        {
          "price": 0.998,
          "size": 126.16
        }
      ],
      "depth": 53942.15
    },
    "no": {
      "bids": [
        {
          "price": 0.001,
          "size": 9573
        },
        {
          "price": 0.002,
          "size": 126.16
        }
      ],
      "asks": [
        {
          "price": 0.999,
          "size": 4564.05
        },
        {
          "price": 0.998,
          "size": 31.88
        }
      ],
      "depth": 53942.15
    },
    "metadata": {
      "min_order_size": 5,
      "tick_size": 0.001,
      "neg_risk": false
    }
  },
  "meta": {
    "request_time": 420
  }
}
```

## Response Fields

### Orderbook Object

| Field | Type | Description |
|-------|------|-------------|
| `market_id` | string | Platform-native market identifier |
| `platform` | string | Source platform (`polymarket` or `kalshi`) |
| `timestamp` | string | Response timestamp (ISO 8601) |
| `yes` | object | YES outcome order book |
| `no` | object | NO outcome order book |
| `metadata` | object | Platform-specific metadata |

### YES/NO Order Book Object

| Field | Type | Description |
|-------|------|-------------|
| `bids` | array | Array of bid orders (sorted by price, descending) |
| `asks` | array | Array of ask orders (sorted by price, ascending) |
| `depth` | number | Total order depth (sum of all bid and ask sizes) |

### Order Object

| Field | Type | Description |
|-------|------|-------------|
| `price` | number | Order price (decimal format, 0.01-1.00) |
| `size` | number | Order size (number of contracts/shares) |

### Metadata Object

| Field | Type | Description | Platform |
|-------|------|-------------|----------|
| `min_order_size` | number | Minimum order size | Polymarket only |
| `tick_size` | number | Minimum price increment | Polymarket only |
| `neg_risk` | boolean | Whether market allows negative risk | Polymarket only |

## Price Normalization

All prices are normalized to decimal format (0.01-1.00) for consistency:

- **Polymarket**: Already uses decimals (0.001-0.999), returned as-is

- **Kalshi**: Prices converted from cents (1-100) to decimals (0.01-1.00)

### Example Price Conversion

**Kalshi Raw Data:**

- `yes` array: `[1, 605]` → Price: `0.01` (1 cent = $0.01)

- `yes_dollars` array: `["0.0100", 605]` → Price: `0.01` (already decimal)

**Unified Response:**

```json
{
  "price": 0.01,
  "size": 605
}
```

## Order Sorting

Orders are returned sorted by price:

- **Bids**: Sorted in descending order (highest bid first)

- **Asks**: Sorted in ascending order (lowest ask first)

This allows you to quickly access:

- Best bid: `bids[0]`

- Best ask: `asks[0]`

- Bid-ask spread: `asks[0].price - bids[0].price`

## Error Responses

### Market Not Found (404)

```json
{
  "error": {
    "code": "MARKET_NOT_FOUND",
    "message": "Market invalid_market_id not found on any supported platform (Polymarket or Kalshi)",
    "details": {
      "polymarket_error": "Polymarket API error: 404 Not Found",
      "kalshi_error": "Kalshi API error: 404 Not Found"
    },
    "timestamp": "2025-10-30T17:33:49.595Z"
  },
  "meta": {
    "request_time": 250
  }
}
```

### Kalshi Credentials Not Configured (500)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred while fetching orderbook",
    "details": {
      "error": "Kalshi credentials not configured. Please set KALSHI_ACCESS_KEY and KALSHI_PRIVATE_KEY environment variables."
    },
    "timestamp": "2025-10-30T17:33:49.595Z"
  },
  "meta": {
    "request_time": 150
  }
}
```

### Invalid Kalshi Credentials (500)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred while fetching orderbook",
    "details": {
      "error": "Invalid Kalshi credentials"
    },
    "timestamp": "2025-10-30T17:33:49.595Z"
  },
  "meta": {
    "request_time": 200
  }
}
```

## Use Cases

### 1. Calculate Bid-Ask Spread

```javascript
const orderbook = await fetchOrderbook('524153');

const yesSpread = orderbook.data.yes.asks[0].price - orderbook.data.yes.bids[0].price;
const noSpread = orderbook.data.no.asks[0].price - orderbook.data.no.bids[0].price;

console.log(`YES spread: ${yesSpread}`);
console.log(`NO spread: ${noSpread}`);
```

### 2. Analyze Order Depth

```javascript
const orderbook = await fetchOrderbook('524153');

console.log(`YES depth: ${orderbook.data.yes.depth}`);
console.log(`NO depth: ${orderbook.data.no.depth}`);

// Calculate total market depth
const totalDepth = orderbook.data.yes.depth + orderbook.data.no.depth;
console.log(`Total market depth: ${totalDepth}`);
```

### 3. Build Order Book Visualization

```javascript
const orderbook = await fetchOrderbook('524153');

// Build order book ladder
const buildLadder = (bids, asks) => {
  const ladder = [];
  
  // Add asks (reversed, highest first)
  [...asks].reverse().forEach(ask => {
    ladder.push({ ...ask, side: 'ask' });
  });
  
  // Add bids (highest first)
  bids.forEach(bid => {
    ladder.push({ ...bid, side: 'bid' });
  });
  
  return ladder;
};

const yesLadder = buildLadder(orderbook.data.yes.bids, orderbook.data.yes.asks);
console.log('YES Order Book Ladder:', yesLadder);
```

### 4. Find Best Execution Price

```javascript
const orderbook = await fetchOrderbook('524153');

// For buying YES (market buy)
const bestYesAsk = orderbook.data.yes.asks[0];
console.log(`Best YES ask: ${bestYesAsk.price} @ ${bestYesAsk.size}`);

// For selling YES (market sell)
const bestYesBid = orderbook.data.yes.bids[0];
console.log(`Best YES bid: ${bestYesBid.price} @ ${bestYesBid.size}`);
```

### 5. Compare Order Books Across Platforms

```javascript
const polymarketOrderbook = await fetchOrderbook('524153');
const kalshiOrderbook = await fetchOrderbook('KXBALANCE-29');

console.log('Polymarket YES depth:', polymarketOrderbook.data.yes.depth);
console.log('Kalshi YES depth:', kalshiOrderbook.data.yes.depth);
```

## Examples

### JavaScript/Node.js

```javascript
const fetchOrderbook = async (marketId) => {
  const response = await fetch(
    `https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/${marketId}/orderbook`,
    {
      headers: {
        'X-API-Key': 'your-api-key',
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get Polymarket orderbook
const polymarketOrderbook = await fetchOrderbook('524153');
console.log('Polymarket orderbook:', polymarketOrderbook);

// Get Kalshi orderbook
const kalshiOrderbook = await fetchOrderbook('KXBALANCE-29');
console.log('Kalshi orderbook:', kalshiOrderbook);
```

### Python

```python
import requests

def fetch_orderbook(market_id, api_key):
    url = f"https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/{market_id}/orderbook"
    headers = {
        "X-API-Key": api_key
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Get Polymarket orderbook
polymarket_ob = fetch_orderbook('524153', 'your-api-key')
print(f"YES depth: {polymarket_ob['data']['yes']['depth']}")

# Get Kalshi orderbook
kalshi_ob = fetch_orderbook('KXBALANCE-29', 'your-api-key')
print(f"YES depth: {kalshi_ob['data']['yes']['depth']}")
```

### cURL

```bash
# Polymarket orderbook
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/524153/orderbook" \
  -H "X-API-Key: your-api-key" \
  | jq '.data'

# Kalshi orderbook
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/KXBALANCE-29/orderbook" \
  -H "X-API-Key: your-api-key" \
  | jq '.data'

# Get best bid/ask
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets/524153/orderbook" \
  -H "X-API-Key: your-api-key" \
  | jq '{
    best_yes_bid: .data.yes.bids[0],
    best_yes_ask: .data.yes.asks[0],
    spread: (.data.yes.asks[0].price - .data.yes.bids[0].price)
  }'
```

## Performance Considerations

- **Response Times**: Typical response times are 200-500ms

- **Polymarket**: Requires two API calls (market data + orderbook), ~300-500ms

- **Kalshi**: Single authenticated API call, ~200-400ms

- **Rate Limits**: Subject to API key rate limits

## Platform-Specific Implementation Details

### Polymarket Implementation

1. **Step 1**: Fetch market data from `https://gamma-api.polymarket.com/markets/{marketId}`

2. **Step 2**: Extract `clobTokenIds` array from market metadata

3. **Step 3**: POST to `https://clob.polymarket.com/books` with token IDs

4. **Step 4**: Transform response to unified format (first token = YES, second = NO)

### Kalshi Implementation

1. **Step 1**: Read credentials from environment variables (`KALSHI_ACCESS_KEY`, `KALSHI_PRIVATE_KEY`)

2. **Step 2**: Create authenticated request with RSA-PSS signature

3. **Step 3**: GET from `https://api.elections.kalshi.com/trade-api/v2/markets/{ticker}/orderbook`

4. **Step 4**: Transform response (normalize prices from cents to decimals)

## Best Practices

### 1. Error Handling

```javascript
const fetchOrderbookSafely = async (marketId) => {
  try {
    const orderbook = await fetchOrderbook(marketId);
    return orderbook;
  } catch (error) {
    if (error.response?.status === 404) {
      console.error(`Market ${marketId} not found`);
      return null;
    }
    throw error;
  }
};
```

### 2. Caching Considerations

```javascript
// Orderbook data changes frequently
// Cache for short periods only (5-10 seconds)
const cacheOrderbook = async (marketId, ttl = 5000) => {
  const cacheKey = `orderbook:${marketId}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  
  const orderbook = await fetchOrderbook(marketId);
  cache.set(cacheKey, {
    data: orderbook,
    timestamp: Date.now()
  });
  
  return orderbook;
};
```

### 3. Handle Platform Differences

```javascript
const orderbook = await fetchOrderbook('524153');

if (orderbook.data.platform === 'polymarket') {
  console.log(`Min order size: ${orderbook.data.metadata.min_order_size}`);
  console.log(`Tick size: ${orderbook.data.metadata.tick_size}`);
} else if (orderbook.data.platform === 'kalshi') {
  // Kalshi metadata is typically empty
  console.log('Kalshi orderbook (no metadata available)');
}
```

## Environment Variables

For Kalshi orderbook support, the following environment variables must be set in Supabase Edge Functions:

- `KALSHI_ACCESS_KEY` - Kalshi API key ID

- `KALSHI_PRIVATE_KEY` - Kalshi private key (PEM format or base64)

### Setting Environment Variables

1. Go to Supabase Dashboard

2. Navigate to: Project Settings → Edge Functions → Secrets

3. Add:

   - Name: `KALSHI_ACCESS_KEY`, Value: `<your-kalshi-api-key-id>`

   - Name: `KALSHI_PRIVATE_KEY`, Value: `<your-kalshi-private-key>`

## Related Endpoints

- **[Markets API v2](./markets-v2.md)** - Get market information and metadata

- **[Price History API v2](./price-history-v2.md)** - Historical price data

- **[Trading API](./trading/trade-v1.md)** - Execute trades on markets

## Changelog

### v2.0.0 (2025-10-30)

- **NEW**: Orderbook endpoint for Polymarket and Kalshi

- **NEW**: Unified orderbook format with normalized prices

- **NEW**: Platform auto-detection from market ID

- **NEW**: Order depth calculations

- **NEW**: Metadata support for Polymarket (min_order_size, tick_size, neg_risk)

---

*Last updated: October 2025*

