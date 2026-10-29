import { ArrowUpRight, Play, Radio, Tv } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import AddToCalendar from '../components/AddToCalendar.jsx'
import { FacebookIcon, YouTubeIcon } from '../components/BrandIcons.jsx'
import Countdown from '../components/Countdown.jsx'
import Img from '../components/Img.jsx'
import LiteYouTube from '../components/LiteYouTube.jsx'
import Reveal from '../components/Reveal.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { SITE } from '../data/site.js'
import { useMotion } from '../hooks/useMotion.js'
import { useNow } from '../hooks/useNow.js'
import { usePage } from '../hooks/usePage.js'
import { useSermons } from '../hooks/useSermons.js'
import { getEvent, liveWindowStatus, nextOccurrence } from '../lib/events.js'
import { CURRENT_SERIES, SERMON_KINDS } from '../lib/sermons.js'
import { formatDate, formatTime, hmToMinutes, relativeDayLabel, todayKey } from '../lib/time.js'
import { CHANNEL_ID } from '../lib/youtube-feed.js'
import './watch.css'

const CHANNEL_NAME = 'God First Official Channel'
const DAY_NAMES = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const viewsLabel = (views) => (views ? `${compact.format(views)} views` : null)
const shortDate = (key) => formatDate(key, { month: 'short', day: 'numeric', year: 'numeric' })

const SERIES_PHRASE = /\b(a\s+)?faith that behave[sd]?\b/i

function seriesEpisodes(videos) {
  const episodes = new Map()
  for (const video of videos) {
    if (!CURRENT_SERIES.match.test(video.title)) continue
    const rest = video.displayTitle.replace(SERIES_PHRASE, '').toLowerCase()
    const step = CURRENT_SERIES.steps.find((name) => rest.includes(name.toLowerCase()))
    if (step && !episodes.has(step)) episodes.set(step, video)
  }
  return episodes
}

function dayPhrase(date, now) {
  return relativeDayLabel(date, todayKey(now)) ?? formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })
}

function OnAirBar({ now, live, onWatchLive }) {
  if (live.live) {
    return (
      <div className="wt-onair is-live">
        <div className="container--wide wt-onair__inner">
          <span className="wt-onair__lamp" aria-hidden="true">
            On air
          </span>
          <p className="wt-onair__text" role="status">
            <strong>{live.label}</strong> is streaming live right now.
          </p>
          <button type="button" className="btn btn--live btn--sm" onClick={onWatchLive}>
            <Radio aria-hidden="true" />
            Watch live
          </button>
        </div>
      </div>
    )
  }

  const { next } = live
  if (!next) return null
  const occurrence = nextOccurrence(getEvent(next.eventId), now)

  return (
    <div className="wt-onair">
      <div className="container--wide wt-onair__inner">
        <span className="wt-onair__lamp" aria-hidden="true">
          On air
        </span>
        <p className="wt-onair__text">
          <span className="wt-onair__label">Next live</span>
          <strong>{next.label}</strong>
          <span className="wt-onair__when">
            {dayPhrase(next.date, now)} · {formatTime(hmToMinutes(next.start))} ET
          </span>
        </p>
        <Countdown to={next.startsAt} className="wt-onair__count" label={`${next.label} goes live in`} />
        {occurrence && <AddToCalendar occurrence={occurrence} label="Remind me" className="btn btn--ghost btn--sm" />}
      </div>
    </div>
  )
}

function LiveScreen({ label, autoplay }) {
  const [active, setActive] = useState(autoplay)
  if (active) {
    return (
      <div className="lite-yt is-active">
        <iframe
          src={`https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}&autoplay=1&rel=0&playsinline=1`}
          title={`${label} live stream`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <button type="button" className="lite-yt wt-live-poster" onClick={() => setActive(true)}>
      <Img name="stageWide" alt="" priority />
      <span className="lite-yt__shade" aria-hidden="true" />
      <span className="wt-live-poster__badge" aria-hidden="true">
        <span className="live-dot" />
        Live now
      </span>
      <span className="lite-yt__play" aria-hidden="true">
        <Play />
      </span>
      <span className="sr-only">Play the live stream: {label}</span>
    </button>
  )
}

function Equalizer() {
  return (
    <span className="wt-eq" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export default function Watch() {
  usePage({
    id: 'watch',
    themeColor: '#060509',
    title: 'Watch',
    description:
      'Watch the Upper Room live every Sunday at 11 AM and Thursday at 7:30 PM ET, or catch up on recent services, Bible studies, and messages from Bishop Patrick L. Wooden, Sr.',
  })

  const now = useNow(30000)
  const live = liveWindowStatus(now)
  const videos = useSermons()
  const { enabled: motion } = useMotion()
  const [params, setParams] = useSearchParams()
  const [kind, setKind] = useState('all')
  const [autoplayId, setAutoplayId] = useState(null)
  const screenRef = useRef(null)
  const titleRef = useRef(null)

  const requested = params.get('v')
  const featured = videos.find((video) => video.kind === 'service') ?? videos[0]
  const selected = videos.find((video) => video.id === requested) ?? featured
  const showLive = live.live && !requested
  const episodes = seriesEpisodes(videos)
  const counts = Object.fromEntries(Object.keys(SERMON_KINDS).map((id) => [id, videos.filter((v) => v.kind === id).length]))
  const shown = kind === 'all' ? videos : videos.filter((video) => video.kind === kind)

  useEffect(() => {
    if (autoplayId && autoplayId === (showLive ? 'live' : selected?.id)) titleRef.current?.focus({ preventScroll: true })
  }, [autoplayId, showLive, selected?.id])

  const bringScreenIntoView = () =>
    screenRef.current?.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' })

  const pick = (id) => {
    setAutoplayId(id)
    bringScreenIntoView()
  }

  const watchLive = () => {
    setAutoplayId('live')
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('v')
        return next
      },
      { replace: true, preventScrollReset: true },
    )
    bringScreenIntoView()
  }

  const videoLink = (video) => ({
    to: `?v=${video.id}`,
    replace: true,
    preventScrollReset: true,
    onClick: () => pick(video.id),
  })

  return (
    <div className="pg-watch">
      <section className="wt-stage" aria-labelledby="wt-title">
        {selected && !showLive && (
          <img className="wt-stage__ambient" src={selected.thumb} alt="" aria-hidden="true" key={selected.id} />
        )}
        <OnAirBar now={now} live={live} onWatchLive={watchLive} />

        <div className="container--wide wt-stage__inner">
          <header className="wt-head">
            <div>
              <p className="eyebrow">Upper Room TV</p>
              <h1 id="wt-title" className="wt-title">
                Live &amp; <em className="accent-word">on demand</em>
              </h1>
            </div>
            <p className="wt-head__lead">
              Worship with us live every Sunday at 11 AM and Thursday at 7:30 PM ET, or catch up on recent services,
              Bible studies, and messages from Bishop Patrick L. Wooden, Sr.
            </p>
          </header>

          <div className="wt-screen" ref={screenRef}>
            <span className="wt-screen__beam" aria-hidden="true" />
            {showLive ? (
              <LiveScreen key="live" label={live.label} autoplay={autoplayId === 'live'} />
            ) : (
              selected && (
                <LiteYouTube
                  key={selected.id}
                  id={selected.id}
                  title={selected.displayTitle}
                  priority
                  autoplay={autoplayId === selected.id}
                />
              )
            )}
          </div>

          {showLive ? (
            <div className="wt-now">
              <div className="wt-now__copy">
                <p className="wt-now__kind wt-now__kind--live">
                  <span className="live-dot" aria-hidden="true" />
                  Live now
                </p>
                <h2 ref={titleRef} tabIndex={-1} className="wt-now__title">
                  {live.label}
                </h2>
                <p className="wt-now__facts">
                  Stream not loading? Watch on{' '}
                  <a href={SITE.social.youtubeLive} target="_blank" rel="noreferrer">
                    YouTube
                  </a>{' '}
                  or{' '}
                  <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                  .
                </p>
              </div>
            </div>
          ) : (
            selected && (
              <div className="wt-now">
                <div className="wt-now__copy">
                  <p className="wt-now__kind">
                    <Equalizer />
                    Now showing · {SERMON_KINDS[selected.kind]}
                  </p>
                  <h2 ref={titleRef} tabIndex={-1} className="wt-now__title">
                    {selected.displayTitle}
                  </h2>
                  <p className="wt-now__facts">
                    {selected.speaker && <span>{selected.speaker}</span>}
                    <span>{shortDate(selected.dateKey)}</span>
                    {viewsLabel(selected.views) && <span>{viewsLabel(selected.views)}</span>}
                  </p>
                </div>
                <div className="wt-now__actions">
                  <ShareButton
                    title={selected.displayTitle}
                    text={`Watch “${selected.displayTitle}” from Upper Room Church of God in Christ`}
                    url={`${SITE.url}/watch?v=${selected.id}`}
                  />
                  <a className="btn btn--ghost btn--sm" href={selected.url} target="_blank" rel="noreferrer">
                    <YouTubeIcon aria-hidden="true" />
                    Open on YouTube
                  </a>
                </div>
              </div>
            )
          )}
          <p className="sr-only" aria-live="polite">
            {autoplayId && !showLive && selected ? `Now playing: ${selected.displayTitle}` : ''}
          </p>
        </div>
      </section>

      <section className="wt-guide section--tight" aria-labelledby="wt-guide-title">
        <div className="container--wide">
          <Reveal className="wt-guide__head">
            <p className="eyebrow">Broadcast schedule</p>
            <h2 id="wt-guide-title" className="wt-h2">
              Every week, <em className="accent-word">on the air</em>
            </h2>
          </Reveal>
          <ul className="wt-guide__grid" role="list">
            {SITE.liveWindows.map((window, index) => {
              const occurrence = nextOccurrence(getEvent(window.eventId), now)
              const isLive = live.live && live.label === window.label
              return (
                <Reveal as="li" key={window.eventId} delay={index * 90} className={`wt-slot${isLive ? ' is-live' : ''}`}>
                  <p className="wt-slot__day">{DAY_NAMES[window.day]}</p>
                  <p className="wt-slot__time tabular">
                    {formatTime(hmToMinutes(window.start)).replace(' ', '')}
                    <span>ET</span>
                  </p>
                  <h3 className="wt-slot__title">{window.label}</h3>
                  <p className="wt-slot__status">
                    {isLive ? (
                      <>
                        <span className="live-dot" aria-hidden="true" />
                        Streaming now
                      </>
                    ) : (
                      occurrence && <>Next: {dayPhrase(occurrence.date, now)}</>
                    )}
                  </p>
                  {occurrence && <AddToCalendar occurrence={occurrence} className="btn btn--ghost btn--sm wt-slot__cal" />}
                </Reveal>
              )
            })}
            <Reveal as="li" delay={180} className="wt-slot wt-slot--where">
              <p className="wt-slot__day">Where to watch</p>
              <a className="wt-platform" href={SITE.social.youtubeLive} target="_blank" rel="noreferrer">
                <YouTubeIcon aria-hidden="true" />
                <span>
                  YouTube
                  <small>{CHANNEL_NAME}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="wt-platform" href={SITE.social.facebook} target="_blank" rel="noreferrer">
                <FacebookIcon aria-hidden="true" />
                <span>
                  Facebook
                  <small>Upper Room Gospel</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <p className="wt-slot__tip">
                <Tv aria-hidden="true" />
                On a smart TV, open the YouTube app and search “{CHANNEL_NAME}.”
              </p>
            </Reveal>
          </ul>
        </div>
      </section>

      <section className="wt-series section" aria-labelledby="wt-series-title">
        <div className="container--wide wt-series__grid">
          <Reveal className="wt-series__copy">
            <p className="eyebrow">Current series · {CURRENT_SERIES.scripture}</p>
            <h2 id="wt-series-title" className="wt-series__title">
              {CURRENT_SERIES.name}
            </h2>
            <blockquote className="wt-series__verse">
              <p>“{CURRENT_SERIES.verse}”</p>
              <footer>{CURRENT_SERIES.scripture} KJV</footer>
            </blockquote>
            <p className="wt-series__note">
              Lit steps have a message in our recent uploads. Tap one to watch, or find the full series on{' '}
              <a
                href={`${SITE.social.youtube}/search?query=${encodeURIComponent(CURRENT_SERIES.name)}`}
                target="_blank"
                rel="noreferrer"
              >
                YouTube
              </a>
              .
            </p>
          </Reveal>
          <ol className="wt-stairs" role="list" aria-label={`${CURRENT_SERIES.name}: the steps of 2 Peter 1:5–7`}>
            {CURRENT_SERIES.steps.map((step, index) => {
              const video = episodes.get(step)
              const number = String(index + 1).padStart(2, '0')
              return (
                <li key={step} className={`wt-stair${video ? ' is-lit' : ''}`} style={{ '--i': index }}>
                  {video ? (
                    <Link className="wt-stair__step" {...videoLink(video)}>
                      <span className="wt-stair__num">{number}</span>
                      <span className="wt-stair__name">{step}</span>
                      <span className="wt-stair__meta">
                        <Play aria-hidden="true" />
                        {formatDate(video.dateKey, { month: 'short', day: 'numeric' })}
                      </span>
                    </Link>
                  ) : (
                    <span className="wt-stair__step">
                      <span className="wt-stair__num">{number}</span>
                      <span className="wt-stair__name">{step}</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="wt-library section" aria-labelledby="wt-library-title">
        <div className="container--wide">
          <Reveal className="wt-library__head">
            <div>
              <p className="eyebrow">On demand</p>
              <h2 id="wt-library-title" className="wt-h2">
                Recently <em className="accent-word">aired</em>
              </h2>
            </div>
            <p className="muted">
              The latest {videos.length} uploads from the {CHANNEL_NAME}. The full archive lives on{' '}
              <a href={SITE.social.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
              .
            </p>
          </Reveal>

          <div className="wt-filters" role="group" aria-label="Filter videos by type">
            <button type="button" className="chip" aria-pressed={kind === 'all'} onClick={() => setKind('all')}>
              Everything <span className="wt-filters__count tabular">{videos.length}</span>
            </button>
            {Object.entries(SERMON_KINDS)
              .filter(([id]) => counts[id] > 0)
              .map(([id, label]) => (
                <button key={id} type="button" className="chip" aria-pressed={kind === id} onClick={() => setKind(id)}>
                  {label} <span className="wt-filters__count tabular">{counts[id]}</span>
                </button>
              ))}
          </div>

          <ul className="wt-grid" role="list">
            {shown.map((video) => {
              const current = !showLive && video.id === selected?.id
              return (
                <li key={video.id}>
                  <Link
                    className={`wt-card${current ? ' is-current' : ''}`}
                    aria-current={current ? 'true' : undefined}
                    {...videoLink(video)}
                  >
                    <span className="wt-card__thumb">
                      <img src={video.thumb} alt="" width="480" height="360" loading="lazy" decoding="async" />
                      <span className="wt-card__kind">{SERMON_KINDS[video.kind]}</span>
                      {current ? (
                        <span className="wt-card__now">
                          <Equalizer />
                          Now showing
                        </span>
                      ) : (
                        <span className="wt-card__play" aria-hidden="true">
                          <Play />
                        </span>
                      )}
                    </span>
                    <span className="wt-card__title">{video.displayTitle}</span>
                    <span className="wt-card__meta">
                      {video.speaker && <span>{video.speaker}</span>}
                      <span>
                        {shortDate(video.dateKey)}
                        {viewsLabel(video.views) && ` · ${viewsLabel(video.views)}`}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="wt-cta section--tight" aria-labelledby="wt-cta-title">
        <Reveal className="container--wide wt-cta__inner">
          <div>
            <p className="eyebrow">Never miss a service</p>
            <h2 id="wt-cta-title" className="wt-h2">
              Subscribe &amp; get <em className="accent-word">notified</em>
            </h2>
            <p className="muted">
              Subscribe on YouTube and turn on notifications to hear the moment we go live.
            </p>
          </div>
          <div className="wt-cta__actions">
            <a className="btn btn--live btn--lg" href={SITE.social.youtubeSubscribe} target="_blank" rel="noreferrer">
              <YouTubeIcon aria-hidden="true" />
              Subscribe on YouTube
            </a>
            <a className="btn btn--ghost btn--lg" href={SITE.social.facebook} target="_blank" rel="noreferrer">
              <FacebookIcon aria-hidden="true" />
              Follow on Facebook
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
