import { CalendarDays, List, Radio, Repeat, Search, X } from 'lucide-react'
import { AUDIENCES, CATEGORIES } from '../../data/events.js'

export const VIEWS = [
  { id: 'list', label: 'List', icon: List },
  { id: 'month', label: 'Month', icon: CalendarDays },
  { id: 'week', label: 'Every Week', icon: Repeat },
]

export default function Toolbar({ filters, onChange, query, onQuery, view, onView, summary, hasFilters, onClear }) {
  const toggleCategory = (id) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    onChange({ cat: next })
  }

  return (
    <div className="ev-toolbar">
      <div className="ev-toolbar__inner container--wide">
        <div className="ev-toolbar__row">
          <div className="ev-views" role="group" aria-label="Calendar view">
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" className="ev-views__btn" aria-pressed={view === id} onClick={() => onView(id)}>
                <Icon aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          <div className="ev-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Search events…"
              aria-label="Search events"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
            />
            {query && (
              <button type="button" className="ev-search__clear" onClick={() => onQuery('')} aria-label="Clear search">
                <X aria-hidden="true" />
              </button>
            )}
          </div>

          <label className="ev-audience">
            <span className="sr-only">Who is it for?</span>
            <select
              className="field__control"
              value={filters.audience}
              onChange={(event) => onChange({ for: event.target.value === 'all' ? null : event.target.value })}
            >
              <option value="all">For everyone</option>
              {Object.entries(AUDIENCES)
                .filter(([id]) => id !== 'everyone')
                .map(([id, label]) => (
                  <option key={id} value={id}>
                    For {label.toLowerCase()}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div className="ev-toolbar__row ev-toolbar__row--chips">
          <div className="ev-chips" role="group" aria-label="Filter by category">
            {Object.entries(CATEGORIES).map(([id, category]) => (
              <button
                key={id}
                type="button"
                className="chip"
                style={{ '--chip-color': category.color }}
                aria-pressed={filters.categories.includes(id)}
                onClick={() => toggleCategory(id)}
              >
                <span className="chip__dot" aria-hidden="true" />
                {category.label}
              </button>
            ))}
            <button
              type="button"
              className="chip"
              style={{ '--chip-color': '#ff4d5e' }}
              aria-pressed={filters.online}
              onClick={() => onChange({ online: filters.online ? null : '1' })}
            >
              <Radio aria-hidden="true" className="chip__icon" />
              Streamed online
            </button>
          </div>
          <p className="ev-toolbar__summary" aria-live="polite">
            <span className="tabular">{summary}</span>
            {hasFilters && (
              <button type="button" className="text-link" onClick={onClear}>
                Clear filters
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
