// app/api/signals/route.ts
// ─────────────────────────────────────────────────────────────
//  GET /api/signals?category=all|macro|tech|energy
//  Fetches RSS feeds server-side (no CORS), runs signal engine,
//  returns AnalyzedItem[] + MarketSummary.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { FEED_SOURCES, type Category } from '@/lib/feeds'
import { fetchFeeds } from '@/lib/rss'
import { analyzeSignal, calcMarketSummary } from '@/lib/signalEngine'
import type { AnalyzedItem, SignalsResponse } from '@/lib/types'

// Simple in-memory cache: refresh every 5 min
let cache: { data: SignalsResponse; at: number } | null = null
const CACHE_TTL = 5 * 60 * 1000

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cat = (searchParams.get('category') ?? 'all') as Category | 'all'

  // Build / serve from cache
  if (!cache || Date.now() - cache.at > CACHE_TTL) {
    const raw = await fetchFeeds(FEED_SOURCES)

    const TWO_DAYS = 2 * 24 * 60 * 60 * 1000
    const items: AnalyzedItem[] = raw
      .filter(item => {
        if (!item.pubDate) return false
        return Date.now() - new Date(item.pubDate).getTime() <= TWO_DAYS
      })
      .map(item => {
        const { signal, score, matchedBull, matchedBear } = analyzeSignal(
          item.title,
          item.category as Category
        )
        return { ...item, category: item.category as Category, signal, score, matchedBull, matchedBear }
      })

    const allSignals    = items.map(i => i.signal)
    const macroSignals  = items.filter(i => i.category === 'macro').map(i => i.signal)
    const techSignals   = items.filter(i => i.category === 'tech').map(i => i.signal)
    const energySignals = items.filter(i => i.category === 'energy').map(i => i.signal)

    cache = {
      at: Date.now(),
      data: {
        items,
        summary: calcMarketSummary(allSignals),
        byCat: {
          macro:  calcMarketSummary(macroSignals),
          tech:   calcMarketSummary(techSignals),
          energy: calcMarketSummary(energySignals),
        },
        fetchedAt: new Date().toISOString(),
      },
    }
  }

  const { data } = cache
  const filtered = cat === 'all'
    ? data.items
    : data.items.filter(i => i.category === cat)

  return NextResponse.json({ ...data, items: filtered }, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
  })
}
