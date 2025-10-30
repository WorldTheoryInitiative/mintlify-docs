# Documentation Build Scripts

This directory contains scripts for managing environment-specific documentation builds.

## Overview

The build script automatically detects the current git branch and updates all documentation files with the appropriate environment credentials:

- **dev branch** → Uses staging credentials (staging API URL and test API key)
- **main branch** → Uses production credentials (production API URL and production API key)

## Files

- `env-config.json` - Environment configuration (staging vs production URLs and API keys)
- `build-docs.js` - Build script that detects branch and updates all documentation files

## Usage

### Automatic (Recommended)

The build script runs automatically when you use npm scripts:

```bash
npm run dev    # Runs build script then starts Mintlify dev server
npm run build  # Runs build script then builds for production
```

### Manual

You can also run the script directly:

```bash
node scripts/build-docs.js
```

## What Gets Updated

The build script updates:

1. **OpenAPI JSON files** (`openapi.json` and `openapi/*.json`):
   - Server URLs
   - Default API keys in authentication config

2. **Markdown files** (`.mdx` and `.md`):
   - All curl command URLs
   - All API key placeholders (`YOUR_API_KEY` → actual API key)
   - Base URL references

3. **Visual indicators**:
   - Adds a development environment warning banner to `index.mdx` when on dev branch

## Environment Configuration

Edit `env-config.json` to change environment credentials:

```json
{
  "staging": {
    "baseUrl": "https://lsplqyqiubvctfpfnukr.supabase.co/functions/v1",
    "apiKey": "test_1234567890abcdef"
  },
  "production": {
    "baseUrl": "https://api.polyrouter.io/functions/v1",
    "apiKey": "5fa709a5-0634-44c3-a991-57166d3c376d"
  }
}
```

## Branch Detection

The script detects the current git branch:
- `dev` or `development` → Uses staging environment
- Any other branch → Uses production environment (defaults to production if branch detection fails)

## Notes

- The script modifies files **in place** - make sure to commit or stash changes before switching branches
- After switching branches, run the build script again to update files for the new environment
- The script is idempotent - running it multiple times won't cause issues

