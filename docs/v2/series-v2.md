# Series API v2

The Series API v2 provides real-time access to prediction market series across all supported platforms without database dependency. This endpoint directly proxies external platform APIs (Polymarket and Kalshi), formats the data into a unified response structure, and returns it immediately for maximum freshness and performance.

## Base Endpoint

```
GET /series-v2
```

## Overview

The Series API v2 offers:
- **Real-Time Data** - Direct API calls to external platforms with no database caching
- **Unified Response Format** - Consistent data structure across all platforms
- **Individual Series Lookup** - Path-based routing for specific series details
- **Advanced Filtering** - Platform, category, and search filtering
- **Robust Error Handling** - Graceful degradation when individual platforms fail
- **Performance Optimized** - Sub-second response times for most requests
- **Platform Native IDs** - Uses actual platform IDs for better traceability

## Key Differences from v1

| Feature | v1 | v2 |
|---------|----|----|
| **Data Source** | Supabase database | Direct external API calls |
| **Data Freshness** | Cached (5-15 minutes) | Real-time (immediate) |
| **Individual Lookup** | Path-based only | Path-based routing |
| **Platform IDs** | Generated internal IDs | Platform-native IDs |
| **Series Structure** | Basic series format | Series with nested events and markets |
| **Error Handling** | Database errors | Platform-specific API errors |
| **Performance** | Fast (cached) | Fast (direct API calls) |

## Series Discovery

### Endpoint

```
GET /series-v2
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | - | Filter by platforms (comma-separated): `polymarket`, `kalshi` |
| `category` | string | No | - | Filter by categories (comma-separated): `politics`, `sports`, `crypto`, `economics`, `technology`, `weather`, `other` |
| `search` | string | No | - | Search series by title/description |
| `sort` | string | No | `title_asc` | Sort order: `title_asc`, `title_desc`, `created_asc`, `created_desc`, `volume_asc`, `volume_desc` |
| `limit` | number | No | `50` | Number of results per page (1-100) |
| `offset` | number | No | `0` | Pagination offset |

### Example Requests

#### Basic Request
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?limit=10" \
  -H "X-API-Key: your-api-key" \
```

#### Platform Filtering
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?platform=polymarket&limit=20" \
  -H "X-API-Key: your-api-key" \
```

#### Category Filtering
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?category=politics&limit=15" \
  -H "X-API-Key: your-api-key" \
```

#### Search Functionality
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?search=trump&limit=25" \
  -H "X-API-Key: your-api-key" \
```

#### Combined Filters
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?platform=polymarket&category=politics&search=election&limit=10" \
  -H "X-API-Key: your-api-key" \
```

### Response Format

```json
{
  "series": [
    {
      "id": "polymarket_series_2",
      "platform": "polymarket",
      "platform_id": "2",
      "title": "NBA",
      "series_slug": "nba",
      "description": "NBA prediction markets",
      "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/super+cool+basketball+in+red+and+blue+wow.png",
      "category": "Sports",
      "tags": ["Sports", "NBA"],
      "metadata": {
        "seriesType": "single",
        "recurrence": "daily",
        "layout": "default",
        "active": true,
        "closed": false,
        "archived": false,
        "new": false,
        "featured": false,
        "restricted": true,
        "competitive": "0",
        "volume24hr": 0,
        "volume": 0,
        "liquidity": 0,
        "startDate": "2021-01-01T17:00:00Z",
        "commentCount": 7696,
        "commentsEnabled": false,
        "createdAt": "2022-10-13T00:36:01.131Z",
        "updatedAt": "2025-09-19T17:46:35.700439Z"
      },
      "events": [
        {
          "id": "2890",
          "platform": "polymarket",
          "platform_id": "2890",
          "series_id": "polymarket_series_2",
          "title": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
          "event_slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
          "description": "In the upcoming NBA game, scheduled for December 4...",
          "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-543e7263-67da-4905-8732-cd3f220ae751.png",
          "resolution_source_url": "https://www.nba.com/games",
          "event_start_at": "2021-12-04T00:00:00Z",
          "event_end_at": "2021-12-04T00:00:00Z",
          "last_synced_at": "2025-09-19T17:53:13.229Z",
          "metadata": {
            "subtitle": "",
            "active": true,
            "closed": true,
            "archived": false,
            "new": false,
            "featured": false,
            "restricted": false,
            "liquidity": 0,
            "volume": 1335.05,
            "openInterest": 0,
            "competitive": 0,
            "commentCount": 8130,
            "volume24hr": 0,
            "volume1wk": 0,
            "volume1mo": 0,
            "volume1yr": 0,
            "createdAt": "2022-07-27T14:40:02.074Z",
            "updatedAt": "2024-04-25T18:49:06.075795Z"
          },
          "raw_data": { /* Full raw platform response */ }
        }
      ],
      "markets": [
        {
          "id": "239826",
          "platform": "polymarket",
          "platform_id": "239826",
          "event_id": "2890",
          "event_name": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
          "event_slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
          "title": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
          "market_slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
          "description": "In the upcoming NBA game, scheduled for December 4...",
          "subcategory": null,
          "source_url": "https://polymarket.com/event/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
          "status": "resolved",
          "market_type": "binary",
          "category": "Sports",
          "tags": ["All"],
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
              "price": 0.0000004113679809846114013590098187297978,
              "bid": 0.0000004113679809846114013590098187297978,
              "ask": 0.0000004113679809846114013590098187297978
            },
            "no": {
              "price": 0.9999995886320190153885986409901813,
              "bid": 0.9999995886320190153885986409901813,
              "ask": 0.9999995886320190153885986409901813
            }
          },
          "volume_24h": 0,
          "volume_7d": 0,
          "volume_total": 1335.045385,
          "liquidity": 50.000009,
          "liquidity_score": 0.05,
          "open_interest": 0,
          "unique_traders": null,
          "fee_rate": 0.02,
          "trading_fee": 0.02,
          "withdrawal_fee": null,
          "created_at": "2021-12-04T10:33:13.541Z",
          "trading_start_at": "2021-12-04T19:35:03.796Z",
          "trading_end_at": "2021-12-04T00:00:00Z",
          "resolution_date": "2021-12-04T00:00:00Z",
          "resolved_at": "2021-12-04T00:00:00Z",
          "resolution_criteria": "In the upcoming NBA game, scheduled for December 4...",
          "resolution_source": "https://www.nba.com/games",
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
            "ammType": "normal",
            "marketType": "normal",
            "formatType": "binary",
            "competitive": 0,
            "score": 0,
            "bestBid": 0,
            "bestAsk": 1,
            "spread": 1,
            "clobTokenIds": ["28182404005967940652495463228537840901055649726248190462854914416579180110833", "47044845753450022047436429968808601130811164131571549682541703866165095016290"]
          },
          "raw_data": { /* Full raw platform response */ },
          "last_synced_at": "2025-09-19T17:53:13.229Z"
        }
      ],
      "last_synced_at": "2025-09-19T17:53:13.229Z",
      "raw_data": { /* Full raw platform response */ }
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 10,
    "offset": 0,
    "has_more": true,
    "next_offset": 10
  },
  "meta": {
    "request_time": 324,
    "cache_hit": false,
    "data_freshness": "2025-09-19T17:53:13.230Z"
  }
}
```

## Individual Series Lookup

### Path-Based Routing

```
GET /series-v2/{series_id}
```

#### Example Request
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2/2" \
  -H "X-API-Key: your-api-key" \
```

#### Individual Series Response Format

```json
{
  "series": [
    {
      "id": "polymarket_series_2",
      "platform": "polymarket",
      "platform_id": "2",
      "title": "NBA",
      "series_slug": "nba",
      "description": "NBA prediction markets",
      "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/super+cool+basketball+in+red+and+blue+wow.png",
      "category": "Sports",
      "tags": ["Sports", "NBA"],
      "metadata": {
        "seriesType": "single",
        "recurrence": "daily",
        "layout": "default",
        "active": true,
        "closed": false,
        "archived": false,
        "new": false,
        "featured": false,
        "restricted": true,
        "competitive": "0",
        "volume24hr": 0,
        "volume": 0,
        "liquidity": 0,
        "startDate": "2021-01-01T17:00:00Z",
        "commentCount": 7696,
        "commentsEnabled": false,
        "createdAt": "2022-10-13T00:36:01.131Z",
        "updatedAt": "2025-09-19T17:46:35.700439Z"
      },
      "events": [ /* Array of nested events */ ],
      "markets": [ /* Array of nested markets */ ],
      "last_synced_at": "2025-09-19T17:53:13.229Z",
      "raw_data": { /* Full raw platform response */ }
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "has_more": false
  },
  "meta": {
    "request_time": 408,
    "cache_hit": false,
    "data_freshness": "2025-09-19T17:57:56.388Z"
  }
}
```

## Response Fields

### Series Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Platform-native series identifier |
| `platform` | string | Source platform (`polymarket`, `kalshi`) |
| `platform_id` | string | Original platform series ID (same as `id`) |
| `title` | string | Series title |
| `series_slug` | string | URL-friendly series identifier |
| `description` | string | Series description |
| `image_url` | string | Series image URL |
| `category` | string | Series category |
| `tags` | array | Array of series tags |
| `metadata` | object | Platform-specific metadata |
| `events` | array | Array of nested events (for individual series lookup) |
| `markets` | array | Array of nested markets (for individual series lookup) |
| `last_synced_at` | string | Last data sync timestamp (ISO 8601) |
| `raw_data` | object | Complete raw platform response |

### Pagination Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of series |
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
- **Series IDs**: Uses Polymarket's internal series IDs (e.g., `2`)
- **Series Structure**: Series contain nested events and markets with full data
- **Rich Metadata**: Volume data, comment counts, feature flags
- **Image Support**: High-quality images for series
- **Nested Data**: Individual series lookup includes all events and markets

### Kalshi
- **Series IDs**: Uses Kalshi ticker symbols (e.g., `KXFDVWLFI`)
- **Series Structure**: Basic series information (no nested data in API)
- **Metadata**: Settlement sources, contract URLs, fee information
- **Image Support**: Limited image support (mostly null)
- **Nested Data**: Events and markets arrays are empty (API limitation)

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
        "category": ["Invalid categories: invalid. Valid options: politics, sports, crypto, economics, technology, weather, other"]
      }
    },
    "timestamp": "2025-09-19T17:53:13.230Z"
  },
  "meta": {
    "request_time": 5
  }
}
```

### Series Not Found (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Series not found with ID 'INVALID123'",
    "details": {
      "resource": "Series",
      "id": "INVALID123",
      "suggestion": "Use GET /series-v2 to find valid series IDs"
    },
    "timestamp": "2025-09-19T17:53:13.230Z"
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
    "timestamp": "2025-09-19T17:53:13.230Z"
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
    "timestamp": "2025-09-19T17:53:13.230Z"
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
// For basic series discovery
const series = await fetchSeriesV2();

// For platform-specific data
const polymarketSeries = await fetchSeriesV2({
  platform: 'polymarket',
  limit: 20
});

// For category filtering
const politicsSeries = await fetchSeriesV2({
  category: 'politics',
  limit: 25
});

// For search functionality
const trumpSeries = await fetchSeriesV2({
  search: 'trump',
  limit: 50
});
```

### 2. Individual Series Lookup
```javascript
// Path-based lookup (recommended)
const series = await fetchSeriesV2('2');

// Handle different platforms
const polymarketSeries = await fetchSeriesV2('2');
const kalshiSeries = await fetchSeriesV2('KXFDVWLFI');
```

### 3. Handle Platform Differences
```javascript
const series = await fetchSeriesV2({ limit: 10 });

series.series.forEach(seriesItem => {
  if (seriesItem.platform === 'polymarket') {
    console.log(`Polymarket: ${seriesItem.title}`);
    console.log(`Events: ${seriesItem.events?.length || 0}`);
    console.log(`Markets: ${seriesItem.markets?.length || 0}`);
  } else if (seriesItem.platform === 'kalshi') {
    console.log(`Kalshi: ${seriesItem.title}`);
    console.log(`Category: ${seriesItem.category}`);
  }
});
```

### 4. Error Handling
```javascript
const fetchSeriesV2WithRetry = async (params, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchSeriesV2(params);
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

### 1. Real-Time Series Monitoring
Monitor series for immediate updates:
```javascript
const monitorSeries = async () => {
  const series = await fetchSeriesV2({
    platform: 'polymarket',
    limit: 20
  });
  
  series.series.forEach(seriesItem => {
    console.log(`${seriesItem.title}: ${seriesItem.metadata?.volume || 0} volume`);
    console.log(`Events: ${seriesItem.events?.length || 0}`);
    console.log(`Markets: ${seriesItem.markets?.length || 0}`);
  });
};
```

### 2. Cross-Platform Analysis
Compare series across platforms:
```javascript
const compareSeries = async () => {
  const polymarketSeries = await fetchSeriesV2({
    platform: 'polymarket',
    limit: 10
  });
  
  const kalshiSeries = await fetchSeriesV2({
    platform: 'kalshi',
    limit: 10
  });
  
  console.log('Polymarket series:', polymarketSeries.series.length);
  console.log('Kalshi series:', kalshiSeries.series.length);
};
```

### 3. Individual Series Analysis
Get detailed information about specific series:
```javascript
const analyzeSeries = async (seriesId) => {
  const series = await fetchSeriesV2(seriesId);
  
  if (series.series.length > 0) {
    const s = series.series[0];
    console.log(`Series: ${s.title}`);
    console.log(`Platform: ${s.platform}`);
    console.log(`Category: ${s.category}`);
    console.log(`Events: ${s.events?.length || 0}`);
    console.log(`Markets: ${s.markets?.length || 0}`);
    console.log(`Description: ${s.description}`);
  }
};
```

### 4. Search and Discovery
Find series by topic:
```javascript
const findSeriesByTopic = async (topic) => {
  const series = await fetchSeriesV2({
    search: topic,
    limit: 50
  });
  
  console.log(`Found ${series.series.length} series for "${topic}"`);
  series.series.forEach(seriesItem => {
    console.log(`${seriesItem.title} (${seriesItem.platform})`);
  });
};
```

## Examples

### JavaScript/Node.js
```javascript
const fetchSeriesV2 = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://api.polyrouter.io/functions/v1/series-v2?${queryString}`, {
    headers: {
      'X-API-Key': 'your-api-key',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get all series
const allSeries = await fetchSeriesV2({ limit: 10 });

// Get platform-specific series
const polymarketSeries = await fetchSeriesV2({
  platform: 'polymarket',
  limit: 20
});

// Get individual series
const individualSeries = await fetchSeriesV2('2');
```

### Python
```python
import requests

def fetch_series_v2(params=None):
    if params is None:
        params = {}
    
    url = "https://api.polyrouter.io/functions/v1/series-v2"
    headers = {
        "X-API-Key": "your-api-key",
    }
    
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Get series with filtering
series = fetch_series_v2({
    "platform": "kalshi",
    "limit": 15
})

# Process series
for series_item in series["series"]:
    print(f"Series: {series_item['title']}")
    print(f"Platform: {series_item['platform']}")
    print(f"Category: {series_item.get('category', 'N/A')}")
    print("---")
```

### cURL
```bash
# Basic series request
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?limit=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.series[] | {id: .id, title: .title, platform: .platform, category: .category}'

# Platform-specific series
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?platform=polymarket&limit=20" \
  -H "X-API-Key: your-api-key" \
  | jq '.series[] | {title: .title, events: (.events | length), markets: (.markets | length)}'

# Individual series lookup
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2/2" \
  -H "X-API-Key: your-api-key" \
  | jq '.series[0] | {title: .title, platform: .platform, events: (.events | length), markets: (.markets | length)}'

# Search series
curl -X GET "https://api.polyrouter.io/functions/v1/series-v2?search=trump&limit=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.series[] | {title: .title, platform: .platform, category: .category}'
```

## Performance Considerations

- **Response Times**: Typical response times are 250-400ms for most requests
- **Platform Availability**: Individual platform failures don't affect other platforms
- **Data Freshness**: All data is real-time with no caching delays
- **Rate Limits**: Respect rate limits to avoid throttling
- **Error Handling**: Implement retry logic for platform unavailability

## Migration from v1

### Key Changes
1. **Data Source**: v1 uses cached database data, v2 uses real-time API calls
2. **Series IDs**: v1 uses generated IDs, v2 uses platform-native IDs
3. **Series Structure**: v1 has basic series format, v2 has series with nested events and markets
4. **Individual Lookup**: v1 only supports path-based, v2 supports path-based routing
5. **Error Handling**: v1 has database errors, v2 has platform-specific errors

### Migration Guide
```javascript
// v1 approach
const series = await fetch('/series-v1/polymarket_series_2');

// v2 approach (path-based)
const series = await fetch('/series-v2/2');
```

## Health Check

```
GET /series-v2/health
```

Returns service health status:

```json
{
  "status": "healthy",
  "service": "series-v2",
  "timestamp": "2025-09-19T17:53:13.230Z",
  "version": "2.0.0",
  "platforms": {
    "polymarket": "healthy",
    "kalshi": "healthy"
  }
}
```

## Changelog

### v2.0.0 (2025-09-19)
- **NEW**: Real-time data access without database dependency
- **NEW**: Platform-native series IDs for better traceability
- **NEW**: Series with nested events and markets structure
- **NEW**: Advanced search and filtering capabilities
- **NEW**: Robust error handling for platform failures
- **NEW**: Direct API proxy architecture
- **IMPROVED**: Response times (250-400ms typical)
- **IMPROVED**: Data freshness (real-time vs cached)
- **IMPROVED**: Error handling and platform resilience

---

*Last updated: September 2025*
