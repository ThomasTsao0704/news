// lib/signalEngine.ts
// ─────────────────────────────────────────────────────────────
//  Keyword-based signal classifier + market score aggregator
//  Each keyword has a weight; category-specific keywords have
//  higher weight than generic ones.
// ─────────────────────────────────────────────────────────────

import type { Category } from './feeds'

export type Signal = 'BULLISH' | 'BEARISH' | 'NEUTRAL'

interface KeywordRule {
  keyword: string
  weight: number
}

// ── Generic (apply to all categories) ────────────────────────
const GENERIC_BULLISH: KeywordRule[] = [
  { keyword: 'beat',          weight: 1 },
  { keyword: 'upgrade',       weight: 1 },
  { keyword: 'growth',        weight: 1 },
  { keyword: 'strong demand', weight: 1.5 },
  { keyword: 'record',        weight: 1 },
  { keyword: 'surge',         weight: 1 },
  { keyword: 'rally',         weight: 1 },
  { keyword: 'optimism',      weight: 1 },
  { keyword: 'expansion',     weight: 1 },
  { keyword: 'profit',        weight: 1 },
  { keyword: 'outperform',    weight: 1.5 },
  { keyword: 'rebound',       weight: 1 },
]

const GENERIC_BEARISH: KeywordRule[] = [
  { keyword: 'miss',          weight: 1 },
  { keyword: 'downgrade',     weight: 1 },
  { keyword: 'weak',          weight: 1 },
  { keyword: 'decline',       weight: 1 },
  { keyword: 'recession',     weight: 2 },
  { keyword: 'contraction',   weight: 1.5 },
  { keyword: 'layoff',        weight: 1 },
  { keyword: 'cut',           weight: 0.8 },
  { keyword: 'default',       weight: 2 },
  { keyword: 'crash',         weight: 2 },
  { keyword: 'warning',       weight: 1 },
  { keyword: 'concern',       weight: 0.8 },
  { keyword: 'delinquency',   weight: 1.5 },
  { keyword: 'selloff',       weight: 1.5 },
]

// ── Category-specific overrides ───────────────────────────────
const CATEGORY_BULLISH: Record<Category, KeywordRule[]> = {
  macro: [
    { keyword: 'rate cut',       weight: 2 },
    { keyword: 'rate pause',     weight: 1.5 },
    { keyword: 'soft landing',   weight: 2 },
    { keyword: 'jobs added',     weight: 1.5 },
    { keyword: 'gdp beat',       weight: 2 },
    { keyword: 'inflation eases',weight: 2 },
  ],
  tech: [
    { keyword: 'ai breakthrough', weight: 2 },
    { keyword: 'revenue beat',    weight: 2 },
    { keyword: 'data center',     weight: 1.5 },
    { keyword: 'cloud growth',    weight: 1.5 },
    { keyword: 'ipo',             weight: 1 },
    { keyword: 'acquisition',     weight: 1 },
  ],
  energy: [
    { keyword: 'opec cut',     weight: 2 },
    { keyword: 'supply tight', weight: 1.5 },
    { keyword: 'oil rally',    weight: 1.5 },
    { keyword: 'lng demand',   weight: 1.5 },
    { keyword: 'price rise',   weight: 1 },
  ],
}

const CATEGORY_BEARISH: Record<Category, KeywordRule[]> = {
  macro: [
    { keyword: 'rate hike',      weight: 2 },
    { keyword: 'stagflation',    weight: 2.5 },
    { keyword: 'bank failure',   weight: 3 },
    { keyword: 'yield inversion',weight: 2 },
    { keyword: 'gdp miss',       weight: 2 },
    { keyword: 'inflation surge',weight: 2 },
  ],
  tech: [
    { keyword: 'data breach',   weight: 2 },
    { keyword: 'antitrust',     weight: 1.5 },
    { keyword: 'guidance cut',  weight: 2 },
    { keyword: 'chip ban',      weight: 2 },
    { keyword: 'valuation cut', weight: 1.5 },
    { keyword: 'revenue miss',  weight: 2 },
  ],
  energy: [
    { keyword: 'demand slump',  weight: 2 },
    { keyword: 'supply glut',   weight: 2 },
    { keyword: 'opec increase', weight: 1.5 },
    { keyword: 'price drop',    weight: 1.5 },
    { keyword: 'recession cuts',weight: 2 },
    { keyword: 'inventory build',weight: 1.5 },
  ],
}

// ─────────────────────────────────────────────────────────────

function scoreText(text: string, rules: KeywordRule[]): number {
  const lower = text.toLowerCase()
  return rules.reduce((sum, r) => {
    return lower.includes(r.keyword) ? sum + r.weight : sum
  }, 0)
}

export function analyzeSignal(title: string, category: Category): {
  signal: Signal
  score: number
  matchedBull: string[]
  matchedBear: string[]
} {
  const allBull = [...GENERIC_BULLISH, ...CATEGORY_BULLISH[category]]
  const allBear = [...GENERIC_BEARISH, ...CATEGORY_BEARISH[category]]

  const lower = title.toLowerCase()
  const matchedBull = allBull.filter(r => lower.includes(r.keyword)).map(r => r.keyword)
  const matchedBear = allBear.filter(r => lower.includes(r.keyword)).map(r => r.keyword)

  const bullScore = scoreText(title, allBull)
  const bearScore = scoreText(title, allBear)
  const score = Math.round((bullScore - bearScore) * 10) / 10

  const signal: Signal =
    score > 0 ? 'BULLISH' : score < 0 ? 'BEARISH' : 'NEUTRAL'

  return { signal, score, matchedBull, matchedBear }
}

export interface MarketSummary {
  bullCount: number
  bearCount: number
  neutralCount: number
  totalScore: number
  bias: Signal
  bullPct: number
  bearPct: number
  neutralPct: number
}

export function calcMarketSummary(signals: Signal[]): MarketSummary {
  const total = signals.length || 1
  const bullCount    = signals.filter(s => s === 'BULLISH').length
  const bearCount    = signals.filter(s => s === 'BEARISH').length
  const neutralCount = signals.filter(s => s === 'NEUTRAL').length
  const totalScore   = bullCount - bearCount

  return {
    bullCount,
    bearCount,
    neutralCount,
    totalScore,
    bias:        totalScore > 0 ? 'BULLISH' : totalScore < 0 ? 'BEARISH' : 'NEUTRAL',
    bullPct:     Math.round(bullCount    / total * 100),
    bearPct:     Math.round(bearCount    / total * 100),
    neutralPct:  Math.round(neutralCount / total * 100),
  }
}
