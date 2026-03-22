// components/HeadlineTable.tsx
'use client'

import SignalBadge from './SignalBadge'
import type { AnalyzedItem } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/feeds'

interface Props {
  items: AnalyzedItem[]
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function HeadlineTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="empty">No headlines found. Check your network connection.</div>
    )
  }

  return (
    <>
      <div className="hl-table">
        <div className="hl-head">
          <span>Signal</span>
          <span>Headline</span>
          <span className="hide-sm">Category</span>
          <span className="hide-sm">Source</span>
          <span className="hide-xs">Time</span>
        </div>
        {items.map((item, i) => (
          <div key={i} className="hl-row">
            <span><SignalBadge signal={item.signal} /></span>
            <span className="hl-title">
              {item.link
                ? <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                : item.title
              }
              {(item.matchedBull.length > 0 || item.matchedBear.length > 0) && (
                <span className="kw-hints">
                  {item.matchedBull.map(k => (
                    <span key={k} className="kw bull">{k}</span>
                  ))}
                  {item.matchedBear.map(k => (
                    <span key={k} className="kw bear">{k}</span>
                  ))}
                </span>
              )}
            </span>
            <span className="hide-sm cat-tag">{CATEGORY_LABELS[item.category]}</span>
            <span className="hide-sm src-tag">{item.source}</span>
            <span className="hide-xs time-tag">{timeAgo(item.pubDate)}</span>
          </div>
        ))}
      </div>

      <style>{`
        .empty {
          padding: 2rem; text-align: center;
          font-size: 13px; color: #888;
          font-family: var(--font-mono, monospace);
        }
        .hl-table {
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 12px; overflow: hidden;
          margin-bottom: 1.5rem;
        }
        @media (prefers-color-scheme: dark) {
          .hl-table { border-color: rgba(255,255,255,0.1); }
        }
        .hl-head {
          display: grid;
          grid-template-columns: 56px 1fr 56px 100px 64px;
          gap: 8px; padding: 8px 14px;
          background: #f7f6f2;
          border-bottom: 0.5px solid rgba(0,0,0,0.08);
          font-size: 11px; font-family: var(--font-mono, monospace);
          letter-spacing: 0.07em; text-transform: uppercase; color: #888;
        }
        @media (prefers-color-scheme: dark) {
          .hl-head { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.07); }
        }
        .hl-row {
          display: grid;
          grid-template-columns: 56px 1fr 56px 100px 64px;
          gap: 8px; padding: 10px 14px;
          border-bottom: 0.5px solid rgba(0,0,0,0.06);
          align-items: start;
        }
        @media (prefers-color-scheme: dark) {
          .hl-row { border-color: rgba(255,255,255,0.05); }
        }
        .hl-row:last-child { border-bottom: none; }
        .hl-row:hover { background: rgba(0,0,0,0.015); }
        @media (prefers-color-scheme: dark) {
          .hl-row:hover { background: rgba(255,255,255,0.03); }
        }
        .hl-title { font-size: 13px; line-height: 1.5; }
        .hl-title a {
          color: inherit; text-decoration: none;
        }
        .hl-title a:hover { text-decoration: underline; }
        .kw-hints { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
        .kw {
          font-size: 10px; padding: 1px 6px;
          border-radius: 3px; font-family: var(--font-mono, monospace);
        }
        .kw.bull { background: #eaf3de; color: #3b6d11; }
        .kw.bear { background: #fcebeb; color: #a32d2d; }
        .cat-tag { font-size: 11px; color: #888; font-family: var(--font-mono, monospace); }
        .src-tag  { font-size: 11px; color: #888; font-family: var(--font-mono, monospace); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .time-tag { font-size: 11px; color: #aaa; font-family: var(--font-mono, monospace); white-space: nowrap; }
        @media (max-width: 640px) {
          .hide-sm { display: none !important; }
          .hl-head, .hl-row { grid-template-columns: 56px 1fr 64px; }
        }
        @media (max-width: 400px) {
          .hide-xs { display: none !important; }
          .hl-head, .hl-row { grid-template-columns: 56px 1fr; }
        }
      `}</style>
    </>
  )
}
