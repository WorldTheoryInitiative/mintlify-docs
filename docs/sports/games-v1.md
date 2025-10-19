# Games API v1

The Games API v1 provides detailed betting markets for specific NFL games from multiple prediction market platforms. This endpoint aggregates real-time odds, spreads, totals, and player props across **Polymarket, Kalshi, ProphetX, Novig, and SX.bet**.

**Note**: To discover available games and their IDs, use the [`/list-games-v1`](./list-games-v1.md) endpoint.

## Base Endpoint

```
GET /games-v1/{game_id}    # Get specific game markets (REQUIRED)
```

## Overview

The Games API v1 offers:
- **Multi-Platform Aggregation** - Game markets from 5 platforms: Polymarket, Kalshi, ProphetX, Novig, and SX.bet
- **PolyRouter Game IDs** - Standardized game identifiers (`PITvBAL20251012`)
- **Market Types** - Moneyline, spread, totals, and player props
- **Odds Format Conversion** - American, decimal, or implied probability
- **Date-Based Filtering** - Find games by date range
- **Team Filtering** - Filter by specific teams
- **Real-Time Data** - Direct platform API calls with no caching

## PolyRouter Game ID Format

Games are identified using a standardized format:

**Format**: `{AwayTeam}v{HomeTeam}{YYYYMMDD}`

**Examples**:
- `PITvBAL20251012` - Steelers @ Ravens on October 12, 2025
- `KCvLV20251113` - Chiefs @ Raiders on November 13, 2025
- `SFvDAL20251027` - 49ers @ Cowboys on October 27, 2025

**Components**:
- **Away Team**: 2-3 letter PolyRouter team ID
- **Home Team**: 2-3 letter PolyRouter team ID
- **Date**: YYYYMMDD format

## Workflow

To use the Games API, follow this two-step process:

1. **Discover Games**: Use [`GET /list-games-v1?league=nfl`](./list-games-v1.md) to get all available games and their PolyRouter IDs
2. **Get Markets**: Use `GET /games-v1/{polyrouter_id}` to fetch detailed betting markets

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | - | Filter markets by platform: `polymarket`, `kalshi`, `prophetx`, `novig`, `sxbet` (comma-separated) |
| `market_type` | string | No | - | Filter by market type: `moneyline`, `spread`, `total`, `prop` (comma-separated) |

## Example Requests

### Basic Workflow
```bash
# Step 1: Get available games and their IDs
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/list-games-v1?league=nfl" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"

# Response includes: { "polyrouter_id": "DETvKC20251012", ... }

# Step 2: Get detailed markets for a specific game
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/DETvKC20251012" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Get Game Markets (All Platforms)
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/DETvKC20251012" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Filter by Specific Platform
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/DETvKC20251012?platform=polymarket" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Filter by Market Type
```bash
# Get only moneyline markets
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/BUFvATL20251013?market_type=moneyline" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"

# Get spread and total markets
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/BUFvATL20251013?market_type=spread,total" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"

# Get player props from Novig
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/BUFvATL20251013?market_type=prop&platform=novig" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

## Response Format

Returns a **single unified game object** with markets from all platforms organized underneath:

```json
{
  "games": [
    {
      "id": "BUFvATL20251013",
      "title": "Buffalo Bills @ Atlanta Falcons",
      "teams": ["BUF", "ATL"],
      "sport": "football",
      "league": "nfl",
      "description": "Buffalo Bills @ Atlanta Falcons",
      "scheduled_at": "2025-10-13T23:15:00Z",
      "status": "live",
      "image_url": "https://polymarket-upload.s3.us-east-2.amazonaws.com/nfl.png",
      "category": "sports",
      "tags": ["Sports", "NFL", "Games"],
      "markets": [
        {
          "platform": "polymarket",
          "event_id": "54821",
          "event_name": "Buffalo Bills @ Atlanta Falcons",
          "event_slug": "nfl-buf-atl-2025-10-13",
          "outcomes": [
            {
              "outcome_id": "623082_0",
              "platform_id": "623082",
              "name": "Bills vs. Falcons",
              "price": 0.655,
              "volume": 358223.156356,
              "status": "open",
              "liquidity": 615917.4594,
              "order_book": {
                "yes": [{"price": 0.65, "qty": 0, "status": "open", "side": "yes"}],
                "no": [{"price": 0.66, "qty": 0, "status": "open", "side": "no"}]
              },
              "metadata": {
                "market_type": "moneyline",
                "market_description": "Bills vs. Falcons moneyline"
              }
            }
          ],
          "metadata": {
            "volume": 406778.686911,
            "volume_24h": 60222.669343,
            "market_count": 4
          }
        },
        {
          "platform": "kalshi",
          "event_id": "KXNFLGAME-25OCT13BUFATL",
          "outcomes": [
            {
              "name": "Atlanta",
              "price": 0.36,
              "volume": 349037,
              "metadata": {
                "market_type": "moneyline"
              }
            },
            {
              "name": "Buffalo",
              "price": 0.66,
              "volume": 2214371,
              "metadata": {
                "market_type": "moneyline"
              }
            }
          ]
        },
        {
          "platform": "prophetx",
          "event_id": "19155",
          "outcomes": [
            {
              "name": "Atlanta Falcons +184",
              "price": 0.352,
              "metadata": {
                "market_type": "moneyline",
                "prophetx_market_type": "moneyline"
              }
            },
            {
              "name": "Buffalo Bills -190",
              "price": 0.655,
              "metadata": {
                "market_type": "moneyline"
              }
            },
            {
              "name": "Buffalo Bills -3.5",
              "price": 0.502,
              "metadata": {
                "market_type": "spread"
              }
            }
          ]
        },
        {
          "platform": "novig",
          "event_id": "3221b1f7-f9a2-453c-a6eb-d5a9d1d2be57",
          "outcomes": [
            {
              "name": "BUF",
              "price": 0.653,
              "liquidity": 2733845.18,
              "metadata": {
                "market_type": "moneyline",
                "market_description": "ATL"
              }
            },
            {
              "name": "ATL +5.5",
              "price": 0.569,
              "metadata": {
                "market_type": "spread"
              }
            },
            {
              "name": "Over 50.5",
              "price": 0.488,
              "metadata": {
                "market_type": "total"
              }
            },
            {
              "name": "Josh Allen 229.5 PASSING_YARDS",
              "price": 0.551,
              "metadata": {
                "market_type": "prop",
                "market_description": "Josh Allen 229.5 PASSING_YARDS"
              }
            }
          ],
          "metadata": {
            "market_count": 311,
            "event_status": "OPEN_PREGAME"
          }
        }
      ],
      "metadata": {
        "polymarket_event_id": "54821",
        "polymarket_slug": "nfl-buf-atl-2025-10-13",
        "novig_event_id": "3221b1f7-f9a2-453c-a6eb-d5a9d1d2be57"
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
    "request_time": 0,
    "platforms_queried": ["polymarket", "kalshi", "prophetx", "novig", "sxbet"],
    "data_freshness": "2025-10-13T07:48:37.357Z"
  }
}
```

**Key Improvement**: The response now returns a **single game object** with all 5 platform markets nested inside, eliminating duplicate game information.

## Response Fields

### Game Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | PolyRouter game ID (e.g., `PITvBAL20251012`) |
| `title` | string | Game title with team names |
| `teams` | array | Array of PolyRouter team IDs |
| `sport` | string | Sport type (`football`) |
| `league` | string | League identifier (`nfl`) |
| `description` | string | Game description |
| `scheduled_at` | string | Game start time (ISO 8601) |
| `status` | string | Game status (`scheduled`, `live`, `final`) |
| `image_url` | string | Game image URL |
| `category` | string | Category (`sports`) |
| `tags` | array | Game tags |
| `markets` | array | Array of platform markets |
| `metadata` | object | Additional game metadata |

### Market Object

| Field | Type | Description |
|-------|------|-------------|
| `platform` | string | Platform name |
| `event_id` | string | Platform event identifier |
| `event_name` | string | Platform event name |
| `event_slug` | string | URL-friendly event identifier |
| `outcomes` | array | Array of betting outcomes |
| `metadata` | object | Platform-specific metadata |

### Outcome Object

| Field | Type | Description |
|-------|------|-------------|
| `outcome_id` | string | Outcome identifier |
| `platform_id` | string | Platform-specific ID |
| `name` | string | Outcome name (e.g., "Pittsburgh Steelers", "over 36.5") |
| `price` | number | Current price (0-1) |
| `volume` | number | Trading volume |
| `status` | string | Outcome status |
| `liquidity` | number | Available liquidity |
| `order_book` | object | Order book data (bids/asks) |
| `metadata` | object | Outcome metadata including `market_type` and `market_description` |

## Platform-Specific Details

### Polymarket ✅ ACTIVE
- **Event Slug Format**: `nfl-{away}-{home}-{YYYY-MM-DD}`
- **Market Types**: Moneyline, Spreads (multiple lines), Totals (multiple lines)
- **Typical Markets**: 4-12 outcomes per game
- **Rich Data**: Volume, liquidity, bid/ask spreads
- **Example**: BUF @ ATL has 8 markets (moneyline, 2 spreads, 4 totals)
- **Volume**: $400K+ per popular game
- **ID Mapping**: PolyRouter `BUFvATL20251013` → Polymarket `nfl-buf-atl-2025-10-13`

### Kalshi ✅ ACTIVE
- **Event Ticker Format**: `KXNFLGAME-{YY}{MON}{DD}{AWAY}{HOME}`
- **Market Types**: Moneyline only (currently)
- **Typical Markets**: 2-4 outcomes (yes/no for each team)
- **Rich Data**: Volume, liquidity, open interest, bid/ask
- **Example**: `KXNFLGAME-25OCT13BUFATL`
- **Volume**: $2M-$10M per game
- **ID Mapping**: PolyRouter `BUFvATL20251013` → Kalshi `KXNFLGAME-25OCT13BUFATL`

### ProphetX ✅ ACTIVE
- **Event ID Format**: Numeric (e.g., `19155`)
- **Market Types**: Moneyline, Spreads (8+ lines), Totals (9+ lines)
- **Typical Markets**: 30-50 outcomes per game
- **Market Depth**: Most comprehensive spread/total options
- **Example**: BUF @ ATL has 23 markets, 38 outcomes
- **Odds Display**: American odds in outcome names (e.g., "Bills -190")
- **ID Mapping**: Automatic via tournament discovery (tournament ID 31 for NFL)

### Novig ✅ ACTIVE
- **Event ID Format**: UUID (e.g., `3221b1f7-f9a2-453c-a6eb-d5a9d1d2be57`)
- **API Type**: GraphQL endpoint at `https://gql.novig.us/v1/graphql`
- **Market Types**: Moneyline, Spreads (10+ lines), Totals (15+ lines), **Player Props (200+ per game)**
- **Typical Markets**: 300-400 outcomes per game (most comprehensive)
- **Rich Data**: Full order book with bid quantities and prices
- **Player Props**: Passing yards, rushing yards, receptions, touchdowns, first TD scorer, and more
- **Example**: BUF @ ATL has 311 markets including extensive prop bets
- **Liquidity**: Deep order books with multiple price levels
- **ID Mapping**: Matches games by team names from GraphQL query

### SX.bet ✅ ACTIVE
- **Event ID Format**: SportX Event ID (e.g., `L15663262`)
- **API Type**: REST endpoint at `https://api.sx.bet`
- **Market Types**: Moneyline, Spreads (multiple lines), Totals (multiple lines), **Player Props**
- **Typical Markets**: 50-100 outcomes per game
- **Rich Data**: Full order book with maker/taker odds and liquidity
- **Blockchain**: Decentralized exchange on SX Network (formerly SportX)
- **Pricing Format**: Percentage odds format (divide by 10^20 for implied probability)
- **Token**: USDC (6 decimals) for bet sizing
- **Example**: CIN @ PIT moneyline with full order book depth (tested on 10/16/2025)
- **Liquidity**: On-chain liquidity with transparent order books
- **ID Mapping**: Matches games by full team names (e.g., "Cincinnati Bengals")
- **Leagues**: 
  - NFL (243) - Main season game lines
  - NFL Playoffs (1189) - Playoff game lines
  - Player Props: Touchdown Scorers (10593), Passing TDs (10591), Passing Yards (10589), Receiving Yards (10590), Rushing Yards (10026), Receptions (10592)
- **Testing**: Verified working on 10/16/2025 with CIN @ PIT game

## Market Types

All outcomes now include a `metadata.market_type` field for easy filtering:

### Moneyline
Winner of the game (straight up, no point spread)

```json
{
  "name": "Buffalo Bills",
  "price": 0.655,
  "volume": 358223,
  "metadata": {
    "market_type": "moneyline",
    "market_description": "Bills vs. Falcons"
  }
}
```

### Spread
Team covering a point spread

```json
{
  "name": "Buffalo Bills -3.5",
  "price": 0.502,
  "volume": 8920,
  "metadata": {
    "market_type": "spread",
    "market_description": "ATL +3.5"
  }
}
```

### Total (Over/Under)
Combined score over or under a number

```json
{
  "name": "Over 50.5",
  "price": 0.488,
  "volume": 293,
  "metadata": {
    "market_type": "total",
    "market_description": "BUF @ ATL t50.5"
  }
}
```

### Prop (Player Props)
Individual player performance bets (primarily from Novig)

```json
{
  "name": "Josh Allen 229.5 PASSING_YARDS",
  "price": 0.551,
  "volume": 0,
  "metadata": {
    "market_type": "prop",
    "market_description": "Josh Allen 229.5 PASSING_YARDS"
  }
}
```

## Game Status Values

| Status | Description |
|--------|-------------|
| `scheduled` | Game is scheduled but hasn't started |
| `live` | Game is currently in progress |
| `final` | Game has finished |
| `postponed` | Game has been postponed |
| `cancelled` | Game has been cancelled |

## Market Type Filtering

Filter outcomes by market type to get only the bets you're interested in:

### Available Market Types
- **`moneyline`** - Which team will win (all platforms)
- **`spread`** - Point spread bets (Polymarket, ProphetX, Novig)
- **`total`** - Over/Under total points (Polymarket, ProphetX, Novig)
- **`prop`** - Player props like passing yards, touchdowns, etc. (Novig)

### Filter Examples

```bash
# Get only moneyline markets from all platforms
GET /games-v1/BUFvATL20251013?market_type=moneyline

# Get spread and total markets
GET /games-v1/BUFvATL20251013?market_type=spread,total

# Get all player props (Novig excels here with 200+ props)
GET /games-v1/BUFvATL20251013?market_type=prop&platform=novig
```

### Platform Market Type Support

| Platform | Moneyline | Spread | Total | Props | Order Book |
|----------|-----------|--------|-------|-------|------------|
| Polymarket | ✅ | ✅ | ✅ | ❌ | ✅ |
| Kalshi | ✅ | ❌ | ❌ | ❌ | ✅ |
| ProphetX | ✅ | ✅ (20+) | ✅ (15+) | ❌ | ❌ |
| Novig | ✅ | ✅ (30+) | ✅ (40+) | ✅ (200+) | ✅ |
| SX.bet | ✅ | ✅ (10+) | ✅ (10+) | ✅ (50+) | ✅ (Full) |

## Use Cases

### 1. Get Today's Games

```javascript
const today = new Date().toISOString().split('T')[0];
const response = await fetch(
  `/games-v1?league=nfl&start_date=${today}&end_date=${today}`
);
```

### 2. Track a Team's Schedule

```javascript
const steelersGames = await fetch('/games-v1?league=nfl&teams=PIT&limit=20');
const games = steelersGames.games;

games.forEach(game => {
  const opponent = game.teams.find(t => t !== 'PIT');
  console.log(`${game.scheduled_at}: vs ${opponent}`);
});
```

### 3. Compare Odds Across Platforms

```javascript
const response = await fetch('/games-v1/BUFvATL20251013?market_type=moneyline');
const game = response.games[0];

// Find Bills moneyline odds across all platforms
game.markets.forEach(market => {
  const billsOutcome = market.outcomes.find(o => 
    o.name.includes('Bills') || o.name.includes('BUF')
  );
  console.log(`${market.platform}: ${(billsOutcome.price * 100).toFixed(1)}%`);
});

// Output:
// polymarket: 65.5%
// kalshi: 66.0%
// prophetx: 65.5%
// novig: 65.3%
```

### 4. Find Best Spread Line

```javascript
// Get all spread markets
const response = await fetch('/games-v1/BUFvATL20251013?market_type=spread');
const game = response.games[0];

// Find all Bills spread options across platforms
const allBillsSpreads = game.markets
  .flatMap(market => 
    market.outcomes
      .filter(o => o.metadata.market_type === 'spread')
      .filter(o => o.name.includes('Bills') || o.name.includes('BUF'))
      .map(o => ({
        platform: market.platform,
        name: o.name,
        price: o.price,
        liquidity: o.liquidity
      }))
  )
  .sort((a, b) => b.liquidity - a.liquidity);

console.log('Best liquidity spreads:', allBillsSpreads.slice(0, 5));
```

### 5. Explore Player Props

```javascript
// Get all player props from Novig (200+ props per game!)
const response = await fetch('/games-v1/BUFvATL20251013?market_type=prop&platform=novig');
const game = response.games[0];
const props = game.markets[0].outcomes;

// Find Josh Allen props
const allenProps = props.filter(o => o.name.includes('Josh Allen'));
console.log(`Josh Allen has ${allenProps.length} prop bets available`);

// Examples:
// - Josh Allen 229.5 PASSING_YARDS
// - Josh Allen 2.5 PASSING_TOUCHDOWNS  
// - Josh Allen 33.5 RUSHING_YARDS
// - Josh Allen FIRST_TOUCHDOWN_SCORER
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

### Invalid Game ID (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "game_id": ["Invalid game ID format. Expected format: {AwayTeam}v{HomeTeam}{YYYYMMDD} (e.g., PITvBAL20251012)"]
      }
    },
    "timestamp": "2025-10-12T20:00:00.000Z"
  }
}
```

### Invalid Team ID (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "teams": ["Invalid team IDs: XYZ. Team IDs must be 2-3 uppercase letters (e.g., PIT, BAL)"]
      }
    },
    "timestamp": "2025-10-12T20:00:00.000Z"
  }
}
```

## Code Examples

### JavaScript/Node.js

```javascript
async function getGames(league, options = {}) {
  const params = new URLSearchParams({ league, ...options });
  
  const response = await fetch(
    `https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1?${params}`,
    {
      headers: {
        'X-API-Key': process.env.API_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_TOKEN}`
      }
    }
  );
  
  return response.json();
}

// Get this week's games
const thisWeek = await getGames('nfl', {
  start_date: '2025-10-12',
  end_date: '2025-10-19',
  limit: 20
});

// Get specific game
async function getGame(gameId) {
  const response = await fetch(
    `https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/${gameId}`,
    {
      headers: {
        'X-API-Key': process.env.API_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_TOKEN}`
      }
    }
  );
  
  return response.json();
}

const steelersRavens = await getGame('PITvBAL20251012');
```

### Python

```python
import requests
import os

def get_games(league, **kwargs):
    params = {'league': league, **kwargs}
    
    response = requests.get(
        'https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1',
        params=params,
        headers={
            'X-API-Key': os.getenv('API_KEY'),
            'Authorization': f'Bearer {os.getenv("SUPABASE_TOKEN")}'
        }
    )
    
    response.raise_for_status()
    return response.json()

# Get Steelers games
steelers_games = get_games('nfl', teams='PIT', limit=10)
for game in steelers_games['games']:
    print(f"{game['scheduled_at']}: {game['title']}")

# Get specific game
def get_game(game_id):
    response = requests.get(
        f'https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/{game_id}',
        headers={
            'X-API-Key': os.getenv('API_KEY'),
            'Authorization': f'Bearer {os.getenv("SUPABASE_TOKEN")}'
        }
    )
    
    response.raise_for_status()
    return response.json()

game = get_game('PITvBAL20251012')
```

## Integration with Team Registry

Use `/league-info-v1` to get team information:

```javascript
// Get team mappings
const leagueInfo = await fetch('/league-info-v1?league=nfl');
const teams = leagueInfo.leagues[0].teams;
const teamMap = new Map(teams.map(t => [t.polyrouter_id, t]));

// Get games and enrich with team data
const games = await fetch('/games-v1?league=nfl');
games.games.forEach(game => {
  const [away, home] = game.teams;
  const awayTeam = teamMap.get(away);
  const homeTeam = teamMap.get(home);
  
  console.log(`${awayTeam.name} @ ${homeTeam.name}`);
  console.log(`  Stadium: ${homeTeam.metadata.stadium}`);
  console.log(`  Colors: ${homeTeam.metadata.colors.join(', ')}`);
});
```

## Health Check

```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1/health"
```

Response:
```json
{
  "status": "healthy",
  "service": "games-v1",
  "timestamp": "2025-10-13T07:19:52.913Z",
  "version": "1.0.0",
  "platforms": {
    "polymarket": "healthy",
    "kalshi": "healthy",
    "prophetx": "healthy",
    "novig": "healthy",
    "sxbet": "healthy"
  }
}
```

## Performance Considerations

- **Response Times**: 500-4000ms depending on platforms queried
- **Parallel Requests**: All 5 platforms queried simultaneously
- **Graceful Degradation**: Individual platform failures don't break entire response
- **Unified Response**: Single game object with all platforms reduces data duplication
- **Market Type Filtering**: Filter by market type to reduce response size (especially useful with Novig's 300+ and SX.bet's 100+ markets)
- **Rate Limits**: Respect platform rate limits

## Response Size Guidance

Without filtering:
- **All platforms, all markets**: ~80KB (Novig adds 300+ prop markets)
- **Moneyline only**: ~5KB (2-4 outcomes per platform)
- **Spread + Total only**: ~15KB (20-50 outcomes per platform)
- **Props only (Novig)**: ~60KB (200+ player props)

**Recommendation**: Use `market_type` filtering to reduce response size and improve performance.

## Key Features (v1.3.0)

### ✅ Implemented
- **5 Platform Integration** - Polymarket, Kalshi, ProphetX, Novig, and SX.bet
- **SX.bet Integration** - Decentralized exchange on SX Network with on-chain liquidity
- **Unified Response Format** - Single game object with all 5 platforms
- **Market Type Classification** - Automatic categorization (moneyline, spread, total, prop)
- **Market Type Filtering** - Filter to specific market types via query params
- **Order Book Data** - Full bid/ask data from Polymarket, Kalshi, Novig, and SX.bet
- **Player Props** - 200+ player prop markets from Novig, 50+ from SX.bet
- **PolyRouter Game IDs** - Standardized game identifiers across all platforms

### 🔜 Future Enhancements
- **Live Scores** - Real-time score updates
- **Play-by-Play** - Live game events
- **Injury Reports** - Player injury status
- **Weather Data** - Game-time weather conditions
- **Broadcast Info** - TV/streaming information
- **Historical Results** - Past game outcomes with final scores
- **Advanced Stats** - Team and player statistics
- **More Leagues** - NBA, MLB, NHL support

---

## Changelog

### v1.3.0 (October 16, 2025)
- **NEW**: SX.bet platform integration with full market support
- **NEW**: Order book data from SX.bet with maker/taker odds
- **NEW**: Player prop markets from SX.bet (6 prop leagues)
- **NEW**: Team name mapping for SX.bet (uses full team names)
- **IMPROVED**: Platform coverage now includes 5 platforms
- **IMPROVED**: Order book transparency with on-chain liquidity data

### v1.2.0 (October 13, 2025)
- **NEW**: Novig platform integration with 200+ player props per game
- **NEW**: Market type filtering (`market_type` query parameter)
- **IMPROVED**: Unified response format with single game object

---

*Last updated: October 16, 2025*


