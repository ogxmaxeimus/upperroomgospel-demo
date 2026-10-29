import { useNow } from '../hooks/useNow.js'
import { durationParts } from '../lib/time.js'

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

export default function Countdown({ to, className = '', label = 'Starts in', showSeconds = true }) {
  const now = useNow(showSeconds ? 1000 : 30000)
  const { days, hours, minutes, seconds } = durationParts(to - now)
  const units = [
    ['days', days],
    ['hrs', hours],
    ['min', minutes],
    ...(showSeconds ? [['sec', seconds]] : []),
  ]

  return (
    <div className={`countdown ${className}`}>
      <div className="countdown__units" aria-hidden="true">
        {units.map(([unit, value]) => (
          <span className="countdown__unit" key={unit}>
            <span className="countdown__value tabular">{String(value).padStart(2, '0')}</span>
            <span className="countdown__label">{unit}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">
        {label} {plural(days, 'day')}, {plural(hours, 'hour')}, and {plural(minutes, 'minute')}
      </span>
    </div>
  )
}
