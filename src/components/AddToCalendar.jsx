import { CalendarPlus, Download, Repeat } from 'lucide-react'
import { useId, useRef } from 'react'
import { SITE } from '../data/site.js'
import { buildICS, downloadICS, googleCalendarUrl, outlookCalendarUrl } from '../lib/calendar.js'
import { eventPath, isRecurring, scheduleLabel } from '../lib/events.js'
import { GoogleIcon, OutlookIcon } from './BrandIcons.jsx'

export default function AddToCalendar({ occurrence, label = 'Add to calendar', className = 'btn btn--ghost btn--sm', iconOnly = false }) {
  const id = `cal-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const popoverRef = useRef(null)
  const { event, date } = occurrence
  const url = `${SITE.url}${eventPath(occurrence)}`
  const recurring = isRecurring(event)
  const close = () => popoverRef.current?.hidePopover?.()

  const download = (series) => {
    downloadICS(`${event.id}${series ? '-every-week' : `-${date}`}.ics`, buildICS([{ event, date, url, series }]))
    close()
  }

  return (
    <>
      <button
        type="button"
        className={className}
        popoverTarget={id}
        style={{ anchorName: `--${id}` }}
        aria-label={iconOnly ? `Add ${event.title} to your calendar` : undefined}
      >
        <CalendarPlus aria-hidden="true" />
        {!iconOnly && label}
      </button>
      <div ref={popoverRef} id={id} popover="auto" className="popover" style={{ positionAnchor: `--${id}` }}>
        <p className="popover__title">{recurring ? 'This date' : 'Add to calendar'}</p>
        <a
          className="popover__item"
          href={googleCalendarUrl(occurrence, { url })}
          target="_blank"
          rel="noreferrer"
          onClick={close}
        >
          <GoogleIcon />
          Google Calendar
        </a>
        <button type="button" className="popover__item" onClick={() => download(false)}>
          <Download aria-hidden="true" />
          <span>
            Apple / iPhone / Outlook app
            <small>Downloads an .ics file</small>
          </span>
        </button>
        <a
          className="popover__item"
          href={outlookCalendarUrl(occurrence, { url })}
          target="_blank"
          rel="noreferrer"
          onClick={close}
        >
          <OutlookIcon />
          Outlook.com
        </a>
        {recurring && (
          <>
            <p className="popover__title">Every time · {scheduleLabel(event)}</p>
            <a
              className="popover__item"
              href={googleCalendarUrl(occurrence, { url, series: true })}
              target="_blank"
              rel="noreferrer"
              onClick={close}
            >
              <Repeat aria-hidden="true" />
              Repeat in Google Calendar
            </a>
            <button type="button" className="popover__item" onClick={() => download(true)}>
              <Repeat aria-hidden="true" />
              <span>
                Repeat in Apple / Outlook
                <small>Recurring .ics file</small>
              </span>
            </button>
          </>
        )}
      </div>
    </>
  )
}
