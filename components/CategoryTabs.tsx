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
  if (score === undefined) return 'var(--muted)'
  return score > 0 ? 'var(--bull)' : score < 0 ? 'var(--bear)' : 'var(--muted)'
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
          const score   = summary?.totalScore
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
          display: flex;
          gap: 0;
          margin-bottom: 1.25rem;
          border-bottom: 1px solid var(--line);
        }
        .tab {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 8px 20px 10px;
          border: none;
          background: none;
          cursor: pointer;
          font-family: var(--serif);
          position: relative;
          transition: background 0.15s;
          color: var(--ink);
        }
        .tab:hover { background: rgba(155,50,38,0.04); }
        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
        }
        .tab-label {
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: var(--ink-sub);
        }
        .tab.active .tab-label {
          color: var(--accent);
          font-weight: 500;
        }
        .tab-score {
          font-size: 11px;
          font-family: var(--mono);
          letter-spacing: 0.04em;
        }
      `}</style>
    </>
  )
}
