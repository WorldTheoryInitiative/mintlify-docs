# Events API v2

The Events API v2 provides real-time access to prediction market events across all supported platforms without database dependency. This endpoint directly proxies external platform APIs (Polymarket and Kalshi), formats the data into a unified response structure, and returns it immediately for maximum freshness and performance.

## Base Endpoint

```
GET /events-v2
```

## Overview

The Events API v2 offers:
- **Real-Time Data** - Direct API calls to external platforms with no database caching
- **Unified Response Format** - Consistent data structure across all platforms
- **Individual Event Lookup** - Path-based routing for specific event details
- **Advanced Filtering** - Platform, volume, and search filtering
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
| **Event Structure** | Single event format | Events with nested markets |
| **Error Handling** | Database errors | Platform-specific API errors |
| **Performance** | Fast (cached) | Fast (direct API calls) |

## Event Discovery

### Endpoint

```
GET /events-v2
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | - | Filter by platforms (comma-separated): `polymarket`, `kalshi` |
| `search` | string | No | - | Search events by title/description |
| `min_volume` | number | No | - | Filter events with minimum total volume |
| `max_volume` | number | No | - | Filter events with maximum total volume |
| `sort` | string | No | `volume_desc` | Sort order: `volume_desc`, `volume_asc`, `created_desc`, `created_asc` |
| `limit` | number | No | `50` | Number of results per page (1-100) |
| `offset` | number | No | `0` | Pagination offset |

### Example Requests

#### Basic Request
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?limit=10" \
  -H "X-API-Key: your-api-key" \
```

#### Platform Filtering
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?platform=polymarket&limit=20" \
  -H "X-API-Key: your-api-key" \
```

#### Search Functionality
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?search=nba&limit=15" \
  -H "X-API-Key: your-api-key" \
```

#### Volume Filtering
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?min_volume=1000&limit=25" \
  -H "X-API-Key: your-api-key" \
```

#### Combined Filters
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?platform=polymarket&search=sports&min_volume=5000&limit=10" \
  -H "X-API-Key: your-api-key" \
```

### Response Format

```json
{
  "markets": [
    {
      "id": "2890",
      "platform": "polymarket",
      "platform_id": "2890",
      "series_id": "polymarket_series_2",
      "title": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
      "event_slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
      "description": "In the upcoming NBA game, scheduled for December 4:\n\nIf the Dallas Mavericks win by over 5.5 points, the market will resolve to \"Yes\".\n\nIf the Memphis Grizzlies lose by less than 5.5 points or win, the market will resolve \"No.\" \n\nIf the game is not completed by December 11, 2021, the market will resolve 50-50.",
      "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-543e7263-67da-4905-8732-cd3f220ae751.png",
      "resolution_source_url": "https://www.nba.com/games",
      "event_start_at": "2021-12-04T00:00:00Z",
      "event_end_at": "2021-12-04T00:00:00Z",
      "last_synced_at": "2025-09-19T17:53:13.229Z",
      "market_count": 1,
      "total_volume": 1335.05,
      "raw_data": {
        "id": "2890",
        "ticker": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
        "slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
        "title": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
        "description": "In the upcoming NBA game, scheduled for December 4:\n\nIf the Dallas Mavericks win by over 5.5 points, the market will resolve to \"Yes\".\n\nIf the Memphis Grizzlies lose by less than 5.5 points or win, the market will resolve \"No.\" \n\nIf the game is not completed by December 11, 2021, the market will resolve 50-50.",
        "resolutionSource": "https://www.nba.com/games",
        "startDate": "2021-12-04T00:00:00Z",
        "creationDate": "2021-12-04T00:00:00Z",
        "endDate": "2021-12-04T00:00:00Z",
        "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-543e7263-67da-4905-8732-cd3f220ae751.png",
        "icon": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-543e7263-67da-4905-8732-cd3f220ae751.png",
        "active": true,
        "closed": true,
        "archived": false,
        "new": false,
        "featured": false,
        "restricted": false,
        "liquidity": 0,
        "volume": 1335.05,
        "openInterest": 0,
        "sortBy": "ascending",
        "category": "Sports",
        "published_at": "2022-07-27 14:40:02.064+00",
        "createdAt": "2022-07-27T14:40:02.074Z",
        "updatedAt": "2024-04-25T18:49:06.075795Z",
        "competitive": 0,
        "volume24hr": 0,
        "volume1wk": 0,
        "volume1mo": 0,
        "volume1yr": 0,
        "liquidityAmm": 0,
        "liquidityClob": 0,
        "commentCount": 8130,
        "markets": [
          {
            "id": "239826",
            "question": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
            "conditionId": "0x064d33e3f5703792aafa92bfb0ee10e08f461b1b34c02c1f02671892ede1609a",
            "slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
            "resolutionSource": "https://www.nba.com/games",
            "endDate": "2021-12-04T00:00:00Z",
            "category": "Sports",
            "liquidity": "50.000009",
            "startDate": "2021-12-04T19:35:03.796Z",
            "fee": "20000000000000000",
            "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-aa2992d1-38df-404a-9190-49a909775014.png",
            "icon": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-aa2992d1-38df-404a-9190-49a909775014.png",
            "description": "In the upcoming NBA game, scheduled for December 4:\n\nIf the Dallas Mavericks win by over 5.5 points, the market will resolve to \"Yes\".\n\nIf the Memphis Grizzlies lose by less than 5.5 points or win, the market will resolve \"No.\" \n\nIf the game is not completed by December 11, 2021, the market will resolve 50-50.",
            "outcomes": "[\"Yes\", \"No\"]",
            "outcomePrices": "[\"0.0000004113679809846114013590098187297978\", \"0.9999995886320190153885986409901813\"]",
            "volume": "1335.045385",
            "active": true,
            "marketType": "normal",
            "closed": true,
            "marketMakerAddress": "0x9c568Ce9a316e7CF9bCCA352b409dfDdCD9b2C08",
            "updatedBy": 15,
            "createdAt": "2021-12-04T10:33:13.541Z",
            "updatedAt": "2024-04-24T23:35:51.063381Z",
            "closedTime": "2021-12-05 20:37:01+00",
            "wideFormat": false,
            "new": false,
            "sentDiscord": false,
            "featured": false,
            "submitted_by": "0x790A4485e5198763C0a34272698ed0cd9506949B",
            "twitterCardLocation": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup.png?1638736245595",
            "twitterCardLastRefreshed": "1638736245595",
            "archived": false,
            "resolvedBy": "0x0dD333859cF16942dd333D7570D839b8946Ac221",
            "restricted": false,
            "volumeNum": 1335.05,
            "liquidityNum": 50,
            "endDateIso": "2021-12-04",
            "startDateIso": "2021-12-04",
            "hasReviewedDates": true,
            "readyForCron": true,
            "volume24hr": 0,
            "volume1wk": 0,
            "volume1mo": 0,
            "volume1yr": 0,
            "clobTokenIds": "[\"28182404005967940652495463228537840901055649726248190462854914416579180110833\", \"47044845753450022047436429968808601130811164131571549682541703866165095016290\"]",
            "fpmmLive": true,
            "volume1wkAmm": 0,
            "volume1moAmm": 0,
            "volume1yrAmm": 0,
            "volume1wkClob": 0,
            "volume1moClob": 0,
            "volume1yrClob": 0,
            "creator": "",
            "ready": false,
            "funded": false,
            "cyom": false,
            "competitive": 0,
            "pagerDutyNotificationEnabled": false,
            "approved": true,
            "rewardsMinSize": 0,
            "rewardsMaxSpread": 0,
            "spread": 1,
            "oneDayPriceChange": 0,
            "oneHourPriceChange": 0,
            "oneWeekPriceChange": 0,
            "oneMonthPriceChange": 0,
            "oneYearPriceChange": 0,
            "lastTradePrice": 0,
            "bestBid": 0,
            "bestAsk": 1,
            "clearBookOnStart": true,
            "manualActivation": false,
            "negRiskOther": false,
            "umaResolutionStatuses": "[]",
            "pendingDeployment": false,
            "deploying": false,
            "rfqEnabled": false,
            "holdingRewardsEnabled": false,
            "feesEnabled": false
          }
        ],
        "series": [
          {
            "id": "2",
            "ticker": "nba",
            "slug": "nba",
            "title": "NBA",
            "seriesType": "single",
            "recurrence": "daily",
            "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/super+cool+basketball+in+red+and+blue+wow.png",
            "icon": "https://polymarket-upload.s3.us-east-2.amazonaws.com/super+cool+basketball+in+red+and+blue+wow.png",
            "layout": "default",
            "active": true,
            "closed": false,
            "archived": false,
            "new": false,
            "featured": false,
            "restricted": true,
            "publishedAt": "2023-01-30 17:13:39.006+00",
            "createdBy": "15",
            "updatedBy": "15",
            "createdAt": "2022-10-13T00:36:01.131Z",
            "updatedAt": "2025-09-19T17:46:35.700439Z",
            "commentsEnabled": false,
            "competitive": "0",
            "volume24hr": 0,
            "startDate": "2021-01-01T17:00:00Z",
            "commentCount": 7696
          }
        ],
        "tags": [
          {
            "id": "100215",
            "label": "All",
            "slug": "all",
            "forceShow": false,
            "updatedAt": "2024-05-30T15:49:47.004061Z"
          }
        ],
        "cyom": false,
        "closedTime": "2022-07-27T14:40:02.074Z",
        "showAllOutcomes": false,
        "showMarketImages": true,
        "enableNegRisk": false,
        "seriesSlug": "nba",
        "negRiskAugmented": false,
        "pendingDeployment": false,
        "deploying": false
      }
    }
  ],
  "pagination": {
    "total": 103,
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

## Individual Event Lookup

### Path-Based Routing

```
GET /events-v2/{event_id}
```

#### Example Request
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2/2890" \
  -H "X-API-Key: your-api-key" \
```

#### Individual Event Response Format

```json
{
  "markets": [
    {
      "id": "2890",
      "platform": "polymarket",
      "platform_id": "2890",
      "series_id": "polymarket_series_2",
      "title": "NBA: Will the Mavericks beat the Grizzlies by more than 5.5 points in their December 4 matchup?",
      "event_slug": "nba-will-the-mavericks-beat-the-grizzlies-by-more-than-5pt5-points-in-their-december-4-matchup",
      "description": "In the upcoming NBA game, scheduled for December 4:\n\nIf the Dallas Mavericks win by over 5.5 points, the market will resolve to \"Yes\".\n\nIf the Memphis Grizzlies lose by less than 5.5 points or win, the market will resolve \"No.\" \n\nIf the game is not completed by December 11, 2021, the market will resolve 50-50.",
      "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nba-will-the-mavericks-beat-the-grizzlies-by-more-than-55-points-in-their-december-4-matchup-543e7263-67da-4905-8732-cd3f220ae751.png",
      "resolution_source_url": "https://www.nba.com/games",
      "event_start_at": "2021-12-04T00:00:00Z",
      "event_end_at": "2021-12-04T00:00:00Z",
      "last_synced_at": "2025-09-19T17:53:13.229Z",
      "market_count": 1,
      "total_volume": 1335.05,
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

### Event Object
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Platform-native event identifier |
| `platform` | string | Source platform (`polymarket`, `kalshi`) |
| `platform_id` | string | Original platform event ID (same as `id`) |
| `series_id` | string | Associated series identifier |
| `title` | string | Event title |
| `event_slug` | string | URL-friendly event identifier |
| `description` | string | Detailed event description |
| `image_url` | string | Event image URL |
| `resolution_source_url` | string | Resolution source URL |
| `event_start_at` | string | Event start timestamp (ISO 8601) |
| `event_end_at` | string | Event end timestamp (ISO 8601) |
| `last_synced_at` | string | Last data sync timestamp (ISO 8601) |
| `market_count` | number | Number of markets in this event |
| `total_volume` | number | Total trading volume across all markets |
| `raw_data` | object | Complete raw platform response |

### Pagination Object
| Field | Type | Description |
|-------|------|-------------|
| `total` | number | Total number of events |
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
- **Event IDs**: Uses Polymarket's internal event IDs (e.g., `2890`)
- **Event Structure**: Events contain nested markets with full market data
- **Series Information**: Events are associated with series (e.g., NBA, NFL)
- **Data Richness**: Full metadata including competitive scores, comment counts
- **Volume Data**: Total volume across all markets in the event
- **Image Support**: High-quality images for events

### Kalshi
- **Event IDs**: Uses Kalshi ticker symbols (e.g., `KXELONMARS-99`)
- **Event Structure**: Events contain nested markets with trading data
- **Series Information**: Events are associated with series categories
- **Data Richness**: Settlement timers, risk limits, tick sizes
- **Volume Data**: Total volume across all markets in the event
- **Image Support**: Limited image support (mostly null)

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
        "min_volume": ["min_volume must be a positive number"]
      }
    },
    "timestamp": "2025-09-19T17:53:13.230Z"
  },
  "meta": {
    "request_time": 5
  }
}
```

### Event Not Found (404)
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event not found with ID 'INVALID123'",
    "details": {
      "resource": "Event",
      "id": "INVALID123",
      "suggestion": "Use GET /events-v2 to find valid event IDs"
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
// For basic event discovery
const events = await fetchEventsV2();

// For platform-specific data
const polymarketEvents = await fetchEventsV2({
  platform: 'polymarket',
  limit: 20
});

// For search functionality
const nbaEvents = await fetchEventsV2({
  search: 'nba',
  limit: 50
});

// For volume filtering
const highVolumeEvents = await fetchEventsV2({
  min_volume: 10000,
  limit: 25
});
```

### 2. Individual Event Lookup
```javascript
// Path-based lookup (recommended)
const event = await fetchEventV2('2890');

// Handle different platforms
const polymarketEvent = await fetchEventV2('2890');
const kalshiEvent = await fetchEventV2('KXELONMARS-99');
```

### 3. Handle Platform Differences
```javascript
const events = await fetchEventsV2({ limit: 10 });

events.markets.forEach(event => {
  if (event.platform === 'polymarket') {
    console.log(`Polymarket: ${event.title}`);
    console.log(`Series: ${event.series_id}`);
    console.log(`Volume: $${event.total_volume?.toLocaleString()}`);
  } else if (event.platform === 'kalshi') {
    console.log(`Kalshi: ${event.title}`);
    console.log(`Volume: $${event.total_volume?.toLocaleString()}`);
  }
});
```

### 4. Error Handling
```javascript
const fetchEventsV2WithRetry = async (params, maxRetries = 3) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchEventsV2(params);
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

### 1. Real-Time Event Monitoring
Monitor events for immediate updates:
```javascript
const monitorEvents = async () => {
  const events = await fetchEventsV2({
    platform: 'polymarket',
    limit: 20
  });
  
  events.markets.forEach(event => {
    console.log(`${event.title}: ${event.total_volume} volume`);
    console.log(`Markets: ${event.market_count}`);
  });
};
```

### 2. Cross-Platform Analysis
Compare events across platforms:
```javascript
const compareEvents = async () => {
  const polymarketEvents = await fetchEventsV2({
    platform: 'polymarket',
    limit: 10
  });
  
  const kalshiEvents = await fetchEventsV2({
    platform: 'kalshi',
    limit: 10
  });
  
  console.log('Polymarket events:', polymarketEvents.markets.length);
  console.log('Kalshi events:', kalshiEvents.markets.length);
};
```

### 3. Individual Event Analysis
Get detailed information about specific events:
```javascript
const analyzeEvent = async (eventId) => {
  const event = await fetchEventV2(eventId);
  
  if (event.markets.length > 0) {
    const e = event.markets[0];
    console.log(`Event: ${e.title}`);
    console.log(`Platform: ${e.platform}`);
    console.log(`Volume: $${e.total_volume?.toLocaleString()}`);
    console.log(`Markets: ${e.market_count}`);
    console.log(`Description: ${e.description}`);
  }
};
```

### 4. Search and Discovery
Find events by topic:
```javascript
const findEventsByTopic = async (topic) => {
  const events = await fetchEventsV2({
    search: topic,
    limit: 50
  });
  
  console.log(`Found ${events.markets.length} events for "${topic}"`);
  events.markets.forEach(event => {
    console.log(`${event.title} (${event.platform})`);
  });
};
```

## Examples

### JavaScript/Node.js
```javascript
const fetchEventsV2 = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?${queryString}`, {
    headers: {
      'X-API-Key': 'your-api-key',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get all events
const allEvents = await fetchEventsV2({ limit: 10 });

// Get platform-specific events
const polymarketEvents = await fetchEventsV2({
  platform: 'polymarket',
  limit: 20
});

// Get individual event
const individualEvent = await fetchEventV2('2890');
```

### Python
```python
import requests

def fetch_events_v2(params=None):
    if params is None:
        params = {}
    
    url = "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2"
    headers = {
        "X-API-Key": "your-api-key",
    }
    
    response = requests.get(url, params=params, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Get events with filtering
events = fetch_events_v2({
    "platform": "kalshi",
    "limit": 15
})

# Process events
for event in events["markets"]:
    print(f"Event: {event['title']}")
    print(f"Platform: {event['platform']}")
    print(f"Volume: ${event.get('total_volume', 0):,.2f}")
    print("---")
```

### cURL
```bash
# Basic events request
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?limit=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {id: .id, title: .title, platform: .platform, total_volume: .total_volume}'

# Platform-specific events
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?platform=polymarket&limit=20" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {title: .title, total_volume: .total_volume, market_count: .market_count}'

# Individual event lookup
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2/2890" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[0] | {title: .title, platform: .platform, total_volume: .total_volume, description: .description}'

# Search events
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/events-v2?search=nba&limit=10" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets[] | {title: .title, platform: .platform, total_volume: .total_volume}'
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
2. **Event IDs**: v1 uses generated IDs, v2 uses platform-native IDs
3. **Event Structure**: v1 has single event format, v2 has events with nested markets
4. **Individual Lookup**: v1 only supports path-based, v2 supports path-based routing
5. **Error Handling**: v1 has database errors, v2 has platform-specific errors

### Migration Guide
```javascript
// v1 approach
const event = await fetch('/events-v1/polymarket_event_2890');

// v2 approach (path-based)
const event = await fetch('/events-v2/2890');
```

## Health Check

```
GET /events-v2/health
```

Returns service health status:

```json
{
  "status": "healthy",
  "service": "events-v2",
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
- **NEW**: Platform-native event IDs for better traceability
- **NEW**: Events with nested markets structure
- **NEW**: Advanced search and filtering capabilities
- **NEW**: Robust error handling for platform failures
- **NEW**: Direct API proxy architecture
- **IMPROVED**: Response times (250-400ms typical)
- **IMPROVED**: Data freshness (real-time vs cached)
- **IMPROVED**: Error handling and platform resilience

---

*Last updated: September 2025*
