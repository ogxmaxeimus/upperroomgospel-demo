import bundled from '../data/sermons.json'
import { todayKey, utcToKey } from './time.js'

export const SERMON_KINDS = {
  service: 'Sunday Services',
  'bible-study': 'Bible Study',
  clip: 'Clips & Commentary',
  announcements: 'Announcements',
}

const SPEAKER_RE = /\b(bishop|prophetess|first lady|pastor|elder|evangelist|minister|mother|dr\.)\b/i
const TIME_RE = /^\s*\d{1,2}(:\d{2})?\s?(am|pm)\s*$/i
const DATE_RE = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})/

function parseTitleDate(text) {
  const match = text.match(DATE_RE)
  if (!match) return null
  const year = match[3].length === 2 ? 2000 + Number(match[3]) : Number(match[3])
  return new Date(Date.UTC(year, Number(match[1]) - 1, Number(match[2])))
}

export function describeVideo(video) {
  const parts = video.title.split(/[|\u2014]/).map((part) => part.trim()).filter(Boolean)
  let title = parts[0] ?? video.title
  let speaker = null
  let serviceDate = null
  for (const part of parts.slice(1)) {
    if (TIME_RE.test(part)) continue
    if (DATE_RE.test(part) && part.length <= 12) {
      serviceDate = parseTitleDate(part)
      continue
    }
    if (SPEAKER_RE.test(part) && !speaker) speaker = part.replace(/\s+/g, ' ').replace(/\s\./g, '.')
    else title = `${title} · ${part}`
  }
  title = title.replace(/\s+/g, ' ').replace(/\s\d{1,2}(:\d{2})?\s?(am|pm)$/i, '')

  const lower = video.title.toLowerCase()
  let kind = 'clip'
  if (lower.includes('announcement')) kind = 'announcements'
  else if (lower.includes('bible study')) kind = 'bible-study'
  else if (serviceDate) kind = serviceDate.getUTCDay() === 4 ? 'bible-study' : 'service'
  else if (/\b(8|11)\s?am\b/i.test(video.title) || lower.includes('service')) kind = 'service'

  return {
    ...video,
    displayTitle: title,
    speaker: speaker ?? (kind === 'announcements' ? null : 'Bishop Patrick L. Wooden, Sr.'),
    kind,
    dateKey: serviceDate ? utcToKey(serviceDate) : todayKey(Date.parse(video.published)),
    thumb: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
    thumbLarge: `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${video.id}`,
  }
}

export const BUNDLED_SERMONS = bundled.videos.map(describeVideo)

export async function fetchLatestSermons(signal) {
  const response = await fetch('/api/sermons', { signal, headers: { accept: 'application/json' } })
  if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('Live feed unavailable')
  const data = await response.json()
  if (!Array.isArray(data.videos) || data.videos.length === 0) throw new Error('Empty feed')
  return data.videos.map(describeVideo)
}

export const CURRENT_SERIES = {
  name: 'Faith That Behaves',
  scripture: '2 Peter 1:5–7',
  match: /faith that behave/i,
  verse:
    'And beside this, giving all diligence, add to your faith virtue; and to virtue knowledge; and to knowledge temperance; and to temperance patience; and to patience godliness; and to godliness brotherly kindness; and to brotherly kindness charity.',
  steps: ['Faith', 'Virtue', 'Knowledge', 'Temperance', 'Patience', 'Godliness', 'Brotherly Kindness', 'Charity'],
}
