// components/MetricCard.tsx
'use client'

interface Props {
  label:  string
  value:  string | number
  color?: 'bull' | 'bear' | 'neutral' | 'default'
}

const colorMap = {
  bull:    '#3b6d11',
  bear:    '#a32d2d',
  neutral: '#888780',
  default: 'inherit',
}

export default function MetricCard({ label, value, color = 'default' }: Props) {
  return (
    <>
      <div className="metric-card">
        <div className="mc-label">{label}</div>
        <div className="mc-value" style={{ color: colorMap[color] }}>{value}</div>
      </div>
      <style>{`
        .metric-card {
          background: #f7f6f2;
          border-radius: 8px;
          padding: 0.875rem 1rem;
        }
        @media (prefers-color-scheme: dark) {
          .metric-card { background: rgba(255,255,255,0.06); }
        }
        .mc-label {
          font-size: 11px; letter-spacing: 0.07em;
          text-transform: uppercase; color: #888; margin-bottom: 6px;
          font-family: var(--font-mono, monospace);
        }
        .mc-value {
          font-size: 24px; font-weight: 500; line-height: 1;
          font-family: var(--font-mono, monospace);
        }
      `}</style>
    </>
  )
}
