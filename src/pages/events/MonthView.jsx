import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { categoryOf, groupByDate, occurrencesBetween } from '../../lib/events.js'
import { addDays, daysInMonth, formatDate, formatTime, monthLabel, parseKey, toKey, weekdayOf } from '../../lib/time.js'
import EventRow from './EventRow.jsx'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthOf = (key) => key.slice(0, 7)

export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1 + delta, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

const shortTime = (minutes) => (minutes == null ? '' : formatTime(minutes).replace(':00', '').replace(' ', '').toLowerCase())

export default function MonthView({ month, onMonth, events, now, today }) {
  const [y, m] = month.split('-').map(Number)
  const first = toKey(y, m, 1)
  const lead = weekdayOf(first)
  const weeks = Math.ceil((lead + daysInMonth(y, m)) / 7)
  const gridStart = addDays(first, -lead)
  const gridEnd = addDays(gridStart, weeks * 7 - 1)
  const cells = Array.from({ length: weeks * 7 }, (_, i) => addDays(gridStart, i))

  const byDate = groupByDate(occurrencesBetween(gridStart, gridEnd, events))

  const firstBusyDay = (from) => cells.find((key) => monthOf(key) === month && key >= from && byDate.has(key))
  const defaultCursor = monthOf(today) === month ? (firstBusyDay(today) ?? today) : (firstBusyDay(first) ?? first)
  const [cursor, setCursor] = useState(defaultCursor)
  const [cursorMonth, setCursorMonth] = useState(month)
  if (cursorMonth !== month) {
    setCursorMonth(month)
    if (monthOf(cursor) !== month) setCursor(defaultCursor)
  }

  const gridRef = useRef(null)
  const focusPending = useRef(false)
  useEffect(() => {
    if (!focusPending.current) return
    const cell = gridRef.current?.querySelector(`[data-key="${cursor}"]`)
    if (cell) {
      cell.focus()
      focusPending.current = false
    }
  }, [cursor, month])

  const move = (key, { focus = true } = {}) => {
    focusPending.current = focus
    setCursor(key)
    if (monthOf(key) !== month) onMonth(monthOf(key))
  }

  const onKeyDown = (event) => {
    const deltas = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }
    let next = null
    if (event.key in deltas) next = addDays(cursor, deltas[event.key])
    else if (event.key === 'Home') next = addDays(cursor, -weekdayOf(cursor))
    else if (event.key === 'End') next = addDays(cursor, 6 - weekdayOf(cursor))
    else if (event.key === 'PageUp' || event.key === 'PageDown') {
      const target = shiftMonth(monthOf(cursor), event.key === 'PageUp' ? -1 : 1)
      const [ty, tm] = target.split('-').map(Number)
      next = toKey(ty, tm, Math.min(parseKey(cursor).d, daysInMonth(ty, tm)))
    }
    if (next) {
      event.preventDefault()
      move(next)
    }
  }

  const selected = byDate.get(cursor) ?? []
  const label = monthLabel(y, m)

  return (
    <div className="ev-month">
      <div className="ev-month__head">
        <h3 className="ev-month__title" aria-live="polite">
          {monthLabel(y, m, { month: 'long' })} <span>{y}</span>
        </h3>
        <div className="ev-month__nav">
          <button type="button" className="btn btn--ghost btn--icon" onClick={() => onMonth(shiftMonth(month, -1))} aria-label="Previous month">
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            disabled={monthOf(today) === month && cursor === today}
            onClick={() => move(today, { focus: false })}
          >
            Today
          </button>
          <button type="button" className="btn btn--ghost btn--icon" onClick={() => onMonth(shiftMonth(month, 1))} aria-label="Next month">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="ev-month__hint">Use arrow keys to move between days. Page Up and Page Down change the month.</p>

      <div className="ev-month__layout">
        <div ref={gridRef} className="ev-grid" role="grid" aria-label={label} onKeyDown={onKeyDown}>
          <div role="row" className="ev-grid__row ev-grid__row--head">
            {WEEKDAYS.map((day) => (
              <div key={day} role="columnheader" className="ev-grid__wd">
                <abbr title={day}>{day.slice(0, 3)}</abbr>
              </div>
            ))}
          </div>
          {Array.from({ length: weeks }, (_, week) => (
            <div role="row" className="ev-grid__row" key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((key) => {
                const items = byDate.get(key) ?? []
                const classes = [
                  'ev-cell',
                  monthOf(key) !== month && 'is-outside',
                  key === today && 'is-today',
                  key < today && 'is-past',
                  key === cursor && 'is-selected',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <div role="gridcell" key={key} className="ev-grid__cell" aria-selected={key === cursor}>
                    <button
                      type="button"
                      data-key={key}
                      tabIndex={key === cursor ? 0 : -1}
                      className={classes}
                      onClick={() => move(key, { focus: false })}
                      aria-label={`${formatDate(key, { weekday: 'long', month: 'long', day: 'numeric' })}${key === today ? ' (today)' : ''}: ${
                        items.length ? `${items.length} event${items.length === 1 ? '' : 's'}` : 'no events'
                      }`}
                    >
                      <span className="ev-cell__num tabular">{parseKey(key).d}</span>
                      <span className="ev-cell__items" aria-hidden="true">
                        {items.slice(0, 3).map((occ) => (
                          <span key={occ.key} className="ev-pill" style={{ '--c': categoryOf(occ.event).color }}>
                            <span className="ev-pill__time">{shortTime(occ.start)}</span>
                            {occ.event.title}
                          </span>
                        ))}
                        {items.length > 3 && <span className="ev-pill ev-pill--more">+{items.length - 3} more</span>}
                      </span>
                      <span className="ev-cell__dots" aria-hidden="true">
                        {items.slice(0, 4).map((occ) => (
                          <i key={occ.key} style={{ '--c': categoryOf(occ.event).color }} />
                        ))}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <section className="ev-agenda" aria-labelledby="ev-agenda-title">
          <p className="ev-agenda__kicker label-font">Selected day</p>
          <h3 id="ev-agenda-title" className="ev-agenda__title">
            {formatDate(cursor, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          {selected.length ? (
            <ol className="ev-rows ev-rows--compact" role="list">
              {selected.map((occurrence) => (
                <EventRow key={occurrence.key} occurrence={occurrence} now={now} />
              ))}
            </ol>
          ) : (
            <p className="ev-agenda__empty">Nothing scheduled. Pick another day.</p>
          )}
        </section>
      </div>
    </div>
  )
}
