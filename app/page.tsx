// app/page.tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import MetricCard    from '@/components/MetricCard'
import ScoreBar      from '@/components/ScoreBar'
import SignalChart   from '@/components/SignalChart'
import HeadlineTable from '@/components/HeadlineTable'
import CategoryTabs  from '@/components/CategoryTabs'
import AIAnalyst     from '@/components/AIAnalyst'
import type { SignalsResponse } from '@/lib/types'
import type { Category } from '@/lib/feeds'

type TabKey = Category | 'all'

function scoreLabel(n: number) {
  return n > 0 ? `+${n}` : `${n}`
}
function scoreColor(n: number): 'bull' | 'bear' | 'neutral' {
  return n > 0 ? 'bull' : n < 0 ? 'bear' : 'neutral'
}

export default function Dashboard() {
  const [data,    setData]    = useState<SignalsResponse | null>(null)
  const [tab,     setTab]     = useState<TabKey>('all')
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<string>('')

  const fetchData = useCallback(async (category: TabKey = 'all') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/signals?category=${category}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: SignalsResponse = await res.json()
      setData(json)
      setLastFetch(new Date(json.fetchedAt).toLocaleTimeString('zh-TW'))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData(tab) }, [tab, fetchData])

  // Auto-refresh every 5 min
  useEffect(() => {
    const id = setInterval(() => fetchData(tab), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [tab, fetchData])

  const activeSum = tab === 'all'
    ? data?.summary ?? null
    : data?.byCat?.[tab as Category] ?? null

  const scores = {
    all:    data?.summary    ?? null,
    macro:  data?.byCat?.macro  ?? null,
    tech:   data?.byCat?.tech   ?? null,
    energy: data?.byCat?.energy ?? null,
  }

  return (
    <>
      <div className="page">
        {/* ── Header ─────────────────────────────────────── */}
        <header className="hdr">
          <div className="hdr-left">
            <h1 className="hdr-title">Decision Dashboard</h1>
            <span className="hdr-sub">Market Signal Engine</span>
          </div>
          <div className="hdr-right">
            {lastFetch && <span className="hdr-time">Updated {lastFetch}</span>}
            <button
              className="refresh-btn"
              onClick={() => fetchData(tab)}
              disabled={loading}
            >
              {loading ? '…' : '↻ Refresh'}
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            ⚠ RSS fetch error: {error} — showing cached or empty data.
          </div>
        )}

        {/* ── Metrics ────────────────────────────────────── */}
        <div className="metrics">
          <MetricCard
            label="Bull signals"
            value={activeSum?.bullCount ?? '—'}
            color="bull"
          />
          <MetricCard
            label="Bear signals"
            value={activeSum?.bearCount ?? '—'}
            color="bear"
          />
          <MetricCard
            label="Market score"
            value={activeSum ? scoreLabel(activeSum.totalScore) : '—'}
            color={activeSum ? scoreColor(activeSum.totalScore) : 'neutral'}
          />
          <MetricCard
            label="Headlines"
            value={data?.items?.length ?? '—'}
          />
        </div>

        {/* ── Score bar ──────────────────────────────────── */}
        {activeSum && (
          <ScoreBar
            bullPct={activeSum.bullPct}
            bearPct={activeSum.bearPct}
            neutralPct={activeSum.neutralPct}
          />
        )}

        {/* ── Chart ──────────────────────────────────────── */}
        {activeSum && (
          <SignalChart
            bullCount={activeSum.bullCount}
            bearCount={activeSum.bearCount}
            neutralCount={activeSum.neutralCount}
          />
        )}

        {/* ── Tabs ───────────────────────────────────────── */}
        <CategoryTabs
          active={tab}
          onChange={t => setTab(t)}
          scores={scores}
        />

        {/* ── Headlines ──────────────────────────────────── */}
        {loading ? (
          <div className="loading">Fetching live RSS feeds…</div>
        ) : (
          <HeadlineTable items={data?.items ?? []} />
        )}

        {/* ── AI Analyst ─────────────────────────────────── */}
        <AIAnalyst items={data?.items ?? []} summary={activeSum} />
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.25rem 4rem;
          font-family: var(--font-sans, system-ui, sans-serif);
        }

        .hdr {
          display: flex; align-items: baseline; justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 0.5px solid rgba(0,0,0,0.1);
        }
        @media (prefers-color-scheme: dark) {
          .hdr { border-color: rgba(255,255,255,0.1); }
        }
        .hdr-left { display: flex; align-items: baseline; gap: 10px; }
        .hdr-title {
          font-size: 15px; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          font-family: var(--font-mono, monospace);
        }
        .hdr-sub {
          font-size: 11px; color: #aaa;
          letter-spacing: 0.06em; font-family: var(--font-mono, monospace);
        }
        .hdr-right { display: flex; align-items: center; gap: 12px; }
        .hdr-time {
          font-size: 11px; color: #aaa;
          font-family: var(--font-mono, monospace);
        }
        .refresh-btn {
          font-size: 11px; font-family: var(--font-mono, monospace);
          letter-spacing: 0.05em; padding: 5px 12px;
          border: 0.5px solid rgba(0,0,0,0.18);
          border-radius: 6px; background: transparent;
          cursor: pointer; color: inherit; transition: background 0.15s;
        }
        .refresh-btn:hover:not(:disabled) { background: rgba(0,0,0,0.04); }
        .refresh-btn:disabled { opacity: 0.4; cursor: default; }
        @media (prefers-color-scheme: dark) {
          .refresh-btn { border-color: rgba(255,255,255,0.15); }
          .refresh-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
        }

        .error-banner {
          font-size: 12px; font-family: var(--font-mono, monospace);
          background: #fcebeb; color: #a32d2d;
          padding: 8px 14px; border-radius: 8px; margin-bottom: 1.25rem;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 10px; margin-bottom: 1.5rem;
        }
        @media (max-width: 560px) {
          .metrics { grid-template-columns: repeat(2, 1fr); }
        }

        .loading {
          padding: 2.5rem; text-align: center;
          font-size: 13px; color: #888;
          font-family: var(--font-mono, monospace);
          letter-spacing: 0.05em;
        }
      `}</style>
    </>
  )
}
