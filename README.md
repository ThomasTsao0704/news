# Decision Dashboard

Real-time investment signal dashboard.  
Fetches RSS feeds server-side (no CORS issues), runs a keyword signal engine,
and calls Claude for AI market analysis.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# → Edit .env.local and add your ANTHROPIC_API_KEY

# 3. Run dev server
npm run dev
# → Open http://localhost:3000
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel

# Set env var in Vercel dashboard:
# ANTHROPIC_API_KEY = sk-ant-...
```

---

## Architecture

```
app/
  page.tsx                  ← Client dashboard UI
  layout.tsx
  api/
    signals/route.ts        ← Fetches RSS + runs signal engine (server)
    proxy/route.ts          ← Transparent RSS proxy (CORS bypass)
    ai/route.ts             ← Anthropic API relay (keeps key server-side)

lib/
  feeds.ts                  ← RSS source registry (add/remove feeds here)
  rss.ts                    ← RSS fetcher with timeout + error handling
  signalEngine.ts           ← Keyword classifier + market score aggregator
  types.ts                  ← Shared TypeScript interfaces

components/
  CategoryTabs.tsx          ← 全部 / 總經 / 科技 / 能源 tab switcher
  HeadlineTable.tsx         ← Headline list with signal badges + keywords
  MetricCard.tsx            ← Summary number cards
  ScoreBar.tsx              ← Bull/Neutral/Bear proportion bar
  SignalBadge.tsx           ← BULL / BEAR / N colored badge
  SignalChart.tsx           ← Recharts bar chart
  AIAnalyst.tsx             ← Claude AI analysis panel
```

---

## Adding RSS Feeds

Edit `lib/feeds.ts`:

```ts
export const FEED_SOURCES: FeedSource[] = [
  {
    url:      'https://your-feed.com/rss',
    label:    'My Source',
    category: 'macro',        // 'macro' | 'tech' | 'energy'
  },
  // ...
]
```

Also add the domain to the allowlist in `app/api/proxy/route.ts`:

```ts
const ALLOWED_DOMAINS = [
  'your-feed.com',
  // ...
]
```

---

## Adding Keywords to the Signal Engine

Edit `lib/signalEngine.ts`.

Generic keywords apply to all categories.  
Category-specific keywords (in `CATEGORY_BULLISH` / `CATEGORY_BEARISH`) have
higher weight and are better for precision.

```ts
// Example: add "fed pivot" as a strong bullish macro signal
CATEGORY_BULLISH.macro.push({ keyword: 'fed pivot', weight: 2.5 })
```

---

## Caching

The `/api/signals` route caches all feed data in memory for 5 minutes.
Hitting "↻ Refresh" in the UI re-fetches immediately if the cache has expired.

To change the TTL, edit the constant in `app/api/signals/route.ts`:

```ts
const CACHE_TTL = 5 * 60 * 1000   // 5 minutes in ms
```

---

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **rss-parser** — server-side RSS fetching
- **Recharts** — signal distribution chart
- **Anthropic claude-sonnet-4** — AI market analysis
