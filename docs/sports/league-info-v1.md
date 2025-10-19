# League Info API v1

The League Info API v1 provides access to league metadata and team information with platform-specific ID mappings. This endpoint serves as the foundation for all sports-related endpoints by providing canonical team identifiers (PolyRouter IDs) that are used across all platforms.

## Base Endpoint

```
GET /league-info-v1
```

## Overview

The League Info API v1 offers:
- **League Metadata** - League names, abbreviations, sports, and season information
- **Team Registry** - Complete team listings with platform ID mappings
- **Platform Mappings** - Team IDs for Polymarket, Kalshi, ProphetX, Novig, and SX.bet
- **Team Metadata** - Colors, logos, stadiums, and historical information
- **No Database Dependency** - Returns static registry data with no API calls
- **Fast Response Times** - Sub-10ms response times

## Current Support

### Supported Leagues
- **NFL** - National Football League (all 32 teams)
- **NBA** - Coming soon
- **MLB** - Coming soon
- **NHL** - Coming soon

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `league` | string | No | - | Filter by specific league (e.g., `nfl`) |
| `include_teams` | boolean | No | `true` | Include team details in response |

## Example Requests

### Get All Leagues with Teams
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Get Specific League (NFL)
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1?league=nfl" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

### Get League Metadata Only (No Teams)
```bash
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1?league=nfl&include_teams=false" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token"
```

## Response Format

### Full Response with Teams

```json
{
  "leagues": [
    {
      "id": "nfl",
      "name": "National Football League",
      "abbreviation": "NFL",
      "sport": "football",
      "season": {
        "year": 2025,
        "start_date": "2025-09-04",
        "end_date": "2026-02-09"
      },
      "teams": [
        {
          "polyrouter_id": "PIT",
          "name": "Pittsburgh Steelers",
          "abbreviation": "PIT",
          "city": "Pittsburgh",
          "state": "PA",
          "conference": "AFC",
          "division": "North",
          "platform_ids": {
            "polymarket": "steelers",
            "kalshi": "PIT",
            "prophetx": "pittsburgh-steelers",
            "novig": "pit_steelers",
            "sxbet": "Pittsburgh Steelers"
          },
          "metadata": {
            "colors": ["#FFB612", "#101820"],
            "founded": 1933,
            "stadium": "Acrisure Stadium"
          }
        }
        // ... 31 more teams
      ]
    }
  ],
  "meta": {
    "request_time": 2,
    "data_freshness": "2025-10-12T19:57:44.459Z"
  }
}
```

### Response without Teams

```json
{
  "leagues": [
    {
      "id": "nfl",
      "name": "National Football League",
      "abbreviation": "NFL",
      "sport": "football",
      "season": {
        "year": 2025,
        "start_date": "2025-09-04",
        "end_date": "2026-02-09"
      },
      "teams": []
    }
  ],
  "meta": {
    "request_time": 1,
    "data_freshness": "2025-10-12T19:58:06.348Z"
  }
}
```

## Response Fields

### League Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique league identifier (e.g., `nfl`) |
| `name` | string | Full league name |
| `abbreviation` | string | League abbreviation |
| `sport` | string | Sport type (`football`, `basketball`, etc.) |
| `season` | object | Current season information |
| `teams` | array | Array of team objects (if `include_teams=true`) |

### Season Object

| Field | Type | Description |
|-------|------|-------------|
| `year` | number | Season year |
| `start_date` | string | Season start date (ISO 8601) |
| `end_date` | string | Season end date (ISO 8601) |

### Team Object

| Field | Type | Description |
|-------|------|-------------|
| `polyrouter_id` | string | Canonical PolyRouter team ID (2-3 letters, e.g., `PIT`) |
| `name` | string | Full team name |
| `abbreviation` | string | Official team abbreviation |
| `city` | string | Team city/region |
| `state` | string | Team state/province (optional) |
| `conference` | string | Conference (NFL: `AFC`/`NFC`) |
| `division` | string | Division (`East`, `West`, `North`, `South`) |
| `platform_ids` | object | Platform-specific team identifiers |
| `metadata` | object | Additional team information |

### Platform IDs Object

| Field | Type | Description |
|-------|------|-------------|
| `polymarket` | string | Polymarket team identifier |
| `kalshi` | string | Kalshi team identifier |
| `prophetx` | string | ProphetX team identifier |
| `novig` | string | Novig team identifier |
| `sxbet` | string | SX.bet team identifier (full team name) |

### Team Metadata Object

| Field | Type | Description |
|-------|------|-------------|
| `colors` | array | Team colors (hex codes) |
| `founded` | number | Year team was founded |
| `stadium` | string | Home stadium name |

## Use Cases

### 1. Get Team Platform Mappings

Perfect for mapping between PolyRouter IDs and platform-specific identifiers:

```javascript
const response = await fetch('/league-info-v1?league=nfl');
const data = await response.json();

// Find Pittsburgh Steelers
const steelers = data.leagues[0].teams.find(t => t.polyrouter_id === 'PIT');

console.log('Polymarket ID:', steelers.platform_ids.polymarket); // "steelers"
console.log('Kalshi ID:', steelers.platform_ids.kalshi); // "PIT"
console.log('ProphetX ID:', steelers.platform_ids.prophetx); // "pittsburgh-steelers"
console.log('SX.bet ID:', steelers.platform_ids.sxbet); // "Pittsburgh Steelers"
```

### 2. Build Team Selector UI

Create a dropdown or list of teams for user selection:

```javascript
const response = await fetch('/league-info-v1?league=nfl');
const data = await response.json();

data.leagues[0].teams.forEach(team => {
  console.log(`${team.name} (${team.abbreviation}) - ${team.city}, ${team.state}`);
});
```

### 3. Get Season Information

Retrieve current season dates for scheduling:

```javascript
const response = await fetch('/league-info-v1?league=nfl&include_teams=false');
const data = await response.json();

const season = data.leagues[0].season;
console.log(`${season.year} season: ${season.start_date} to ${season.end_date}`);
```

### 4. Filter by Conference/Division

Find all teams in a specific division:

```javascript
const response = await fetch('/league-info-v1?league=nfl');
const data = await response.json();

const afcNorth = data.leagues[0].teams.filter(t => 
  t.conference === 'AFC' && t.division === 'North'
);

console.log('AFC North teams:', afcNorth.map(t => t.name));
// ["Baltimore Ravens", "Cincinnati Bengals", "Cleveland Browns", "Pittsburgh Steelers"]
```

## Error Responses

### League Not Found (404)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "League 'xyz' not found",
    "details": {
      "league": "xyz",
      "available_leagues": ["nfl"]
    },
    "timestamp": "2025-10-12T19:57:44.459Z"
  }
}
```

### Validation Error (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "league": ["Invalid league. Valid options: nfl, nba, mlb, nhl"]
      }
    },
    "timestamp": "2025-10-12T19:57:44.459Z"
  }
}
```

## Code Examples

### JavaScript/Node.js

```javascript
const API_KEY = 'your-api-key';
const SUPABASE_TOKEN = 'your-supabase-token';

async function getLeagueInfo(league = null, includeTeams = true) {
  const params = new URLSearchParams();
  if (league) params.append('league', league);
  if (!includeTeams) params.append('include_teams', 'false');
  
  const response = await fetch(
    `https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1?${params}`,
    {
      headers: {
        'X-API-Key': API_KEY,
        'Authorization': `Bearer ${SUPABASE_TOKEN}`
      }
    }
  );
  
  return response.json();
}

// Get NFL with all teams
const nfl = await getLeagueInfo('nfl');
console.log(`NFL has ${nfl.leagues[0].teams.length} teams`);

// Get all leagues without team details
const leagues = await getLeagueInfo(null, false);
console.log('Available leagues:', leagues.leagues.map(l => l.abbreviation));
```

### Python

```python
import requests

API_KEY = 'your-api-key'
SUPABASE_TOKEN = 'your-supabase-token'

def get_league_info(league=None, include_teams=True):
    params = {}
    if league:
        params['league'] = league
    if not include_teams:
        params['include_teams'] = 'false'
    
    response = requests.get(
        'https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1',
        params=params,
        headers={
            'X-API-Key': API_KEY,
            'Authorization': f'Bearer {SUPABASE_TOKEN}'
        }
    )
    
    response.raise_for_status()
    return response.json()

# Get NFL teams
nfl_data = get_league_info('nfl')
for team in nfl_data['leagues'][0]['teams']:
    print(f"{team['name']} - PolyRouter ID: {team['polyrouter_id']}")
```

### cURL

```bash
# Get all leagues with teams
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token" \
  | jq '.leagues[0].teams | length'

# Get specific team info
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1?league=nfl" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token" \
  | jq '.leagues[0].teams[] | select(.polyrouter_id == "PIT")'

# Get AFC North teams
curl -X GET "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/league-info-v1?league=nfl" \
  -H "X-API-Key: your-api-key" \
  -H "Authorization: Bearer your-supabase-token" \
  | jq '.leagues[0].teams[] | select(.conference == "AFC" and .division == "North")'
```

## NFL Teams Reference

### AFC Teams

**AFC East**: Buffalo Bills (BUF), Miami Dolphins (MIA), New England Patriots (NE), New York Jets (NYJ)

**AFC North**: Baltimore Ravens (BAL), Cincinnati Bengals (CIN), Cleveland Browns (CLE), Pittsburgh Steelers (PIT)

**AFC South**: Houston Texans (HOU), Indianapolis Colts (IND), Jacksonville Jaguars (JAX), Tennessee Titans (TEN)

**AFC West**: Denver Broncos (DEN), Kansas City Chiefs (KC), Las Vegas Raiders (LV), Los Angeles Chargers (LAC)

### NFC Teams

**NFC East**: Dallas Cowboys (DAL), New York Giants (NYG), Philadelphia Eagles (PHI), Washington Commanders (WAS)

**NFC North**: Chicago Bears (CHI), Detroit Lions (DET), Green Bay Packers (GB), Minnesota Vikings (MIN)

**NFC South**: Atlanta Falcons (ATL), Carolina Panthers (CAR), New Orleans Saints (NO), Tampa Bay Buccaneers (TB)

**NFC West**: Arizona Cardinals (ARI), Los Angeles Rams (LAR), San Francisco 49ers (SF), Seattle Seahawks (SEA)

## PolyRouter Team ID Format

PolyRouter IDs are the canonical identifiers used across all sports endpoints:
- **Format**: 2-3 uppercase letters
- **Examples**: `PIT` (Pittsburgh Steelers), `KC` (Kansas City Chiefs), `SF` (San Francisco 49ers)
- **Usage**: Use these IDs in `/games` and `/awards` endpoints for team filtering

## Platform ID Mappings

Each team has platform-specific identifiers that are automatically mapped:

### Polymarket
- **Format**: Lowercase team name (e.g., `steelers`, `chiefs`)
- **Usage**: Used internally when fetching Polymarket data

### Kalshi
- **Format**: Official team abbreviation (e.g., `PIT`, `KC`)
- **Usage**: Matches PolyRouter IDs in most cases

### ProphetX
- **Format**: Kebab-case full team name (e.g., `pittsburgh-steelers`)
- **Usage**: Used in ProphetX API calls

### Novig
- **Format**: Lowercase abbreviation with team suffix (e.g., `pit_steelers`)
- **Usage**: Used in Novig API calls

### SX.bet
- **Format**: Full team name (e.g., `Pittsburgh Steelers`)
- **Usage**: Used in SX.bet market matching (team names in API responses)
- **Note**: Unlike other platforms, SX.bet uses full team names for all API interactions
- **Example**: PolyRouter `PIT` → SX.bet `"Pittsburgh Steelers"`

## Performance Characteristics

- **Response Times**: < 10ms (no external API calls)
- **Caching**: Static data, no caching needed
- **Rate Limits**: Standard API rate limits apply

## Best Practices

### 1. Cache Team Data Locally

Since team data changes infrequently, cache it locally in your application:

```javascript
// Fetch once and store
const leagueData = await getLeagueInfo('nfl');
localStorage.setItem('nfl_teams', JSON.stringify(leagueData.leagues[0].teams));

// Use cached data
const teams = JSON.parse(localStorage.getItem('nfl_teams'));
```

### 2. Build Lookup Maps

Create efficient lookup structures:

```javascript
const response = await getLeagueInfo('nfl');
const teams = response.leagues[0].teams;

// Create lookup by PolyRouter ID
const teamById = new Map(teams.map(t => [t.polyrouter_id, t]));

// Quick lookup
const steelers = teamById.get('PIT');
console.log(steelers.platform_ids.polymarket); // "steelers"
```

### 3. Use for Game ID Generation

PolyRouter IDs are used to generate game IDs:

```javascript
const awayTeam = 'PIT';
const homeTeam = 'BAL';
const date = '20251012';
const gameId = `${awayTeam}v${homeTeam}${date}`; // PITvBAL20251012
```

### 4. Team Name Display

Use team metadata for rich UI displays:

```javascript
function displayTeam(teamId) {
  const team = teamById.get(teamId);
  return `
    <div style="border-left: 4px solid ${team.metadata.colors[0]}">
      <h3>${team.name}</h3>
      <p>${team.city}, ${team.state} • ${team.stadium}</p>
      <p>Founded: ${team.metadata.founded}</p>
    </div>
  `;
}
```

## Integration with Other Endpoints

### Games Endpoint

Use PolyRouter IDs to filter games:

```bash
# Get all Steelers games
curl "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/games-v1?league=nfl&teams=PIT"
```

### Awards Endpoint

Team IDs are included in award candidate data:

```bash
# Award candidates will include team_polyrouter_id field
curl "https://ptahricowhzsxfhqnvqe.supabase.co/functions/v1/awards-v1?league=nfl&award_type=mvp"
```

## Future Enhancements

- **NBA Support** - All 30 NBA teams with conference/division structure
- **MLB Support** - All 30 MLB teams with league/division structure  
- **NHL Support** - All 32 NHL teams with conference/division structure
- **Team Rosters** - Player information with position and number
- **Team Statistics** - Historical performance data
- **Logo URLs** - Direct links to team logos

---

## Changelog

### v1.1.0 (October 16, 2025)
- **NEW**: SX.bet platform ID mappings for all 32 NFL teams
- **NEW**: Platform IDs now include 5 platforms (Polymarket, Kalshi, ProphetX, Novig, SX.bet)
- **IMPROVED**: Documentation includes SX.bet-specific mapping details and examples

---

*Last updated: October 16, 2025*

