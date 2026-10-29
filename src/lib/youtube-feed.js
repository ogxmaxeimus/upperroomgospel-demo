export const CHANNEL_ID = 'UCWzZoBg8BYxzktCR6RlvMBw'
export const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" }

function decode(text) {
  return text.replace(/&(#x?[0-9a-f]+|\w+);/gi, (match, code) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return Number.isFinite(value) ? String.fromCodePoint(value) : match
    }
    return ENTITIES[code] ?? match
  })
}

export function parseYouTubeFeed(xml) {
  return xml
    .split('<entry>')
    .slice(1)
    .map((chunk) => {
      const pick = (re) => (chunk.match(re)?.[1] ?? '').trim()
      return {
        id: pick(/<yt:videoId>([^<]+)<\/yt:videoId>/),
        title: decode(pick(/<title>([\s\S]*?)<\/title>/)),
        published: pick(/<published>([^<]+)<\/published>/),
        views: Number(pick(/<media:statistics views="(\d+)"/)) || null,
      }
    })
    .filter((video) => video.id && video.title)
}
