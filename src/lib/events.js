import { CATEGORIES, RECURRING_EVENTS, SPECIAL_EVENTS } from '../data/events.js'
import { SITE } from '../data/site.js'
import {
  addDays,
  daysInMonth,
  formatDate,
  hmToMinutes,
  monthLabel,
  parseKey,
  todayKey,
  toKey,
  weekdayOf,
  zonedToEpoch,
} from './time.js'

export const ALL_EVENTS = [...RECURRING_EVENTS, ...SPECIAL_EVENTS]
const BY_ID = new Map(ALL_EVENTS.map((event) => [event.id, event]))

export const getEvent = (id) => BY_ID.get(id)
export const categoryOf = (event) => CATEGORIES[event.category] ?? CATEGORIES.special
export const isRecurring = (event) => Boolean(event.schedule)

const ORDINALS = ['', '1st', '2nd', '3rd', '4th', '5th']
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_PLURAL = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']

export function nthWeekday(y, m, weekday, nth) {
  if (nth === -1) {
    const last = daysInMonth(y, m)
    const lastWeekday = weekdayOf(toKey(y, m, last))
    return toKey(y, m, last - ((lastWeekday - weekday + 7) % 7))
  }
  const firstWeekday = weekdayOf(toKey(y, m, 1))
  const day = 1 + ((weekday - firstWeekday + 7) % 7) + (nth - 1) * 7
  return day <= daysInMonth(y, m) ? toKey(y, m, day) : null
}

export function scheduleLabel(event) {
  const s = event.schedule
  if (!s) return null
  let label
  if (s.type === 'weekly') label = `Every ${s.days.map((d) => DAY_NAMES[d]).join(' & ')}`
  else label = `${s.nth === -1 ? 'Last' : ORDINALS[s.nth]} ${DAY_NAMES[s.day]} monthly`
  if (s.months?.length && s.months.length < 12) {
    const first = new Date(Date.UTC(2000, s.months[0] - 1, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    const last = new Date(Date.UTC(2000, s.months.at(-1) - 1, 1)).toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    label += ` · ${first}–${last}`
  }
  return label
}

export const dayPlural = (day) => DAY_PLURAL[day]

function makeOccurrence(event, date) {
  const start = hmToMinutes(event.time?.start)
  const end = hmToMinutes(event.time?.end)
  return {
    key: `${event.id}@${date}`,
    id: event.id,
    event,
    date,
    start,
    end,
    showEnd: event.time?.showEnd !== false,
    startsAt: zonedToEpoch(date, start ?? 0),
    endsAt: zonedToEpoch(date, end ?? (start != null ? start + 90 : 24 * 60 - 1)),
  }
}

function expandRecurring(event, from, to) {
  const out = []
  const s = event.schedule
  const skip = new Set(event.skip ?? [])
  const allowed = (key) => {
    if (skip.has(key)) return false
    if (event.from && key < event.from) return false
    if (event.until && key > event.until) return false
    if (s.months && !s.months.includes(parseKey(key).m)) return false
    return true
  }
  if (s.type === 'weekly') {
    for (let key = from; key <= to; key = addDays(key, 1)) {
      if (s.days.includes(weekdayOf(key)) && allowed(key)) out.push(makeOccurrence(event, key))
    }
  } else if (s.type === 'monthly') {
    let { y, m } = parseKey(from)
    const end = parseKey(to)
    while (y < end.y || (y === end.y && m <= end.m)) {
      const key = nthWeekday(y, m, s.day, s.nth)
      if (key && key >= from && key <= to && allowed(key)) out.push(makeOccurrence(event, key))
      m += 1
      if (m > 12) {
        m = 1
        y += 1
      }
    }
  }
  return out
}

function expandSpecial(event, from, to) {
  if (!event.date) return []
  const out = []
  const last = event.endDate ?? event.date
  for (let key = event.date; key <= last; key = addDays(key, 1)) {
    if (key >= from && key <= to) out.push({ ...makeOccurrence(event, key), multiDay: event.endDate != null })
  }
  return out
}

export function occurrencesBetween(from, to, events = ALL_EVENTS) {
  const list = []
  for (const event of events) {
    list.push(...(isRecurring(event) ? expandRecurring(event, from, to) : expandSpecial(event, from, to)))
  }
  return list.sort(
    (a, b) =>
      a.startsAt - b.startsAt ||
      Number(Boolean(b.event.featured)) - Number(Boolean(a.event.featured)) ||
      a.event.title.localeCompare(b.event.title),
  )
}

export function upcomingOccurrences({ now = Date.now(), days = 60, limit = Infinity, events = ALL_EVENTS } = {}) {
  const today = todayKey(now)
  return occurrencesBetween(today, addDays(today, days), events)
    .filter((occ) => occ.endsAt > now)
    .slice(0, limit)
}

export function nextOccurrence(event, now = Date.now(), horizon = 400) {
  return upcomingOccurrences({ now, days: horizon, limit: 1, events: [event] })[0] ?? null
}

export function occurrenceStatus(occ, now = Date.now()) {
  if (now >= occ.endsAt) return 'past'
  if (occ.start != null && now >= occ.startsAt) return 'live'
  return 'upcoming'
}

export function saveTheDates() {
  return SPECIAL_EVENTS.filter((event) => event.tba)
}

export function highlights(now = Date.now()) {
  const today = todayKey(now)
  return SPECIAL_EVENTS.filter((event) => event.date && (event.endDate ?? event.date) < today && (event.image || event.video)).sort(
    (a, b) => b.date.localeCompare(a.date),
  )
}

export function upcomingSpecials(now = Date.now()) {
  const today = todayKey(now)
  return SPECIAL_EVENTS.filter((event) => event.date && (event.endDate ?? event.date) >= today).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

export function matchesFilters(event, { categories = [], audience = 'all', query = '', online = false }) {
  if (categories.length && !categories.includes(event.category)) return false
  if (audience !== 'all' && !event.audience?.includes(audience) && !event.audience?.includes('everyone')) return false
  if (online && !event.online) return false
  if (query) {
    const haystack = [event.title, event.tagline, event.summary, event.location, categoryOf(event).label]
      .join(' ')
      .toLowerCase()
    if (!query.toLowerCase().split(/\s+/).every((word) => haystack.includes(word))) return false
  }
  return true
}

export function liveWindowStatus(now = Date.now()) {
  const today = todayKey(now)
  const weekday = weekdayOf(today)
  for (const window of SITE.liveWindows) {
    if (window.day !== weekday) continue
    const start = zonedToEpoch(today, hmToMinutes(window.start))
    const end = zonedToEpoch(today, hmToMinutes(window.end))
    if (now >= start && now < end) return { live: true, label: window.label }
  }
  let next = null
  for (let i = 0; i < 8 && !next; i += 1) {
    const key = addDays(today, i)
    for (const window of SITE.liveWindows) {
      if (window.day !== weekdayOf(key)) continue
      const start = zonedToEpoch(key, hmToMinutes(window.start))
      if (start > now && (!next || start < next.startsAt)) next = { startsAt: start, date: key, ...window }
    }
  }
  return { live: false, next }
}

export function eventPath(occ) {
  return isRecurring(occ.event) ? `/events/${occ.id}?date=${occ.date}` : `/events/${occ.id}`
}

export function groupByDate(occurrences) {
  const groups = new Map()
  for (const occ of occurrences) {
    if (!groups.has(occ.date)) groups.set(occ.date, [])
    groups.get(occ.date).push(occ)
  }
  return groups
}

export function specialDateLabel(event) {
  if (event.tba) {
    const [y, m] = event.tba.split('-').map(Number)
    return `${monthLabel(y, m)} · Dates TBA`
  }
  if (!event.date) return ''
  if (!event.endDate) return formatDate(event.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const start = parseKey(event.date)
  const end = parseKey(event.endDate)
  if (start.y === end.y && start.m === end.m) {
    return `${formatDate(event.date, { month: 'short', day: 'numeric' })}–${end.d}, ${end.y}`
  }
  return `${formatDate(event.date, { month: 'short', day: 'numeric' })} – ${formatDate(event.endDate, { month: 'short', day: 'numeric', year: 'numeric' })}`
}

// Every recurring series (anchored at its next date) plus dated special events, for calendar feeds.
export function calendarFeedItems(now = Date.now(), baseUrl = SITE.url) {
  const items = []
  for (const event of RECURRING_EVENTS) {
    const next = nextOccurrence(event, now)
    if (next) items.push({ event, date: next.date, url: `${baseUrl}/events/${event.id}`, series: true })
  }
  const cutoff = addDays(todayKey(now), -30)
  for (const event of SPECIAL_EVENTS) {
    if (!event.date || (event.endDate ?? event.date) < cutoff) continue
    for (let key = event.date; key <= (event.endDate ?? event.date); key = addDays(key, 1)) {
      items.push({ event, date: key, url: `${baseUrl}/events/${event.id}` })
    }
  }
  return items
}
