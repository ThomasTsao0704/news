// components/ScoreBar.tsx
'use client'

interface Props {
  bullPct:    number
  bearPct:    number
  neutralPct: number
}

export default function ScoreBar({ bullPct, bearPct, neutralPct }: Props) {
  return (
    <div className="score-bar-wrap">
      <div className="bar-labels">
        <span>BULLISH {bullPct}%</span>
        <span>NEUTRAL {neutralPct}%</span>
        <span>BEARISH {bearPct}%</span>
      </div>
      <div className="bar-track">
        <div className="seg bull" style={{ width: `${bullPct}%` }} />
        <div className="seg neutral" style={{ width: `${neutralPct}%` }} />
        <div className="seg bear" style={{ width: `${bearPct}%` }} />
      </div>
      <style>{`
        .score-bar-wrap { margin: 0 0 1.75rem; }
        .bar-labels {
          display: flex; justify-content: space-between;
          font-size: 11px; font-family: var(--font-mono, monospace);
          letter-spacing: 0.06em; color: #888; margin-bottom: 7px;
        }
        .bar-track {
          height: 6px; border-radius: 3px; overflow: hidden;
          display: flex; background: #e8e6df;
        }
        .seg { height: 100%; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
        .seg.bull    { background: #639922; }
        .seg.neutral { background: #c4c2b9; }
        .seg.bear    { background: #e24b4a; }
      `}</style>
    </div>
  )
}
