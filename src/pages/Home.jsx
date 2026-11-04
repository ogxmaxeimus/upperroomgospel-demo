import { ArrowRight, ArrowUpRight, Baby, HandHeart, MapPin, Play, Radio, SquareParking } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link } from 'react-router'
import AddToCalendar from '../components/AddToCalendar.jsx'
import Countdown from '../components/Countdown.jsx'
import EmberField from '../components/EmberField.jsx'
import EventCard, { occurrenceWhen } from '../components/EventCard.jsx'
import Img from '../components/Img.jsx'
import { nextService } from '../components/LiveBadge.jsx'
import LiteYouTube from '../components/LiteYouTube.jsx'
import { LogoMark } from '../components/Logo.jsx'
import Marquee from '../components/Marquee.jsx'
import Reveal from '../components/Reveal.jsx'
import { DEPARTMENTS } from '../data/ministries.js'
import { SITE } from '../data/site.js'
import { useNow } from '../hooks/useNow.js'
import { usePage } from '../hooks/usePage.js'
import { usePointerGlow } from '../hooks/usePointerGlow.js'
import { useSermons } from '../hooks/useSermons.js'
import { liveWindowStatus, occurrenceStatus, upcomingOccurrences } from '../lib/events.js'
import { CURRENT_SERIES } from '../lib/sermons.js'
import { TZ } from '../lib/time.js'
import './home.css'

const publishedFormat = new Intl.DateTimeFormat('en-US', { timeZone: TZ, month: 'long', day: 'numeric', year: 'numeric' })

const PILLARS = ['Worship', 'The Word', 'Prayer', 'Fellowship', 'Evangelism', 'Impact Saturdays', 'Keep God First']

function NextServiceBand({ now }) {
  const live = liveWindowStatus(now)
  const next = nextService(now)
  if (!next) return null
  const status = occurrenceStatus(next, now)

  return (
    <section className="home-next" aria-label="Next service">
      <div className="home-next__inner container--wide">
        {live.live ? (
          <>
            <div className="home-next__copy">
              <p className="home-next__label">
                <span className="live-dot" aria-hidden="true" />
                Live now
              </p>
              <p className="home-next__title">{live.label} is streaming</p>
            </div>
            <a className="btn btn--primary btn--lg" href={SITE.social.youtubeLive} target="_blank" rel="noreferrer">
              <Radio aria-hidden="true" />
              Join the live stream
            </a>
          </>
        ) : (
          <>
            <div className="home-next__copy">
              <p className="home-next__label">{status === 'live' ? 'In service now' : 'Next service'}</p>
              <p className="home-next__title">{next.event.title}</p>
              <p className="home-next__when tabular">{occurrenceWhen(next, now)} ET</p>
            </div>
            {status === 'live' ? (
              <p className="home-next__now">Come on in. We’re worshipping right now.</p>
            ) : (
              <Countdown to={next.startsAt} className="home-next__countdown" />
            )}
            <div className="home-next__actions">
              <AddToCalendar occurrence={next} className="btn btn--primary btn--sm" />
              <a className="btn btn--ghost btn--sm" href={SITE.directionsUrl} target="_blank" rel="noreferrer">
                <MapPin aria-hidden="true" />
                Directions
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function MinistryTile({ dept, className = '' }) {
  const ref = useRef(null)
  usePointerGlow(ref)
  return (
    <Link ref={ref} to={dept.to} className={`home-tile glow-follow ${className}`} style={{ '--tile-accent': dept.accent }}>
      <Img name={dept.image} alt="" className="home-tile__img" />
      <span className="home-tile__shade" aria-hidden="true" />
      <span className="home-tile__body">
        <span className="home-tile__kicker">{dept.kicker}</span>
        <span className="home-tile__name">{dept.name}</span>
        <span className="home-tile__blurb">{dept.blurb}</span>
      </span>
      <ArrowUpRight aria-hidden="true" className="home-tile__arrow" />
    </Link>
  )
}

export default function Home() {
  usePage({
    id: 'home',
    themeColor: '#040915',
    description:
      'Upper Room Church of God in Christ in Raleigh, NC. Sunday worship at 8 & 11 AM and Thursday Bible Study at 7:30 PM, in person and live online.',
  })

  const now = useNow(30000)
  const videos = useSermons()
  const latest = videos.find((video) => video.kind === 'service') ?? videos[0]
  const upcoming = useMemo(() => upcomingOccurrences({ now, days: 21, limit: 8 }), [now])
  const live = liveWindowStatus(now)

  return (
    <div className="pg-home">
      <section className="home-hero">
        <div className="home-hero__media" aria-hidden="true">
          <video
            ref={(el) => {
              if (el && matchMedia('(prefers-reduced-motion: reduce)').matches) el.pause()
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/video/hero-poster.jpg"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <EmberField className="home-hero__embers" />
        <div className="home-hero__inner container--wide">
          <div className="home-hero__hud label-font" aria-hidden="true">
            <span>Raleigh · North Carolina</span>
            <span className="home-hero__hud-line" />
            <span>Sun 8 &amp; 11 AM · Thu 7:30 PM</span>
          </div>
          <h1 className="home-hero__title">
            <span className="home-hero__name" translate="no">
              Upper Room Church of God in Christ
            </span>
          </h1>
          <p className="home-hero__lead">
            A Spirit-filled church family in Raleigh, North Carolina, pastored by Bishop Patrick L. Wooden, Sr. Come as
            you are. We saved you a seat.
          </p>
          <div className="home-hero__ctas">
            <Link to="/im-new" className="btn btn--primary btn--lg">
              Plan Your Visit
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link to="/watch" className="btn btn--glass btn--lg">
              {live.live ? <span className="live-dot" aria-hidden="true" /> : <Play aria-hidden="true" />}
              {live.live ? 'Watch Live Now' : 'Watch Online'}
            </Link>
          </div>
        </div>
        <ul className="home-hero__services container--wide" role="list" aria-label="Service times">
          {SITE.services.map((service) => (
            <li key={service.id} className="home-hero__service">
              <span className="home-hero__service-day">{service.day}</span>
              <span className="home-hero__service-time tabular">{service.time}</span>
              <span className="home-hero__service-label">
                {service.label}
                <span>{service.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <NextServiceBand now={now} />

      <section className="home-welcome section" aria-labelledby="home-welcome-title">
        <div className="container home-welcome__grid">
          <Reveal className="home-welcome__media" variant="scale">
            <Img name="greeting" alt="A church mother warmly greeting a visitor outside the Upper Room" />
            <p className="home-welcome__badge label-font">All are welcome</p>
          </Reveal>
          <div className="home-welcome__copy">
            <Reveal>
              <p className="eyebrow">New here?</p>
              <h2 id="home-welcome-title" className="h2 display">
                We saved you <em className="accent-word">a seat.</em>
              </h2>
              <p className="lead">
                We welcome everyone to our church, including all ethnic groups. Here’s what to know before your first
                visit.
              </p>
            </Reveal>
            <ul className="home-facts" role="list">
              <Reveal as="li" delay={80}>
                <SquareParking aria-hidden="true" />
                <span>
                  <strong>Parking</strong>
                  Back lot for the 8 AM service unless you have special needs. Both lots are open at 11 AM.
                </span>
              </Reveal>
              <Reveal as="li" delay={160}>
                <Baby aria-hidden="true" />
                <span>
                  <strong>Your kids</strong>
                  Children’s Church (ages 4–11) during the 8 AM service, plus nursing stations and a room for little
                  ones.
                </span>
              </Reveal>
              <Reveal as="li" delay={240}>
                <HandHeart aria-hidden="true" />
                <span>
                  <strong>Need anything?</strong>
                  Our hospitality team and ushers are ready to help you find a seat.
                </span>
              </Reveal>
            </ul>
            <Reveal className="home-welcome__ctas" delay={300}>
              <Link to="/im-new" className="btn btn--primary">
                Plan your visit
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link to="/beliefs" className="text-link">
                What we believe
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="home-events section" aria-labelledby="home-events-title">
        <div className="container--wide">
          <Reveal className="section-head section-head--split">
            <div>
              <p className="eyebrow">Happening soon</p>
              <h2 id="home-events-title" className="h2 display">
                Life at the <em className="accent-word">Upper Room</em>
              </h2>
            </div>
            <div className="home-events__aside">
              <p className="muted">Worship, Bible study, youth events, outreach: there’s always a place to plug in.</p>
              <Link to="/events" className="btn btn--primary">
                Open the full calendar
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
        <ol className="home-events__rail" role="list">
          {upcoming.map((occurrence) => (
            <li key={occurrence.key}>
              <EventCard occurrence={occurrence} now={now} />
            </li>
          ))}
          <li>
            <Link to="/events" className="home-events__more">
              <span>See every event</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </li>
        </ol>
      </section>

      {latest && (
        <section className="home-watch section" aria-labelledby="home-watch-title">
          <div className="container--wide home-watch__grid">
            <Reveal className="home-watch__player" variant="scale">
              <LiteYouTube id={latest.id} title={latest.displayTitle} />
            </Reveal>
            <Reveal className="home-watch__copy" delay={120}>
              <p className="eyebrow">Latest message</p>
              <h2 id="home-watch-title" className="home-watch__title">
                {latest.displayTitle}
              </h2>
              <p className="muted">
                {latest.speaker} · {publishedFormat.format(new Date(latest.published))}
              </p>
              <div className="home-series">
                <p className="home-series__label label-font">Current series · {CURRENT_SERIES.scripture}</p>
                <p className="home-series__name accent-word">{CURRENT_SERIES.name}</p>
                <ol className="home-series__steps" role="list">
                  {CURRENT_SERIES.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="home-watch__ctas">
                <Link to="/watch" className="btn btn--primary">
                  More messages
                  <ArrowRight aria-hidden="true" />
                </Link>
                <a className="btn btn--ghost" href={SITE.social.youtubeSubscribe} target="_blank" rel="noreferrer">
                  Subscribe on YouTube
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <div className="home-marquee" aria-hidden="true">
        <Marquee speed={46}>
          {PILLARS.map((word) => (
            <span key={word} className="home-marquee__item">
              {word}
              <LogoMark />
            </span>
          ))}
        </Marquee>
      </div>

      <section className="home-ministries section" aria-labelledby="home-ministries-title">
        <div className="container--wide">
          <Reveal className="section-head section-head--split">
            <div>
              <p className="eyebrow">Get connected</p>
              <h2 id="home-ministries-title" className="h2 display">
                Find your <em className="accent-word">place.</em>
              </h2>
            </div>
            <p className="muted">
              Upper Room offers many opportunities for fellowship. No matter what your gifts are, you’ll discover an
              opportunity to develop and use them for the Lord.
            </p>
          </Reveal>
          <div className="home-tiles">
            <MinistryTile dept={DEPARTMENTS.youth} className="home-tile--wide" />
            <MinistryTile dept={DEPARTMENTS.men} />
            <MinistryTile dept={DEPARTMENTS.women} />
            <MinistryTile dept={DEPARTMENTS.music} />
            <MinistryTile dept={DEPARTMENTS.evangelism} />
          </div>
          <Reveal className="home-ministries__more">
            <Link to="/ministries" className="btn btn--ghost btn--lg">
              Browse all 40+ groups
              <ArrowRight aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="home-pastor section" aria-labelledby="home-pastor-title">
        <div className="container home-pastor__grid">
          <Reveal className="home-pastor__media" variant="scale">
            <Img name="bishopPulpit" alt="Bishop Patrick L. Wooden, Sr. preaching from the pulpit" />
          </Reveal>
          <Reveal className="home-pastor__copy" delay={120}>
            <p className="eyebrow" id="home-pastor-title">
              Our pastor
            </p>
            <blockquote className="home-pastor__quote">
              <p>“I love you enough to tell you the truth.”</p>
              <footer>Bishop Patrick L. Wooden, Sr.</footer>
            </blockquote>
            <p className="lead">
              For nearly four decades, Bishop Wooden has led the Upper Room with love, compassion, strength, and sincerity
              as a “watchman on the wall” and a voice for the voiceless.
            </p>
            <div className="home-pastor__links">
              <Link to="/about/bishop-wooden" className="btn btn--primary">
                Meet Bishop Wooden
              </Link>
              <Link to="/about/first-lady-wooden" className="btn btn--ghost">
                Meet First Lady Wooden
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="home-give section--tight" aria-labelledby="home-give-title">
        <div className="container">
          <Reveal className="home-give__card">
            <div>
              <p className="eyebrow">Generosity</p>
              <h2 id="home-give-title" className="h3">
                However God calls you to give, we make it simple.
              </h2>
            </div>
            <div className="home-give__actions">
              <a className="btn btn--primary" href={SITE.giving.funds[0].url} target="_blank" rel="noreferrer">
                Give online
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="btn btn--ghost" href={`sms:${SITE.giving.textNumber.raw}?&body=Give`}>
                Text “Give” to {SITE.giving.textNumber.display}
              </a>
              <Link to="/give#why" className="text-link">
                Why we give
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
