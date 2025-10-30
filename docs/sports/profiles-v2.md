# User Profiles API v2

## Overview

The User Profiles API provides access to user profile information and trading history across multiple prediction market platforms. This API allows you to fetch user profiles, metrics, and trade history from Kalshi and Polymarket platforms using a unified interface.

## Base URL

```
https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/profile
```

## Authentication

All endpoints require API key authentication via the `X-API-Key` header:

```bash
curl -H "X-API-Key: your-api-key" \
  "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/profile/info?platform=kalshi&user=chronicaria"
```

## Endpoints

### GET /profile/info

Retrieve user profile information and optional metrics.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | Platform identifier (`kalshi` or `polymarket`) |
| `user` | string | Yes | User identifier (nickname for Kalshi, address for Polymarket) |
| `include_metrics` | boolean | No | Include trading metrics in response (default: false) |

**Example Requests:**

```bash
# Kalshi profile
curl -H "X-API-Key: your-api-key" \
  "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/profile/info?platform=kalshi&user=witnessforhire"

# Polymarket profile with metrics
curl -H "X-API-Key: your-api-key" \
  "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1/profile/info?platform=polymarket&user=0xA6d0793b7aC2E3e7ECa1730c9B8528fb9a67dB8d&include_metrics=true"
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "profile": {
      "platform": "kalshi",
      "user_id": "chronicaria",
      "display_name": "chronicaria",
      "profile_image": "https://example.com/avatar.jpg",
      "description": "Prediction market enthusiast",
      "joined_at": "2023-01-15T10:30:00Z",
      "follower_count": 150,
      "following_count": 75,
      "profile_view_count": 1250,
      "metadata": {
        "nickname": "chronicaria",
        "profile_image_path": "/avatars/chronicaria.jpg"
      }
    },
    "metrics": {
      "platform": "kalshi",
      "user_id": "chronicaria",
      "volume": 15000.50,
      "pnl": 2500.75,
      "roi": 0.167,
      "num_markets_traded": 45,
      "portfolio_value": 17500.25,
      "open_interest": 3200.00,
      "metadata": {
        "dollars_traded": 15000.50,
        "dollars_investment": 15000.00
      }
    },
    "meta": {
      "request_time": 245,
      "platform": "kalshi",
      "data_freshness": "2024-01-15T14:30:00Z"
    }
  },
  "meta": {
    "request_time": 245,
    "platform": "kalshi",
    "data_freshness": "2024-01-15T14:30:00Z"
  }
}
```

### GET /profile/trades

Retrieve user trade history with pagination support.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `platform` | string | Yes | Platform identifier (`kalshi` or `polymarket`) |
| `user` | string | Yes | User identifier (nickname for Kalshi, address for Polymarket) |
| `limit` | number | No | Number of trades to return (1-100, default: 50) |
| `cursor` | string | No | Pagination cursor for next page |

**Example Requests:**

```bash
# Kalshi trades
curl -H "X-API-Key: your-api-key" \
  "https://your-supabase-project.supabase.co/functions/v1/profile/trades?platform=kalshi&user=chronicaria&limit=25"

# Polymarket trades with pagination
curl -H "X-API-Key: your-api-key" \
  "https://your-supabase-project.supabase.co/functions/v1/profile/trades?platform=polymarket&user=0xA6d0793b7aC2E3e7ECa1730c9B8528fb9a67dB8d&limit=50&cursor=eyJ0aW1lc3RhbXAiOjE3MDEyMzQ1NjcwMDB9"
```

**Response Format:**

```json
{
  "success": true,
  "data": {
    "trades": [
      {
        "platform": "kalshi",
        "trade_id": "trade_12345",
        "user_id": "chronicaria",
        "market_id": "market_abc123",
        "ticker": "TRUMP-2024",
        "title": "Will Trump win the 2024 election?",
        "side": "buy",
        "outcome": "yes",
        "price": 0.65,
        "size": 100,
        "timestamp": "2024-01-15T14:30:00Z",
        "transaction_hash": "0x1234567890abcdef",
        "metadata": {
          "maker_nickname": "other_user",
          "taker_action": "buy",
          "price_dollars": "65.00"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 50,
      "has_more": false,
      "next_cursor": null
    },
    "meta": {
      "request_time": 180,
      "platform": "kalshi",
      "data_freshness": "2024-01-15T14:30:00Z"
    }
  },
  "meta": {
    "request_time": 180,
    "platform": "kalshi",
    "data_freshness": "2024-01-15T14:30:00Z"
  }
}
```

## Platform-Specific Details

### Kalshi

**User Identifiers:** Use Kalshi nicknames (e.g., "chronicaria", "azimthedream83")

**Data Sources:**
- Profile: `/v1/social/profile?nickname={nickname}`
- Metrics: `/v1/social/profile/metrics?nickname={nickname}&since_day_before=0`
- Trades: `/v1/social/trades?nickname={nickname}&page_size={limit}`

**Available Fields:**
- Profile: nickname, follower_count, following_count, profile_image_path, description, joined_at, profile_view_count
- Metrics: volume, pnl, roi, num_markets_traded, portfolio_value, open_interest
- Trades: trade_id, market_id, ticker, price, size, side, outcome, timestamp

### Polymarket

**User Identifiers:** Use wallet addresses (e.g., "0xA6d0793b7aC2E3e7ECa1730c9B8528fb9a67dB8d")

**Data Sources:**
- Profile: Extracted from `/activity` endpoint
- Metrics: Calculated from `/activity` and `/value` endpoints
- Trades: `/trades` endpoint with `takerOnly=true`

**Available Fields:**
- Profile: address, pseudonym, name, bio, profile_image (from activity data)
- Metrics: volume, pnl, num_markets_traded (calculated from activity/value data)
- Trades: transaction_hash, condition_id, title, side, outcome, price, size, timestamp

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid query parameters",
    "details": {
      "validation_errors": [
        {
          "field": "platform",
          "message": "Platform must be 'kalshi' or 'polymarket'"
        }
      ]
    }
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API key required. Please provide X-API-Key header."
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found on platform",
    "details": {
      "platform": "kalshi",
      "user": "nonexistent_user"
    }
  }
}
```

**503 Service Unavailable:**
```json
{
  "success": false,
  "error": {
    "code": "PLATFORM_ERROR",
    "message": "Failed to fetch profile data from kalshi",
    "details": {
      "platform": "kalshi",
      "user": "chronicaria",
      "error": "API rate limit exceeded"
    }
  }
}
```

## Rate Limits

- **Standard API Key:** 100 requests per minute
- **Premium API Key:** 1000 requests per minute
- **Platform-specific limits:** Kalshi (~1000 req/min), Polymarket (~100 req/min)

## Best Practices

1. **Use appropriate user identifiers:**
   - Kalshi: Use exact nicknames (case-sensitive)
   - Polymarket: Use full wallet addresses (checksummed)

2. **Handle pagination:**
   - Use `limit` parameter to control response size
   - Use `cursor` for pagination (Kalshi only)
   - Check `has_more` and `next_cursor` in response

3. **Include metrics when needed:**
   - Set `include_metrics=true` only when trading data is required
   - Metrics add ~200ms to response time

4. **Error handling:**
   - Always check `success` field in response
   - Handle platform-specific errors gracefully
   - Implement retry logic for 503 errors

## Future Platform Support

The API is designed to easily support additional platforms:

- **Limitless:** Will use wallet addresses as identifiers
- **Manifold:** Will use usernames as identifiers

New platforms will be added by:
1. Creating platform-specific connector files
2. Adding platform to validation schemas
3. Updating documentation

## Migration Notes

This is the initial release of the Profiles API v2. No migration is needed as this is a new feature.

## Changelog

### v2.0.0 (2024-01-15)
- Initial release with Kalshi and Polymarket support
- Unified profile and trades endpoints
- Pagination support for trades
- Optional metrics inclusion
