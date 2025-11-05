# Search API v2

The Search API v2 provides real-time search functionality across all supported prediction market platforms without database dependency. This endpoint directly queries external platform search APIs (Polymarket, Kalshi, and Limitless), aggregates the results, and returns them in a unified format for maximum search coverage and performance.

## Base Endpoint

```
GET /search-v2
```

## Overview

The Search API v2 offers:
- **Real-Time Search** - Direct API calls to external platform search endpoints
- **Multi-Platform Aggregation** - Combined search results from all supported platforms
- **Unified Response Format** - Consistent data structure across all platforms
- **Platform Filtering** - Search specific platforms or all platforms simultaneously
- **Flexible Pagination** - Support for both cursor-based and offset-based pagination
- **Rich Search Results** - Returns markets, events, series, and tags in unified format
- **Performance Optimized** - Sub-second response times for most search queries

## Key Features

| Feature | Description |
|---------|-------------|
| **Multi-Platform Search** | Search across Polymarket, Kalshi, and Limitless simultaneously |
| **Platform Filtering** | Filter results by specific platforms |
| **Unified Results** | Markets, events, series, and tags in consistent format |
| **Real-Time Data** | Direct API calls with no caching delays |
| **Flexible Pagination** | Support for both cursor and offset-based pagination |
| **Rich Metadata** | Volume, liquidity, search scores, and platform-specific data |

## Search Discovery

### Endpoint

```
GET /search-v2
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `query` | string | Yes | - | Search query string (1-200 characters) |
| `platform` | string | No | - | Filter by platforms (comma-separated): `polymarket`, `kalshi`, `limitless` |
| `limit` | number | No | `10` | Number of results per page (1-50) |
| `page` | number | No | `1` | Page number for Polymarket pagination (starts at 1) |
| `cursor` | string | No | - | Cursor for Kalshi pagination |

### Example Requests

#### Basic Search
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=trump&limit=10" \
  -H "X-API-Key: your-api-key" \
```

#### Platform-Specific Search
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=election&platform=polymarket&limit=5" \
  -H "X-API-Key: your-api-key" \
```

#### Multi-Platform Search
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=trump&platform=polymarket,kalshi&limit=15" \
  -H "X-API-Key: your-api-key" \
```

#### Pagination with Cursor
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=trump&platform=kalshi&limit=10&cursor=eyJjdXJzb3IiOiIxMjM0NTY3ODkwIn0" \
  -H "X-API-Key: your-api-key" \
```

### Response Format

```json
{
  "markets": [
    {
      "id": "series-39609",
      "platform": "polymarket",
      "platform_id": "39609",
      "title": "Will Trump impose more sanctions on Russia by September 30?",
      "series_slug": "will-trump-impose-more-sanctions-on-russia-by-september-30",
      "description": "On August 6, 2025, President Donald J. Trump signed an Executive Order...",
      "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/will-trump-impose-more-sanctions-on-russia-by-august-31--7HgynYii29j.jpg",
      "category": null,
      "tags": [
        "Politics",
        "Ukraine",
        "Trump",
        "Trump Presidency",
        "Geopolitics",
        "Trump-Putin",
        "Foreign Policy"
      ],
      "metadata": {
        "volume": 7576005.534676,
        "openInterest": 0,
        "volume1wk": 5464121.843398999,
        "volume1mo": 5564328.423674999,
        "volume1yr": 5564328.423674999,
        "marketCount": 1,
        "commentCount": 503,
        "isFeatured": false,
        "isNew": false,
        "isRestricted": true,
        "startTime": "2025-09-16T17:00:00Z",
        "endTime": "2025-09-30T00:00:00Z"
      },
      "last_synced_at": "2025-09-18T23:35:00.273Z"
    },
    {
      "id": "KXUSAMBCANADA",
      "platform": "kalshi",
      "platform_id": "KXUSAMBCANADA",
      "title": "Ambassador to Canada",
      "series_slug": "KXUSAMBCANADA",
      "description": "Series: Ambassador to Canada",
      "image_url": null,
      "category": "Politics",
      "tags": [
        "Politics"
      ],
      "metadata": {
        "search_score": 0,
        "is_trending": false,
        "is_new": false,
        "is_closing": false,
        "is_price_delta": false,
        "total_series_volume": 3615,
        "total_market_count": 5,
        "active_market_count": 0,
        "subcategories": {
          "Politics": [
            "First 100 days"
          ]
        }
      },
      "last_synced_at": "2025-09-18T23:26:27.998Z"
    }
  ],
  "pagination": {
    "total": 2056,
    "limit": 10,
    "offset": 0,
    "has_more": true,
    "next_offset": 10
  },
  "meta": {
    "request_time": 367,
    "cache_hit": false,
    "data_freshness": "2025-09-18T23:35:00.276Z"
  }
}
```

## Response Fields

### Search Result Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Platform-native identifier |
| `platform` | string | Source platform (`polymarket`, `kalshi`, `limitless`) |
| `platform_id` | string | Original platform identifier |
| `title` | string | Result title/name |
| `series_slug` | string | URL-friendly identifier |
| `description` | string | Result description |
| `image_url` | string | Associated image URL (if available) |
| `category` | string | Result category |
| `tags` | array | Array of relevant tags |
| `metadata` | object | Platform-specific metadata |
| `last_synced_at` | string | Last data sync timestamp (ISO 8601) |

### Search Metadata (Polymarket)
| Field | Type | Description |
|-------|------|-------------|
| `volume` | number | Total trading volume |
| `openInterest` | number | Current open interest |
| `volume1wk` | number | 1-week trading volume |
| `volume1mo` | number | 1-month trading volume |
| `volume1yr` | number | 1-year trading volume |
| `marketCount` | number | Number of markets in series/event |
| `commentCount` | number | Number of comments |
| `isFeatured` | boolean | Whether result is featured |
| `isNew` | boolean | Whether result is new |
| `isRestricted` | boolean | Whether result is restricted |
| `startTime` | string | Start timestamp (ISO 8601) |
| `endTime` | string | End timestamp (ISO 8601) |

### Search Metadata (Kalshi)
| Field | Type | Description |
|-------|------|-------------|
| `search_score` | number | Platform search relevance score |
| `is_trending` | boolean | Whether result is trending |
| `is_new` | boolean | Whether result is new |
| `is_closing` | boolean | Whether result is closing soon |
| `is_price_delta` | boolean | Whether result has price changes |
| `total_series_volume` | number | Total series trading volume |
| `total_market_count` | number | Total number of markets |
| `active_market_count` | number | Number of active markets |
| `subcategories` | object | Platform subcategories |

### Pagination Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of search results |
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

### Polymarket Search
- **Search Scope**: Events, markets, and tags
- **Pagination**: Page-based (`page` parameter)
- **Rich Metadata**: Volume data, comment counts, feature flags
- **Image Support**: High-quality images for events and markets
- **Tag System**: Comprehensive tagging with categories
- **Volume Data**: 1-week, 1-month, 1-year volume metrics

### Kalshi Search
- **Search Scope**: Series, events, and markets
- **Pagination**: Cursor-based (`cursor` parameter)
- **Search Scoring**: Platform-specific relevance scoring
- **Trending Indicators**: Real-time trending status
- **Market Counts**: Active vs total market counts
- **Subcategories**: Detailed categorization system

### Limitless Search
- **Search Scope**: Markets only (no events or series)
- **Pagination**: Page-based (`page` parameter)
- **Search Scoring**: Similarity-based scoring with hardcoded threshold (0.3)
- **Market Data**: Creator information, collateral tokens, trading metadata
- **Categories**: Platform-specific categories and tags
- **Volume Data**: 24h and total volume metrics

## Error Responses

### Validation Error (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "query": ["query is required and must be a non-empty string"],
        "limit": ["limit must be a number between 1 and 50"]
      }
    },
    "timestamp": "2025-09-18T23:35:00.276Z"
  },
  "meta": {
    "request_time": 5
  }
}
```

### Platform Unavailable (503)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Failed to fetch data from external platforms",
    "timestamp": "2025-09-18T23:35:00.276Z"
  },
  "meta": {
    "request_time": 411
  }
}
```

### Authentication Error (401)
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or missing API key",
    "timestamp": "2025-09-18T23:35:00.276Z"
  }
}
```

## Rate Limits

- **Free Tier**: 100 requests/minute
- **Starter Tier**: 500 requests/minute
- **Pro Tier**: 2000 requests/minute
- **Enterprise**: Custom limits

## Best Practices

### 1. Query Optimization
```javascript
// Use specific, focused queries
const results = await searchV2("trump presidency 2025");

// Avoid overly broad queries
const results = await searchV2("politics"); // Too broad
```

### 2. Platform Filtering
```javascript
// Search specific platforms when you know what you're looking for
const polymarketResults = await searchV2({
  query: "trump",
  platform: "polymarket",
  limit: 20
});

// Search all platforms for comprehensive results
const allResults = await searchV2({
  query: "election",
  limit: 30
});
```

### 3. Pagination Handling
```javascript
const searchWithPagination = async (query, limit = 10) => {
  let allResults = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && allResults.length < 100) { // Limit to 100 results
    const response = await searchV2({
      query,
      limit,
      offset
    });

    allResults.push(...response.markets);
    hasMore = response.pagination.has_more;
    offset = response.pagination.next_offset;
  }

  return allResults;
};
```

### 4. Error Handling
```javascript
const searchWithRetry = async (params, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await searchV2(params);
    } catch (error) {
      if (error.status === 503 && attempt < maxRetries - 1) {
        // Platform unavailable, retry after delay
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
};
```

## Use Cases

### 1. Market Discovery
Find relevant markets across platforms:
```javascript
const discoverMarkets = async (topic) => {
  const results = await searchV2({
    query: topic,
    limit: 20
  });

  // Filter for actual markets vs series/events
  const markets = results.markets.filter(item => 
    item.metadata?.marketCount > 0 || 
    item.title.includes('?') // Markets typically have questions
  );

  return markets;
};
```

### 2. Cross-Platform Analysis
Compare search results across platforms:
```javascript
const comparePlatforms = async (query) => {
  const [polymarket, kalshi] = await Promise.all([
    searchV2({ query, platform: "polymarket", limit: 10 }),
    searchV2({ query, platform: "kalshi", limit: 10 })
  ]);

  return {
    polymarket: {
      count: polymarket.markets.length,
      totalVolume: polymarket.markets.reduce((sum, m) => 
        sum + (m.metadata?.volume || 0), 0)
    },
    kalshi: {
      count: kalshi.markets.length,
      totalVolume: kalshi.markets.reduce((sum, m) => 
        sum + (m.metadata?.total_series_volume || 0), 0)
    }
  };
};
```

### 3. Trending Topics
Find trending topics across platforms:
```javascript
const findTrending = async () => {
  const trendingQueries = ['trump', 'election', 'bitcoin', 'ai'];
  const results = [];

  for (const query of trendingQueries) {
    const searchResults = await searchV2({ query, limit: 5 });
    results.push({
      query,
      results: searchResults.markets.length,
      trending: searchResults.markets.some(m => m.metadata?.is_trending)
    });
  }

  return results.sort((a, b) => b.results - a.results);
};
```

## Examples

### JavaScript/Node.js
```javascript
const searchV2 = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://api.polyrouter.io/functions/v1/search-v2?${queryString}`, {
    headers: {
      'X-API-Key': 'your-api-key',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Basic search
const results = await searchV2({ query: 'trump', limit: 10 });

// Platform-specific search
const polymarketResults = await searchV2({ 
  query: 'election', 
  platform: 'polymarket', 
  limit: 20 
});

// Search with pagination
const page2 = await searchV2({ 
  query: 'bitcoin', 
  limit: 10, 
  offset: 10 
});
```

### Python
```python
import requests

def search_v2(params=None):
    if params is None:
        params = {}
    
    url = "https://api.polyrouter.io/functions/v1/search-v2"
    headers = {
        "X-API-Key": "your-api-key",
    }
    
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Search for markets
results = search_v2({
    "query": "trump",
    "limit": 15
})

# Process results
for result in results["markets"]:
    print(f"Platform: {result['platform']}")
    print(f"Title: {result['title']}")
    print(f"Tags: {', '.join(result.get('tags', []))}")
    print("---")
```

### cURL
```bash
# Basic search
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=trump&limit=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {platform: .platform, title: .title, tags: .tags}'

# Platform-specific search
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=election&platform=polymarket&limit=20" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {title: .title, volume: .metadata.volume, marketCount: .metadata.marketCount}'

# Search with pagination
curl -X GET "https://api.polyrouter.io/functions/v1/search-v2?query=bitcoin&limit=10&offset=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.pagination'
```

## Performance Considerations

- **Response Times**: Typical response times are 200-500ms for most queries
- **Query Complexity**: Simpler, more specific queries perform better
- **Platform Availability**: Individual platform failures don't affect other platforms
- **Data Freshness**: All data is real-time with no caching delays
- **Rate Limits**: Respect rate limits to avoid throttling

## Health Check

```
GET /search-v2/health
```

Returns service health status:

```json
{
  "status": "healthy",
  "service": "search-v2",
  "timestamp": "2025-09-18T23:35:00.276Z",
  "version": "2.0.0",
  "platforms": {
    "polymarket": "healthy",
    "kalshi": "healthy",
    "limitless": "healthy"
  }
}
```

## Changelog

### v2.0.0 (2025-09-18)
- **NEW**: Real-time search across multiple prediction market platforms
- **NEW**: Unified search results format for markets, events, series, and tags
- **NEW**: Platform filtering and multi-platform aggregation
- **NEW**: Flexible pagination support (cursor and offset-based)
- **NEW**: Rich metadata including volume data, search scores, and trending indicators
- **NEW**: Direct API proxy architecture with no database dependency
- **IMPROVED**: Response times (200-500ms typical)
- **IMPROVED**: Data freshness (real-time vs cached)
- **IMPROVED**: Error handling and platform resilience

---

*Last updated: September 2025*
