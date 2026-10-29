import { Link } from 'react-router'
import { SITE } from '../data/site.js'
import { useNow } from '../hooks/useNow.js'
import { eventPath, getEvent, liveWindowStatus, nextOccurrence } from '../lib/events.js'
import { formatDate, formatTime, relativeDayLabel, todayKey } from '../lib/time.js'

const SERVICE_IDS = ['sunday-worship-8am', 'sunday-worship-11am', 'thursday-bible-study']

export function nextService(now = Date.now()) {
  return SERVICE_IDS.map((id) => nextOccurrence(getEvent(id), now))
    .filter(Boolean)
    .sort((a, b) => a.startsAt - b.startsAt)[0]
}

export default function LiveBadge({ className = '' }) {
  const now = useNow(30000)
  const live = liveWindowStatus(now)

  if (live.live) {
    return (
      <a className={`live-badge is-live ${className}`} href={SITE.social.youtubeLive} target="_blank" rel="noreferrer">
        <span className="live-dot" aria-hidden="true" />
        <span className="live-badge__time">Live now</span>
        <span className="sr-only">: {live.label} on YouTube (opens in a new tab)</span>
      </a>
    )
  }

  const next = nextService(now)
  if (!next) return null
  const inProgress = now >= next.startsAt
  const day =
    relativeDayLabel(next.date, todayKey(now)) ??
    formatDate(next.date, { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <Link className={`live-badge ${className}`} to={eventPath(next)}>
      <span className="live-badge__label">{inProgress ? 'In service now' : 'Next service'}</span>
      <span className="live-badge__time tabular">
        {inProgress ? next.event.title.replace('Sunday Morning ', '') : `${day} · ${formatTime(next.start)}`}
      </span>
    </Link>
  )
}
