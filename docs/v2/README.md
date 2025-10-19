# Purity API v2 Documentation

The Purity API v2 provides real-time access to prediction market data across multiple platforms without database dependencies. This version offers improved performance, simplified architecture, and direct platform integration.

## Overview

The v2 API architecture eliminates database dependencies by directly proxying external platform APIs (Polymarket, Kalshi, and Limitless), providing:

- **Real-Time Data** - Direct API calls with no caching delays
- **Platform-Native IDs** - Use actual platform identifiers for better traceability
- **Simplified Architecture** - Cleaner, more maintainable codebase
- **Improved Performance** - Sub-second response times for most requests
- **Robust Error Handling** - Graceful degradation when individual platforms fail

## Key Differences from v1

| Feature | v1 | v2 |
|---------|----|----|
| **Data Source** | Supabase database | Direct external API calls |
| **Data Freshness** | Cached (5-15 minutes) | Real-time (immediate) |
| **Platform IDs** | Generated internal IDs | Platform-native IDs |
| **Dependencies** | Database required | Database independent |
| **Performance** | Fast (cached) | Fast (direct API calls) |
| **Error Handling** | Database errors | Platform-specific API errors |

## Available Endpoints

### Core Data Endpoints

- **[Markets API v2](./markets-v2.md)** - Real-time market data across platforms
- **[Events API v2](./events-v2.md)** - Event discovery and details
- **[Series API v2](./series-v2.md)** - Series information and nested data
- **[Search API v2](./search-v2.md)** - Multi-platform search functionality

### Specialized Endpoints

- **[Price History API v2](./price-history-v2.md)** - Historical price data with platform auto-detection

## Platform Support

### Polymarket
- **Market IDs**: Native Polymarket market IDs (e.g., `516710`)
- **Event IDs**: Native Polymarket event IDs (e.g., `2890`)
- **Series IDs**: Native Polymarket series IDs (e.g., `2`)
- **Data Richness**: Full metadata, CLOB token IDs, volume metrics
- **Image Support**: High-quality images for events and markets

### Kalshi
- **Market IDs**: Kalshi ticker symbols (e.g., `KXELONMARS-99`)
- **Event IDs**: Kalshi event tickers (e.g., `KXELONMARS-99`)
- **Series IDs**: Kalshi series tickers (e.g., `KXELONMARS`)
- **Data Richness**: Settlement timers, risk limits, trading data
- **Image Support**: Limited image support

### Limitless
- **Market IDs**: Limitless market slugs (e.g., `will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770`)
- **Event IDs**: Not supported (Limitless doesn't have explicit events)
- **Series IDs**: Not supported (Limitless doesn't have explicit series)
- **Data Richness**: Creator information, collateral tokens, trading metadata
- **Image Support**: Limited image support

## Authentication

All v2 endpoints require authentication using only your API key:

```bash
curl -X GET "https://api.polyrouter.io/functions/v1/markets-v2" \
  -H "X-API-Key: your-api-key"
```

**Note:** The Authorization header with Supabase tokens is not required for v2 endpoints. Only the `X-API-Key` header is needed.

## Rate Limits

- **Free Tier**: 100 requests/minute
- **Starter Tier**: 500 requests/minute
- **Pro Tier**: 2000 requests/minute
- **Enterprise**: Custom limits

## Error Handling

The v2 API provides comprehensive error handling:

### Common Error Codes

- **400 Bad Request** - Invalid parameters or malformed requests
- **401 Unauthorized** - Invalid or missing API key
- **404 Not Found** - Resource not found on any platform
- **503 Service Unavailable** - Platform temporarily unavailable

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "platform": "polymarket",
      "reason": "External API temporarily down",
      "retry_after": 60
    },
    "timestamp": "2025-01-07T18:25:52.236Z"
  },
  "meta": {
    "request_time": 150
  }
}
```

## Performance Characteristics

### Response Times
- **Typical**: 200-500ms for most requests
- **Complex Queries**: 500-1000ms for multi-platform searches
- **Individual Lookups**: 100-300ms for single resource requests

### Platform Availability
- **Independent Failures**: Individual platform failures don't affect other platforms
- **Graceful Degradation**: Partial results when some platforms are unavailable
- **Retry Logic**: Built-in retry mechanisms for transient failures

## Migration from v1

### Market ID Changes

**v1 Format:**
```
kalshi_market_KXNFLGAME-25SEP14PHIKC-PHI
polymarket_market_0x039b48827f3c6b83f50153715af8a66f2b74b04fcfc5def13acb3f151eeb3d81
```

**v2 Format:**
```
KXNFLGAME-25SEP14PHIKC-PHI  # Kalshi ticker
516710                      # Polymarket market ID
will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770  # Limitless market slug
```

### Code Migration Example

**v1 Code:**
```javascript
const markets = await fetch('/markets-v1?platform=polymarket');
const priceHistory = await fetch('/price-history-v1?market_ids=kalshi_market_KXNFLGAME-25SEP14PHIKC-PHI');
```

**v2 Code:**
```javascript
const markets = await fetch('/markets-v2?platform=polymarket');
const priceHistory = await fetch('/price-history-v2?market_ids=KXNFLGAME-25SEP14PHIKC-PHI');
```

## Best Practices

### 1. Use Platform-Native IDs
```javascript
// Get market IDs from platform APIs
const polymarketMarkets = await fetch('/markets-v2?platform=polymarket');
const kalshiMarkets = await fetch('/markets-v2?platform=kalshi');

// Use native IDs for price history
const priceHistory = await fetch('/price-history-v2?market_ids=516710,KXELONMARS-99,will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770');
```

### 2. Handle Platform Differences
```javascript
const markets = await fetch('/markets-v2?limit=10');

markets.markets.forEach(market => {
  if (market.platform === 'polymarket') {
    console.log(`Polymarket: ${market.title}`);
    console.log(`CLOB Tokens: ${market.metadata.clobTokenIds}`);
  } else if (market.platform === 'kalshi') {
    console.log(`Kalshi: ${market.title}`);
    console.log(`Settlement Timer: ${market.metadata.settlement_timer_seconds}s`);
  } else if (market.platform === 'limitless') {
    console.log(`Limitless: ${market.title}`);
    console.log(`Creator: ${market.metadata.creator.name}`);
    console.log(`Collateral Token: ${market.metadata.collateralToken.symbol}`);
  }
});
```

### 3. Implement Error Handling
```javascript
const fetchWithRetry = async (url, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      
      if (response.status === 503 && attempt < maxRetries - 1) {
        const retryAfter = response.headers.get('retry-after') || 60;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
};
```

### 4. Optimize for Performance
```javascript
// Use appropriate limits
const markets = await fetch('/markets-v2?limit=20'); // Not 1000

// Filter by platform when possible
const polymarketMarkets = await fetch('/markets-v2?platform=polymarket');

// Use specific time ranges for price history
const priceHistory = await fetch('/price-history-v2?market_ids=516710&start_ts=1640995200&end_ts=1641081600');
```

## Health Monitoring

### Health Check Endpoints

Each v2 endpoint provides a health check:

```bash
# Markets API health
curl -X GET "https://api.polyrouter.io/functions/v1/markets-v2/health" \
  -H "X-API-Key: your-api-key"

# Events API health
curl -X GET "https://api.polyrouter.io/functions/v1/events-v2/health" \
  -H "X-API-Key: your-api-key"

# Series API health
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2/health" \
  -H "X-API-Key: your-api-key"

# Search API health
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2/health" \
  -H "X-API-Key: your-api-key"

# Price History API health
curl -X GET "https://api.polyrouter.io/functions/v1/price-history-v2/health" \
  -H "X-API-Key: your-api-key"
```

### Health Response Format

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
- **BREAKING**: Changed to platform-native IDs
- **NEW**: Direct platform API integration without database dependencies
- **NEW**: Real-time data access with no caching delays
- **NEW**: Platform auto-detection for price history
- **NEW**: Multi-platform search and aggregation
- **IMPROVED**: Performance optimization (200-500ms typical response times)
- **IMPROVED**: Simplified architecture with cleaner code
- **IMPROVED**: Robust error handling and platform resilience

---

*Last updated: January 2025*
