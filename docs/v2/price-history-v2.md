# Price History API v2

The Price History API v2 provides direct access to historical price data from multiple prediction market platforms without requiring internal database lookups. This endpoint uses platform-specific market identifiers and fetches data directly from platform APIs (Polymarket, Kalshi, and Limitless) for improved performance and reduced complexity.

## Base Endpoint

```
GET /price-history-v2
```

## Overview

The Price History API v2 provides:
- **Direct Platform Integration** - No database dependencies, direct API calls
- **Platform-Specific IDs** - Use native platform identifiers
- **Improved Performance** - Eliminates database lookup overhead
- **Simplified Architecture** - Cleaner, more maintainable code
- **Real-Time Data** - Always fresh data from platform APIs
- **Multi-Platform Support** - Kalshi, Polymarket, and Limitless integration

## Key Differences from v1

| Feature | v1 | v2 |
|---------|----|----|
| **Market IDs** | Internal DB IDs (`kalshi_market_...`) | Platform-specific IDs |
| **Data Source** | Database lookup + API call | Direct platform API |
| **Performance** | Database query + API call | Direct API call only |
| **Dependencies** | Database required | Database independent |
| **Scalability** | Limited by DB performance | Limited by platform APIs |

## Market ID Formats

The API uses **simple platform-native identifiers** and automatically detects the platform:

### Polymarket Markets
Format: `{market_id}` (Polymarket's native market ID)

**Example:**
```
516710
```

- API tries Polymarket first: `https://gamma-api.polymarket.com/markets/{market_id}`
- If found, extracts `clobTokenIds` from market metadata
- Uses first CLOB token ID for price history: `https://clob.polymarket.com/prices-history`

### Kalshi Markets
Format: `{market_ticker}` (Kalshi's native market ticker)

**Example:**
```
KXELONMARS-99
```

- API tries Kalshi if Polymarket fails: fetches market data from Kalshi API
- Extracts `event_ticker` from market data, then gets `series_ticker` from event
- Uses Kalshi candlestick API: `https://api.elections.kalshi.com/trade-api/v2/series/{series}/markets/{market}/candlesticks`

### Limitless Markets
Format: `{market_slug}` (Limitless's native market slug)

**Example:**
```
will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770
```

- API tries Limitless if Polymarket and Kalshi fail: fetches market data from Limitless API
- Uses market slug for price history: `https://api.limitless.exchange/markets/{market_slug}/historical-price`
- Provides price history for "Yes" outcome with timestamp and price data

### Auto-Detection Process
1. **Try Polymarket**: Attempt to fetch market data from Polymarket API
2. **Try Kalshi**: If Polymarket fails, fetch Kalshi market data and event data
3. **Try Limitless**: If both Polymarket and Kalshi fail, fetch Limitless market data
4. **Error**: If no platform recognizes the ID, return error

## Price History Retrieval

### Endpoint

```
GET /price-history-v2
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `market_ids` | string | Yes | - | Comma-separated list of platform-specific market IDs |
| `start_ts` | string | **Yes** | - | Start timestamp (Unix timestamp) |
| `end_ts` | string | **Yes** | - | End timestamp (Unix timestamp) |
| `interval` | string | **Yes** | - | Time interval: `1m`, `5m`, `1h`, `4h`, `1d` |
| `limit` | string | No | `1000` | Maximum number of data points per market (1-5000) |

### Example Requests

#### Basic Request - Polymarket
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/price-history-v2?market_ids=516710&start_ts=1757036253&end_ts=1757270253&interval=1h&limit=10" \
  -H "X-API-Key: your-api-key" \
```

#### Basic Request - Kalshi
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/price-history-v2?market_ids=KXELONMARS-99&start_ts=1757036253&end_ts=1757270253&interval=1h&limit=10" \
  -H "X-API-Key: your-api-key" \
```

#### Multiple Markets
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/price-history-v2?market_ids=516710,KXELONMARS-99,will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770&start_ts=1757036253&end_ts=1757270253&interval=1h&limit=50" \
  -H "X-API-Key: your-api-key" \
```

#### High-Frequency Data
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/price-history-v2?market_ids=516710&start_ts=1757036253&end_ts=1757270253&interval=1m&limit=200" \
  -H "X-API-Key: your-api-key" \
```

### Response Format

```json
{
  "data": [
    {
      "timestamp": 1757037600,
      "price": {
        "close": 0,
        "open": 0,
        "high": 0,
        "low": 0
      },
      "volume": 0,
      "openInterest": 1773,
      "bidAsk": {
        "bid": {
          "close": 0.02,
          "open": 0.02,
          "high": 0.02,
          "low": 0.02
        },
        "ask": {
          "close": 0.05,
          "open": 0.05,
          "high": 0.05,
          "low": 0.05
        }
      },
      "platform": "kalshi",
      "marketId": "KXELONMARS:KXELONMARS-99",
      "outcomeId": "yes"
    },
    {
      "timestamp": 1758304213,
      "price": {
        "close": 0.07
      },
      "platform": "polymarket",
      "marketId": "104173557214744537570424345347209544585775842950109756851652855913015295701992"
    }
  ],
  "meta": {
    "total_points": 2,
    "platforms": ["kalshi", "polymarket"],
    "time_range": {
      "start": 1757037600,
      "end": 1758307743
    },
    "interval": "1h",
    "request_time": 1145,
    "cache_hit": false,
    "data_freshness": "2025-09-19T18:49:38.574Z"
  }
}
```

## Platform-Specific Implementation

### Polymarket Integration

1. **Market Data Fetching**
   ```
   GET https://gamma-api.polymarket.com/markets/{market_id}
   ```

2. **CLOB Token Extraction**
   - Extract `clobTokenIds` array from market metadata
   - Use first CLOB token ID for price history (simplified approach)
   - Each token represents a different outcome (Yes/No)

3. **Price History Fetching**
   ```
   GET https://clob.polymarket.com/prices-history?market={clobTokenId}&interval={interval}&startTs={start_ts}&endTs={end_ts}
   ```

### Kalshi Integration

1. **Market Data Fetching**
   ```
   GET https://api.elections.kalshi.com/trade-api/v2/markets/{market_ticker}
   ```

2. **Event Data Fetching**
   ```
   GET https://api.elections.kalshi.com/trade-api/v2/events/{event_ticker}
   ```

3. **Price History Fetching**
   ```
   GET https://api.elections.kalshi.com/trade-api/v2/series/{series_ticker}/markets/{market_ticker}/candlesticks?period_interval={interval}&start_ts={start_ts}&end_ts={end_ts}
   ```

4. **Outcome Generation**
   - Kalshi provides Yes outcome data with full OHLC and bid/ask spreads
   - No outcome calculated as `1 - Yes price`
   - Bid/ask spreads inverted for No outcome

### Limitless Integration

1. **Market Data Fetching**
   ```
   GET https://api.limitless.exchange/markets/{market_slug}
   ```

2. **Price History Fetching**
   ```
   GET https://api.limitless.exchange/markets/{market_slug}/historical-price?from={from}&to={to}&interval={interval}
   ```

3. **Data Transformation**
   - Limitless provides price history for "Yes" outcome only
   - Timestamps converted from milliseconds to seconds
   - Price data normalized to decimal format (0-1)
   - No outcome calculated as `1 - Yes price`

## Error Handling

### Invalid Market ID Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "market_ids": ["Invalid market ID format: invalid_id. Expected: platform-native market ID (e.g., \"12345\" for Polymarket or \"KXELONMARS-99\" for Kalshi)"]
      }
    },
    "timestamp": "2025-01-07T18:25:52.236Z"
  }
}
```

### Platform API Unavailable
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
  }
}
```

### Market Not Found
```json
{
  "error": {
    "code": "MARKET_NOT_FOUND",
    "message": "Market not found: polymarket_market_99999",
    "details": {
      "market_id": "polymarket_market_99999",
      "platform": "polymarket"
    },
    "timestamp": "2025-01-07T18:25:52.236Z"
  }
}
```

## Performance Characteristics

### Response Times
- **Polymarket**: ~200-500ms (market data + CLOB API calls)
- **Kalshi**: ~100-300ms (direct candlestick API)
- **Multiple Markets**: Parallel processing for optimal performance

### Rate Limits
- **Polymarket**: 100 requests/minute
- **Kalshi**: 1000 requests/minute
- **Combined**: Limited by slowest platform

### Caching
- **No Caching**: Always fresh data from platform APIs
- **Real-Time**: Data reflects current platform state
- **Consistency**: No cache invalidation issues

## Migration from v1

### Market ID Conversion

**v1 Format:**
```
kalshi_market_KXNFLGAME-25SEP14PHIKC-PHI
polymarket_market_0x039b48827f3c6b83f50153715af8a66f2b74b04fcfc5def13acb3f151eeb3d81
```

**v2 Format:**
```
KXELONMARS-99  # Kalshi market ticker
516710         # Polymarket market ID
will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770  # Limitless market slug
```

### Code Migration Example

**v1 Code:**
```javascript
const priceHistory = await fetchPriceHistory({
  market_ids: 'kalshi_market_KXNFLGAME-25SEP14PHIKC-PHI',
  start_ts: '1757036253',
  end_ts: '1757270253',
  interval: '1h'
});
```

**v2 Code:**
```javascript
const priceHistory = await fetchPriceHistory({
  market_ids: 'KXELONMARS-99',  // Simple Kalshi ticker
  start_ts: '1757036253',
  end_ts: '1757270253',
  interval: '1h'
});
```

## Best Practices

### 1. Use Platform-Native Market IDs
```javascript
// Get market IDs from platform APIs
const polymarketMarkets = await fetch('/markets-v2?platform=polymarket');
const kalshiMarkets = await fetch('/markets-v2?platform=kalshi');

// Use simple platform-native IDs
const marketIds = [
  polymarketMarkets.markets[0].id,  // e.g., "516710"
  kalshiMarkets.markets[0].id,      // e.g., "KXELONMARS-99"
  limitlessMarkets.markets[0].id    // e.g., "will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770"
];
```

### 2. Handle Platform Differences
```javascript
const priceHistory = await fetchPriceHistory({
  market_ids: '516710,KXELONMARS-99,will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770',  // Simple platform-native IDs
  start_ts: '1757036253',
  end_ts: '1757270253',
  interval: '1h'
});

// Process data based on platform
priceHistory.data.forEach(point => {
  if (point.platform === 'kalshi') {
    // Kalshi has full OHLC data and bid/ask spreads
    console.log(`OHLC: O:${point.price.open} H:${point.price.high} L:${point.price.low} C:${point.price.close}`);
    console.log(`Bid/Ask: ${point.bidAsk.bid.close}/${point.bidAsk.ask.close}`);
    console.log(`Volume: ${point.volume}, Open Interest: ${point.openInterest}`);
  } else if (point.platform === 'polymarket') {
    // Polymarket has closing prices and CLOB token IDs
    console.log(`Price: ${point.price.close}`);
    console.log(`Market ID: ${point.marketId}`);
  } else if (point.platform === 'limitless') {
    // Limitless has price data for "Yes" outcome
    console.log(`Price: ${point.price.close}`);
    console.log(`Market ID: ${point.marketId}`);
    console.log(`Outcome: ${point.outcomeId}`);
  }
});
```

### 3. Error Handling
```javascript
const fetchPriceHistoryWithRetry = async (params, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchPriceHistory(params);
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

## Health Check

```
GET /price-history-v2/health
```

Returns service health status:

```json
{
  "status": "healthy",
  "service": "price-history-v2",
  "timestamp": "2025-01-07T18:25:52.236Z",
  "version": "2.0.0",
  "features": [
    "Platform-specific market IDs",
    "Direct API integration",
    "No database dependency",
    "Polymarket CLOB integration",
    "Kalshi candlestick integration",
    "Limitless price history integration"
  ]
}
```

## Changelog

### v2.0.0 (2025-01-07)
- **BREAKING**: Changed market ID format to simple platform-native identifiers
- **NEW**: Direct platform API integration without database dependencies
- **NEW**: Polymarket CLOB token ID extraction from market data (uses first token)
- **NEW**: Kalshi market and event data fetching for series ticker resolution
- **NEW**: Platform auto-detection for seamless multi-platform support
- **IMPROVED**: Performance optimization by eliminating database lookups
- **IMPROVED**: Simplified architecture with cleaner code
- **IMPROVED**: Real-time data freshness from platform APIs
- **IMPROVED**: Rich price history data with OHLC, bid/ask spreads, and volume

---

*Last updated: January 2025*
