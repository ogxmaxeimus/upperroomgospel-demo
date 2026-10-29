import { categoryOf } from '../../lib/events.js'
import { addDays, formatDate, parseKey } from '../../lib/time.js'

export default function WeekStrip({ byDate, today, onPick, days = 14 }) {
  const keys = Array.from({ length: days }, (_, i) => addDays(today, i))

  return (
    <nav className="ev-strip" aria-label="Jump to a day in the next two weeks">
      <ol role="list">
        {keys.map((key) => {
          const items = byDate.get(key) ?? []
          const count = items.length
          return (
            <li key={key}>
              <button
                type="button"
                className={`ev-strip__day${key === today ? ' is-today' : ''}`}
                disabled={!count}
                onClick={() => onPick(key)}
                aria-label={`${formatDate(key)}: ${count ? `${count} event${count === 1 ? '' : 's'}` : 'no events'}`}
              >
                <span className="ev-strip__wd">{key === today ? 'Today' : formatDate(key, { weekday: 'short' })}</span>
                <span className="ev-strip__num tabular">{parseKey(key).d}</span>
                <span className="ev-strip__dots" aria-hidden="true">
                  {items.slice(0, 4).map((occ) => (
                    <i key={occ.key} style={{ '--c': categoryOf(occ.event).color }} />
                  ))}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
