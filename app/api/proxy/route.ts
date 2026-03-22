// app/api/proxy/route.ts
// ─────────────────────────────────────────────────────────────
//  GET /api/proxy?url=<encoded_rss_url>
//  A transparent RSS proxy: browser hits this endpoint, server
//  fetches the external URL and streams it back — bypassing
//  CORS headers that external RSS hosts don't set.
//
//  Usage (client side):
//    const res = await fetch(`/api/proxy?url=${encodeURIComponent(rssUrl)}`)
//    const xml = await res.text()
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_DOMAINS = [
  'feeds.reuters.com',
  'feeds.content.dowjones.io',
  'feeds.a.dj.com',
  'www.cnbc.com',
  'feeds.feedburner.com',
  'www.theverge.com',
  'rss.nytimes.com',
  'oilprice.com',
  'www.rigzone.com',
  'feeds.bloomberg.com',
]

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rawUrl = searchParams.get('url')

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  let targetUrl: URL
  try {
    targetUrl = new URL(decodeURIComponent(rawUrl))
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // Security: only proxy allow-listed RSS domains
  if (!ALLOWED_DOMAINS.includes(targetUrl.hostname)) {
    return NextResponse.json(
      { error: `Domain not allowed: ${targetUrl.hostname}` },
      { status: 403 }
    )
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DecisionDashboard/1.0)',
        'Accept':     'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(8000),
    })

    const body = await upstream.text()

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Content-Type':                upstream.headers.get('Content-Type') ?? 'application/xml',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':               'public, s-maxage=300',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Upstream fetch failed', detail: (err as Error).message },
      { status: 502 }
    )
  }
}
