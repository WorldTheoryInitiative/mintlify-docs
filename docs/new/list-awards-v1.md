# List Awards API v1

The List Awards API v1 provides a directory of all available sports awards with their IDs and metadata. This endpoint returns static registry data without fetching live odds - use it to discover award IDs for the Awards API v1.

## Base Endpoint

```
GET /list-awards-v1
```

## Overview

The List Awards API v1 offers:
- **Award Discovery** - Find all available awards for a league
- **Award IDs** - Get standardized award identifiers for use with `/awards-v1`
- **Platform Availability** - See which platforms have each award configured
- **Award Metadata** - Deadlines, descriptions, eligibility
- **Fast Response** - Sub-10ms response times (no external API calls)
- **Multi-League Support** - NFL, NBA, NHL, MLB

## Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `league` | string | **Yes** | - | League ID: `nfl`, `nba`, `nhl`, `mlb` |
| `award_type` | string | No | - | Filter by award type: `mvp`, `opoy`, `dpoy`, etc. |
| `season` | number | No | `2025` | Season year |

## Example Requests

### Get All NFL Awards
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/list-awards-v1?league=nfl" \
  -H "X-API-Key: your-api-key"
```

### Get Only MVP Awards
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/list-awards-v1?league=nfl&award_type=mvp" \
  -H "X-API-Key: your-api-key"
```

### Get NBA Awards
```bash
curl -X GET "https://api.polyrouter.io/functions/v1/list-awards-v1?league=nba" \
  -H "X-API-Key: your-api-key"
```

## Response Format

```json
{
  "data": {
    "awards": [
      {
        "id": "nfl_mvp_2025",
        "award_name": "NFL MVP",
        "league": "nfl",
        "season": 2025,
        "award_type": "mvp",
        "platforms": ["polymarket", "kalshi"],
        "metadata": {
          "deadline": "2026-02-18T00:00:00Z",
          "description": "NFL Most Valuable Player Award for the 2025-26 season",
          "eligibility": "All NFL players"
        }
      },
      {
        "id": "nfl_opoy_2025",
        "award_name": "NFL Offensive Player of the Year",
        "league": "nfl",
        "season": 2025,
        "award_type": "opoy",
        "platforms": ["polymarket", "kalshi"],
        "metadata": {
          "deadline": "2026-02-09T23:59:59Z",
          "description": "NFL Offensive Player of the Year Award for the 2025-26 season",
          "eligibility": "All offensive players"
        }
      }
      // ... 5 more awards
    ],
    "pagination": {
      "total": 7,
      "limit": 7,
      "offset": 0,
      "has_more": false,
      "next_offset": 0
    },
    "meta": {
      "league": "nfl",
      "data_freshness": "2025-10-20T12:26:09.141Z"
    }
  },
  "meta": {
    "request_time": 0
  }
}
```

## Response Fields

### Award Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Award identifier (e.g., `nfl_mvp_2025`) - use with `/awards-v1/{id}` |
| `award_name` | string | Full award name |
| `league` | string | League identifier (e.g., `nfl`) |
| `season` | number | Season year |
| `award_type` | string | Award type code (`mvp`, `opoy`, etc.) |
| `platforms` | array | Platforms with configured markets |
| `metadata` | object | Award details (deadline, description, eligibility) |

## Supported Awards

### NFL (7 awards)
- **mvp** - Most Valuable Player
- **opoy** - Offensive Player of the Year
- **dpoy** - Defensive Player of the Year
- **oroy** - Offensive Rookie of the Year
- **droy** - Defensive Rookie of the Year
- **cpoy** - Comeback Player of the Year
- **coy** - Coach of the Year

### NBA (6 awards)
- **mvp** - Most Valuable Player
- **dpoy** - Defensive Player of the Year
- **6moy** - Sixth Man of the Year
- **mip** - Most Improved Player
- **roy** - Rookie of the Year
- **coy** - Coach of the Year

### NHL (6 awards)
- **hart** - Hart Memorial Trophy (MVP)
- **vezina** - Vezina Trophy (Best Goaltender)
- **norris** - Norris Trophy (Best Defenseman)
- **calder** - Calder Memorial Trophy (Rookie of the Year)
- **art_ross** - Art Ross Trophy (Leading Scorer)
- **rocket_richard** - Maurice Richard Trophy (Leading Goal Scorer)

### MLB (7 awards)
- **al_mvp** - AL MVP
- **nl_mvp** - NL MVP
- **al_cy_young** - AL Cy Young Award
- **nl_cy_young** - NL Cy Young Award
- **al_roy** - AL Rookie of the Year
- **nl_roy** - NL Rookie of the Year
- **manager_of_year** - Manager of the Year

## Use Cases

### 1. Build Award Selector UI

```javascript
const response = await fetch('/list-awards-v1?league=nfl', {
  headers: { 'X-API-Key': API_KEY }
});
const data = await response.json();

// Create dropdown options
const awardOptions = data.data.awards.map(award => ({
  value: award.id,
  label: award.award_name,
  platforms: award.platforms.length
}));
```

### 2. Workflow: Discover → Fetch Odds

```javascript
// Step 1: Get available awards
const awardsListResponse = await fetch('/list-awards-v1?league=nfl');
const awardsList = await awardsListResponse.json();

// Step 2: Find award of interest
const mvp = awardsList.data.awards.find(a => a.award_type === 'mvp');
console.log(`Award ID: ${mvp.id}`); // nfl_mvp_2025

// Step 3: Get detailed odds
const oddsResponse = await fetch(`/awards-v1/${mvp.id}`);
const odds = await oddsResponse.json();

console.log(`${odds.awards[0].markets.length} platforms with odds`);
```

### 3. Check Platform Availability

```javascript
const awards = await fetch('/list-awards-v1?league=nfl').then(r => r.json());

// Find which awards have Polymarket markets
const polymarketAwards = awards.data.awards
  .filter(a => a.platforms.includes('polymarket'))
  .map(a => a.award_name);

console.log('Available on Polymarket:', polymarketAwards);
```

## Integration with Awards API

This endpoint is designed to work with `/awards-v1/{award_id}`:

```javascript
// 1. List awards
const awards = await fetch('/list-awards-v1?league=nfl');
const mvpAward = awards.data.awards.find(a => a.award_type === 'mvp');

// 2. Get odds
const odds = await fetch(`/awards-v1/${mvpAward.id}`);
const oddsData = await odds.json();

// Now you have detailed odds from all platforms
console.log(`Platforms: ${oddsData.awards[0].markets.map(m => m.platform).join(', ')}`);
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
    "timestamp": "2025-10-20T12:00:00.000Z"
  }
}
```

### Invalid League (400)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": {
        "league": ["Invalid league. Valid options: nfl, nba, nhl, mlb"]
      }
    },
    "timestamp": "2025-10-20T12:00:00.000Z"
  }
}
```

## Performance

- **Response Time**: < 10ms (no external API calls)
- **Data Source**: Static registry files
- **Caching**: Data is static, cache indefinitely

## Code Examples

### JavaScript/Node.js

```javascript
async function getAwardsList(league, awardType = null) {
  const params = new URLSearchParams({ league });
  if (awardType) params.append('award_type', awardType);
  
  const response = await fetch(
    `https://api.polyrouter.io/functions/v1/list-awards-v1?${params}`,
    {
      headers: {
        'X-API-Key': process.env.API_KEY
      }
    }
  );
  
  return response.json();
}

// Get all NFL awards
const nflAwards = await getAwardsList('nfl');
console.log(`${nflAwards.data.awards.length} NFL awards available`);

// Get only ROY awards
const royAwards = await getAwardsList('nfl', 'oroy');
console.log(`Found: ${royAwards.data.awards[0].award_name}`);
```

### Python

```python
import requests
import os

def get_awards_list(league, award_type=None):
    params = {'league': league}
    if award_type:
        params['award_type'] = award_type
    
    response = requests.get(
        'https://api.polyrouter.io/functions/v1/list-awards-v1',
        params=params,
        headers={'X-API-Key': os.getenv('API_KEY')}
    )
    
    response.raise_for_status()
    return response.json()

# Get all NBA awards
nba_awards = get_awards_list('nba')
for award in nba_awards['data']['awards']:
    print(f"{award['id']}: {award['award_name']}")
```

## Notes

- **Team-Based Outcomes**: Super Bowl, division, and conference winners are now in `/list-futures-v1`
- **Platform Configuration**: Empty `platforms` array means no market IDs configured yet
- **Static Data**: This endpoint returns registry data only, not live odds

---

*Last updated: October 20, 2025*

