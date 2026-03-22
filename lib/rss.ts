// lib/rss.ts
// ─────────────────────────────────────────────────────────────
//  Server-side RSS fetcher (runs in Next.js API routes only)
//  Uses rss-parser; handles timeouts and malformed feeds.
// ─────────────────────────────────────────────────────────────

import Parser from 'rss-parser'
import type { FeedSource } from './feeds'

export interface FeedItem {
  title:     string
  link:      string
  pubDate:   string | null
  source:    string
  category:  string
}

const parser = new Parser({
  timeout:    8000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; DecisionDashboard/1.0)',
    'Accept':     'application/rss+xml, application/xml, text/xml, */*',
  },
})

async function fetchOneFeed(source: FeedSource): Promise<FeedItem[]> {
  try {
    const feed = await parser.parseURL(source.url)
    return (feed.items ?? []).slice(0, 15).map(item => ({
      title:    (item.title ?? '').replace(/<[^>]+>/g, '').trim(),
      link:     item.link ?? '',
      pubDate:  item.pubDate ?? item.isoDate ?? null,
      source:   source.label,
      category: source.category,
    }))
  } catch (err) {
    console.warn(`[rss] Failed to fetch ${source.url}:`, (err as Error).message)
    return []
  }
}

export async function fetchFeeds(sources: FeedSource[]): Promise<FeedItem[]> {
  const results = await Promise.allSettled(sources.map(fetchOneFeed))

  const items: FeedItem[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') items.push(...r.value)
  }

  // Sort newest-first; items without dates go to the bottom
  items.sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0
    if (!a.pubDate) return 1
    if (!b.pubDate) return -1
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  })

  return items
}
