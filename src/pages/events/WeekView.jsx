import { Link } from 'react-router'
import AddToCalendar from '../../components/AddToCalendar.jsx'
import { categoryOf, nextOccurrence, scheduleLabel } from '../../lib/events.js'
import { formatDate, formatTimeRange, hmToMinutes } from '../../lib/time.js'
import { EmptyState } from './ListView.jsx'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const startOf = (event) => hmToMinutes(event.time?.start) ?? 24 * 60

function timeLabel(event) {
  const start = hmToMinutes(event.time?.start)
  const end = event.time?.showEnd === false ? null : hmToMinutes(event.time?.end)
  return formatTimeRange(start, end)
}

function RhythmItem({ event, now, wide = false }) {
  const next = nextOccurrence(event, now)
  return (
    <li className={`ev-beat${wide ? ' ev-beat--wide' : ''}`} style={{ '--tile-accent': categoryOf(event).color }}>
      {wide && <p className="ev-beat__rule">{scheduleLabel(event)}</p>}
      <p className="ev-beat__time tabular">{timeLabel(event)}</p>
      <h4 className="ev-beat__name">
        <Link to={`/events/${event.id}`} className="stretched-link">
          {event.title}
        </Link>
      </h4>
      <p className="ev-beat__meta">
        {event.location}
        {event.online && ' · Streamed'}
      </p>
      {next && (
        <div className="ev-beat__foot">
          <span className="ev-beat__next tabular">Next: {formatDate(next.date, { month: 'short', day: 'numeric' })}</span>
          <AddToCalendar occurrence={next} iconOnly className="btn btn--ghost btn--icon btn--sm" />
        </div>
      )}
    </li>
  )
}

export default function WeekView({ events, now, onClear }) {
  const weekly = events.filter((event) => event.schedule?.type === 'weekly')
  const monthly = events
    .filter((event) => event.schedule?.type === 'monthly')
    .sort((a, b) => a.schedule.nth - b.schedule.nth || a.schedule.day - b.schedule.day || startOf(a) - startOf(b))

  if (!weekly.length && !monthly.length) return <EmptyState onClear={onClear} />

  return (
    <div className="ev-rhythm">
      {weekly.length > 0 && (
        <section aria-labelledby="ev-rhythm-week">
          <h3 id="ev-rhythm-week" className="ev-rhythm__title">
            Every week
          </h3>
          <ol className="ev-rhythm__week" role="list">
            {DAYS.map((name, day) => {
              const items = weekly.filter((event) => event.schedule.days.includes(day)).sort((a, b) => startOf(a) - startOf(b))
              return (
                <li key={name} className={`ev-rhythm__day${items.length ? '' : ' is-empty'}`}>
                  <p className="ev-rhythm__dayname">
                    <span aria-hidden="true">{name.slice(0, 3)}</span>
                    <span className="sr-only">{name}</span>
                  </p>
                  {items.length ? (
                    <ul role="list">
                      {items.map((event) => (
                        <RhythmItem key={event.id} event={event} now={now} />
                      ))}
                    </ul>
                  ) : (
                    <p className="ev-rhythm__rest">
                      <span className="ev-rhythm__rest-mark" aria-hidden="true" />
                      <span className="sr-only">Nothing weekly</span>
                    </p>
                  )}
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {monthly.length > 0 && (
        <section aria-labelledby="ev-rhythm-month">
          <h3 id="ev-rhythm-month" className="ev-rhythm__title">
            Every month
          </h3>
          <ul className="ev-rhythm__months" role="list">
            {monthly.map((event) => (
              <RhythmItem key={event.id} event={event} now={now} wide />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
