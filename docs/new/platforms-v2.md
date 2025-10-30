# Platforms API v2

The Platforms API v2 provides comprehensive information about all supported platforms, their capabilities, and real-time health status. This endpoint allows developers to discover available platforms, understand their features, and check service availability.

## Base Endpoint

```
GET /platforms-v2
```

## Overview

The Platforms API v2 offers:
- **Platform Discovery** - List all supported market and sports platforms
- **Capability Information** - Detailed feature support for each platform
- **Health Monitoring** - Real-time health status for all platforms
- **ID Format Specifications** - Regex patterns and examples for market IDs
- **Rate Limit Information** - Rate limits for each platform
- **Endpoint Support Matrix** - Which endpoints each platform supports

## Use Cases

### 1. Platform Discovery
Discover which platforms are available and what features they support:
```javascript
const platforms = await fetch('/platforms-v2');
console.log(`Available market platforms: ${platforms.markets.total_platforms}`);
console.log(`Available sports platforms: ${platforms.sports.total_platforms}`);
```

### 2. Feature Detection
Check if a platform supports specific features:
```javascript
const platforms = await fetch('/platforms-v2');
const manifold = platforms.markets.platforms.find(p => p.platform === 'manifold');

if (manifold.endpoints.price_history) {
  console.log('Manifold supports price history');
} else {
  console.log('Manifold does not support price history');
}
```

### 3. Health Monitoring
Monitor platform health status:
```javascript
const platforms = await fetch('/platforms-v2');
const unhealthy = Object.entries(platforms.markets.health)
  .filter(([platform, status]) => status !== 'healthy')
  .map(([platform]) => platform);

if (unhealthy.length > 0) {
  console.log(`Unhealthy platforms: ${unhealthy.join(', ')}`);
}
```

### 4. ID Format Validation
Validate market IDs before making API calls:
```javascript
const platforms = await fetch('/platforms-v2');
const marketId = 'KXMVENFLMULTIGAMEEXTENDED-S2025A0E563099C2-2D8CBFF225B';

// Find which platform this ID belongs to
const platform = platforms.markets.platforms.find(p => {
  const pattern = new RegExp(p.id_format.pattern);
  return pattern.test(marketId);
});

console.log(`Market ID belongs to: ${platform.display_name}`);
```

## Response Format

```json
{
  "markets": {
    "platforms": [
      {
        "platform": "polymarket",
        "display_name": "Polymarket",
        "endpoints": {
          "markets": true,
          "events": true,
          "series": true,
          "search": true,
          "price_history": true
        },
        "features": {
          "status_filtering": true,
          "date_filtering": true,
          "pagination_type": "offset",
          "market_types": ["binary", "categorical"]
        },
        "id_format": {
          "description": "Numeric market IDs or 0x-prefixed hex strings",
          "example": "516710",
          "pattern": "^\\d+$|^0x[a-fA-F0-9]+$"
        },
        "base_url": "https://gamma-api.polymarket.com",
        "rate_limit": "100 req/min"
      },
      {
        "platform": "kalshi",
        "display_name": "Kalshi",
        "endpoints": {
          "markets": true,
          "events": true,
          "series": true,
          "search": true,
          "price_history": true
        },
        "features": {
          "status_filtering": true,
          "date_filtering": true,
          "pagination_type": "cursor",
          "market_types": ["binary"]
        },
        "id_format": {
          "description": "Ticker symbols starting with KX",
          "example": "KXMVENFLMULTIGAMEEXTENDED-S2025A0E563099C2-2D8CBFF225B",
          "pattern": "^KX[A-Z0-9\\-]+$"
        },
        "base_url": "https://api.elections.kalshi.com",
        "rate_limit": "1000 req/min"
      },
      {
        "platform": "limitless",
        "display_name": "Limitless",
        "endpoints": {
          "markets": true,
          "events": false,
          "series": false,
          "search": true,
          "price_history": true
        },
        "features": {
          "status_filtering": false,
          "date_filtering": false,
          "pagination_type": "offset",
          "market_types": ["binary", "categorical"]
        },
        "id_format": {
          "description": "Market slugs (lowercase with hyphens)",
          "example": "will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770",
          "pattern": "^[a-z0-9\\-]+$"
        },
        "base_url": "https://api.limitless.exchange",
        "rate_limit": "200 req/min (estimated)"
      },
      {
        "platform": "manifold",
        "display_name": "Manifold Markets",
        "endpoints": {
          "markets": true,
          "events": false,
          "series": false,
          "search": true,
          "price_history": false
        },
        "features": {
          "status_filtering": true,
          "date_filtering": false,
          "pagination_type": "offset",
          "market_types": ["binary", "categorical", "numeric", "poll", "bounty"]
        },
        "id_format": {
          "description": "Alphanumeric IDs or UUIDs",
          "example": "P6RhQltqPE",
          "pattern": "^[a-zA-Z0-9]+$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
        },
        "base_url": "https://api.manifold.markets",
        "rate_limit": "200 req/min (estimated)"
      }
    ],
    "health": {
      "polymarket": "healthy",
      "kalshi": "healthy",
      "limitless": "healthy",
      "manifold": "healthy"
    },
    "total_platforms": 4
  },
  "sports": {
    "platforms": [
      {
        "platform": "polymarket",
        "display_name": "Polymarket Sports",
        "endpoints": {
          "awards": true,
          "games": true,
          "list_games": true,
          "league_info": true
        },
        "features": {
          "odds_formats": ["american", "decimal", "probability"],
          "supported_leagues": ["nfl"],
          "market_types": ["player_props", "game_lines", "season_awards"]
        },
        "rate_limit": "100 req/min"
      },
      {
        "platform": "kalshi",
        "display_name": "Kalshi Sports",
        "endpoints": {
          "awards": true,
          "games": true,
          "list_games": true,
          "league_info": true
        },
        "features": {
          "odds_formats": ["american", "decimal", "probability"],
          "supported_leagues": ["nfl"],
          "market_types": ["player_props", "game_lines", "season_awards"]
        },
        "rate_limit": "1000 req/min"
      },
      {
        "platform": "prophetx",
        "display_name": "ProphetX",
        "endpoints": {
          "awards": true,
          "games": true,
          "list_games": true,
          "league_info": true
        },
        "features": {
          "odds_formats": ["american", "decimal", "probability"],
          "supported_leagues": ["nfl"],
          "market_types": ["player_props", "game_lines"]
        },
        "rate_limit": "Unknown"
      },
      {
        "platform": "novig",
        "display_name": "Novig",
        "endpoints": {
          "awards": true,
          "games": true,
          "list_games": true,
          "league_info": true
        },
        "features": {
          "odds_formats": ["american", "decimal", "probability"],
          "supported_leagues": ["nfl"],
          "market_types": ["player_props", "game_lines"]
        },
        "rate_limit": "Unknown"
      },
      {
        "platform": "sxbet",
        "display_name": "SX.bet",
        "endpoints": {
          "awards": true,
          "games": true,
          "list_games": true,
          "league_info": true
        },
        "features": {
          "odds_formats": ["american", "decimal", "probability"],
          "supported_leagues": ["nfl"],
          "market_types": ["player_props", "game_lines"]
        },
        "rate_limit": "Unknown"
      }
    ],
    "health": {
      "polymarket": "healthy",
      "kalshi": "healthy",
      "prophetx": "healthy",
      "novig": "healthy",
      "sxbet": "healthy"
    },
    "total_platforms": 5
  },
  "meta": {
    "request_time": 123,
    "timestamp": "2025-10-20T11:47:18.445Z",
    "version": "2.1.0"
  }
}
```

## Response Fields

### Market Platform Object

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | Platform identifier (lowercase) |
| `display_name` | string | Human-readable platform name |
| `endpoints` | object | Supported endpoints (markets, events, series, search, price_history) |
| `features` | object | Platform capabilities and features |
| `id_format` | object | Market ID format specification |
| `base_url` | string | Platform's base API URL |
| `rate_limit` | string | Rate limit information |

### Endpoints Object

| Field | Type | Description |
|-------|------|-------------|
| `markets` | boolean | Supports Markets-v2 endpoint |
| `events` | boolean | Supports Events-v2 endpoint |
| `series` | boolean | Supports Series-v2 endpoint |
| `search` | boolean | Supports Search-v2 endpoint |
| `price_history` | boolean | Supports Price History-v2 endpoint |

### Features Object

| Field | Type | Description |
|-------|------|-------------|
| `status_filtering` | boolean | Supports filtering by market status |
| `date_filtering` | boolean | Supports filtering by date ranges |
| `pagination_type` | string | Pagination method: `offset` or `cursor` |
| `market_types` | array | Supported market types (e.g., binary, categorical) |

### ID Format Object

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Human-readable description of ID format |
| `example` | string | Example market ID |
| `pattern` | string | Regular expression pattern for validation |

### Sports Platform Object

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | Platform identifier (lowercase) |
| `display_name` | string | Human-readable platform name |
| `endpoints` | object | Supported sports endpoints |
| `features` | object | Sports-specific features |
| `rate_limit` | string | Rate limit information |

### Sports Endpoints Object

| Field | Type | Description |
|-------|------|-------------|
| `awards` | boolean | Supports Awards-v1 endpoint |
| `games` | boolean | Supports Games-v1 endpoint |
| `list_games` | boolean | Supports List-Games-v1 endpoint |
| `league_info` | boolean | Supports League-Info-v1 endpoint |

### Sports Features Object

| Field | Type | Description |
|-------|------|-------------|
| `odds_formats` | array | Supported odds formats (american, decimal, probability) |
| `supported_leagues` | array | Supported sports leagues (e.g., nfl) |
| `market_types` | array | Supported market types (e.g., player_props, game_lines) |

### Health Status Values

| Value | Description |
|-------|-------------|
| `healthy` | Platform is operating normally |
| `degraded` | Platform is experiencing issues but partially functional |
| `unavailable` | Platform is currently unavailable |

## Platform Comparison

### Market Platforms Feature Matrix

| Platform | Markets | Events | Series | Search | Price History | Status Filter | Date Filter | Pagination |
|----------|---------|--------|--------|--------|---------------|---------------|-------------|------------|
| Polymarket | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Offset |
| Kalshi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Cursor |
| Limitless | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | Offset |
| Manifold | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | Offset |

### Sports Platforms Feature Matrix

| Platform | Awards | Games | List Games | League Info | Leagues |
|----------|--------|-------|------------|-------------|---------|
| Polymarket Sports | ✅ | ✅ | ✅ | ✅ | NFL |
| Kalshi Sports | ✅ | ✅ | ✅ | ✅ | NFL |
| ProphetX | ✅ | ✅ | ✅ | ✅ | NFL |
| Novig | ✅ | ✅ | ✅ | ✅ | NFL |
| SX.bet | ✅ | ✅ | ✅ | ✅ | NFL |

## Market ID Formats

### Polymarket
- **Format**: Numeric IDs or hex strings starting with `0x`
- **Example**: `516710` or `0x1234abcd...`
- **Pattern**: `^\d+$|^0x[a-fA-F0-9]+$`
- **Notes**: Both numeric market IDs and CLOB token IDs are supported

### Kalshi
- **Format**: Ticker symbols starting with `KX`
- **Example**: `KXMVENFLMULTIGAMEEXTENDED-S2025A0E563099C2-2D8CBFF225B`
- **Pattern**: `^KX[A-Z0-9\-]+$`
- **Notes**: All Kalshi market tickers begin with `KX` prefix

### Limitless
- **Format**: URL-friendly slugs (lowercase with hyphens)
- **Example**: `will-elon-musk-rejoin-the-trump-administration-this-year-1749202282770`
- **Pattern**: `^[a-z0-9\-]+$`
- **Notes**: Long descriptive slugs with timestamp suffixes

### Manifold
- **Format**: Short alphanumeric IDs or UUIDs
- **Example**: `P6RhQltqPE` or `550e8400-e29b-41d4-a716-446655440000`
- **Pattern**: `^[a-zA-Z0-9]+$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`
- **Notes**: Short alphanumeric IDs are more common than UUIDs

## Platform-Specific Details

### Polymarket
**Strengths:**
- Full event/series hierarchy support
- Comprehensive price history via CLOB API
- Rich metadata (CLOB token IDs, competitive scores)
- High-quality images
- Status and date filtering

**Limitations:**
- Lower rate limits (100 req/min)
- Status uses boolean `closed` flag (not status enum)

**Best For:**
- Large-scale prediction markets
- Political and economic events
- Markets with high liquidity

### Kalshi
**Strengths:**
- Highest rate limits (1000 req/min)
- Full OHLC candlestick data
- Bid/ask spreads
- Native status filtering
- Event/series hierarchy

**Limitations:**
- Binary markets only
- Requires series ticker for price history

**Best For:**
- Binary prediction markets
- High-frequency data access
- Markets with precise pricing

### Limitless
**Strengths:**
- Simple market structure
- Creator information
- Collateral token details
- Price history support

**Limitations:**
- No events or series support
- No status filtering
- No date filtering
- Lower feature set

**Best For:**
- Simple market discovery
- Markets with specific creators
- Crypto-native markets

### Manifold
**Strengths:**
- Most diverse market types (binary, categorical, numeric, polls, bounties)
- Token filtering (MANA vs CASH)
- Topic tags and creator metadata
- Unique trader counts
- Community-driven markets

**Limitations:**
- No price history
- No events or series support
- No date filtering
- Uses search-markets API for filtering

**Best For:**
- Community prediction markets
- Multiple choice markets
- Play money (MANA) markets
- Markets with many traders

## Status Filtering Behavior

Each platform handles status filtering differently:

### Polymarket
- **API Parameter**: `closed` (boolean)
- **Mapping**: 
  - `status=open` → `closed=false`
  - `status=closed` → `closed=true` (returns resolved markets)
  - `status=resolved` → `closed=true`
- **Response Status**: Markets have `status: "resolved"` when closed

### Kalshi
- **API Parameter**: `status` (comma-separated string)
- **Mapping**: Direct mapping to Kalshi values
  - `status=open` → `status=open`
  - `status=closed` → `status=closed`
  - `status=resolved` → `status=settled`
  - `status=unopened` → `status=unopened`
- **Response Status**: Direct status values from API

### Limitless
- **API Parameter**: None (status filtering not supported)
- **Behavior**: All markets returned regardless of status parameter
- **Response Status**: Status determined from market data

### Manifold
- **API Parameter**: `filter` (single value)
- **Mapping**:
  - `status=open` → `filter=open`
  - `status=closed` → `filter=closed` (returns markets with `isResolved=false` but past close time)
  - `status=resolved` → `filter=resolved`
- **Response Status**: Calculated from `isResolved` and `closeTime`

## Example Requests

### Basic Platform Discovery
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets.platforms[] | {platform, display_name, endpoints}'
```

### Check Platform Health
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets.health'
```

### Get ID Formats
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets.platforms[] | {platform, id_format}'
```

### Check Feature Support
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2" \
  -H "X-API-Key: your-api-key" \
  | jq '.markets.platforms[] | {platform, features}'
```

### Sports Platforms
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2" \
  -H "X-API-Key: your-api-key" \
  | jq '.sports.platforms[] | {platform, display_name, supported_leagues: .features.supported_leagues}'
```

## Code Examples

### JavaScript/Node.js
```javascript
const fetchPlatforms = async () => {
  const response = await fetch('https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2', {
    headers: {
      'X-API-Key': 'your-api-key',
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Get all platforms
const platforms = await fetchPlatforms();

// Filter platforms by capability
const platformsWithPriceHistory = platforms.markets.platforms
  .filter(p => p.endpoints.price_history)
  .map(p => p.platform);

console.log('Platforms with price history:', platformsWithPriceHistory);

// Check if a specific platform supports an endpoint
const kalshi = platforms.markets.platforms.find(p => p.platform === 'kalshi');
if (kalshi.endpoints.series) {
  console.log('Kalshi supports series endpoint');
}

// Validate market ID format
const validateMarketId = (marketId, platformName) => {
  const platform = platforms.markets.platforms.find(p => p.platform === platformName);
  if (!platform) return false;
  
  const pattern = new RegExp(platform.id_format.pattern);
  return pattern.test(marketId);
};

console.log(validateMarketId('516710', 'polymarket')); // true
console.log(validateMarketId('KXMARKET123', 'kalshi')); // true
console.log(validateMarketId('516710', 'kalshi')); // false
```

### Python
```python
import requests
import re

def fetch_platforms():
    url = "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2"
    headers = {
        "X-API-Key": "your-api-key",
    }
    
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Get platforms
platforms = fetch_platforms()

# Find platforms that support a specific endpoint
def find_platforms_with_endpoint(endpoint_name):
    return [
        p['platform'] 
        for p in platforms['markets']['platforms']
        if p['endpoints'].get(endpoint_name, False)
    ]

print("Platforms with events:", find_platforms_with_endpoint('events'))
print("Platforms with price_history:", find_platforms_with_endpoint('price_history'))

# Validate market ID
def validate_market_id(market_id, platform_name):
    platform = next(
        (p for p in platforms['markets']['platforms'] if p['platform'] == platform_name),
        None
    )
    
    if not platform:
        return False
    
    pattern = platform['id_format']['pattern']
    return bool(re.match(pattern, market_id))

print(validate_market_id('516710', 'polymarket'))  # True
print(validate_market_id('KXMARKET123', 'kalshi'))  # True

# Check platform health
unhealthy = [
    platform 
    for platform, status in platforms['markets']['health'].items()
    if status != 'healthy'
]

if unhealthy:
    print(f"Unhealthy platforms: {', '.join(unhealthy)}")
else:
    print("All platforms are healthy")
```

### TypeScript
```typescript
interface Platform {
  platform: string;
  display_name: string;
  endpoints: {
    markets: boolean;
    events: boolean;
    series: boolean;
    search: boolean;
    price_history: boolean;
  };
  features: {
    status_filtering: boolean;
    date_filtering: boolean;
    pagination_type: 'offset' | 'cursor';
    market_types: string[];
  };
  id_format: {
    description: string;
    example: string;
    pattern: string;
  };
  base_url: string;
  rate_limit: string;
}

interface PlatformsResponse {
  markets: {
    platforms: Platform[];
    health: Record<string, 'healthy' | 'degraded' | 'unavailable'>;
    total_platforms: number;
  };
  sports: {
    platforms: any[];
    health: Record<string, string>;
    total_platforms: number;
  };
  meta: {
    request_time: number;
    timestamp: string;
    version: string;
  };
}

const fetchPlatforms = async (): Promise<PlatformsResponse> => {
  const response = await fetch('https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/platforms-v2', {
    headers: {
      'X-API-Key': 'your-api-key',
    }
  });
  
  return response.json();
};

// Detect platform from market ID
const detectPlatform = (marketId: string, platforms: Platform[]): Platform | null => {
  return platforms.find(p => {
    const pattern = new RegExp(p.id_format.pattern);
    return pattern.test(marketId);
  }) || null;
};

const platforms = await fetchPlatforms();
const platform = detectPlatform('KXMARKET123', platforms.markets.platforms);
console.log(`Detected platform: ${platform?.display_name}`);
```

## Use Cases

### 1. Dynamic Platform Selection
```javascript
const platforms = await fetchPlatforms();

// Find best platform for specific use case
const platformsWithEvents = platforms.markets.platforms
  .filter(p => p.endpoints.events);

console.log('Platforms with events support:', 
  platformsWithEvents.map(p => p.display_name)
);
```

### 2. ID Format Validation
```javascript
const validateAndRoute = async (marketId) => {
  const platforms = await fetchPlatforms();
  
  // Detect which platform this ID belongs to
  const platform = platforms.markets.platforms.find(p => {
    const pattern = new RegExp(p.id_format.pattern);
    return pattern.test(marketId);
  });
  
  if (!platform) {
    throw new Error('Invalid market ID format');
  }
  
  console.log(`Routing to ${platform.display_name}`);
  return fetch(`/markets-v2/${marketId}?platform=${platform.platform}`);
};
```

### 3. Health-Based Routing
```javascript
const getHealthyPlatforms = async () => {
  const platforms = await fetchPlatforms();
  
  return platforms.markets.platforms
    .filter(p => platforms.markets.health[p.platform] === 'healthy')
    .map(p => p.platform);
};

// Only query healthy platforms
const healthyPlatforms = await getHealthyPlatforms();
const markets = await fetch(`/markets-v2?platform=${healthyPlatforms.join(',')}`);
```

### 4. Feature-Based Selection
```javascript
const selectPlatform = async (requirements) => {
  const platforms = await fetchPlatforms();
  
  return platforms.markets.platforms.find(p => {
    if (requirements.price_history && !p.endpoints.price_history) return false;
    if (requirements.status_filtering && !p.features.status_filtering) return false;
    if (requirements.market_type && !p.features.market_types.includes(requirements.market_type)) return false;
    return true;
  });
};

const platform = await selectPlatform({
  price_history: true,
  status_filtering: true,
  market_type: 'categorical'
});

console.log(`Selected platform: ${platform?.display_name}`);
```

## Performance

- **Response Time**: < 50ms (static configuration data)
- **Caching**: Can be cached client-side indefinitely
- **No External Calls**: No external API calls required
- **Always Available**: Not dependent on external platform availability

## Best Practices

### 1. Cache Platform Information
```javascript
// Cache platforms response to avoid unnecessary requests
let cachedPlatforms = null;
let cacheTime = null;
const CACHE_TTL = 3600000; // 1 hour

const getPlatforms = async () => {
  if (cachedPlatforms && Date.now() - cacheTime < CACHE_TTL) {
    return cachedPlatforms;
  }
  
  cachedPlatforms = await fetchPlatforms();
  cacheTime = Date.now();
  return cachedPlatforms;
};
```

### 2. Use for Client-Side Validation
```javascript
const validateRequest = async (marketId, endpoint) => {
  const platforms = await getPlatforms();
  
  // Detect platform from ID
  const platform = platforms.markets.platforms.find(p => {
    const pattern = new RegExp(p.id_format.pattern);
    return pattern.test(marketId);
  });
  
  if (!platform) {
    throw new Error('Invalid market ID format');
  }
  
  // Check if platform supports endpoint
  if (!platform.endpoints[endpoint]) {
    throw new Error(`Platform ${platform.display_name} does not support ${endpoint}`);
  }
  
  return platform;
};
```

### 3. Build Platform-Specific UI
```javascript
const buildPlatformSelector = async () => {
  const platforms = await fetchPlatforms();
  
  return platforms.markets.platforms.map(p => ({
    value: p.platform,
    label: p.display_name,
    disabled: platforms.markets.health[p.platform] !== 'healthy',
    features: Object.entries(p.endpoints)
      .filter(([_, supported]) => supported)
      .map(([endpoint]) => endpoint)
  }));
};
```

## Integration with Other Endpoints

### Market Discovery
```javascript
// Get platforms, then query markets
const platforms = await fetchPlatforms();
const healthyPlatforms = Object.entries(platforms.markets.health)
  .filter(([_, status]) => status === 'healthy')
  .map(([platform]) => platform);

const markets = await fetch(`/markets-v2?platform=${healthyPlatforms.join(',')}&limit=50`);
```

### ID-Based Routing
```javascript
// Auto-detect platform from market ID
const getMarket = async (marketId) => {
  const platforms = await fetchPlatforms();
  
  const platform = platforms.markets.platforms.find(p => {
    const pattern = new RegExp(p.id_format.pattern);
    return pattern.test(marketId);
  });
  
  if (!platform) {
    throw new Error('Unknown market ID format');
  }
  
  return fetch(`/markets-v2/${marketId}?platform=${platform.platform}`);
};
```

## Error Handling

### Authentication Error (401)
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or missing API key",
    "timestamp": "2025-10-20T11:47:18.445Z"
  }
}
```

### Internal Error (500)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred while fetching platform information",
    "timestamp": "2025-10-20T11:47:18.445Z"
  }
}
```

## Rate Limits

This endpoint uses the same rate limits as other v2 endpoints:
- **Free Tier**: 100 requests/minute
- **Starter Tier**: 500 requests/minute
- **Pro Tier**: 2000 requests/minute
- **Enterprise**: Custom limits

## Changelog

### v2.1.0 (2025-10-20)
- **NEW**: Initial release of Platforms API
- **NEW**: Market platforms information (Polymarket, Kalshi, Limitless, Manifold)
- **NEW**: Sports platforms information (Polymarket, Kalshi, ProphetX, Novig, SX.bet)
- **NEW**: Platform health status monitoring
- **NEW**: ID format specifications with regex patterns
- **NEW**: Feature capability matrix
- **NEW**: Rate limit information

---

*Last updated: October 2025*

