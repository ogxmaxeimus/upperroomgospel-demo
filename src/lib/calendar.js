import { fullAddress, SITE } from '../data/site.js'
import { hmToMinutes, offsetString, pad, parseKey, TZ } from './time.js'

const DAY_CODES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

function locationFor(event) {
  if (event.location === 'Conference call') return 'Conference call'
  return event.location ? `${event.location}, ${fullAddress}` : fullAddress
}

function describe(event, url) {
  return [event.summary, ...(event.details ?? []), url].filter(Boolean).join('\n\n')
}

const compact = (key) => key.replaceAll('-', '')
const hhmm = (minutes) => `${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}00`

function addDayKey(key, n) {
  const { y, m, d } = parseKey(key)
  const date = new Date(Date.UTC(y, m - 1, d + n))
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`
}

function rrule(schedule) {
  if (!schedule) return null
  const parts =
    schedule.type === 'weekly'
      ? ['FREQ=WEEKLY', `BYDAY=${schedule.days.map((d) => DAY_CODES[d]).join(',')}`]
      : ['FREQ=MONTHLY', `BYDAY=${schedule.nth}${DAY_CODES[schedule.day]}`]
  if (schedule.months?.length && schedule.months.length < 12) parts.push(`BYMONTH=${schedule.months.join(',')}`)
  return `RRULE:${parts.join(';')}`
}

export function googleCalendarUrl(occ, { url, series = false } = {}) {
  const { event, date, start, end } = occ
  const params = new URLSearchParams({ action: 'TEMPLATE', text: `${event.title} · Upper Room`, details: describe(event, url), location: locationFor(event) })
  if (start == null) {
    params.set('dates', `${compact(date)}/${compact(addDayKey(date, 1))}`)
  } else {
    params.set('dates', `${compact(date)}T${hhmm(start)}/${compact(date)}T${hhmm(end ?? start + 90)}`)
    params.set('ctz', TZ)
  }
  if (series && event.schedule) params.set('recur', rrule(event.schedule))
  return `https://calendar.google.com/calendar/render?${params}`
}

export function outlookCalendarUrl(occ, { url } = {}) {
  const { event, date, start, end } = occ
  const params = new URLSearchParams({ path: '/calendar/action/compose', rru: 'addevent', subject: `${event.title} · Upper Room`, body: describe(event, url), location: locationFor(event) })
  if (start == null) {
    params.set('startdt', date)
    params.set('enddt', addDayKey(date, 1))
    params.set('allday', 'true')
  } else {
    const iso = (m) => `${date}T${pad(Math.floor(m / 60))}:${pad(m % 60)}:00${offsetString(date, m)}`
    params.set('startdt', iso(start))
    params.set('enddt', iso(end ?? start + 90))
  }
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`
}

// ── iCalendar (.ics) ──────────────────────────────────────────────────────────────────────
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:America/New_York',
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:-0500',
  'TZOFFSETTO:-0400',
  'TZNAME:EDT',
  'DTSTART:19700308T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:-0400',
  'TZOFFSETTO:-0500',
  'TZNAME:EST',
  'DTSTART:19701101T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
]

const escapeText = (text = '') =>
  text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

function fold(line) {
  const bytes = new TextEncoder().encode(line)
  if (bytes.length <= 74) return line
  const out = []
  let current = ''
  let size = 0
  for (const char of line) {
    const charSize = new TextEncoder().encode(char).length
    if (size + charSize > 73) {
      out.push(current)
      current = ' '
      size = 1
    }
    current += char
    size += charSize
  }
  out.push(current)
  return out.join('\r\n')
}

function stamp() {
  return `${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`
}

function vevent(event, date, { url, series }) {
  const startMin = hmToMinutes(event.time?.start)
  const endMin = hmToMinutes(event.time?.end) ?? (startMin != null ? startMin + 90 : null)
  const lines = ['BEGIN:VEVENT', `UID:${event.id}-${series ? 'series' : compact(date)}@upperroomgospel.org`, `DTSTAMP:${stamp()}`]
  if (startMin == null) {
    lines.push(`DTSTART;VALUE=DATE:${compact(date)}`, `DTEND;VALUE=DATE:${compact(addDayKey(date, 1))}`)
  } else {
    lines.push(`DTSTART;TZID=${TZ}:${compact(date)}T${hhmm(startMin)}`, `DTEND;TZID=${TZ}:${compact(date)}T${hhmm(endMin)}`)
  }
  if (series && event.schedule) lines.push(rrule(event.schedule))
  lines.push(
    `SUMMARY:${escapeText(`${event.title} · Upper Room`)}`,
    `DESCRIPTION:${escapeText(describe(event, url))}`,
    `LOCATION:${escapeText(locationFor(event))}`,
  )
  if (url) lines.push(`URL:${url}`)
  lines.push('END:VEVENT')
  return lines
}

export function buildICS(items) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Upper Room COGIC//Events//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${SITE.shortName} Events`, `X-WR-TIMEZONE:${TZ}`, ...VTIMEZONE]
  for (const item of items) lines.push(...vevent(item.event, item.date, item))
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n')
}

export function downloadICS(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const href = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}
