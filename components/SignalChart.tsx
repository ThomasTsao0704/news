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
    { name: 'Bullish', value: bullCount,    fill: '#97c459' },
    { name: 'Neutral', value: neutralCount, fill: '#b4b2a9' },
    { name: 'Bearish', value: bearCount,    fill: '#f09595' },
  ]

  return (
    <div style={{ width: '100%', height: 160, marginBottom: '1.5rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={36} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#888' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'monospace', fill: '#888' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            contentStyle={{
              fontSize: 12, fontFamily: 'monospace',
              border: '0.5px solid rgba(0,0,0,0.1)',
              borderRadius: 8, boxShadow: 'none',
            }}
            formatter={(v: number) => [`${v} signals`, '']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
