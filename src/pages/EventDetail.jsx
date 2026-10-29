import { ArrowLeft, ArrowRight, CalendarClock, MapPin, Navigation, Radio, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import AddToCalendar from '../components/AddToCalendar.jsx'
import Countdown from '../components/Countdown.jsx'
import EventCard from '../components/EventCard.jsx'
import Img, { imageMeta } from '../components/Img.jsx'
import Lightbox from '../components/Lightbox.jsx'
import LiteYouTube from '../components/LiteYouTube.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { AUDIENCES } from '../data/events.js'
import { fullAddress, SITE } from '../data/site.js'
import { useNow } from '../hooks/useNow.js'
import { usePage } from '../hooks/usePage.js'
import { useSermons } from '../hooks/useSermons.js'
import {
  ALL_EVENTS,
  categoryOf,
  eventPath,
  getEvent,
  isRecurring,
  nextOccurrence,
  occurrencesBetween,
  occurrenceStatus,
  scheduleLabel,
  specialDateLabel,
  upcomingOccurrences,
} from '../lib/events.js'
import { formatDate, formatTimeRange, offsetString, pad, parseKey } from '../lib/time.js'
import './events/events.css'
import './event-detail.css'

const KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function pickOccurrence(event, requested, now) {
  if (!event || event.tba) return null
  if (isRecurring(event)) {
    if (requested && KEY_PATTERN.test(requested)) {
      const match = occurrencesBetween(requested, requested, [event])[0]
      if (match) return match
    }
    return nextOccurrence(event, now)
  }
  const days = occurrencesBetween(event.date, event.endDate ?? event.date, [event])
  return days.find((occ) => occ.endsAt > now) ?? days[0] ?? null
}

function isoStamp(occ, minutes) {
  if (minutes == null) return occ.date
  return `${occ.date}T${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00${offsetString(occ.date, minutes)}`
}

function structuredData(event, occ) {
  if (!occ) return null
  const online = event.online
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.summary,
    startDate: isoStamp(occ, occ.start),
    ...(occ.end != null && { endDate: isoStamp(occ, occ.end) }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: online
      ? 'https://schema.org/MixedEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: [
      {
        '@type': 'Place',
        name: `${SITE.name}${event.location ? ` · ${event.location}` : ''}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.state,
          postalCode: SITE.address.zip,
          addressCountry: 'US',
        },
      },
      ...(online ? [{ '@type': 'VirtualLocation', url: SITE.social.youtubeLive }] : []),
    ],
    organizer: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    isAccessibleForFree: true,
  }
}

function NotFoundEvent() {
  return (
    <div className="pg-event">
      <section className="evd-missing container">
        <p className="eyebrow">Event not found</p>
        <h1 className="h1">This event isn’t on the calendar.</h1>
        <p className="lead">It may have been moved or removed. Here’s everything that’s coming up.</p>
        <Link to="/events" className="btn btn--primary">
          <ArrowLeft aria-hidden="true" />
          Back to all events
        </Link>
      </section>
    </div>
  )
}

export default function EventDetail() {
  const { eventId } = useParams()
  const [params] = useSearchParams()
  const event = getEvent(eventId)
  const now = useNow(30000)
  const requested = params.get('date')
  const [lightbox, setLightbox] = useState(null)
  const sermons = useSermons()

  usePage({
    id: 'event',
    themeColor: '#03060f',
    title: event?.title ?? 'Event not found',
    description: event?.summary,
  })

  const occurrence = useMemo(() => pickOccurrence(event, requested, now), [event, requested, now])
  const upcomingDates = useMemo(
    () => (event && isRecurring(event) ? upcomingOccurrences({ now, days: 120, limit: 8, events: [event] }) : []),
    [event, now],
  )
  const related = useMemo(
    () =>
      event
        ? upcomingOccurrences({
            now,
            days: 45,
            events: ALL_EVENTS.filter((e) => e.id !== event.id && e.category === event.category),
          })
            .filter((occ, index, list) => list.findIndex((o) => o.id === occ.id) === index)
            .slice(0, 3)
        : [],
    [event, now],
  )

  if (!event) return <NotFoundEvent />

  const category = categoryOf(event)
  const status = occurrence ? occurrenceStatus(occurrence, now) : 'tba'
  const nextDate = status === 'past' && isRecurring(event) ? nextOccurrence(event, now) : null
  const gallery = (event.gallery ?? (event.image ? [event.image] : [])).map((name) => imageMeta(name)).filter(Boolean)
  const audience = (event.audience ?? []).map((id) => AUDIENCES[id]).filter(Boolean)
  const ld = structuredData(event, occurrence)
  const inPerson = event.location !== 'Conference call'
  const replay = !event.video && event.replay ? sermons.find((video) => video.kind === event.replay) : null

  return (
    <div className="pg-event" style={{ '--tile-accent': category.color }}>
      <header className="evd-hero">
        <div className="evd-hero__glow" aria-hidden="true" />
        <div className="container evd-hero__inner">
          <nav className="evd-crumbs" aria-label="Breadcrumb">
            <Link to="/events">
              <ArrowLeft aria-hidden="true" />
              All events
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={`/events?cat=${event.category}`}>{category.label}</Link>
          </nav>

          <div className="evd-hero__grid">
            <div>
              <p className="evd-kicker">
                <span className="chip__dot" aria-hidden="true" />
                {isRecurring(event) ? scheduleLabel(event) : category.label}
              </p>
              <h1 className="evd-title">{event.title}</h1>
              {event.tagline && <p className="evd-tagline">{event.tagline}</p>}

              <div className="evd-actions">
                {occurrence && status !== 'past' && <AddToCalendar occurrence={occurrence} className="btn btn--primary" />}
                {event.online && status === 'live' && (
                  <a className="btn btn--primary" href={SITE.social.youtubeLive} target="_blank" rel="noreferrer">
                    <Radio aria-hidden="true" />
                    Watch live
                  </a>
                )}
                <ShareButton title={event.title} text={event.summary} className="btn btn--ghost" />
                {inPerson && (
                  <a className="btn btn--ghost" href={SITE.directionsUrl} target="_blank" rel="noreferrer">
                    <Navigation aria-hidden="true" />
                    Directions
                  </a>
                )}
              </div>
            </div>

            <aside className="evd-when" aria-label="When and where">
              {occurrence ? (
                <>
                  <div className="evd-when__date">
                    <span className="evd-when__month">{formatDate(occurrence.date, { month: 'short' })}</span>
                    <span className="evd-when__day tabular">{parseKey(occurrence.date).d}</span>
                    <span className="evd-when__weekday">{formatDate(occurrence.date, { weekday: 'long' })}</span>
                  </div>
                  <dl className="evd-facts">
                    <div>
                      <dt>
                        <CalendarClock aria-hidden="true" />
                        When
                      </dt>
                      <dd>
                        {event.endDate ? specialDateLabel(event) : formatDate(occurrence.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                        <br />
                        <span className="tabular">
                          {formatTimeRange(occurrence.start, occurrence.showEnd ? occurrence.end : null)}
                          {occurrence.start != null && ' ET'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <MapPin aria-hidden="true" />
                        Where
                      </dt>
                      <dd>
                        {event.location}
                        {inPerson && (
                          <>
                            <br />
                            <span className="evd-facts__muted">{fullAddress}</span>
                          </>
                        )}
                      </dd>
                    </div>
                    {audience.length > 0 && (
                      <div>
                        <dt>
                          <Users aria-hidden="true" />
                          For
                        </dt>
                        <dd>{audience.join(' · ')}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="evd-status">
                    {status === 'upcoming' && <Countdown to={occurrence.startsAt} />}
                    {status === 'live' && (
                      <p className="evd-status__live">
                        <span className="live-dot" aria-hidden="true" />
                        Happening now
                      </p>
                    )}
                    {status === 'past' && (
                      <p className="evd-status__past">
                        This {isRecurring(event) ? 'date' : 'event'} has passed.{' '}
                        {nextDate ? (
                          <Link to={eventPath(nextDate)} className="text-link">
                            Next: {formatDate(nextDate.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        ) : (
                          <Link to="/events" className="text-link">
                            See what’s next
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        )}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="evd-when__tba">
                  <span className="evd-when__month">Save the date</span>
                  <span className="evd-when__tba-big">{specialDateLabel(event)}</span>
                  <p>Dates and details are coming soon. Check back here or subscribe to the calendar.</p>
                </div>
              )}
            </aside>
          </div>
        </div>
      </header>

      <div className="container evd-body">
        <article className="evd-main">
          <h2 className="evd-h2">About this {status === 'past' && !isRecurring(event) ? 'event' : 'gathering'}</h2>
          <p className="evd-summary">{event.summary}</p>
          {event.details?.length > 0 && (
            <ul className="evd-details" role="list">
              {event.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}

          {event.video && (
            <div className="evd-media">
              <h2 className="evd-h2">Watch</h2>
              <LiteYouTube id={event.video} title={event.title} />
            </div>
          )}

          {replay && (
            <div className="evd-media">
              <h2 className="evd-h2">Missed one? Catch the latest</h2>
              <LiteYouTube id={replay.id} title={replay.displayTitle} />
              <p className="evd-media__caption">
                {replay.displayTitle} · {formatDate(replay.dateKey, { month: 'long', day: 'numeric' })}
                <Link to="/watch" className="text-link">
                  All messages
                  <ArrowRight aria-hidden="true" />
                </Link>
              </p>
            </div>
          )}

          {gallery.length > 0 && (
            <div className="evd-media">
              <h2 className="evd-h2">{gallery.length > 1 ? 'Flyers' : 'Flyer'}</h2>
              <ul className="evd-gallery" role="list">
                {gallery.map((image, index) => (
                  <li key={image.src}>
                    <button type="button" className="evd-gallery__btn" onClick={() => setLightbox(index)}>
                      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
                      <span className="sr-only">Enlarge</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Lightbox items={gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
            </div>
          )}
        </article>

        <aside className="evd-side">
          {upcomingDates.length > 0 && (
            <section className="evd-card">
              <h2 className="evd-card__title">Upcoming dates</h2>
              <ul className="evd-dates" role="list">
                {upcomingDates.map((occ) => (
                  <li key={occ.key}>
                    <Link
                      to={eventPath(occ)}
                      className="evd-dates__link"
                      aria-current={occurrence?.date === occ.date ? 'date' : undefined}
                      preventScrollReset
                    >
                      <span className="tabular">{formatDate(occ.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="evd-dates__time tabular">{formatTimeRange(occ.start, null)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {inPerson && (
            <section className="evd-card">
              <h2 className="evd-card__title">First time at the Upper Room?</h2>
              <p>We’d love to meet you. Here’s where to park, what to expect, and what’s available for your kids.</p>
              <Link to="/im-new" className="text-link">
                Plan your visit
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>
          )}

          {event.link && (
            <section className="evd-card evd-card--accent">
              <h2 className="evd-card__title">Get connected</h2>
              <Link to={event.link.to} className="text-link">
                {event.link.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </section>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="evd-related container" aria-labelledby="evd-related-title">
          <h2 id="evd-related-title" className="evd-h2">
            More {category.label.toLowerCase()} coming up
          </h2>
          <div className="evd-related__grid">
            {related.map((occ) => (
              <EventCard key={occ.key} occurrence={occ} now={now} />
            ))}
          </div>
        </section>
      )}

      {ld && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />}
    </div>
  )
}
