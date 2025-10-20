# Futures API v1

The Futures API v1 provides real-time odds for sports futures markets (championships, divisions, conferences) from multiple prediction market platforms. This endpoint aggregates team-based betting data across Polymarket, Kalshi, and SX.bet.

**Note**: To discover available futures and their IDs, use the [`/list-futures-v1`](./list-futures-v1.md) endpoint.

## Base Endpoint

```
GET /futures-v1/{future_id}    # Get specific future odds (REQUIRED)
```

## Overview

The Futures API v1 offers:
- **Multi-Platform Aggregation** - Odds from 3 platforms: Polymarket, Kalshi, and SX.bet
- **Team-Based Markets** - Championships, division winners, conference champions
- **Odds Format Conversion** - American, decimal, or implied probability formats
- **Real-Time Data** - Direct platform API calls with no caching
- **Rich Metadata** - Volume, liquidity, and platform-specific data
- **Performance Optimized** - Parallel platform queries for fast responses

## Future ID Format

Futures are identified using a standardized format:

**Format**: `{league}_{future_type}_{season}`

**Examples**:
- `nfl_superbowl_2025` - Super Bowl LX Winner
- `nfl_afc_champion_2025` - AFC Champion
- `nfl_afc_east_2025` - AFC East Division Winner
- `nba_championship_2025` - NBA Championship Winner

## Workflow

To use the Futures API, follow this two-step process:

1. **Discover Futures**: Use [`GET /list-futures-v1?league=nfl`](./list-futures-v1.md) to get all available futures and their IDs
2. **Get Odds**: Use `GET /futures-v1/{future_id}` to fetch detailed odds

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | - | Filter by platforms (comma-separated): `polymarket`, `kalshi`, `sxbet` |
| `odds_format` | string | No | `american` | Odds format: `american`, `decimal`, `probability` |

## Example Requests

### Basic Workflow
```bash
# Step 1: Get available futures and their IDs
curl -X GET "https://api.polyrouter.io/functions/v1/list-futures-v1?league=nfl" \
  -H "X-API-Key: your-api-key"

# Response includes: { "id": "nfl_superbowl_2025", ... }

# Step 2: Get detailed odds for Super Bowl
curl -X GET "https://api.polyrouter.io/functions/v1/futures-v1/nfl_superbowl_2025" \
  -H "X-API-Key: your-api-key"
```

### Get Super Bowl Odds (All Platforms)
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/futures-v1/nfl_superbowl_2025" \
  -H "X-API-Key: your-api-key"
```

### Filter by Specific Platform
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/futures-v1/nfl_superbowl_2025?platform=polymarket" \
  -H "X-API-Key: your-api-key"
```

### Get Division Winner Odds
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/futures-v1/nfl_afc_east_2025" \
  -H "X-API-Key: your-api-key"
```

## Response Format

Returns a **single unified future object** with markets from all platforms:

```json
{
  "futures": [
    {
      "id": "nfl_superbowl_2025",
      "future_name": "Super Bowl LX Winner",
      "league": "nfl",
      "season": 2025,
      "future_type": "championship",
      "category": "team",
      "markets": [
        {
          "platform": "polymarket",
          "market_id": "23656",
          "outcomes": [
            {
              "team_polyrouter_id": null,
              "outcome_name": "Buffalo",
              "odds": {
                "american": "+770",
                "decimal": 8.7,
                "implied_probability": 0.115
              },
              "volume_24h": 529338.62,
              "last_trade_price": 0.11,
              "metadata": {
                "polymarket_market_id": "540209",
                "liquidity": 247861.34,
                "best_bid": 0.11,
                "best_ask": 0.12,
                "spread": 0.01
              }
            }
            // ... 32 more teams
          ]
        },
        {
          "platform": "kalshi",
          "market_id": "KXSB-26",
          "outcomes": [
            {
              "team_polyrouter_id": null,
              "outcome_name": "Buffalo",
              "odds": {
                "american": "+669",
                "decimal": 7.69,
                "implied_probability": 0.13
              },
              "volume_24h": 8656,
              "last_trade_price": 0.13,
              "metadata": {
                "kalshi_market_ticker": "KXSB-26-BUF",
                "liquidity": 123456789,
                "open_interest": 256271
              }
            }
            // ... 31 more teams
          ]
        }
      ],
      "metadata": {
        "polymarket_event_id": "23656",
        "polymarket_slug": "super-bowl-lx-winner",
        "kalshi_event_ticker": "KXSB-26"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "has_more": false,
    "next_offset": 0
  },
  "meta": {
    "request_time": 1856,
    "platforms_queried": ["polymarket", "kalshi", "sxbet"],
    "data_freshness": "2025-10-20T12:45:40.618Z"
  }
}
```

## Response Fields

### Future Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Future identifier (e.g., `nfl_superbowl_2025`) |
| `future_name` | string | Full future name |
| `league` | string | League identifier (e.g., `nfl`) |
| `season` | number | Season year |
| `future_type` | string | Future type (`championship`, `division`, `conference`) |
| `category` | string | Category (`team` for all current futures) |
| `markets` | array | Array of platform markets |
| `metadata` | object | Future metadata and platform-specific info |

### Market Object

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | Platform name (`polymarket`, `kalshi`, `sxbet`) |
| `market_id` | string | Platform-specific market identifier |
| `outcomes` | array | Array of teams/outcomes with odds |

### Outcome Object

| Field | Type | Description |
|-------|------|-------------|
| `team_polyrouter_id` | string | PolyRouter team ID (if matched) |
| `outcome_name` | string | Team name |
| `odds` | object | Odds in all formats |
| `volume_24h` | number | 24-hour trading volume |
| `last_trade_price` | number | Last trade price (0-1) |
| `metadata` | object | Platform-specific metadata |

### Odds Object

| Field | Type | Description |
|-------|------|-------------|
| `american` | string | American odds (e.g., `+770`, `-200`) |
| `decimal` | number | Decimal odds (e.g., `8.7`) |
| `implied_probability` | number | Implied probability (e.g., `0.115` = 11.5%) |

## Platform-Specific Details

### Polymarket ✅ ACTIVE
- **Market Structure**: Event with nested markets per team
- **Event ID Configured**: Super Bowl (23656)
- **Pricing**: Probability-based (0-1) with bid/ask spreads
- **Rich Data**: Volume (24h, 1mo), liquidity, best bid/ask
- **Teams**: 33 (includes tie/other)
- **Super Bowl Favorites**: Buffalo +770 (11.5%), Kansas City +545 (16%)

### Kalshi ✅ ACTIVE
- **Market Structure**: Event ticker with nested markets per team
- **Event Ticker Configured**: Super Bowl (KXSB-26)
- **Pricing**: Cent-based (0-100) converted to decimal (0-1)
- **Rich Data**: Volume_24h, liquidity, open_interest, bid/ask
- **Teams**: 32 (one per NFL team)
- **Super Bowl Favorites**: Buffalo +669 (13%), Kansas City +525 (16%)

### SX.bet ✅ INTEGRATED (No Active Markets)
- **Status**: Integrated but currently no active markets
- **League IDs Configured**: 
  - Super Bowl Winner: 10397
  - AFC Champion: 10398
  - NFC Champion: 10399
- **Note**: Markets exist on platform but have 0 active orders currently
- **Structure**: When active, provides on-chain order book with liquidity

## Use Cases

### 1. Compare Super Bowl Odds Across Platforms

```javascript
const response = await fetch('/futures-v1/nfl_superbowl_2025');
const data = await response.json();

const future = data.futures[0];
future.markets.forEach(market => {
  const buffaloOdds = market.outcomes.find(o => o.outcome_name.includes('Buffalo'));
  console.log(`${market.platform}: Buffalo ${buffaloOdds.odds.american} (${(buffaloOdds.odds.implied_probability * 100).toFixed(1)}%)`);
});

// Output:
// polymarket: Buffalo +770 (11.5%)
// kalshi: Buffalo +669 (13.0%)
```

### 2. Find Best Odds

```javascript
const response = await fetch('/futures-v1/nfl_superbowl_2025');
const data = await response.json();

// Get all platforms' odds for Kansas City Chiefs
const teamName = 'Kansas City';
const teamOdds = data.futures[0].markets
  .map(market => {
    const team = market.outcomes.find(o => o.outcome_name.includes(teamName));
    return team ? {
      platform: market.platform,
      odds: team.odds.american,
      probability: team.odds.implied_probability
    } : null;
  })
  .filter(Boolean);

console.log(`${teamName} odds:`);
teamOdds.forEach(o => {
  console.log(`  ${o.platform}: ${o.odds} (${(o.probability * 100).toFixed(1)}%)`);
});
```

### 3. Track Market Activity

```javascript
const response = await fetch('/futures-v1/nfl_superbowl_2025?platform=polymarket');
const polymarketMarket = response.futures[0].markets[0];

// Find most active teams by 24h volume
const topByVolume = polymarketMarket.outcomes
  .sort((a, b) => b.volume_24h - a.volume_24h)
  .slice(0, 5);

console.log('Most active teams (24h volume):');
topByVolume.forEach(t => {
  console.log(`  ${t.outcome_name}: $${t.volume_24h.toLocaleString()}`);
});
```

## Error Responses

### Missing Future ID (400)
```json
{
  "error": {
    "code": "FUTURE_ID_REQUIRED",
    "message": "Future ID is required. Use GET /list-futures-v1?league=nfl to get available futures and their IDs.",
    "example": "GET /futures-v1/nfl_superbowl_2025",
    "timestamp": "2025-10-20T12:00:00.000Z"
  }
}
```

### Invalid Future ID (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "future_id": ["Future not found: invalid_future_id"]
      }
    },
    "timestamp": "2025-10-20T12:00:00.000Z"
  }
}
```

## Code Examples

### JavaScript/Node.js

```javascript
async function getFuture(futureId, options = {}) {
  const params = new URLSearchParams(options);
  
  const response = await fetch(
    `https://api.polyrouter.io/functions/v1/futures-v1/${futureId}?${params}`,
    {
      headers: {
        'X-API-Key': process.env.API_KEY
      }
    }
  );
  
  return response.json();
}

// Get Super Bowl odds from all platforms
const superBowl = await getFuture('nfl_superbowl_2025');
console.log(`Platforms: ${superBowl.futures[0].markets.length}`);

// Get only Polymarket odds
const polymarketOnly = await getFuture('nfl_superbowl_2025', { platform: 'polymarket' });
```

### Python

```python
import requests
import os

def get_future(future_id, **kwargs):
    params = kwargs
    
    response = requests.get(
        f'https://api.polyrouter.io/functions/v1/futures-v1/{future_id}',
        params=params,
        headers={'X-API-Key': os.getenv('API_KEY')}
    )
    
    response.raise_for_status()
    return response.json()

# Get Super Bowl odds
super_bowl = get_future('nfl_superbowl_2025')
for market in super_bowl['futures'][0]['markets']:
    top_team = market['outcomes'][0]
    print(f"{market['platform']}: {top_team['outcome_name']} {top_team['odds']['american']}")

# Get only Kalshi
kalshi_odds = get_future('nfl_superbowl_2025', platform='kalshi')
```

## Platform Support

### Polymarket ✅
- **Super Bowl**: 33 teams with live odds
- **Data**: Volume, liquidity, bid/ask spreads
- **Update Frequency**: Real-time

### Kalshi ✅
- **Super Bowl**: 32 teams with live odds
- **Data**: Volume, liquidity, open interest
- **Update Frequency**: Real-time

### SX.bet ✅ (Integrated, No Active Markets)
- **Configured**: Super Bowl (10397), AFC Champion (10398), NFC Champion (10399)
- **Current Status**: 0 active markets
- **Note**: Will return data when markets become active

## Future Types

### Championship
Winner of the league championship
- NFL: Super Bowl
- NBA: NBA Championship
- NHL: Stanley Cup
- MLB: World Series

### Conference
Winner of conference championship
- NFL: AFC Champion, NFC Champion
- NBA: Eastern Conference, Western Conference
- NHL: Eastern Conference, Western Conference
- MLB: AL Pennant, NL Pennant

### Division
Winner of division
- NFL: 8 divisions (AFC East/North/South/West, NFC East/North/South/West)
- NBA: 6 divisions (Atlantic, Central, Southeast, Northwest, Pacific, Southwest)
- NHL: 4 divisions (Atlantic, Metropolitan, Central, Pacific)
- MLB: 6 divisions (AL East/Central/West, NL East/Central/West)

## Response Size

- **All platforms**: ~20-30KB (depends on number of teams)
- **Single platform**: ~10-15KB
- **Championship futures**: Larger (30+ teams)
- **Division futures**: Smaller (4 teams typically)

## Performance Considerations

- **Response Times**: 500-2000ms depending on number of platforms
- **Parallel Requests**: All platforms queried simultaneously
- **Data Freshness**: Real-time data with no caching
- **Rate Limits**: Respect platform rate limits to avoid throttling

## Integration with League Info

Combine with `/league-info-v1` to get team information:

```javascript
// Get team mappings
const leagueInfo = await fetch('/league-info-v1?league=nfl');
const teams = leagueInfo.leagues[0].teams;
const teamMap = new Map(teams.map(t => [t.name.toLowerCase(), t]));

// Get futures
const futures = await fetch('/futures-v1/nfl_superbowl_2025');

// Enrich outcomes with team info
futures.futures[0].markets[0].outcomes.forEach(outcome => {
  const team = teamMap.get(outcome.outcome_name.toLowerCase());
  if (team) {
    console.log(`${team.name} (${team.abbreviation}): ${outcome.odds.american}`);
    console.log(`  Stadium: ${team.metadata.stadium}`);
  }
});
```

## Comparison with Awards API

| Feature | Awards API | Futures API |
|---------|-----------|-------------|
| **Target** | Individual players/coaches | Teams |
| **Examples** | MVP, OPOY, Rookie of Year | Super Bowl, Division Winners |
| **Platforms** | Polymarket, Kalshi | Polymarket, Kalshi, SX.bet |
| **Outcome Count** | 30-70 candidates | 4-33 teams |
| **URL Pattern** | `/awards-v1/nfl_mvp_2025` | `/futures-v1/nfl_superbowl_2025` |

## Future Enhancements

- **Team Win Totals** - Over/under regular season wins
- **Playoff Qualification** - Make playoffs / miss playoffs markets
- **Seeding** - First seed, top 4 seed, etc.
- **Historical Data** - Past season results
- **Odds Movement** - Track how odds change over time

---

## Changelog

### v1.0.0 (October 20, 2025)
- **NEW**: Futures API v1 with championship, division, and conference markets
- **NEW**: Multi-platform aggregation (Polymarket, Kalshi, SX.bet)
- **NEW**: Real-time odds with volume and liquidity data
- **NEW**: Platform filtering support
- **NEW**: Multi-league support (NFL, NBA, NHL, MLB)

---

*Last updated: October 20, 2025*

