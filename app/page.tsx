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

// ── Translation via MyMemory free API ─────────────────────────────────────────
async function translateOne(title: string): Promise<string> {
  try {
    const r = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(title)}&langpair=en|zh-TW`
    )
    const j = await r.json()
    const t = (j.responseData?.translatedText ?? '').trim()
    return t || title
  } catch {
    return title
  }
}

async function translateTitles(titles: string[]): Promise<string[]> {
  if (titles.length === 0) return []
  // Concurrency limit: 5 at a time to avoid rate-limiting
  const results: string[] = new Array(titles.length).fill('')
  const CONCURRENCY = 5
  for (let i = 0; i < titles.length; i += CONCURRENCY) {
    const chunk = titles.slice(i, i + CONCURRENCY)
    const translated = await Promise.all(chunk.map(translateOne))
    translated.forEach((t, j) => { results[i + j] = t })
  }
  return results
}

export default function Dashboard() {
  const [data,        setData]        = useState<SignalsResponse | null>(null)
  const [tab,         setTab]         = useState<TabKey>('all')
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [lastFetch,   setLastFetch]   = useState<string>('')
  const [translated,  setTranslated]  = useState(false)
  const [translations,setTranslations]= useState<string[]>([])
  const [translating, setTranslating] = useState(false)

  const fetchData = useCallback(async (category: TabKey = 'all') => {
    setLoading(true)
    setError(null)
    // Reset translations when refreshing
    setTranslated(false)
    setTranslations([])
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

  useEffect(() => {
    const id = setInterval(() => fetchData(tab), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [tab, fetchData])

  async function handleTranslate() {
    if (translated) {
      setTranslated(false)
      return
    }
    if (translations.length > 0) {
      setTranslated(true)
      return
    }
    const titles = (data?.items ?? []).map(i => i.title)
    if (titles.length === 0) return
    setTranslating(true)
    const result = await translateTitles(titles)
    setTranslations(result)
    setTranslated(true)
    setTranslating(false)
  }

  const activeSum = tab === 'all'
    ? data?.summary ?? null
    : data?.byCat?.[tab as Category] ?? null

  const scores = {
    all:    data?.summary       ?? null,
    macro:  data?.byCat?.macro  ?? null,
    tech:   data?.byCat?.tech   ?? null,
    energy: data?.byCat?.energy ?? null,
  }

  return (
    <>
      <div className="page">

        {/* ── Header ───────────────────────────────────────────── */}
        <header className="hdr">
          <div className="hdr-left">
            <h1 className="hdr-title">決策情報板</h1>
            <span className="hdr-divider">｜</span>
            <span className="hdr-sub">Market Signal Engine</span>
          </div>
          <div className="hdr-right">
            {lastFetch && <span className="hdr-time">更新 {lastFetch}</span>}
            <button
              className="hdr-btn translate-btn"
              onClick={handleTranslate}
              disabled={translating || loading}
            >
              {translating ? '翻譯中…' : translated ? '顯示原文' : '中文翻譯'}
            </button>
            <button
              className="hdr-btn"
              onClick={() => fetchData(tab)}
              disabled={loading}
            >
              {loading ? '…' : '更新'}
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            ⚠ RSS 擷取錯誤：{error}
          </div>
        )}

        {/* ── Metrics ──────────────────────────────────────────── */}
        <div className="metrics">
          <MetricCard
            label="強勢信號"
            value={activeSum?.bullCount ?? '—'}
            color="bull"
          />
          <MetricCard
            label="弱勢信號"
            value={activeSum?.bearCount ?? '—'}
            color="bear"
          />
          <MetricCard
            label="市場分數"
            value={activeSum ? scoreLabel(activeSum.totalScore) : '—'}
            color={activeSum ? scoreColor(activeSum.totalScore) : 'neutral'}
          />
          <MetricCard
            label="新聞則數"
            value={data?.items?.length ?? '—'}
          />
        </div>

        {/* ── Score bar ────────────────────────────────────────── */}
        {activeSum && (
          <ScoreBar
            bullPct={activeSum.bullPct}
            bearPct={activeSum.bearPct}
            neutralPct={activeSum.neutralPct}
          />
        )}

        {/* ── Chart ────────────────────────────────────────────── */}
        {activeSum && (
          <SignalChart
            bullCount={activeSum.bullCount}
            bearCount={activeSum.bearCount}
            neutralCount={activeSum.neutralCount}
          />
        )}

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <CategoryTabs
          active={tab}
          onChange={t => setTab(t)}
          scores={scores}
        />

        {/* ── Headlines ────────────────────────────────────────── */}
        {loading ? (
          <div className="loading">情報擷取中…</div>
        ) : (
          <HeadlineTable
            items={data?.items ?? []}
            translations={translated ? translations : []}
          />
        )}

        {/* ── AI Analyst ───────────────────────────────────────── */}
        <AIAnalyst items={data?.items ?? []} summary={activeSum} />

      </div>

      <style>{`
        .page {
          max-width: 920px;
          margin: 0 auto;
          padding: 2rem 1.25rem 4rem;
          font-family: var(--serif);
        }

        /* ── Header ── */
        .hdr {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--line);
        }
        .hdr-left {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .hdr-title {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.18em;
          font-family: var(--serif);
          color: var(--ink);
        }
        .hdr-divider {
          color: var(--accent);
          font-size: 14px;
        }
        .hdr-sub {
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.08em;
          font-family: var(--mono);
        }
        .hdr-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hdr-time {
          font-size: 11px;
          color: var(--muted);
          font-family: var(--mono);
          letter-spacing: 0.04em;
        }
        .hdr-btn {
          font-size: 11px;
          font-family: var(--serif);
          letter-spacing: 0.08em;
          padding: 5px 14px;
          border: 0.5px solid var(--line);
          border-radius: 2px;
          background: transparent;
          cursor: pointer;
          color: var(--ink);
          transition: background 0.15s, border-color 0.15s;
        }
        .hdr-btn:hover:not(:disabled) {
          background: var(--card);
          border-color: var(--accent);
          color: var(--accent);
        }
        .hdr-btn:disabled { opacity: 0.4; cursor: default; }
        .translate-btn { color: var(--accent); border-color: var(--accent); }
        .translate-btn:hover:not(:disabled) { background: rgba(155,50,38,0.06); }

        /* ── Error ── */
        .error-banner {
          font-size: 12px;
          font-family: var(--mono);
          background: var(--bear-bg);
          color: var(--bear);
          padding: 8px 14px;
          border-radius: 2px;
          border: 0.5px solid #e0b0b0;
          margin-bottom: 1.25rem;
          letter-spacing: 0.04em;
        }

        /* ── Metrics ── */
        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 560px) {
          .metrics { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── Loading ── */
        .loading {
          padding: 2.5rem;
          text-align: center;
          font-size: 13px;
          color: var(--muted);
          font-family: var(--serif);
          letter-spacing: 0.12em;
        }
      `}</style>
    </>
  )
}
