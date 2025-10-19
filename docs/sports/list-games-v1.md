# List Games API v1

The List Games API v1 provides a directory of all available NFL games with their PolyRouter IDs. This endpoint uses ProphetX tournament data to discover all games and generate standardized identifiers for use with the Games API.

## Base Endpoint

```
GET /list-games-v1
```

## Overview

The List Games API v1 offers:
- **Game Discovery** - Find all available NFL games
- **PolyRouter IDs** - Standardized game identifiers for use with `/games-v1`
- **Real-Time Updates** - Live game status tracking
- **Date Filtering** - Find games by date range
- **Status Filtering** - Filter by live, upcoming, or finished games
- **ProphetX Integration** - Uses ProphetX tournament data as source

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `league` | string | **Yes** | - | League ID (currently only `nfl`) |
| `status` | string | No | - | Filter by status: `not_started`, `live`, `finished` |
| `start_date` | string | No | - | Filter games after this date (ISO 8601) |
| `end_date` | string | No | - | Filter games before this date (ISO 8601) |
| `limit` | number | No | `50` | Number of results per page (1-100) |
| `offset` | number | No | `0` | Pagination offset |

## Example Requests

### Get All Available Games
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/list-games-v1?league=nfl" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Get Only Upcoming Games
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/list-games-v1?league=nfl&status=not_started" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Get Live Games
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/list-games-v1?league=nfl&status=live" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Get Games in Date Range
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/list-games-v1?league=nfl&start_date=2025-10-19&end_date=2025-10-26" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

## Response Format

```json
{
  "games": [
    {
      "polyrouter_id": "DETvKC20251013",
      "prophetx_event_id": 19154,
      "title": "Detroit Lions at Kansas City Chiefs",
      "away_team": {
        "abbreviation": "DET",
        "name": "Detroit Lions"
      },
      "home_team": {
        "abbreviation": "KC",
        "name": "Kansas City Chiefs"
      },
      "scheduled_at": "2025-10-13T00:20:00Z",
      "status": "not_started",
      "tournament": {
        "id": 31,
        "name": "NFL"
      },
      "sport": "American Football"
    },
    {
      "polyrouter_id": "BUFvATL20251013",
      "prophetx_event_id": 19155,
      "title": "Buffalo Bills at Atlanta Falcons",
      "away_team": {
        "abbreviation": "BUF",
        "name": "Buffalo Bills"
      },
      "home_team": {
        "abbreviation": "ATL",
        "name": "Atlanta Falcons"
      },
      "scheduled_at": "2025-10-13T23:15:00Z",
      "status": "not_started",
      "tournament": {
        "id": 31,
        "name": "NFL"
      },
      "sport": "American Football"
    }
  ],
  "pagination": {
    "total": 21,
    "limit": 50,
    "offset": 0,
    "has_more": false,
    "next_offset": 0
  },
  "meta": {
    "league": "nfl",
    "source": "prophetx",
    "data_freshness": "2025-10-12T21:12:49.501Z"
  }
}
```

## Response Fields

### Game Object

| Field | Type | Description |
|-------|------|-------------|
| `polyrouter_id` | string | PolyRouter game ID (e.g., `DETvKC20251013`) |
| `prophetx_event_id` | number | ProphetX event ID |
| `title` | string | Game title with team names |
| `away_team` | object | Away team information |
| `home_team` | object | Home team information |
| `scheduled_at` | string | Game start time (ISO 8601 UTC) |
| `status` | string | Game status (`not_started`, `live`, `finished`) |
| `tournament` | object | Tournament information |
| `sport` | string | Sport name |

### Team Object

| Field | Type | Description |
|-------|------|-------------|
| `abbreviation` | string | Team abbreviation (e.g., `DET`, `KC`) |
| `name` | string | Full team name |

## Game Statuses

- **`not_started`** - Game hasn't started yet
- **`live`** - Game is currently in progress
- **`finished`** - Game has ended

## Use Cases

### 1. Build Game Schedule

```javascript
const response = await fetch('/list-games-v1?league=nfl&status=not_started');
const data = await response.json();

const schedule = data.games.map(game => ({
  id: game.polyrouter_id,
  matchup: `${game.away_team.abbreviation} @ ${game.home_team.abbreviation}`,
  time: new Date(game.scheduled_at).toLocaleString()
}));

console.log('Upcoming Games:');
schedule.forEach(g => console.log(`${g.matchup} - ${g.time}`));
```

### 2. Find Today's Games

```javascript
const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const response = await fetch(
  `/list-games-v1?league=nfl&start_date=${today}&end_date=${tomorrow}`
);
const data = await response.json();

console.log(`${data.games.length} games today`);
```

### 3. Monitor Live Games

```javascript
// Poll for live games every 30 seconds
setInterval(async () => {
  const response = await fetch('/list-games-v1?league=nfl&status=live');
  const data = await response.json();
  
  console.log(`${data.games.length} games live now`);
  data.games.forEach(game => {
    console.log(`  ⚡ ${game.title}`);
  });
}, 30000);
```

### 4. Get PolyRouter IDs for Market Data

```javascript
// Step 1: Find the game you want
const listResponse = await fetch('/list-games-v1?league=nfl&status=not_started&limit=5');
const gamesList = await listResponse.json();

const game = gamesList.games[0]; // Pick first upcoming game
console.log(`Selected: ${game.title} (${game.polyrouter_id})`);

// Step 2: Get detailed markets using the PolyRouter ID
const marketsResponse = await fetch(`/games-v1/${game.polyrouter_id}`);
const markets = await marketsResponse.json();

console.log(`Markets from ${markets.games.length} platforms`);
```

## Integration with Games API

The primary use case for this endpoint is to discover PolyRouter IDs for the Games API:

```javascript
// 1. List games
const games = await fetch('/list-games-v1?league=nfl');
const gamesList = await games.json();

// 2. Find game of interest
const detVsKc = gamesList.games.find(g => 
  g.away_team.abbreviation === 'DET' && g.home_team.abbreviation === 'KC'
);

// 3. Get detailed markets
const markets = await fetch(`/games-v1/${detVsKc.polyrouter_id}`);
const gameData = await markets.json();

// Now you have markets from all 5 platforms (Polymarket, Kalshi, ProphetX, Novig, SX.bet)!
console.log(`${gameData.games.length} platforms with ${
  gameData.games.reduce((sum, g) => sum + g.markets[0].outcomes.length, 0)
} total betting outcomes`);
```

## Error Responses

### Missing Required Parameter (400)
```json
{
  "error": {
    "code": "INVALID_LEAGUE",
    "message": "League 'nba' not supported. Currently only 'nfl' is available.",
    "timestamp": "2025-10-12T21:00:00.000Z"
  }
}
```

### ProphetX API Error (500)
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "ProphetX API error: 500 Internal Server Error",
    "timestamp": "2025-10-12T21:00:00.000Z"
  }
}
```

## Performance

- **Response Time**: 100-300ms
- **Data Source**: ProphetX tournament endpoint
- **Update Frequency**: Real-time
- **Caching**: No caching - always fresh data
- **Typical Response Size**: ~5-10KB for 20 games

## Future Enhancements

- **NBA Games** - Basketball game listings
- **MLB Games** - Baseball game listings
- **NHL Games** - Hockey game listings
- **Additional Filters** - Conference, division, TV network
- **Game Metadata** - Weather, injuries, line movements
- **Historical Games** - Past games with final scores

---

*Last updated: October 2025*


