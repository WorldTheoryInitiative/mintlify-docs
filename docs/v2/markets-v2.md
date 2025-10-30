# Markets API v2

The Markets API v2 provides real-time access to prediction markets across all supported platforms without database dependency. This endpoint directly proxies external platform APIs (Polymarket, Kalshi, and Limitless), formats the data into a unified response structure, and returns it immediately for maximum freshness and performance.

## Base Endpoint

```
GET /markets-v2
```

## Overview

The Markets API v2 offers:
- **Real-Time Data** - Direct API calls to external platforms with no database caching
- **Unified Response Format** - Consistent data structure across all platforms
- **Individual Market Lookup** - Both query parameter and path-based routing support
- **Advanced Filtering** - Status, date range, and platform filtering
- **Robust Error Handling** - Graceful degradation when individual platforms fail
- **Performance Optimized** - Sub-second response times for most requests
- **Platform Native IDs** - Uses actual platform IDs for better traceability

## Key Differences from v1

| Feature | v1 | v2 |
|---------|----|----|
| **Data Source** | Supabase database | Direct external API calls |
| **Data Freshness** | Cached (5-15 minutes) | Real-time (immediate) |
| **Individual Lookup** | Path-based only | Query parameter + Path-based |
| **Platform IDs** | Generated internal IDs | Platform-native IDs |
| **Slug Structure** | Single `slug` field | `event_slug` + `market_slug` |
| **Error Handling** | Database errors | Platform-specific API errors |
| **Performance** | Fast (cached) | Fast (direct API calls) |

## Market Discovery

### Endpoint

```
GET /markets-v2
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | - | Filter by platforms (comma-separated): `polymarket`, `kalshi`, `limitless` |
| `status` | string | No | - | Filter by market status (comma-separated): `open`, `closed`, `resolved`, `paused` |
| `start_date_min` | string | No | - | Filter markets starting after this date (ISO 8601) |
| `start_date_max` | string | No | - | Filter markets starting before this date (ISO 8601) |
| `end_date_min` | string | No | - | Filter markets ending after this date (ISO 8601) |
| `end_date_max` | string | No | - | Filter markets ending before this date (ISO 8601) |
| `sort` | string | No | `volume_desc` | Sort order: `volume_desc`, `volume_asc`, `created_desc`, `created_asc` |
| `market_id` | string | No | - | Get specific market by ID (alternative to path-based lookup) |
| `limit` | number | No | `50` | Number of results per page (1-100) |
| `offset` | number | No | `0` | Pagination offset |

### Example Requests

#### Basic Request
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?limit=10" \
  -H "X-API-Key: your-api-key" \
```

#### Platform Filtering
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?platform=polymarket&limit=20" \
  -H "X-API-Key: your-api-key" \
```

#### Status Filtering
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?status=open&limit=15" \
  -H "X-API-Key: your-api-key" \
```

#### Date Range Filtering
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?start_date_min=2025-01-01&end_date_max=2025-12-31&limit=25" \
  -H "X-API-Key: your-api-key" \
```

#### Query Parameter Individual Lookup
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?market_id=516710&platform=polymarket" \
  -H "X-API-Key: your-api-key" \
```

### Response Format

```json
{
  "markets": [
    {
      "id": "516710",
      "platform": "polymarket",
      "platform_id": "516710",
      "event_id": "",
      "event_name": null,
      "event_slug": null,
      "title": "US recession in 2025?",
      "market_slug": "us-recession-in-2025",
      "description": "This market will resolve to \"Yes\", if either of the following conditions are met:\n\n1. The National Bureau of Economic Research (NBER) publicly announces that a recession has occurred in the United States, at any point in 2025, with the announcement made by December 31, 2025, 11:59 PM ET.\n\n2. The seasonally adjusted annualized percent change in quarterly U.S. real GDP from the previous quarter is less than 0.0 for two consecutive quarters between Q4 2024 and Q4 2025 (inclusive), as reported by the Bureau of Economic Analysis (BEA). \n\nOtherwise, this market will resolve to \"No\".",
      "subcategory": null,
      "source_url": "https://polymarket.com/event/us-recession-in-2025",
      "status": "open",
      "market_type": "binary",
      "category": null,
      "tags": null,
      "outcomes": [
        {
          "id": "yes",
          "name": "Yes"
        },
        {
          "id": "no",
          "name": "No"
        }
      ],
      "current_prices": {
        "yes": {
          "price": 0.065,
          "bid": 0.065,
          "ask": 0.065
        },
        "no": {
          "price": 0.935,
          "bid": 0.935,
          "ask": 0.935
        }
      },
      "volume_24h": 14627.926604000002,
      "volume_7d": null,
      "volume_total": 9520372.917076,
      "liquidity": 91870.3842,
      "liquidity_score": 0.09,
      "open_interest": null,
      "unique_traders": null,
      "fee_rate": null,
      "trading_fee": null,
      "withdrawal_fee": null,
      "created_at": "2024-12-29T18:04:31.897422Z",
      "trading_start_at": "2025-01-08T01:33:54.924Z",
      "trading_end_at": "2026-02-28T12:00:00Z",
      "resolution_date": "2026-02-28T12:00:00Z",
      "resolved_at": null,
      "resolution_criteria": "This market will resolve to \"Yes\", if either of the following conditions are met:\n\n1. The National Bureau of Economic Research (NBER) publicly announces that a recession has occurred in the United States, at any point in 2025, with the announcement made by December 31, 2025, 11:59 PM ET.\n\n2. The seasonally adjusted annualized percent change in quarterly U.S. real GDP from the previous quarter is less than 0.0 for two consecutive quarters between Q4 2024 and Q4 2025 (inclusive), as reported by the Bureau of Economic Analysis (BEA). \n\nOtherwise, this market will resolve to \"No\".",
      "resolution_source": "https://www.bea.gov/data/gdp/gross-domestic-product",
      "price_24h_changes": {
        "yes": 0,
        "no": 0
      },
      "price_7d_changes": {
        "yes": 0,
        "no": 0
      },
      "last_trades": null,
      "metadata": {
        "competitive": 0.8408837688410519,
        "bestBid": 0.06,
        "bestAsk": 0.07,
        "spread": 0.01,
        "clobTokenIds": "[\"104173557214744537570424345347209544585775842950109756851652855913015295701992\", \"44528029102356085806317866371026691780796471200782980570839327755136990994869\"]",
        "acceptingOrders": true,
        "lastTradePrice": 0.06
      },
      "raw_data": {
        "id": "516710",
        "question": "US recession in 2025?",
        "slug": "us-recession-in-2025",
        "description": "This market will resolve to \"Yes\"...",
        "active": true,
        "closed": false,
        "outcomes": ["Yes", "No"],
        "outcomePrices": [0.065, 0.935],
        "volume24hr": 14627.926604000002,
        "volume1wk": null,
        "volumeNum": 9520372.917076,
        "liquidityNum": 91870.3842,
        "createdAt": "2024-12-29T18:04:31.897422Z",
        "startDate": "2025-01-08T01:33:54.924Z",
        "endDate": "2026-02-28T12:00:00Z",
        "closedTime": null,
        "resolutionSource": "https://www.bea.gov/data/gdp/gross-domestic-product",
        "oneDayPriceChange": 0,
        "oneWeekPriceChange": 0,
        "competitive": 0.8408837688410519,
        "bestBid": 0.06,
        "bestAsk": 0.07,
        "spread": 0.01,
        "clobTokenIds": "[\"104173557214744537570424345347209544585775842950109756851652855913015295701992\", \"44528029102356085806317866371026691780796471200782980570839327755136990994869\"]",
        "acceptingOrders": true,
        "lastTradePrice": 0.06,
        "events": []
      },
      "last_synced_at": "2025-01-07T18:25:52.236Z"
    }
  ],
  "pagination": {
    "total": 455,
    "limit": 10,
    "offset": 0,
    "has_more": true,
    "next_offset": 10
  },
  "meta": {
    "request_time": 473,
    "cache_hit": false,
    "data_freshness": "2025-01-07T18:25:52.236Z"
  }
}
```

## Individual Market Lookup

The v2 API supports two methods for individual market lookup:

### Method 1: Path-Based Routing

```
GET /markets-v2/{market_id}
```

#### Example Request
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2/516710" \
  -H "X-API-Key: your-api-key" \
```

### Method 2: Query Parameter

```
GET /markets-v2?market_id={market_id}&platform={platform}
```

#### Example Request
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?market_id=KXTRUMPRESIGN&platform=kalshi" \
  -H "X-API-Key: your-api-key" \
```

### Individual Market Response Format

```json
{
  "markets": [
    {
      "id": "516710",
      "platform": "polymarket",
      "platform_id": "516710",
      "event_id": "",
      "event_name": null,
      "event_slug": null,
      "title": "US recession in 2025?",
      "market_slug": "us-recession-in-2025",
      "description": "This market will resolve to \"Yes\"...",
      "subcategory": null,
      "source_url": "https://polymarket.com/event/us-recession-in-2025",
      "status": "open",
      "market_type": "binary",
      "category": null,
      "tags": null,
      "outcomes": [
        {
          "id": "yes",
          "name": "Yes"
        },
        {
          "id": "no",
          "name": "No"
        }
      ],
      "current_prices": {
        "yes": {
          "price": 0.065,
          "bid": 0.065,
          "ask": 0.065
        },
        "no": {
          "price": 0.935,
          "bid": 0.935,
          "ask": 0.935
        }
      },
      "volume_24h": 14627.926604000002,
      "volume_7d": null,
      "volume_total": 9520372.917076,
      "liquidity": 91870.3842,
      "liquidity_score": 0.09,
      "open_interest": null,
      "unique_traders": null,
      "fee_rate": null,
      "trading_fee": null,
      "withdrawal_fee": null,
      "created_at": "2024-12-29T18:04:31.897422Z",
      "trading_start_at": "2025-01-08T01:33:54.924Z",
      "trading_end_at": "2026-02-28T12:00:00Z",
      "resolution_date": "2026-02-28T12:00:00Z",
      "resolved_at": null,
      "resolution_criteria": "This market will resolve to \"Yes\"...",
      "resolution_source": "https://www.bea.gov/data/gdp/gross-domestic-product",
      "price_24h_changes": {
        "yes": 0,
        "no": 0
      },
      "price_7d_changes": {
        "yes": 0,
        "no": 0
      },
      "last_trades": null,
      "metadata": {
        "competitive": 0.8408837688410519,
        "bestBid": 0.06,
        "bestAsk": 0.07,
        "spread": 0.01,
        "clobTokenIds": "[\"104173557214744537570424345347209544585775842950109756851652855913015295701992\", \"44528029102356085806317866371026691780796471200782980570839327755136990994869\"]",
        "acceptingOrders": true,
        "lastTradePrice": 0.06
      },
      "raw_data": { /* Full raw platform response */ },
      "last_synced_at": "2025-01-07T18:25:52.236Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "has_more": false
  },
  "meta": {
    "request_time": 234,
    "cache_hit": false,
    "data_freshness": "2025-01-07T18:25:52.236Z"
  }
}
```

## Response Fields

### Market Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Platform-native market identifier |
| `platform` | string | Source platform (`polymarket`, `kalshi`, `limitless`) |
| `platform_id` | string | Original platform market ID (same as `id`) |
| `event_id` | string | Associated event identifier |
| `event_name` | string | Event title (if available) |
| `event_slug` | string | URL-friendly event identifier |
| `title` | string | Market question/title |
| `market_slug` | string | URL-friendly market identifier |
| `description` | string | Detailed market description |
| `subcategory` | string | Market subcategory |
| `source_url` | string | Original platform URL |
| `status` | string | Market status (`open`, `closed`, `resolved`, `paused`) |
| `market_type` | string | Market type (`binary`, `categorical`, `scalar`) |
| `category` | string | Market category |
| `tags` | array | Array of market tags |
| `outcomes` | array | Array of market outcomes |
| `current_prices` | object | Current prices for each outcome |
| `volume_24h` | number | 24-hour trading volume |
| `volume_7d` | number | 7-day trading volume |
| `volume_total` | number | Total trading volume |
| `liquidity` | number | Market liquidity |
| `liquidity_score` | number | Calculated liquidity score (0-1) |
| `open_interest` | number | Current open interest |
| `unique_traders` | number | Number of unique traders |
| `fee_rate` | number | Trading fee rate |
| `trading_fee` | number | Trading fee |
| `withdrawal_fee` | number | Withdrawal fee |
| `created_at` | string | Market creation timestamp (ISO 8601) |
| `trading_start_at` | string | Trading start timestamp (ISO 8601) |
| `trading_end_at` | string | Trading end timestamp (ISO 8601) |
| `resolution_date` | string | Market resolution timestamp (ISO 8601) |
| `resolved_at` | string | Market resolution timestamp (ISO 8601) |
| `resolution_criteria` | string | Market resolution criteria |
| `resolution_source` | string | Resolution source URL |
| `price_24h_changes` | object | 24-hour price changes per outcome |
| `price_7d_changes` | object | 7-day price changes per outcome |
| `last_trades` | object | Last trade information |
| `metadata` | object | Platform-specific metadata |
| `raw_data` | object | Complete raw platform response |
| `last_synced_at` | string | Last data sync timestamp (ISO 8601) |

### Outcome Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Outcome identifier |
| `name` | string | Outcome display name |

### Current Prices Object
| Field | Type | Description |
|-------|------|-------------|
| `price` | number | Current market price |
| `bid` | number | Best bid price |
| `ask` | number | Best ask price |

### Pagination Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of markets |
| `limit` | number | Number of results per page |
| `offset` | number | Current page offset |
| `has_more` | boolean | Whether more pages exist |
| `next_offset` | number | Offset for next page |

### Meta Object
| Field | Type | Description |
|-------|------|-------------|
| `request_time` | number | Request processing time (ms) |
| `cache_hit` | boolean | Whether response was served from cache |
| `data_freshness` | string | Data freshness timestamp (ISO 8601) |

## Platform-Specific Details

### Polymarket
- **Market IDs**: Uses Polymarket's internal market IDs (e.g., `516710`)
- **Event Structure**: Markets may have associated events with `event_slug`
- **Source URLs**: Uses `event_slug` when available, falls back to `market_slug`
- **Data Richness**: Full metadata including competitive scores, CLOB token IDs
- **Price Data**: Bid/ask spreads and last trade prices
- **Volume Data**: 24h, 7d, and total volume available

### Kalshi
- **Market IDs**: Uses Kalshi ticker symbols (e.g., `KXTRUMPRESIGN`)
- **Event Structure**: Markets are nested within events
- **Source URLs**: Uses market ticker for direct market URLs
- **Data Richness**: Settlement timers, risk limits, tick sizes
- **Price Data**: Cent-based prices converted to decimal (0-1)
- **Volume Data**: 24h and total volume available

### Limitless
- **Market IDs**: Uses Limitless market slugs (e.g., `will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770`)
- **Event Structure**: Markets are standalone (no explicit events)
- **Source URLs**: Uses market slug for direct market URLs
- **Data Richness**: Creator information, collateral tokens, trading metadata
- **Price Data**: Decimal prices (0-1) with bid/ask spreads
- **Volume Data**: 24h and total volume available

## Error Responses

### Validation Error (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "limit": ["limit must be a number between 1 and 100"],
        "status": ["Invalid status value. Valid options: open, closed, resolved, paused"]
      }
    },
    "timestamp": "2025-01-07T18:25:52.236Z"
  },
  "meta": {
    "request_time": 5
  }
}
```

### Market Not Found (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Market not found with ID 'INVALID123'",
    "details": {
      "resource": "Market",
      "id": "INVALID123",
      "suggestion": "Use GET /markets-v2 to find valid market IDs"
    },
    "timestamp": "2025-01-07T18:25:52.236Z"
  },
  "meta": {
    "request_time": 128
  }
}
```

### Platform Unavailable (503)
```json
{
  "error": {
    "code": "PLATFORM_UNAVAILABLE",
    "message": "Platform 'polymarket' is currently unavailable",
    "details": {
      "platform": "polymarket",
      "reason": "External API temporarily down",
      "retry_after": 60
    },
    "timestamp": "2025-01-07T18:25:52.236Z"
  },
  "meta": {
    "request_time": 2000
  }
}
```

### Authentication Error (401)
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or missing API key",
    "timestamp": "2025-01-07T18:25:52.236Z"
  }
}
```

## Rate Limits

- **Free Tier**: 100 requests/minute
- **Starter Tier**: 500 requests/minute
- **Pro Tier**: 2000 requests/minute
- **Enterprise**: Custom limits

## Best Practices

### 1. Use Appropriate Parameters
```javascript
// For basic market discovery
const markets = await fetchMarketsV2();

// For platform-specific data
const polymarketMarkets = await fetchMarketsV2({
  platform: 'polymarket',
  limit: 20
});

// For status filtering
const openMarkets = await fetchMarketsV2({
  status: 'open',
  limit: 50
});

// For date range filtering
const upcomingMarkets = await fetchMarketsV2({
  start_date_min: '2025-01-01',
  end_date_max: '2025-12-31',
  limit: 25
});
```

### 2. Individual Market Lookup
```javascript
// Path-based lookup (recommended)
const market = await fetchMarketV2('516710');

// Query parameter lookup
const market = await fetchMarketsV2({
  market_id: 'KXTRUMPRESIGN',
  platform: 'kalshi'
});
```

### 3. Handle Platform Differences
```javascript
const markets = await fetchMarketsV2({ limit: 10 });

markets.markets.forEach(market => {
  if (market.platform === 'polymarket') {
    console.log(`Polymarket: ${market.title}`);
    console.log(`Source: ${market.source_url}`);
    console.log(`Competitive: ${market.metadata.competitive}`);
  } else if (market.platform === 'kalshi') {
    console.log(`Kalshi: ${market.title}`);
    console.log(`Source: ${market.source_url}`);
    console.log(`Settlement Timer: ${market.metadata.settlement_timer_seconds}s`);
  } else if (market.platform === 'limitless') {
    console.log(`Limitless: ${market.title}`);
    console.log(`Source: ${market.source_url}`);
    console.log(`Creator: ${market.metadata.creator.name}`);
    console.log(`Collateral Token: ${market.metadata.collateralToken.symbol}`);
  }
});
```

### 4. Error Handling
```javascript
const fetchMarketsV2WithRetry = async (params, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchMarketsV2(params);
    } catch (error) {
      if (error.status === 503 && attempt < maxRetries - 1) {
        // Platform unavailable, retry after delay
        const retryAfter = error.details?.retry_after || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      throw error;
    }
  }
};
```

## Use Cases

### 1. Real-Time Market Monitoring
Monitor markets for immediate updates:
```javascript
const monitorMarkets = async () => {
  const markets = await fetchMarketsV2({
    platform: 'polymarket',
    status: 'open',
    limit: 20
  });
  
  markets.markets.forEach(market => {
    console.log(`${market.title}: ${market.current_prices.yes.price}`);
    console.log(`Volume 24h: $${market.volume_24h?.toLocaleString()}`);
  });
};
```

### 2. Cross-Platform Analysis
Compare similar markets across platforms:
```javascript
const compareMarkets = async () => {
  const polymarketMarkets = await fetchMarketsV2({
    platform: 'polymarket',
    limit: 10
  });
  
  const kalshiMarkets = await fetchMarketsV2({
    platform: 'kalshi',
    limit: 10
  });
  
  console.log('Polymarket markets:', polymarketMarkets.markets.length);
  console.log('Kalshi markets:', kalshiMarkets.markets.length);
};
```

### 3. Individual Market Analysis
Get detailed information about specific markets:
```javascript
const analyzeMarket = async (marketId, platform) => {
  const market = await fetchMarketsV2({
    market_id: marketId,
    platform: platform
  });
  
  if (market.markets.length > 0) {
    const m = market.markets[0];
    console.log(`Market: ${m.title}`);
    console.log(`Status: ${m.status}`);
    console.log(`Volume 24h: $${m.volume_24h?.toLocaleString()}`);
    console.log(`Liquidity Score: ${m.liquidity_score}`);
    console.log(`Source: ${m.source_url}`);
  }
};
```

### 4. Date-Based Filtering
Find markets within specific time ranges:
```javascript
const findUpcomingMarkets = async () => {
  const upcoming = await fetchMarketsV2({
    start_date_min: new Date().toISOString(),
    end_date_max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    limit: 50
  });
  
  console.log(`Found ${upcoming.markets.length} upcoming markets`);
  upcoming.markets.forEach(market => {
    console.log(`${market.title} - Ends: ${market.trading_end_at}`);
  });
};
```

## Examples

### JavaScript/Node.js
```javascript
const fetchMarketsV2 = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?${queryString}`, {
    headers: {
      'X-API-Key': 'your-api-key',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get all markets
const allMarkets = await fetchMarketsV2({ limit: 10 });

// Get platform-specific markets
const polymarketMarkets = await fetchMarketsV2({
  platform: 'polymarket',
  limit: 20
});

// Get individual market
const individualMarket = await fetchMarketsV2({
  market_id: '516710',
  platform: 'polymarket'
});
```

### Python
```python
import requests

def fetch_markets_v2(params=None):
    if params is None:
        params = {}
    
    url = "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2"
    headers = {
        "X-API-Key": "your-api-key",
    }
    
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Get markets with filtering
markets = fetch_markets_v2({
    "platform": "kalshi",
    "status": "open",
    "limit": 15
})

# Process markets
for market in markets["markets"]:
    print(f"Market: {market['title']}")
    print(f"Platform: {market['platform']}")
    print(f"Volume 24h: ${market.get('volume_24h', 0):,.2f}")
    print(f"Source: {market['source_url']}")
    print("---")
```

### cURL
```bash
# Basic markets request
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?limit=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {id: .id, title: .title, platform: .platform, volume_24h: .volume_24h}'

# Platform-specific markets
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?platform=polymarket&status=open&limit=20" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {title: .title, current_prices: .current_prices, volume_total: .volume_total}'

# Individual market lookup (path-based)
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2/516710" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[0] | {title: .title, status: .status, volume_total: .volume_total, source_url: .source_url}'

# Individual market lookup (query parameter)
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/markets-v2?market_id=KXTRUMPRESIGN&platform=kalshi" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[0] | {title: .title, status: .status, volume_total: .volume_total, source_url: .source_url}'
```

## Performance Considerations

- **Response Times**: Typical response times are 200-500ms for most requests
- **Platform Availability**: Individual platform failures don't affect other platforms
- **Data Freshness**: All data is real-time with no caching delays
- **Rate Limits**: Respect rate limits to avoid throttling
- **Error Handling**: Implement retry logic for platform unavailability

## Migration from v1

### Key Changes
1. **Data Source**: v1 uses cached database data, v2 uses real-time API calls
2. **Market IDs**: v1 uses generated IDs, v2 uses platform-native IDs
3. **Slug Structure**: v1 has single `slug`, v2 has `event_slug` + `market_slug`
4. **Individual Lookup**: v1 only supports path-based, v2 supports both methods
5. **Error Handling**: v1 has database errors, v2 has platform-specific errors

### Migration Guide
```javascript
// v1 approach
const market = await fetch('/markets-v1/polymarket_market_0x123...');

// v2 approach (path-based)
const market = await fetch('/markets-v2/516710');

// v2 approach (query parameter)
const market = await fetch('/markets-v2?market_id=516710&platform=polymarket');
```

## Health Check

```
GET /markets-v2/health
```

Returns service health status:

```json
{
  "status": "healthy",
  "service": "markets-v2",
  "timestamp": "2025-01-07T18:25:52.236Z",
  "version": "2.0.0",
  "platforms": {
    "polymarket": "healthy",
    "kalshi": "healthy",
    "limitless": "healthy"
  }
}
```

## Changelog

### v2.0.0 (2025-01-07)
- **NEW**: Real-time data access without database dependency
- **NEW**: Platform-native market IDs for better traceability
- **NEW**: Dual slug structure (`event_slug` + `market_slug`)
- **NEW**: Query parameter individual market lookup
- **NEW**: Advanced date range filtering
- **NEW**: Robust error handling for platform failures
- **NEW**: Direct API proxy architecture
- **IMPROVED**: Response times (200-500ms typical)
- **IMPROVED**: Data freshness (real-time vs cached)
- **IMPROVED**: Error handling and platform resilience

---

*Last updated: January 2025*
