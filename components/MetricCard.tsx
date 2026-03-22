// components/MetricCard.tsx
'use client'

interface Props {
  label:  string
  value:  string | number
  color?: 'bull' | 'bear' | 'neutral' | 'default'
}

const colorMap = {
  bull:    'var(--bull)',
  bear:    'var(--bear)',
  neutral: 'var(--muted)',
  default: 'var(--ink)',
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
          background: var(--card);
          border: 0.5px solid var(--line);
          border-radius: 4px;
          padding: 0.875rem 1rem;
          position: relative;
        }
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: var(--accent);
          border-radius: 4px 0 0 4px;
          opacity: 0.6;
        }
        .mc-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 8px;
          font-family: var(--mono);
        }
        .mc-value {
          font-size: 22px;
          font-weight: 500;
          line-height: 1;
          font-family: var(--mono);
        }
      `}</style>
    </>
  )
}
