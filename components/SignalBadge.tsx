// components/SignalBadge.tsx
'use client'

import type { Signal } from '@/lib/signalEngine'

const CONFIG: Record<Signal, { label: string; cls: string }> = {
  BULLISH: { label: 'BULL', cls: 'bull' },
  BEARISH: { label: 'BEAR', cls: 'bear' },
  NEUTRAL: { label: 'N',    cls: 'neutral' },
}

export default function SignalBadge({ signal }: { signal: Signal }) {
  const { label, cls } = CONFIG[signal]
  return (
    <>
      <span className={`badge ${cls}`}>{label}</span>
      <style>{`
        .badge {
          display: inline-block;
          font-size: 10px; font-weight: 500;
          font-family: var(--font-mono, monospace);
          letter-spacing: 0.07em;
          padding: 3px 7px; border-radius: 4px;
          white-space: nowrap;
        }
        .badge.bull    { background: #eaf3de; color: #27500a; }
        .badge.bear    { background: #fcebeb; color: #791f1f; }
        .badge.neutral { background: #f1efe8; color: #5f5e5a; }
      `}</style>
    </>
  )
}
