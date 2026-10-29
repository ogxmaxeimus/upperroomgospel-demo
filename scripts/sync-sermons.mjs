// Refreshes src/data/sermons.json from the God First Official YouTube channel.
// Runs before every Netlify build. If YouTube is unreachable, the existing file is kept.
import { writeFile } from 'node:fs/promises'
import { FEED_URL, parseYouTubeFeed } from '../src/lib/youtube-feed.js'

const target = new URL('../src/data/sermons.json', import.meta.url)

try {
  const response = await fetch(FEED_URL, { headers: { 'user-agent': 'UpperRoomSite/1.0' } })
  if (!response.ok) throw new Error(`YouTube responded with ${response.status}`)
  const videos = parseYouTubeFeed(await response.text())
  if (videos.length === 0) throw new Error('Feed contained no videos')
  await writeFile(target, `${JSON.stringify({ updated: new Date().toISOString(), videos }, null, 2)}\n`)
  console.log(`sync:sermons → saved ${videos.length} videos`)
} catch (error) {
  console.warn(`sync:sermons → kept existing sermons.json (${error.message})`)
}
