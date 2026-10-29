import { MapPin, Radio } from 'lucide-react'
import { Link } from 'react-router'
import { categoryOf, eventPath, occurrenceStatus } from '../lib/events.js'
import { formatDate, formatTimeRange, parseKey, relativeDayLabel, todayKey } from '../lib/time.js'

export function DateBlock({ date, className = '' }) {
  return (
    <span className={`date-block ${className}`} aria-hidden="true">
      <span className="date-block__month">{formatDate(date, { month: 'short' })}</span>
      <span className="date-block__day tabular">{parseKey(date).d}</span>
      <span className="date-block__weekday">{formatDate(date, { weekday: 'short' })}</span>
    </span>
  )
}

export function occurrenceWhen(occurrence, now = Date.now()) {
  const { date, start, end, showEnd } = occurrence
  const day = relativeDayLabel(date, todayKey(now)) ?? formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })
  return `${day} · ${formatTimeRange(start, showEnd ? end : null)}`
}

export default function EventCard({ occurrence, now, headingLevel = 3 }) {
  const { event, date } = occurrence
  const category = categoryOf(event)
  const status = occurrenceStatus(occurrence, now)
  const Heading = `h${headingLevel}`

  return (
    <article className="event-card" style={{ '--tile-accent': category.color }}>
      <div className="event-card__top">
        <DateBlock date={date} />
        <span className="event-card__cat">
          <span className="chip__dot" aria-hidden="true" />
          {category.label}
        </span>
      </div>
      <Heading className="event-card__title">
        <Link to={eventPath(occurrence)} className="stretched-link">
          {event.title}
        </Link>
      </Heading>
      <p className="event-card__when tabular">
        <span className="sr-only">{formatDate(date)}, </span>
        {occurrenceWhen(occurrence, now)}
      </p>
      <p className="event-card__where">
        <MapPin aria-hidden="true" />
        {event.location ?? 'Upper Room'}
      </p>
      <div className="event-card__flags">
        {status === 'live' && <span className="flag flag--live">Happening now</span>}
        {event.online && (
          <span className="flag">
            <Radio aria-hidden="true" />
            Streamed
          </span>
        )}
      </div>
    </article>
  )
}
