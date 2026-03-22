// components/SignalChart.tsx
'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

interface Props {
  bullCount:    number
  bearCount:    number
  neutralCount: number
}

export default function SignalChart({ bullCount, bearCount, neutralCount }: Props) {
  const data = [
    { name: '陽',  value: bullCount,    fill: '#c05050' },
    { name: '中立', value: neutralCount, fill: '#a09488' },
    { name: '陰',  value: bearCount,    fill: '#4a9c5e' },
  ]

  return (
    <div style={{ width: '100%', height: 140, marginBottom: '1.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={32} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fontFamily: 'serif', fill: 'var(--ink-sub, #6b5f54)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'monospace', fill: 'var(--muted, #998d80)' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(155,50,38,0.04)' }}
            contentStyle={{
              fontSize: 12,
              fontFamily: 'serif',
              border: '0.5px solid var(--line, #d4c8b5)',
              borderRadius: 2,
              boxShadow: 'none',
              background: 'var(--card, #ede8de)',
              color: 'var(--ink, #221d18)',
            }}
            formatter={(v: number) => [`${v} 則`, '']}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
