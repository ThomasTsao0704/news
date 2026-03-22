// lib/types.ts

import type { Signal } from './signalEngine'
import type { Category } from './feeds'
import type { MarketSummary } from './signalEngine'

export interface AnalyzedItem {
  title:       string
  link:        string
  pubDate:     string | null
  source:      string
  category:    Category
  signal:      Signal
  score:       number
  matchedBull: string[]
  matchedBear: string[]
}

export interface SignalsResponse {
  items:     AnalyzedItem[]
  summary:   MarketSummary
  byCat: {
    macro:  MarketSummary
    tech:   MarketSummary
    energy: MarketSummary
  }
  fetchedAt: string
}
