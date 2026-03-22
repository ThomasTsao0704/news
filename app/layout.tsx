// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Decision Dashboard',
  description: 'Real-time market signal engine',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
