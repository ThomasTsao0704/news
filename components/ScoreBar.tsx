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
        <span style={{ color: 'var(--bull)' }}>陽 {bullPct}%</span>
        <span style={{ color: 'var(--muted)' }}>中 {neutralPct}%</span>
        <span style={{ color: 'var(--bear)' }}>陰 {bearPct}%</span>
      </div>
      <div className="bar-track">
        <div className="seg bull"    style={{ width: `${bullPct}%` }} />
        <div className="seg neutral" style={{ width: `${neutralPct}%` }} />
        <div className="seg bear"    style={{ width: `${bearPct}%` }} />
      </div>
      <style>{`
        .score-bar-wrap { margin: 0 0 1.75rem; }
        .bar-labels {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-family: var(--serif);
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .bar-track {
          height: 5px;
          border-radius: 1px;
          overflow: hidden;
          display: flex;
          background: var(--line);
        }
        .seg { height: 100%; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
        .seg.bull    { background: #c05050; }
        .seg.neutral { background: var(--muted); opacity: 0.5; }
        .seg.bear    { background: #4a9c5e; }
      `}</style>
    </div>
  )
}
