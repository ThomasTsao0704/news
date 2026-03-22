// components/AIAnalyst.tsx
'use client'

import { useState } from 'react'
import type { AnalyzedItem } from '@/lib/types'
import type { MarketSummary } from '@/lib/signalEngine'

interface Props {
  items:   AnalyzedItem[]
  summary: MarketSummary | null
}

export default function AIAnalyst({ items, summary }: Props) {
  const [input,  setInput]   = useState('')
  const [output, setOutput]  = useState('')
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    setOutput('')

    const context = summary
      ? `目前市場訊號: ${summary.bullCount}個偏多, ${summary.bearCount}個偏空, 市場分數: ${summary.totalScore > 0 ? '+' : ''}${summary.totalScore}\n\n最新標題:\n${items.slice(0, 20).map(i => `[${i.signal}] ${i.title}`).join('\n')}`
      : ''

    const userMsg = input.trim()
      ? `${context}\n\n請分析這條新聞標題：「${input.trim()}」\n用2-3句話說明：這條訊號是偏多還是偏空？為什麼？與整體市場狀況如何互動？`
      : `${context}\n\n請用3-4句話，用繁體中文給出整體市場分析：現在市場偏向哪個方向？投資人應注意什麼？有什麼關鍵風險或機會？`

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })
      const data = await res.json()
      setOutput(data.text ?? '分析失敗，請重試。')
    } catch {
      setOutput('連線失敗，請確認網路後重試。')
    } finally {
      setLoading(false)
    }
  }

  const biasColor = summary
    ? summary.totalScore > 0 ? '#3b6d11' : summary.totalScore < 0 ? '#a32d2d' : '#888'
    : '#888'
  const biasLabel = summary
    ? summary.totalScore > 0 ? '偏多' : summary.totalScore < 0 ? '偏空' : '中性'
    : '—'

  return (
    <>
      <div className="ai-panel">
        <div className="ai-header">
          <span className="ai-title">AI 市場分析師</span>
          {summary && (
            <span className="ai-verdict" style={{ color: biasColor }}>
              ● {biasLabel}
            </span>
          )}
        </div>

        <textarea
          className="ai-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={`貼入新聞標題進行單條分析...\n或直接留空，按下方按鈕取得整體市場解讀`}
          rows={3}
        />

        <button
          className="ai-btn"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? '分析中...' : input.trim() ? '→ 分析這條訊息' : '→ 整體市場解讀'}
        </button>

        {output && (
          <div className="ai-output">{output}</div>
        )}
      </div>

      <style>{`
        .ai-panel {
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 2rem;
        }
        @media (prefers-color-scheme: dark) {
          .ai-panel { border-color: rgba(255,255,255,0.1); }
        }
        .ai-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .ai-title {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: #888; font-family: var(--font-mono, monospace);
        }
        .ai-verdict {
          font-size: 12px; font-weight: 500;
          font-family: var(--font-mono, monospace); letter-spacing: 0.05em;
        }
        .ai-input {
          width: 100%; resize: vertical;
          font-size: 13px; line-height: 1.6;
          font-family: var(--font-mono, monospace);
          border: 0.5px solid rgba(0,0,0,0.15);
          border-radius: 8px; padding: 10px 12px;
          background: transparent; color: inherit;
          margin-bottom: 10px; min-height: 72px;
        }
        @media (prefers-color-scheme: dark) {
          .ai-input { border-color: rgba(255,255,255,0.12); }
        }
        .ai-input:focus { outline: none; border-color: rgba(0,0,0,0.3); }
        @media (prefers-color-scheme: dark) {
          .ai-input:focus { border-color: rgba(255,255,255,0.25); }
        }
        .ai-btn {
          font-size: 12px; font-family: var(--font-mono, monospace);
          letter-spacing: 0.05em; padding: 8px 16px;
          border: 0.5px solid rgba(0,0,0,0.2);
          border-radius: 8px; background: transparent;
          cursor: pointer; color: inherit; transition: background 0.15s;
        }
        .ai-btn:hover:not(:disabled) { background: rgba(0,0,0,0.04); }
        .ai-btn:disabled { opacity: 0.5; cursor: default; }
        @media (prefers-color-scheme: dark) {
          .ai-btn { border-color: rgba(255,255,255,0.15); }
          .ai-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); }
        }
        .ai-output {
          margin-top: 12px;
          font-size: 13px; line-height: 1.75;
          padding: 12px 14px;
          background: #f7f6f2;
          border-radius: 8px;
          white-space: pre-wrap;
        }
        @media (prefers-color-scheme: dark) {
          .ai-output { background: rgba(255,255,255,0.05); }
        }
      `}</style>
    </>
  )
}
