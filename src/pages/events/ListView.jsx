import { CalendarSearch } from 'lucide-react'
import { formatDate, monthLabel, parseKey, relativeDayLabel } from '../../lib/time.js'
import EventRow from './EventRow.jsx'

export function EmptyState({ onClear }) {
  return (
    <div className="ev-empty">
      <CalendarSearch aria-hidden="true" />
      <h3>Nothing matches those filters</h3>
      <p>Try a different search, or clear the filters to see everything.</p>
      <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>
        Clear filters
      </button>
    </div>
  )
}

function withMonthBreaks(byDate, today) {
  const days = []
  let lastMonth = today.slice(0, 7)
  for (const [date, items] of byDate) {
    const month = date.slice(0, 7)
    days.push({ date, items, newMonth: month !== lastMonth })
    lastMonth = month
  }
  return days
}

export default function ListView({ byDate, now, today, canLoadMore, onMore, onClear }) {
  const days = withMonthBreaks(byDate, today)
  if (!days.length) return <EmptyState onClear={onClear} />

  return (
    <div className="ev-list">
      {days.map(({ date, items, newMonth }) => {
        const { y, m, d } = parseKey(date)
        const relative = relativeDayLabel(date, today)
        const named = relative === 'Today' || relative === 'Tomorrow'
        return (
          <div key={date} className="ev-day-wrap">
            {newMonth && (
              <p className="ev-month-banner" aria-hidden="true">
                {monthLabel(y, m, { month: 'long' })}
                <span>{y}</span>
              </p>
            )}
            <section id={`day-${date}`} className={`ev-day${date === today ? ' is-today' : ''}`} aria-labelledby={`day-${date}-h`}>
              <h3 id={`day-${date}-h`} className="ev-day__head">
                <span className="ev-day__num tabular" aria-hidden="true">
                  {d}
                </span>
                <span className="ev-day__label">
                  <span className="ev-day__rel">{relative ?? formatDate(date, { weekday: 'long' })}</span>
                  <span className="ev-day__date">{formatDate(date, { weekday: named ? 'long' : undefined, month: 'long', day: 'numeric' })}</span>
                </span>
              </h3>
              <ol className="ev-rows" role="list">
                {items.map((occurrence) => (
                  <EventRow key={occurrence.key} occurrence={occurrence} now={now} />
                ))}
              </ol>
            </section>
          </div>
        )
      })}
      {canLoadMore && (
        <div className="ev-more">
          <button type="button" className="btn btn--ghost" onClick={onMore}>
            Show more dates
          </button>
        </div>
      )}
    </div>
  )
}
