// All church times are Eastern Time. Dates are handled as 'YYYY-MM-DD' keys in Raleigh's calendar,
// so the site shows the right day and time no matter where a visitor's device is.
export const TZ = 'America/New_York'
export const TZ_LABEL = 'ET'

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hourCycle: 'h23',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  weekday: 'short',
})

export function zonedParts(epoch = Date.now()) {
  const parts = {}
  for (const { type, value } of partsFormatter.formatToParts(new Date(epoch))) parts[type] = value
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
    second: Number(parts.second),
    weekday: WEEKDAY_SHORT.indexOf(parts.weekday),
  }
}

export const pad = (n) => String(n).padStart(2, '0')
export const toKey = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`

export function parseKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return { y, m, d }
}

export function keyToUTC(key) {
  const { y, m, d } = parseKey(key)
  return new Date(Date.UTC(y, m - 1, d))
}

export const utcToKey = (date) => toKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate())

export function addDays(key, n) {
  const date = keyToUTC(key)
  date.setUTCDate(date.getUTCDate() + n)
  return utcToKey(date)
}

export const weekdayOf = (key) => keyToUTC(key).getUTCDay()
export const daysInMonth = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate()
export const diffDays = (a, b) => Math.round((keyToUTC(b) - keyToUTC(a)) / 86400000)

export function todayKey(epoch = Date.now()) {
  const p = zonedParts(epoch)
  return toKey(p.year, p.month, p.day)
}

export function nowMinutes(epoch = Date.now()) {
  const p = zonedParts(epoch)
  return p.hour * 60 + p.minute
}

export function hmToMinutes(hm) {
  if (!hm) return null
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

function offsetAt(epoch) {
  const p = zonedParts(epoch)
  const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second)
  return asUTC - Math.floor(epoch / 1000) * 1000
}

// Eastern wall-clock (date key + minutes after midnight) → epoch milliseconds
export function zonedToEpoch(key, minutes = 0) {
  const { y, m, d } = parseKey(key)
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60)
  const first = offsetAt(guess)
  let epoch = guess - first
  const second = offsetAt(epoch)
  if (second !== first) epoch = guess - second
  return epoch
}

export function offsetString(key, minutes = 0) {
  const offset = offsetAt(zonedToEpoch(key, minutes)) / 60000
  const sign = offset <= 0 ? '-' : '+'
  const abs = Math.abs(offset)
  return `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
}

// ── Formatting (Intl-based, always rendered in Eastern Time) ──────────────────────────────
const cache = new Map()
function fmt(options) {
  const id = JSON.stringify(options)
  if (!cache.has(id)) cache.set(id, new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', ...options }))
  return cache.get(id)
}

export const formatDate = (key, options = { weekday: 'long', month: 'long', day: 'numeric' }) =>
  fmt(options).format(keyToUTC(key))

export function formatTime(minutes) {
  if (minutes == null) return 'Time TBA'
  const date = new Date(Date.UTC(2000, 0, 1, Math.floor(minutes / 60), minutes % 60))
  return fmt({ hour: 'numeric', minute: '2-digit' }).format(date)
}

export function formatTimeRange(start, end) {
  if (start == null) return 'Time TBA'
  if (end == null) return formatTime(start)
  return `${formatTime(start)} – ${formatTime(end)}`
}

export const monthLabel = (y, m, options = { month: 'long', year: 'numeric' }) =>
  fmt(options).format(new Date(Date.UTC(y, m - 1, 1)))

export function relativeDayLabel(key, today) {
  const diff = diffDays(today, key)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff > 1 && diff < 7) return formatDate(key, { weekday: 'long' })
  return null
}

export function durationParts(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}
