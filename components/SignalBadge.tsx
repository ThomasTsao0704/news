// components/SignalBadge.tsx
'use client'

import type { Signal } from '@/lib/signalEngine'

const CONFIG: Record<Signal, { label: string; cls: string }> = {
  BULLISH: { label: '↑強', cls: 'bull' },
  BEARISH: { label: '↓弱', cls: 'bear' },
  NEUTRAL: { label: '中',  cls: 'neutral' },
}

export default function SignalBadge({ signal }: { signal: Signal }) {
  const { label, cls } = CONFIG[signal]
  return (
    <>
      <span className={`badge ${cls}`}>{label}</span>
      <style>{`
        .badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          font-family: var(--serif);
          letter-spacing: 0.04em;
          padding: 3px 8px;
          border-radius: 2px;
          white-space: nowrap;
          border: 0.5px solid transparent;
        }
        .badge.bull {
          background: var(--bull-bg);
          color: var(--bull);
          border-color: #e8b0b0;
        }
        .badge.bear {
          background: var(--bear-bg);
          color: var(--bear);
          border-color: #a0d0b0;
        }
        .badge.neutral {
          background: var(--neut-bg);
          color: var(--muted);
          border-color: var(--line);
        }
      `}</style>
    </>
  )
}
