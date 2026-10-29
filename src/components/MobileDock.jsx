import { CalendarDays, Gift, House, Menu, Play } from 'lucide-react'
import { NavLink } from 'react-router'

const ITEMS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/watch', label: 'Watch', icon: Play },
  { to: '/give', label: 'Give', icon: Gift },
]

export default function MobileDock({ onOpenMenu }) {
  return (
    <nav className="dock" aria-label="Quick links">
      <ul role="list">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="dock__link">
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
        <li>
          <button type="button" className="dock__link" onClick={onOpenMenu}>
            <Menu aria-hidden="true" />
            <span>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
