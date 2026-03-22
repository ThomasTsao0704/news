// app/api/ai/route.ts
// ─────────────────────────────────────────────────────────────
//  POST /api/ai  { message: string }
//  Calls Anthropic API from the server (keeps key safe)
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Missing message' }, { status: 400 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 600,
        system:     '你是一位精簡的市場分析師，用繁體中文回答。每次回答控制在3-4句以內，聚焦在可操作的洞察，不要廢話。',
        messages:   [{ role: 'user', content: message }],
      }),
    })

    const data = await res.json()
    const text = data.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''
    return NextResponse.json({ text })
  } catch (err) {
    return NextResponse.json(
      { error: 'Anthropic API error', detail: (err as Error).message },
      { status: 502 }
    )
  }
}
