# List Futures API v1

The List Futures API v1 provides a directory of all available sports futures (team-based betting markets like championships, divisions, conferences) with their IDs and metadata. This endpoint returns static registry data without fetching live odds - use it to discover future IDs for the Futures API v1.

## Base Endpoint

```
GET /list-futures-v1
```

## Overview

The List Futures API v1 offers:
- **Future Discovery** - Find all available futures for a league
- **Future IDs** - Get standardized future identifiers for use with `/futures-v1`
- **Platform Availability** - See which platforms have each future configured
- **Future Metadata** - Deadlines, descriptions, eligible teams
- **Fast Response** - Sub-10ms response times (no external API calls)
- **Multi-League Support** - NFL, NBA, NHL, MLB

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `league` | string | **Yes** | - | League ID: `nfl`, `nba`, `nhl`, `mlb` |
| `future_type` | string | No | - | Filter by type: `championship`, `division`, `conference` |
| `season` | number | No | `2025` | Season year |

## Example Requests

### Get All NFL Futures
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/list-futures-v1?league=nfl" \
  -H "X-API-Key: your-api-key"
```

### Get Only Championship Futures
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/list-futures-v1?league=nfl&future_type=championship" \
  -H "X-API-Key: your-api-key"
```

### Get Division Winners
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/list-futures-v1?league=nfl&future_type=division" \
  -H "X-API-Key: your-api-key"
```

## Response Format

```json
{
  "data": {
    "futures": [
      {
        "id": "nfl_superbowl_2025",
        "future_name": "Super Bowl LX Winner",
        "league": "nfl",
        "season": 2025,
        "future_type": "championship",
        "category": "team",
        "platforms": ["polymarket", "kalshi", "sxbet"],
        "metadata": {
          "deadline": "2026-02-09T23:59:59Z",
          "description": "Super Bowl LX Winner (2025-26 NFL season)",
          "eligible_teams": ["BUF", "MIA", "NE", "NYJ", "BAL", "CIN", "CLE", "PIT", ...]
        }
      },
      {
        "id": "nfl_afc_champion_2025",
        "future_name": "AFC Champion",
        "league": "nfl",
        "season": 2025,
        "future_type": "conference",
        "category": "team",
        "platforms": ["sxbet"],
        "metadata": {
          "deadline": "2026-02-01T23:59:59Z",
          "description": "AFC Conference Champion (2025-26 NFL season)",
          "eligible_teams": ["BUF", "MIA", "NE", "NYJ", "BAL", "CIN", "CLE", "PIT", ...]
        }
      }
      // ... 9 more futures
    ],
    "pagination": {
      "total": 11,
      "limit": 11,
      "offset": 0,
      "has_more": false,
      "next_offset": 0
    },
    "meta": {
      "league": "nfl",
      "data_freshness": "2025-10-20T12:26:26.059Z"
    }
  },
  "meta": {
    "request_time": 0
  }
}
```

## Response Fields

### Future Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Future identifier (e.g., `nfl_superbowl_2025`) - use with `/futures-v1/{id}` |
| `future_name` | string | Full future name |
| `league` | string | League identifier (e.g., `nfl`) |
| `season` | number | Season year |
| `future_type` | string | Future type: `championship`, `division`, `conference` |
| `category` | string | Category: `team` (all current futures are team-based) |
| `platforms` | array | Platforms with configured markets |
| `metadata` | object | Future details (deadline, description, eligible teams) |

## Supported Futures

### NFL (11 futures)

**Championship (1)**:
- `nfl_superbowl_2025` - Super Bowl LX Winner

**Conference (2)**:
- `nfl_afc_champion_2025` - AFC Champion
- `nfl_nfc_champion_2025` - NFC Champion

**Division (8)**:
- `nfl_afc_east_2025` - AFC East Division Winner
- `nfl_afc_north_2025` - AFC North Division Winner
- `nfl_afc_south_2025` - AFC South Division Winner
- `nfl_afc_west_2025` - AFC West Division Winner
- `nfl_nfc_east_2025` - NFC East Division Winner
- `nfl_nfc_north_2025` - NFC North Division Winner
- `nfl_nfc_south_2025` - NFC South Division Winner
- `nfl_nfc_west_2025` - NFC West Division Winner

### NBA (3 futures)
- `nba_championship_2025` - NBA Championship Winner
- `nba_eastern_conference_2025` - Eastern Conference Champion
- `nba_western_conference_2025` - Western Conference Champion

### NHL (3 futures)
- `nhl_stanley_cup_2025` - Stanley Cup Winner
- `nhl_eastern_conference_2025` - Eastern Conference Champion
- `nhl_western_conference_2025` - Western Conference Champion

### MLB (3 futures)
- `mlb_world_series_2025` - World Series Winner
- `mlb_al_pennant_2025` - AL Pennant Winner
- `mlb_nl_pennant_2025` - NL Pennant Winner

## Use Cases

### 1. Build Future Selector UI

```javascript
const response = await fetch('/list-futures-v1?league=nfl', {
  headers: { 'X-API-Key': API_KEY }
});
const data = await response.json();

// Group by type
const groupedFutures = data.data.futures.reduce((acc, future) => {
  if (!acc[future.future_type]) acc[future.future_type] = [];
  acc[future.future_type].push(future);
  return acc;
}, {});

console.log('Championship:', groupedFutures.championship); // Super Bowl
console.log('Divisions:', groupedFutures.division.length); // 8
```

### 2. Workflow: Discover → Fetch Odds

```javascript
// Step 1: Get available futures
const futuresListResponse = await fetch('/list-futures-v1?league=nfl');
const futuresList = await futuresListResponse.json();

// Step 2: Find future of interest
const superBowl = futuresList.data.futures.find(f => f.future_type === 'championship');
console.log(`Future ID: ${superBowl.id}`); // nfl_superbowl_2025

// Step 3: Get detailed odds
const oddsResponse = await fetch(`/futures-v1/${superBowl.id}`);
const odds = await oddsResponse.json();

console.log(`${odds.futures[0].markets.length} platforms with odds`);
```

### 3. Filter by Type

```javascript
// Get only division winners
const divisions = await fetch('/list-futures-v1?league=nfl&future_type=division')
  .then(r => r.json());

console.log('Division futures:', divisions.data.futures.map(f => f.future_name));
// AFC East, AFC North, AFC South, AFC West, NFC East, NFC North, NFC South, NFC West
```

## Integration with Futures API

This endpoint is designed to work with `/futures-v1/{future_id}`:

```javascript
// 1. List futures
const futures = await fetch('/list-futures-v1?league=nfl');
const futuresList = await futures.json();

// 2. Find championship
const championship = futuresList.data.futures.find(f => f.future_type === 'championship');

// 3. Get odds from all platforms
const odds = await fetch(`/futures-v1/${championship.id}`);
const oddsData = await odds.json();

// Result: Super Bowl odds from Polymarket (33 teams), Kalshi (32 teams), SX.bet (0 teams)
console.log(`Platforms: ${oddsData.futures[0].markets.map(m => m.platform).join(', ')}`);
```

## Performance

- **Response Time**: < 10ms (no external API calls)
- **Data Source**: Static registry files
- **Caching**: Data is static, cache indefinitely

## Notes

- **Team-Based Only**: All current futures are team-based outcomes
- **Eligible Teams**: Lists PolyRouter team IDs that can win
- **Platform Configuration**: Empty `platforms` array means no market IDs configured yet
- **Static Data**: This endpoint returns registry data only, not live odds

---

*Last updated: October 20, 2025*

