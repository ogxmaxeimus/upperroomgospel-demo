import { ArrowRight, MapPin, Radio } from 'lucide-react'
import { Link } from 'react-router'
import AddToCalendar from '../../components/AddToCalendar.jsx'
import Countdown from '../../components/Countdown.jsx'
import { occurrenceWhen } from '../../components/EventCard.jsx'
import { SITE } from '../../data/site.js'
import { categoryOf, eventPath, occurrenceStatus } from '../../lib/events.js'

export default function NextUp({ occurrence, now }) {
  if (!occurrence) return null
  const { event } = occurrence
  const category = categoryOf(event)
  const status = occurrenceStatus(occurrence, now)

  return (
    <section className="ev-next" style={{ '--tile-accent': category.color }} aria-labelledby="ev-next-title">
      <div className="ev-next__frame" aria-hidden="true" />
      <div className="ev-next__head">
        <span className="ev-next__label">
          <span className={status === 'live' ? 'live-dot' : 'ev-next__blip'} aria-hidden="true" />
          {status === 'live' ? 'Happening now' : 'Next up'}
        </span>
        <span className="ev-next__cat">{category.label}</span>
      </div>

      <h2 id="ev-next-title" className="ev-next__title">
        {event.title}
      </h2>
      {event.tagline && <p className="ev-next__tagline">{event.tagline}</p>}

      <p className="ev-next__when tabular">{occurrenceWhen(occurrence, now)} ET</p>
      <p className="ev-next__where">
        <MapPin aria-hidden="true" />
        {event.location}
        {event.online && (
          <>
            <span aria-hidden="true">·</span>
            <Radio aria-hidden="true" />
            Online too
          </>
        )}
      </p>

      {status === 'live' ? (
        event.online && (
          <a className="ev-next__live" href={SITE.social.youtubeLive} target="_blank" rel="noreferrer">
            <span className="live-dot" aria-hidden="true" />
            Join the live stream
          </a>
        )
      ) : (
        <Countdown to={occurrence.startsAt} className="ev-next__countdown" />
      )}

      <div className="ev-next__actions">
        <AddToCalendar occurrence={occurrence} className="btn btn--primary btn--sm" />
        <Link to={eventPath(occurrence)} className="btn btn--ghost btn--sm">
          Details
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
