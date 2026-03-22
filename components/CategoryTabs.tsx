// components/CategoryTabs.tsx
'use client'

import { CATEGORY_LABELS, type Category } from '@/lib/feeds'
import type { MarketSummary } from '@/lib/signalEngine'

type TabKey = Category | 'all'

interface Props {
  active:   TabKey
  onChange: (tab: TabKey) => void
  scores: {
    all:    MarketSummary | null
    macro:  MarketSummary | null
    tech:   MarketSummary | null
    energy: MarketSummary | null
  }
}

const TABS: TabKey[] = ['all', 'macro', 'tech', 'energy']

function scoreColor(score: number | undefined) {
  if (score === undefined) return '#888'
  return score > 0 ? '#3b6d11' : score < 0 ? '#a32d2d' : '#888'
}

function scoreLabel(score: number | undefined) {
  if (score === undefined) return '—'
  return score > 0 ? `+${score}` : `${score}`
}

export default function CategoryTabs({ active, onChange, scores }: Props) {
  return (
    <>
      <div className="tabs">
        {TABS.map(tab => {
          const summary = scores[tab]
          const score = summary?.totalScore
          return (
            <button
              key={tab}
              className={`tab ${active === tab ? 'active' : ''}`}
              onClick={() => onChange(tab)}
            >
              <span className="tab-label">{CATEGORY_LABELS[tab]}</span>
              <span className="tab-score" style={{ color: scoreColor(score) }}>
                {scoreLabel(score)}
              </span>
            </button>
          )
        })}
      </div>

      <style>{`
        .tabs {
          display: flex; gap: 4px;
          margin-bottom: 1.5rem;
          border-bottom: 0.5px solid rgba(0,0,0,0.1);
          padding-bottom: 0;
        }
        @media (prefers-color-scheme: dark) {
          .tabs { border-color: rgba(255,255,255,0.1); }
        }
        .tab {
          display: flex; flex-direction: column; align-items: center;
          gap: 2px; padding: 8px 16px 10px;
          border: none; background: none; cursor: pointer;
          font-family: var(--font-mono, monospace);
          position: relative; border-radius: 8px 8px 0 0;
          transition: background 0.15s;
        }
        .tab:hover { background: rgba(0,0,0,0.03); }
        @media (prefers-color-scheme: dark) {
          .tab:hover { background: rgba(255,255,255,0.04); }
        }
        .tab.active::after {
          content: '';
          position: absolute; bottom: -0.5px; left: 0; right: 0;
          height: 2px; background: #2c2c2a; border-radius: 2px 2px 0 0;
        }
        @media (prefers-color-scheme: dark) {
          .tab.active::after { background: #d3d1c7; }
        }
        .tab-label {
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.05em;
          color: rgba(0,0,0,0.45);
        }
        .tab.active .tab-label { color: #2c2c2a; }
        @media (prefers-color-scheme: dark) {
          .tab-label      { color: rgba(255,255,255,0.4); }
          .tab.active .tab-label { color: #d3d1c7; }
        }
        .tab-score {
          font-size: 11px; font-weight: 500; letter-spacing: 0.04em;
        }
      `}</style>
    </>
  )
}
