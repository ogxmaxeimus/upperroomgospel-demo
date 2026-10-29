import { FEED_URL, parseYouTubeFeed } from '../../src/lib/youtube-feed.js'

export default async () => {
  try {
    const response = await fetch(FEED_URL, { headers: { 'user-agent': 'UpperRoomSite/1.0' } })
    if (!response.ok) throw new Error(`YouTube responded with ${response.status}`)
    const videos = parseYouTubeFeed(await response.text())
    return Response.json(
      { updated: new Date().toISOString(), videos },
      { headers: { 'cache-control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600' } },
    )
  } catch (error) {
    return Response.json({ error: error.message }, { status: 502 })
  }
}

export const config = { path: '/api/sermons' }
