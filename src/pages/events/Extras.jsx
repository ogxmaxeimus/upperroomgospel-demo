import { ArrowRight, BellRing, CalendarCheck, Download, Mail, Play } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import AddToCalendar from '../../components/AddToCalendar.jsx'
import { GoogleIcon } from '../../components/BrandIcons.jsx'
import Img, { imageMeta } from '../../components/Img.jsx'
import Lightbox from '../../components/Lightbox.jsx'
import Reveal from '../../components/Reveal.jsx'
import { SITE } from '../../data/site.js'
import { buildICS, downloadICS } from '../../lib/calendar.js'
import {
  calendarFeedItems,
  categoryOf,
  highlights,
  nextOccurrence,
  saveTheDates,
  specialDateLabel,
  upcomingSpecials,
} from '../../lib/events.js'
import { diffDays, formatDate, monthLabel, parseKey, todayKey } from '../../lib/time.js'

function Ticket({ event, now }) {
  const category = categoryOf(event)
  const next = event.date ? nextOccurrence(event, now) : null
  let stubTop
  let stubBig
  if (event.tba) {
    const [y, m] = event.tba.split('-').map(Number)
    stubTop = y
    stubBig = monthLabel(y, m, { month: 'short' })
  } else {
    stubTop = formatDate(event.date, { month: 'short' })
    stubBig = parseKey(event.date).d
  }
  const daysAway = event.date ? diffDays(todayKey(now), event.date) : null

  return (
    <li className="ticket" style={{ '--tile-accent': category.color }}>
      <div className="ticket__stub" aria-hidden="true">
        <span className="ticket__stub-top">{stubTop}</span>
        <span className="ticket__stub-big">{stubBig}</span>
        <span className="ticket__stub-foot">{event.tba ? 'Dates TBA' : daysAway > 0 ? `in ${daysAway} days` : 'Now'}</span>
      </div>
      <div className="ticket__body">
        <p className="ticket__kicker label-font">{event.tagline ?? category.label}</p>
        <h3 className="ticket__title">{event.title}</h3>
        <p className="ticket__date tabular">{specialDateLabel(event)}</p>
        <p className="ticket__summary">{event.summary}</p>
        <div className="ticket__actions">
          {next && <AddToCalendar occurrence={next} className="btn btn--primary btn--sm" />}
          <Link to={`/events/${event.id}`} className="btn btn--ghost btn--sm">
            Details
            <ArrowRight aria-hidden="true" />
          </Link>
          {event.link && (
            <Link to={event.link.to} className="text-link">
              {event.link.label}
            </Link>
          )}
        </div>
      </div>
    </li>
  )
}

export function SaveTheDates({ now }) {
  const items = [...upcomingSpecials(now), ...saveTheDates()]
  if (!items.length) return null
  return (
    <section className="ev-save section" aria-labelledby="ev-save-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">On the horizon</p>
          <h2 id="ev-save-title" className="h2">
            Save the date
          </h2>
        </Reveal>
        <ol className="ev-tickets" role="list">
          {items.map((event) => (
            <Ticket key={event.id} event={event} now={now} />
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Subscribe() {
  const host = import.meta.env.DEV ? new URL(SITE.url).host : window.location.host
  const feed = `webcal://${host}/calendar.ics`

  return (
    <section className="ev-sub section section--tight" aria-labelledby="ev-sub-title">
      <div className="container">
        <Reveal className="ev-sub__card">
          <BellRing aria-hidden="true" className="ev-sub__icon" />
          <div className="ev-sub__copy">
            <h2 id="ev-sub-title" className="h3">
              Never miss a Sunday.
            </h2>
            <p>
              Subscribe once and every service, Bible study, and ministry gathering shows up in your phone’s calendar,
              then stays up to date when plans change.
            </p>
          </div>
          <div className="ev-sub__actions">
            <a className="btn btn--primary" href={feed}>
              <CalendarCheck aria-hidden="true" />
              Subscribe on iPhone / Mac / Outlook
            </a>
            <a
              className="btn btn--ghost"
              href={`https://calendar.google.com/calendar/render?cid=${encodeURIComponent(feed)}`}
              target="_blank"
              rel="noreferrer"
            >
              <GoogleIcon />
              Subscribe in Google Calendar
            </a>
            <button
              type="button"
              className="text-link"
              onClick={() => downloadICS('upper-room-events.ics', buildICS(calendarFeedItems()))}
            >
              <Download aria-hidden="true" />
              Or download a one-time .ics file
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Highlights({ now }) {
  const items = highlights(now)
  const withImages = items.filter((event) => event.image)
  const slides = withImages.map((event) => ({
    ...imageMeta(event.image),
    caption: `${event.title} · ${specialDateLabel(event)}`,
  }))
  const [index, setIndex] = useState(null)
  if (!items.length) return null

  return (
    <section className="ev-highlights section" aria-labelledby="ev-hl-title">
      <div className="container--wide">
        <Reveal className="section-head section-head--split">
          <div>
            <p className="eyebrow">Rewind</p>
            <h2 id="ev-hl-title" className="h2">
              Recent highlights
            </h2>
          </div>
          <p className="muted">A look back at what God has been doing at the Upper Room this year.</p>
        </Reveal>
      </div>
      <ol className="ev-rail" role="list">
        {items.map((event) => {
          const slide = withImages.indexOf(event)
          return (
            <li key={event.id} className="ev-rail__item" style={{ '--tile-accent': categoryOf(event).color }}>
              {event.image ? (
                <button type="button" className="ev-rail__thumb" onClick={() => setIndex(slide)}>
                  <Img name={event.image} alt="" />
                  <span className="sr-only">View flyer: {event.title}</span>
                </button>
              ) : (
                <Link to={`/events/${event.id}`} className="ev-rail__thumb ev-rail__thumb--video">
                  <img
                    src={`https://i.ytimg.com/vi/${event.video}/hqdefault.jpg`}
                    alt=""
                    width="480"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="ev-rail__play" aria-hidden="true">
                    <Play />
                  </span>
                  <span className="sr-only">Watch the recap: {event.title}</span>
                </Link>
              )}
              <p className="ev-rail__date label-font">{specialDateLabel(event)}</p>
              <h3 className="ev-rail__title">
                <Link to={`/events/${event.id}`}>{event.title}</Link>
              </h3>
            </li>
          )
        })}
      </ol>
      <Lightbox items={slides} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  )
}

const SUBMIT_BODY = `Ministry / department:
Event name:
Date(s):
Start and end time:
Location:
Who it's for:
Short description:
Contact person and phone:
Flyer attached? (yes/no)`

export function SubmitEvent() {
  const href = `mailto:${SITE.email}?subject=${encodeURIComponent('Event for the website calendar')}&body=${encodeURIComponent(SUBMIT_BODY)}`
  return (
    <section className="ev-submit section section--tight">
      <div className="container ev-submit__inner">
        <p>
          <strong>Ministry leader?</strong> Send your event to the church office and we’ll add it to the calendar.
        </p>
        <a className="btn btn--ghost btn--sm" href={href}>
          <Mail aria-hidden="true" />
          Submit an event
        </a>
      </div>
    </section>
  )
}
