# Awards API v1

The Awards API v1 provides real-time odds for individual player and coach awards (MVP, Rookie of the Year, Coach of the Year, etc.) from multiple prediction market platforms. This endpoint aggregates betting data across Polymarket and Kalshi.

**Note**: To discover available awards and their IDs, use the [`/list-awards-v1`](./list-awards-v1.md) endpoint.

## Base Endpoint

```
GET /awards-v1/{award_id}    # Get specific award odds (REQUIRED)
```

## Overview

The Awards API v1 offers:
- **Multi-Platform Aggregation** - Odds from 2 platforms: Polymarket and Kalshi
- **Player & Coach Awards** - MVP, OPOY, DPOY, Rookie of the Year, Coach of the Year, etc.
- **Odds Format Conversion** - American, decimal, or implied probability formats
- **Real-Time Data** - Direct platform API calls with no caching
- **Rich Metadata** - Volume, liquidity, and platform-specific data
- **Performance Optimized** - Parallel platform queries for fast responses

**Note**: Team-based futures (Super Bowl, divisions, conferences) have moved to the [`/futures-v1`](./futures-v1.md) endpoint.

## Supported Awards

### NFL Awards (2025-26 Season)

All awards are available from **both Polymarket and Kalshi**:

- **MVP** - Most Valuable Player
  - Polymarket: 68 candidates | Kalshi: 52 candidates
- **OPOY** - Offensive Player of the Year
  - Polymarket: 53 candidates | Kalshi: 51 candidates
- **DPOY** - Defensive Player of the Year
  - Polymarket: 53 candidates | Kalshi: 53 candidates
- **OROY** - Offensive Rookie of the Year
  - Polymarket: 34 candidates | Kalshi: 51 candidates
- **DROY** - Defensive Rookie of the Year
  - Polymarket: 25 candidates | Kalshi: 51 candidates
- **CPOY** - Comeback Player of the Year
  - Polymarket: 34 candidates | Kalshi: 33 candidates
- **COY** - Coach of the Year
  - Polymarket: 40 candidates | Kalshi: 33 candidates

**Note**: Team-based futures (Super Bowl, conference, and division winners) have moved to [`/futures-v1`](./futures-v1.md).

## Award ID Format

Awards are identified using a standardized format:

**Format**: `{league}_{award_type}_{season}`

**Examples**:
- `nfl_mvp_2025` - NFL MVP
- `nfl_dpoy_2025` - NFL Defensive Player of the Year
- `nba_mvp_2025` - NBA MVP

## Workflow

To use the Awards API, follow this two-step process:

1. **Discover Awards**: Use [`GET /list-awards-v1?league=nfl`](./list-awards-v1.md) to get all available awards and their IDs
2. **Get Odds**: Use `GET /awards-v1/{award_id}` to fetch detailed odds

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | - | Filter by platforms (comma-separated): `polymarket`, `kalshi` |
| `odds_format` | string | No | `american` | Odds format: `american`, `decimal`, `probability` |

## Example Requests

### Basic Workflow
```bash
# Step 1: Get available awards and their IDs
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/list-awards-v1?league=nfl" \
  -H "X-API-Key: your-api-key"

# Response includes: { "id": "nfl_mvp_2025", ... }

# Step 2: Get detailed odds for NFL MVP
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/awards-v1/nfl_mvp_2025" \
  -H "X-API-Key: your-api-key"
```

### Get NFL MVP Odds (All Platforms)
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/awards-v1/nfl_mvp_2025" \
  -H "X-API-Key: your-api-key"
```

### Get NFL MVP with Decimal Odds
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/awards-v1/nfl_mvp_2025?odds_format=decimal" \
  -H "X-API-Key: your-api-key"
```

### Filter by Platform
```bash
curl -X GET "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/awards-v1/nfl_mvp_2025?platform=kalshi" \
  -H "X-API-Key: your-api-key"
```

## Response Format

Returns a **single unified award object** with markets from all platforms:

```json
{
  "awards": [
    {
      "id": "nfl_mvp_2025",
      "award_name": "NFL MVP",
      "league": "nfl",
      "season": 2025,
      "award_type": "mvp",
      "markets": [
        {
          "platform": "polymarket",
          "market_id": "33682",
          "candidates": [
            {
              "player_name": "Josh Allen",
              "team_polyrouter_id": null,
              "odds": {
                "american": "+153",
                "decimal": 2.53,
                "implied_probability": 0.395
              },
              "volume_24h": 1003,
              "last_trade_price": 0.4,
              "metadata": {
                "polymarket_market_id": "566648",
                "polymarket_condition_id": "0x33dd906869981227e2b2711b03aa578e4fbec0cd618a3905d364a4ca07d83b46",
                "liquidity": 7503,
                "best_bid": 0.27,
                "best_ask": 0.52,
                "spread": 0.25,
                "clob_token_ids": "[\"115542647731992906371806514836619617982959930503399160204297198316787384267730\", \"92617505285231219970901114478714477757083223773887711801217588686286869016155\"]"
              }
            },
            {
              "player_name": "Patrick Mahomes",
              "team_polyrouter_id": null,
              "odds": {
                "american": "+382",
                "decimal": 4.82,
                "implied_probability": 0.2075
              },
              "volume_24h": 3646,
              "last_trade_price": 0.12,
              "metadata": {
                "polymarket_market_id": "566651",
                "liquidity": 7163,
                "best_bid": 0.145,
                "best_ask": 0.27,
                "spread": 0.125
              }
            }
            // ... 66 more candidates
          ]
        }
      ],
      "metadata": {
        "polymarket_event_id": "33682",
        "polymarket_slug": "nfl-mvp-355",
        "deadline": "2026-02-18T00:00:00Z",
        "description": "This is a polymarket on which player will be named the 2025–26 NFL regular season MVP.",
        "total_volume": 68162,
        "volume_24h": 873
      }
    },
    {
      "id": "nfl_mvp_2025",
      "award_name": "NFL MVP",
      "league": "nfl",
      "season": 2025,
      "award_type": "mvp",
      "markets": [
        {
          "platform": "kalshi",
          "market_id": "KXNFLMVP-26",
          "candidates": [
            {
              "player_name": "Josh Allen",
              "team_polyrouter_id": null,
              "odds": {
                "american": "+163",
                "decimal": 2.63,
                "implied_probability": 0.38
              },
              "volume_24h": 4476,
              "last_trade_price": 0.38,
              "metadata": {
                "kalshi_market_ticker": "KXNFLMVP-26-JALL",
                "liquidity": 130248773,
                "open_interest": 256271,
                "yes_bid": 0.36,
                "yes_ask": 0.42
              }
            },
            {
              "player_name": "Baker Mayfield",
              "team_polyrouter_id": null,
              "odds": {
                "american": "+669",
                "decimal": 7.69,
                "implied_probability": 0.13
              },
              "volume_24h": 17896,
              "last_trade_price": 0.13,
              "metadata": {
                "kalshi_market_ticker": "KXNFLMVP-26-BMAY",
                "liquidity": 122792351,
                "open_interest": 291010,
                "yes_bid": 0.12,
                "yes_ask": 0.13
              }
            }
            // ... 50 more candidates
          ]
        }
      ],
      "metadata": {
        "kalshi_event_ticker": "KXNFLMVP-26",
        "kalshi_series_ticker": "KXNFLMVP",
        "description": "MVP winner? - 2025-26 season"
      }
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50,
    "offset": 0,
    "has_more": false,
    "next_offset": 0
  },
  "meta": {
    "request_time": 1856,
    "platforms_queried": ["polymarket", "kalshi", "prophetx", "novig", "sxbet"],
    "data_freshness": "2025-10-12T20:21:46.834Z"
  }
}
```

**Note**: The response shows a **single award object** with multiple markets (one per platform). This unified structure allows you to easily compare odds across platforms for the same award.

## Response Fields

### Award Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Award identifier (e.g., `nfl_mvp_2025`) |
| `award_name` | string | Full award name |
| `league` | string | League identifier (e.g., `nfl`) |
| `season` | number | Season year |
| `award_type` | string | Award type code (`mvp`, `opoy`, etc.) |
| `markets` | array | Array of platform markets |
| `metadata` | object | Award metadata and platform-specific info |

### Market Object

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | Platform name (`kalshi`, `polymarket`, etc.) |
| `market_id` | string | Platform-specific market identifier |
| `candidates` | array | Array of award candidates with odds |

### Candidate Object

| Field | Type | Description |
|-------|------|-------------|
| `player_name` | string | Player or coach name |
| `team_polyrouter_id` | string | PolyRouter team ID (if applicable) |
| `odds` | object | Odds in all formats |
| `volume_24h` | number | 24-hour trading volume |
| `last_trade_price` | number | Last trade price (0-1) |
| `metadata` | object | Platform-specific metadata |

### Odds Object

| Field | Type | Description |
|-------|------|-------------|
| `american` | string | American odds (e.g., `+163`, `-200`) |
| `decimal` | number | Decimal odds (e.g., `2.63`) |
| `implied_probability` | number | Implied probability (e.g., `0.38` = 38%) |

## Odds Formats Explained

### American Odds
- **Positive (+)**: Underdog odds showing profit on $100 bet
  - `+163` = Win $163 on $100 bet ($263 total return)
- **Negative (-)**: Favorite odds showing bet needed to win $100
  - `-200` = Bet $200 to win $100 ($300 total return)

### Decimal Odds
- Represents total return per $1 wagered
- `2.63` = $2.63 return on $1 bet ($1.63 profit)

### Implied Probability
- Market's estimated chance of winning
- `0.38` = 38% probability

## Platform-Specific Details

### Polymarket ✅ ACTIVE
- **Market Structure**: Event with nested markets per candidate/team
- **Event IDs Configured**: All 8 NFL awards
  - MVP: 33682 | OPOY: 40669 | DPOY: 40668 | OROY: 23940
  - DROY: 23939 | CPOY: 23938 | COY: 24059 | Super Bowl: 23656
- **Individual Markets**: Each candidate has their own market (e.g., market ID `566648` for Josh Allen)
- **Pricing**: Probability-based (0-1) with bid/ask spreads
- **Rich Data**: Volume (24h, 1mo, 1yr), liquidity, best bid/ask, CLOB token IDs
- **Candidate Field**: Uses `groupItemTitle` for player/team names
- **MVP Favorites**: Josh Allen (+153, 39.5%), Patrick Mahomes (+382, 20.75%), Baker Mayfield (+755, 11.7%)
- **Super Bowl Favorites**: Buffalo Bills (+506, 17%), Baltimore Ravens (+2603, 4%)

### Kalshi ✅ ACTIVE
- **Market Structure**: Event ticker with nested markets per candidate/team
- **Event Tickers Configured**: All 8 NFL awards
  - MVP: KXNFLMVP-26 | OPOY: KXNFLOPOTY-26 | DPOY: KXNFLDPOTY-26 | OROY: KXNFLOROTY-26
  - DROY: KXNFLDROTY-26 | CPOY: KXNFLCPOTY-26 | COY: KXNFLCOTY-26 | Super Bowl: KXSB-26
- **Individual Markets**: Each candidate has their own ticker (e.g., `KXNFLMVP-26-JALL` for Josh Allen)
- **Pricing**: Cent-based (0-100) converted to decimal (0-1)
- **Rich Data**: Volume_24h, liquidity, open_interest, bid/ask spreads
- **MVP Favorites**: Josh Allen (+163, 38%), Baker Mayfield (+669, 13%), Patrick Mahomes (+614, 14%)
- **Super Bowl Favorites**: Buffalo Bills (+567, 15%), Detroit Lions (+733, 12%), Green Bay Packers (+900, 10%)

### ProphetX ⏳ COMING SOON
- **Status**: Tournament IDs need to be added to registry
- **Structure**: Tournament-based with competitor selections
- **API**: Uses affiliate endpoint with event-based queries

### Novig ⏳ COMING SOON
- **Status**: Not yet implemented
- **Priority**: Low (will be added in future release)

### SX.bet ✅ INTEGRATED (No Active Markets)
- **Status**: Integrated but no active championship markets currently
- **League IDs Configured**: 
  - Super Bowl Winner: 10397 (NFL - Super Bowl Champion) - **0 markets**
  - AFC Champion: 10398 (NFL - AFC Champion) - **0 markets**
  - NFC Champion: 10399 (NFL - NFC Champion) - **0 markets**
  - Super Bowl MVP: 10407 (Super Bowl - MVP) - **0 markets**
- **Market Structure**: League-based with market hashes for each team
- **Pricing**: Percentage odds format (0-100 converted to 0-1)
- **Rich Data**: On-chain order book with liquidity (when markets are active)
- **Note**: 
  - Individual player awards (MVP, OPOY, etc.) are not supported on SX.bet
  - Championship markets exist on the platform but have no active markets at this time
  - Markets may become active later in the season
- **Available Player Prop Leagues** (not included in awards endpoint):
  - League 10593: NFL - Touchdown Scorers (51 events)
  - League 10591: NFL - Player Passing Touchdowns (2 events)
  - League 10589: NFL - Player Passing Yards (2 events)
  - League 10590: NFL - Player Receiving Yards (3 events)
  - League 10026: NFL - Player Rushing Yards (3 events)
  - League 10592: NFL - Player Total Receptions (3 events)

**Checking for Market Availability**:
To check if SX.bet championship markets have become active:
```bash
# Check Super Bowl markets
curl "https://api.sx.bet/markets/active?leagueId=10397"

# Check AFC Champion markets
curl "https://api.sx.bet/markets/active?leagueId=10398"

# Check NFC Champion markets  
curl "https://api.sx.bet/markets/active?leagueId=10399"

# Check Super Bowl MVP markets
curl "https://api.sx.bet/markets/active?leagueId=10407"
```

If markets become active, the Purity API will automatically include them in responses.

## Use Cases

### 1. Compare Odds Across Platforms

```javascript
const response = await fetch('/awards-v1?league=nfl&award_type=mvp');
const data = await response.json();

const award = data.awards[0];
award.markets.forEach(market => {
  console.log(`${market.platform} odds:`);
  market.candidates.slice(0, 3).forEach(c => {
    console.log(`  ${c.player_name}: ${c.odds.american}`);
  });
});
```

### 2. Find Best Odds

Compare odds across platforms to find the best value:

```javascript
const response = await fetch('/awards-v1?league=nfl&award_type=mvp');
const data = await response.json();

// Get all platforms' odds for a player
const playerName = 'Josh Allen';
const playerOdds = data.awards
  .flatMap(award => award.markets)
  .map(market => {
    const candidate = market.candidates.find(c => c.player_name === playerName);
    return candidate ? {
      platform: market.platform,
      american: candidate.odds.american,
      decimal: candidate.odds.decimal,
      probability: candidate.odds.implied_probability
    } : null;
  })
  .filter(Boolean);

console.log(`${playerName} odds:`);
playerOdds.forEach(o => {
  console.log(`  ${o.platform}: ${o.american} (${(o.probability * 100).toFixed(1)}%)`);
});

// Output:
// Josh Allen odds:
//   polymarket: +153 (39.5%)
//   kalshi: +163 (38.0%)
// Best odds: Polymarket at +153 (higher payout for same $100 bet)
```

### 3. Track Market Activity

```javascript
// Find most active markets by 24h volume
award.markets[0].candidates
  .sort((a, b) => b.volume_24h - a.volume_24h)
  .slice(0, 5)
  .forEach(c => {
    console.log(`${c.player_name}: $${c.volume_24h.toLocaleString()} volume`);
  });
```

### 4. Calculate Expected Value

```javascript
const candidate = award.markets[0].candidates[0];
const yourEstimatedProbability = 0.45; // You think they have 45% chance

const decimal = candidate.odds.decimal;
const ev = (decimal * yourEstimatedProbability) - 1;
console.log(`Expected Value: ${(ev * 100).toFixed(2)}%`);
```

## Error Responses

### Missing Required Parameter (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "league": ["league is required"]
      }
    },
    "timestamp": "2025-10-12T20:00:00.000Z"
  }
}
```

### Missing Award ID (400)
```json
{
  "error": {
    "code": "AWARD_ID_REQUIRED",
    "message": "Award ID is required. Use GET /list-awards-v1?league=nfl to get available awards and their IDs.",
    "example": "GET /awards-v1/nfl_mvp_2025",
    "timestamp": "2025-10-20T12:00:00.000Z"
  }
}
```

### Invalid Award ID (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "award_id": ["Award not found: invalid_award_id"]
      }
    },
    "timestamp": "2025-10-20T12:00:00.000Z"
  }
}
```

## Best Practices

### 1. Use List Endpoint First

Always start with `/list-awards-v1` to discover available awards:

```bash
curl "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/list-awards-v1?league=nfl"
```

### 2. Choose Appropriate Odds Format

American odds are most familiar to US bettors, while decimal odds are clearer mathematically:

```javascript
// For US audience
const mvpOdds = await fetch('/awards-v1?league=nfl&award_type=mvp&odds_format=american');

// For probability analysis
const mvpProbs = await fetch('/awards-v1?league=nfl&award_type=mvp&odds_format=probability');
```

### 3. Monitor High-Volume Candidates

Track where the money is flowing:

```javascript
const topByVolume = candidates
  .filter(c => c.volume_24h > 0)
  .sort((a, b) => b.volume_24h - a.volume_24h);
```

### 4. Use Bid/Ask for Better Pricing

Check the spread before placing bets:

```javascript
const spread = candidate.metadata.yes_ask - candidate.metadata.yes_bid;
console.log(`Spread: ${(spread * 100).toFixed(2)}%`);
```

## Integration with League Info

Combine with `/league-info-v1` to get team information for candidates:

```javascript
// Get team mappings
const leagueInfo = await fetch('/league-info-v1?league=nfl');
const teams = leagueInfo.leagues[0].teams;

// Get awards
const awards = await fetch('/awards-v1?league=nfl&award_type=mvp');

// Enrich candidates with team info
awards.awards[0].markets[0].candidates.forEach(candidate => {
  // TODO: Match player to team (would need player-team mapping)
  console.log(candidate.player_name, candidate.odds.american);
});
```

## Performance Considerations

- **Response Times**: 500-2000ms depending on number of platforms and awards
- **Parallel Requests**: All platforms queried simultaneously
- **Data Freshness**: Real-time data with no caching
- **Rate Limits**: Respect platform rate limits to avoid throttling

## Code Examples

### JavaScript/Node.js

```javascript
async function getAwards(league, awardType = null) {
  const params = new URLSearchParams({ league });
  if (awardType) params.append('award_type', awardType);
  
  const response = await fetch(
    `https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/awards-v1?${params}`,
    {
      headers: {
        'X-API-Key': process.env.API_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_TOKEN}`
      }
    }
  );
  
  return response.json();
}

// Get all awards
const allAwards = await getAwards('nfl');
console.log(`Total awards: ${allAwards.awards.length}`);

// Get MVP only
const mvp = await getAwards('nfl', 'mvp');
const topCandidate = mvp.awards[0].markets[0].candidates[0];
console.log(`MVP favorite: ${topCandidate.player_name} at ${topCandidate.odds.american}`);
```

### Python

```python
import requests
import os

def get_awards(league, award_type=None):
    params = {'league': league}
    if award_type:
        params['award_type'] = award_type
    
    response = requests.get(
        'https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/awards-v1',
        params=params,
        headers={
            'X-API-Key': os.getenv('API_KEY'),
            'Authorization': f'Bearer {os.getenv("SUPABASE_TOKEN")}'
        }
    )
    
    response.raise_for_status()
    return response.json()

# Get all NFL awards
awards = get_awards('nfl')
for award in awards['awards']:
    print(f"{award['award_name']}: {len(award['markets'][0]['candidates'])} candidates")

# Get top 5 MVP candidates
mvp = get_awards('nfl', 'mvp')
candidates = mvp['awards'][0]['markets'][0]['candidates'][:5]
for c in candidates:
    print(f"{c['player_name']}: {c['odds']['american']} (${c['volume_24h']:,.0f} volume)")
```

## Adding Platform Market IDs

### Current Configuration Status

**✅ Fully Configured (Both Polymarket + Kalshi):**
- **MVP** - Polymarket (33682) + Kalshi (KXNFLMVP-26)
- **OPOY** - Polymarket (40669) + Kalshi (KXNFLOPOTY-26)
- **DPOY** - Polymarket (40668) + Kalshi (KXNFLDPOTY-26)
- **OROY** - Polymarket (23940) + Kalshi (KXNFLOROTY-26)
- **DROY** - Polymarket (23939) + Kalshi (KXNFLDROTY-26)
- **CPOY** - Polymarket (23938) + Kalshi (KXNFLCPOTY-26)
- **COY** - Polymarket (24059) + Kalshi (KXNFLCOTY-26)
- **Super Bowl** - Polymarket (23656) + Kalshi (KXSB-26)

**All 8 NFL awards are fully operational with dual-platform support!**

### How to Add Missing IDs

1. **Find the Polymarket Event**: Search on Polymarket for the award (e.g., "NFL OPOY 2025")
2. **Get the Event ID**: From the URL or API response
3. **Update the registry**: Edit `supabase/functions/_shared/sports-router/data/nfl-awards.ts`

Example:
```typescript
{
  id: "nfl_opoy_2025",
  award_name: "NFL Offensive Player of the Year",
  platform_markets: {
    polymarket: {
      market_id: "12345", // ← Add the Polymarket event ID here
      clob_token_ids: []
    },
    kalshi: {
      market_ticker: "KXNFLOPOTY-26" // ✅ Already configured
    },
    prophetx: {
      tournament_id: "" // ← Add ProphetX tournament ID when available
    }
  }
}
```

### Finding Polymarket Event IDs

**Method 1: Search API**
```bash
curl "https://gamma-api.polymarket.com/search?query=NFL+OPOY+2025"
```

**Method 2: Browse Website**
1. Go to polymarket.com
2. Search for "NFL Offensive Player of the Year"
3. Click on the event
4. Get event ID from URL: `polymarket.com/event/nfl-opoy-355` → Event ID is the number after searching events endpoint

**Method 3: Direct API Query**
```bash
curl "https://gamma-api.polymarket.com/events/{event_id}"
```

## Future Enhancements

- **NBA Awards** - MVP, DPOY, MIP, 6MOY, etc.
- **MLB Awards** - AL/NL MVP, Cy Young, ROY, Manager of the Year
- **NHL Awards** - Hart Trophy, Vezina, Norris, Calder
- **Team Associations** - Link players to their current teams
- **Historical Data** - Past season award winners
- **Odds Movement** - Track how odds change over time
- **Multi-Platform Comparison** - Side-by-side odds comparison

---

## Changelog

### v2.0.0 (October 20, 2025)
- **BREAKING**: Awards endpoint now requires award_id in path (`/awards-v1/{award_id}`)
- **BREAKING**: Removed Super Bowl and conference futures from awards (moved to `/futures-v1`)
- **NEW**: Path-based endpoint structure matching games API pattern
- **NEW**: Integration with `/list-awards-v1` discovery endpoint
- **CHANGED**: Now 7 NFL awards (removed superbowl, afc_champion, nfc_champion)
- **CHANGED**: Unified response format with single award object containing multiple platform markets
- **IMPROVED**: Clearer separation between player/coach awards and team futures
- **IMPROVED**: Better discovery workflow: list → detail pattern

### v1.2.0 (October 16, 2025)
- **DEPRECATED**: Query parameter-based filtering (use path-based in v2.0.0)
- **NOTE**: SX.bet removed from awards (championship markets moved to futures)

### v1.1.0 (October 12, 2025)
- **NEW**: All 8 NFL awards fully operational with Polymarket + Kalshi dual-platform support
- **IMPROVED**: Award type filtering and odds format conversion

---

*Last updated: October 20, 2025*

