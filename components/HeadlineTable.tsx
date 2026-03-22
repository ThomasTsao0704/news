// components/HeadlineTable.tsx
'use client'

import { useState, useMemo } from 'react'
import SignalBadge from './SignalBadge'
import type { AnalyzedItem } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/feeds'

interface Props {
  items:         AnalyzedItem[]
  translations?: string[]
}

type SortCol = 'signal' | 'title' | 'category' | 'source' | 'time'
type SortDir = 'asc' | 'desc'

const SIGNAL_ORDER = { BULLISH: 0, NEUTRAL: 1, BEARISH: 2 }

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return '剛剛'
  if (m < 60) return `${m}分前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}時前`
  return `${Math.floor(h / 24)}日前`
}

export default function HeadlineTable({ items, translations = [] }: Props) {
  const [sortCol, setSortCol] = useState<SortCol>('time')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  // Build indexed items so translations stay aligned
  const indexed = useMemo(
    () => items.map((item, i) => ({ item, i })),
    [items]
  )

  const sorted = useMemo(() => {
    const arr = [...indexed]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortCol) {
        case 'signal':
          cmp = SIGNAL_ORDER[a.item.signal] - SIGNAL_ORDER[b.item.signal]
          break
        case 'title': {
          const ta = (translations[a.i] ?? a.item.title).toLowerCase()
          const tb = (translations[b.i] ?? b.item.title).toLowerCase()
          cmp = ta.localeCompare(tb, 'zh-TW')
          break
        }
        case 'category':
          cmp = a.item.category.localeCompare(b.item.category)
          break
        case 'source':
          cmp = (a.item.source ?? '').localeCompare(b.item.source ?? '')
          break
        case 'time': {
          const da = a.item.pubDate ? new Date(a.item.pubDate).getTime() : 0
          const db = b.item.pubDate ? new Date(b.item.pubDate).getTime() : 0
          cmp = da - db
          break
        }
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return arr
  }, [indexed, sortCol, sortDir, translations])

  function arrow(col: SortCol) {
    if (sortCol !== col) return <span className="sort-arrow inactive">⇅</span>
    return <span className="sort-arrow active">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  if (items.length === 0) {
    return <div className="empty">暫無標題。請確認網路連線。</div>
  }

  return (
    <>
      <div className="hl-table">
        <div className="hl-head">
          <span className="hcol sortable" onClick={() => handleSort('signal')}>
            信號{arrow('signal')}
          </span>
          <span className="hcol sortable" onClick={() => handleSort('title')}>
            標題{arrow('title')}
          </span>
          <span className="hcol sortable hide-sm" onClick={() => handleSort('category')}>
            類別{arrow('category')}
          </span>
          <span className="hcol sortable hide-sm" onClick={() => handleSort('source')}>
            來源{arrow('source')}
          </span>
          <span className="hcol sortable hide-xs" onClick={() => handleSort('time')}>
            時間{arrow('time')}
          </span>
        </div>

        {sorted.map(({ item, i }) => {
          const title = translations[i] ?? item.title
          return (
            <div key={i} className="hl-row">
              <span><SignalBadge signal={item.signal} /></span>
              <span className="hl-title">
                {item.link
                  ? <a href={item.link} target="_blank" rel="noopener noreferrer">{title}</a>
                  : title
                }
                {(item.matchedBull.length > 0 || item.matchedBear.length > 0) && (
                  <span className="kw-hints">
                    {item.matchedBull.map(k => <span key={k} className="kw bull">{k}</span>)}
                    {item.matchedBear.map(k => <span key={k} className="kw bear">{k}</span>)}
                  </span>
                )}
              </span>
              <span className="hide-sm cat-tag">{CATEGORY_LABELS[item.category]}</span>
              <span className="hide-sm src-tag">{item.source}</span>
              <span className="hide-xs time-tag">{timeAgo(item.pubDate)}</span>
            </div>
          )
        })}
      </div>

      <style>{`
        .empty {
          padding: 2rem; text-align: center;
          font-size: 13px; color: var(--muted);
          font-family: var(--serif); letter-spacing: 0.1em;
        }
        .hl-table {
          border: 0.5px solid var(--line);
          border-radius: 2px; overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .hl-head {
          display: grid;
          grid-template-columns: 52px 1fr 52px 110px 62px;
          gap: 8px; padding: 8px 14px;
          background: var(--card);
          border-bottom: 0.5px solid var(--line);
          font-size: 11px;
          font-family: var(--serif);
          letter-spacing: 0.12em;
          color: var(--muted);
        }
        .hcol { display: flex; align-items: center; gap: 3px; }
        .sortable {
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          transition: color 0.15s;
        }
        .sortable:hover { color: var(--accent); }
        .sort-arrow { font-size: 10px; }
        .sort-arrow.inactive { opacity: 0.3; }
        .sort-arrow.active { color: var(--accent); }

        .hl-row {
          display: grid;
          grid-template-columns: 52px 1fr 52px 110px 62px;
          gap: 8px; padding: 10px 14px;
          border-bottom: 0.5px solid var(--line);
          align-items: start;
          transition: background 0.1s;
        }
        .hl-row:last-child { border-bottom: none; }
        .hl-row:hover { background: rgba(155,50,38,0.03); }

        .hl-title { font-size: 13px; line-height: 1.6; font-family: var(--serif); }
        .hl-title a { color: var(--ink); text-decoration: none; }
        .hl-title a:hover {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .kw-hints { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 5px; }
        .kw { font-size: 10px; padding: 1px 6px; border-radius: 2px; font-family: var(--mono); }
        .kw.bull { background: var(--bull-bg); color: var(--bull); }
        .kw.bear { background: var(--bear-bg); color: var(--bear); }

        .cat-tag  { font-size: 11px; color: var(--muted); font-family: var(--serif); letter-spacing: 0.06em; }
        .src-tag  { font-size: 11px; color: var(--muted); font-family: var(--mono); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .time-tag { font-size: 11px; color: var(--muted); font-family: var(--serif); letter-spacing: 0.04em; white-space: nowrap; }

        @media (max-width: 640px) {
          .hide-sm { display: none !important; }
          .hl-head, .hl-row { grid-template-columns: 52px 1fr 62px; }
        }
        @media (max-width: 400px) {
          .hide-xs { display: none !important; }
          .hl-head, .hl-row { grid-template-columns: 52px 1fr; }
        }
      `}</style>
    </>
  )
}
