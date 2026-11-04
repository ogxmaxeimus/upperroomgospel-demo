import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { AUDIENCES, CATEGORIES, RECURRING_EVENTS } from '../data/events.js'
import { useMotion } from '../hooks/useMotion.js'
import { useNow } from '../hooks/useNow.js'
import { usePage } from '../hooks/usePage.js'
import { ALL_EVENTS, groupByDate, matchesFilters, upcomingOccurrences } from '../lib/events.js'
import { monthLabel, todayKey, TZ } from '../lib/time.js'
import { Highlights, SaveTheDates, SubmitEvent, Subscribe } from './events/Extras.jsx'
import ListView from './events/ListView.jsx'
import MonthView from './events/MonthView.jsx'
import NextUp from './events/NextUp.jsx'
import Toolbar, { VIEWS } from './events/Toolbar.jsx'
import WeekStrip from './events/WeekStrip.jsx'
import WeekView from './events/WeekView.jsx'
import './events/events.css'

const HORIZON_STEP = 42
const MAX_HORIZON = 365
const FEATURED = ALL_EVENTS.filter((event) => event.featured)

const clockFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TZ,
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
})
const clockDate = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric' })

function RaleighClock() {
  const now = useNow(1000)
  return (
    <p className="ev-clock label-font" aria-hidden="true">
      <span className="ev-clock__dot" />
      Raleigh, NC
      <span className="ev-clock__sep">/</span>
      <span className="tabular">{clockFormat.format(now)}</span> ET
      <span className="ev-clock__date">
        <span className="ev-clock__sep">/</span> {clockDate.format(now)}
      </span>
    </p>
  )
}

const STATS = [
  { value: RECURRING_EVENTS.filter((e) => e.schedule.type === 'weekly').length, label: 'Weekly gatherings' },
  { value: RECURRING_EVENTS.filter((e) => e.schedule.type === 'monthly').length, label: 'Monthly gatherings' },
  { value: RECURRING_EVENTS.filter((e) => e.online).length, label: 'Streamed live' },
]

export default function Events() {
  usePage({
    id: 'events',
    themeColor: '#03060f',
    title: 'Events',
    description:
      'Every service, Bible study, youth event, outreach, and special event at the Upper Room. Searchable, filterable, and one tap from your calendar.',
  })

  const now = useNow(60000)
  const today = todayKey(now)
  const { enabled: motion } = useMotion()
  const [params, setParams] = useSearchParams()

  const view = VIEWS.some((v) => v.id === params.get('view')) ? params.get('view') : 'list'
  const monthParam = params.get('month') ?? ''
  const month = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthParam) ? monthParam : today.slice(0, 7)
  const catParam = params.get('cat') ?? ''
  const forParam = params.get('for')
  const online = params.get('online') === '1'
  const urlQuery = params.get('q') ?? ''

  const filters = useMemo(
    () => ({
      categories: catParam.split(',').filter((id) => CATEGORIES[id]),
      audience: AUDIENCES[forParam] ? forParam : 'all',
      online,
    }),
    [catParam, forParam, online],
  )

  const update = useCallback(
    (changes) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(changes)) {
            if (value == null || value === '' || (Array.isArray(value) && !value.length)) next.delete(key)
            else next.set(key, Array.isArray(value) ? value.join(',') : value)
          }
          return next
        },
        { replace: true, preventScrollReset: true },
      ),
    [setParams],
  )

  const [query, setQuery] = useState(urlQuery)
  const search = useDeferredValue(query.trim())
  useEffect(() => {
    if (query.trim() === urlQuery) return
    const timer = setTimeout(() => update({ q: query.trim() || null }), 350)
    return () => clearTimeout(timer)
  }, [query, urlQuery, update])

  const [horizon, setHorizon] = useState(HORIZON_STEP)

  const events = useMemo(() => ALL_EVENTS.filter((event) => matchesFilters(event, { ...filters, query: search })), [filters, search])
  const upcoming = useMemo(() => upcomingOccurrences({ now, days: horizon, events }), [now, horizon, events])
  const byDate = useMemo(() => groupByDate(upcoming), [upcoming])
  const nextUp = useMemo(() => upcomingOccurrences({ now, days: 60, limit: 1, events: FEATURED })[0], [now])

  const hasFilters = filters.categories.length > 0 || filters.audience !== 'all' || filters.online || query.trim() !== ''
  const clearFilters = () => {
    setQuery('')
    update({ cat: null, for: null, online: null, q: null })
  }

  const scrollTarget = useRef(null)
  const scrollToDay = useCallback(
    (key) => {
      const section = document.getElementById(`day-${key}`)
      if (!section) return
      scrollTarget.current = null
      section.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'start' })
      section.querySelector('a')?.focus({ preventScroll: true })
    },
    [motion],
  )
  useEffect(() => {
    if (view === 'list' && scrollTarget.current) scrollToDay(scrollTarget.current)
  }, [view, scrollToDay])

  const pickDay = (key) => {
    scrollTarget.current = key
    if (view !== 'list') update({ view: null })
    else scrollToDay(key)
  }

  const weeks = Math.round(horizon / 7)
  let summary
  if (view === 'month') {
    const [y, m] = month.split('-').map(Number)
    summary = `Showing ${monthLabel(y, m)}`
  } else if (view === 'week') {
    const count = events.filter((event) => event.schedule).length
    summary = `${count} recurring gathering${count === 1 ? '' : 's'}`
  } else {
    summary = `${upcoming.length} event${upcoming.length === 1 ? '' : 's'} in the next ${weeks} weeks`
  }

  return (
    <div className="pg-events">
      <header className="ev-hero">
        <div className="ev-hero__floor" aria-hidden="true" />
        <div className="ev-hero__glow" aria-hidden="true" />
        <div className="ev-hero__inner container--wide">
          <div className="ev-hero__copy">
            <RaleighClock />
            <h1 className="ev-hero__title">
              <span className="ev-hero__line">What’s</span>
              <span className="ev-hero__line ev-hero__line--outline">happening</span>
              <em className="ev-hero__sub">at the Upper Room.</em>
            </h1>
            <p className="ev-hero__lead">
              Services, Bible study, youth events, outreach, and special events, all in one place. Tap any event to
              add it to your calendar.
            </p>
            <dl className="ev-stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="ev-stats__item">
                  <dt>{stat.label}</dt>
                  <dd className="tabular">{String(stat.value).padStart(2, '0')}</dd>
                </div>
              ))}
            </dl>
          </div>
          <NextUp occurrence={nextUp} now={now} />
        </div>
        <div className="container--wide">
          <WeekStrip byDate={byDate} today={today} onPick={pickDay} />
        </div>
      </header>

      <section id="calendar" className="ev-calendar" aria-label="Event calendar">
        <Toolbar
          filters={filters}
          onChange={update}
          query={query}
          onQuery={setQuery}
          view={view}
          onView={(id) => update({ view: id === 'list' ? null : id })}
          summary={summary}
          hasFilters={hasFilters}
          onClear={clearFilters}
        />
        <div className="ev-calendar__body container--wide">
          {view === 'list' && (
            <ListView
              byDate={byDate}
              now={now}
              today={today}
              canLoadMore={horizon < MAX_HORIZON}
              onMore={() => setHorizon((h) => Math.min(MAX_HORIZON, h + HORIZON_STEP))}
              onClear={clearFilters}
            />
          )}
          {view === 'month' && (
            <MonthView
              month={month}
              onMonth={(m) => update({ month: m === today.slice(0, 7) ? null : m })}
              events={events}
              now={now}
              today={today}
            />
          )}
          {view === 'week' && <WeekView events={events} now={now} onClear={clearFilters} />}
        </div>
      </section>

      <SaveTheDates now={now} />
      <Subscribe />
      <Highlights now={now} />
      <SubmitEvent />
    </div>
  )
}
