import { ArrowRight, MapPin, Radio } from 'lucide-react'
import { Link } from 'react-router'
import AddToCalendar from '../../components/AddToCalendar.jsx'
import { categoryOf, eventPath, occurrenceStatus } from '../../lib/events.js'
import { formatTime } from '../../lib/time.js'

export default function EventRow({ occurrence, now, headingLevel = 4 }) {
  const { event, start, end, showEnd } = occurrence
  const category = categoryOf(event)
  const status = occurrenceStatus(occurrence, now)
  const Heading = `h${headingLevel}`

  return (
    <li className={`ev-row${status === 'live' ? ' is-live' : ''}`} style={{ '--tile-accent': category.color }}>
      <div className="ev-row__time tabular">
        {start == null ? (
          <span className="ev-row__start">TBA</span>
        ) : (
          <>
            <span className="ev-row__start">{formatTime(start)}</span>
            {showEnd && end != null && <span className="ev-row__end">to {formatTime(end)}</span>}
          </>
        )}
      </div>
      <div className="ev-row__body">
        <p className="ev-row__cat">
          <span className="chip__dot" aria-hidden="true" />
          {category.label}
          {status === 'live' && <span className="flag flag--live">Happening now</span>}
          {event.online && (
            <span className="flag">
              <Radio aria-hidden="true" />
              Streamed
            </span>
          )}
        </p>
        <Heading className="ev-row__title">
          <Link to={eventPath(occurrence)} className="stretched-link">
            {event.title}
          </Link>
        </Heading>
        <p className="ev-row__meta">
          {event.tagline && <span>{event.tagline}</span>}
          <span className="ev-row__where">
            <MapPin aria-hidden="true" />
            {event.location ?? 'Upper Room'}
          </span>
        </p>
      </div>
      <div className="ev-row__actions">
        <AddToCalendar occurrence={occurrence} iconOnly className="btn btn--ghost btn--icon" />
        <ArrowRight aria-hidden="true" className="ev-row__go" />
      </div>
    </li>
  )
}
