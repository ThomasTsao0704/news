// lib/feeds.ts
// ─────────────────────────────────────────────────────────────
//  RSS feed registry
//  Category: "macro" | "tech" | "energy"
// ─────────────────────────────────────────────────────────────

export type Category = 'macro' | 'tech' | 'energy'

export interface FeedSource {
  url: string
  label: string
  category: Category
}

export const FEED_SOURCES: FeedSource[] = [
  // ── Macro / 總經 ─────────────────────────────────────────
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines', label: 'MarketWatch',          category: 'macro' },
  { url: 'https://feeds.reuters.com/reuters/businessNews',                     label: 'Reuters Business',     category: 'macro' },
  { url: 'https://www.cnbc.com/id/10000664/device/rss/rss.html',               label: 'CNBC Economy',         category: 'macro' },
  { url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',                      label: 'WSJ Markets',          category: 'macro' },
  { url: 'https://feeds.bbci.co.uk/news/rss.xml',                              label: 'BBC News',             category: 'macro' },
  { url: 'https://hnrss.org/frontpage',                                         label: 'Hacker News',          category: 'macro' },
  { url: 'https://feeds.bloomberg.com/markets/news.rss',                       label: 'Bloomberg Markets',    category: 'macro' },
  { url: 'https://www.bis.org/doclist/all_statistics.rss',                     label: 'BIS Statistics',       category: 'macro' },
  { url: 'https://www.bis.org/doclist/all_pressrels.rss',                      label: 'BIS Press Releases',   category: 'macro' },
  { url: 'https://www.twse.com.tw/rwd/zh/news/feed?type=rss',                  label: '臺灣證券交易所',        category: 'macro' },
  // ── DT 區域
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_90_0.xml',          label: 'DT 科技/區域',         category: 'macro' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_90_300.xml',        label: 'DT 東南亞',            category: 'macro' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_90_305.xml',        label: 'DT 印度',              category: 'macro' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_90_310.xml',        label: 'DT 東亞/中國',         category: 'macro' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_90_315.xml',        label: 'DT 國際',              category: 'macro' },

  // ── Tech / 科技 ──────────────────────────────────────────
  { url: 'https://feeds.feedburner.com/TechCrunch',                            label: 'TechCrunch',           category: 'tech' },
  { url: 'https://www.theverge.com/rss/index.xml',                             label: 'The Verge',            category: 'tech' },
  { url: 'https://www.cnbc.com/id/19854910/device/rss/rss.html',               label: 'CNBC Tech',            category: 'tech' },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',        label: 'NYT Tech',             category: 'tech' },
  { url: 'https://pansci.asia/feed',                                            label: '泛科學',               category: 'tech' },
  { url: 'https://technews.tw/feed/',                                           label: '科技新報',             category: 'tech' },
  // ── DT 科技/產業
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_0.xml',          label: 'DT 科技/產業',         category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_10.xml',         label: 'DT IT系統供應鏈',      category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_30.xml',         label: 'DT 光電顯示光學',      category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_40.xml',         label: 'DT 半導體零組件',      category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_50.xml',         label: 'DT 物聯科技智慧製造',  category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_60.xml',         label: 'DT AI智慧應用電商',    category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_70.xml',         label: 'DT 行動通訊XR',        category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_90.xml',         label: 'DT CarTech綠能',       category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_100.xml',        label: 'DT 航太衛星軍工',      category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_10_110.xml',        label: 'DT 科技政策',          category: 'tech' },
  // ── DT 研究報告
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_0.xml',          label: 'DT Research',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_1.xml',          label: 'DT 電腦運算',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_3.xml',          label: 'DT 智慧家庭',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_5.xml',          label: 'DT 智慧穿戴',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_6.xml',          label: 'DT 行動裝置應用',      category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_7.xml',          label: 'DT 寬頻無線',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_9.xml',          label: 'DT 顯示科技應用',      category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_16.xml',         label: 'DT IC設計',            category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_17.xml',         label: 'DT IC製造',            category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_22.xml',         label: 'DT 物聯網',            category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_23.xml',         label: 'DT CarTech',           category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_24.xml',         label: 'DT Cloud',             category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_25.xml',         label: 'DT AI Focus',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_26.xml',         label: 'DT 伺服器',            category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_27.xml',         label: 'DT 行動通訊',          category: 'tech' },
  { url: 'https://www.digitimes.com.tw/tech/rss/xml/xmlrss_30_29.xml',         label: 'DT 智慧製造',          category: 'tech' },

  // ── Energy / 能源 ────────────────────────────────────────
  { url: 'https://oilprice.com/rss/main',                                       label: 'OilPrice.com',         category: 'energy' },
  { url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx',                label: 'Rigzone',              category: 'energy' },
  { url: 'https://www.cnbc.com/id/10000533/device/rss/rss.html',                label: 'CNBC Energy',          category: 'energy' },
]

export const CATEGORY_LABELS: Record<Category | 'all', string> = {
  all:    '全部',
  macro:  '總經',
  tech:   '科技',
  energy: '能源',
}
