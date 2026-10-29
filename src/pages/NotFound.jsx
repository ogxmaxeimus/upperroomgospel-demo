import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { LogoMark } from '../components/Logo.jsx'
import { usePage } from '../hooks/usePage.js'
import './not-found.css'

const SUGGESTIONS = [
  { to: '/events', label: 'Events calendar' },
  { to: '/im-new', label: 'Plan a visit' },
  { to: '/watch', label: 'Watch messages' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/contact', label: 'Contact & prayer' },
]

export default function NotFound() {
  const { pathname } = useLocation()
  usePage({ id: 'not-found', themeColor: '#040915', title: 'Page not found' })

  return (
    <div className="pg-404">
      <section className="nf container">
        <div className="nf__mark" aria-hidden="true">
          <span className="nf__digit">4</span>
          <LogoMark />
          <span className="nf__digit">4</span>
        </div>
        <h1 className="nf__title">This room is empty.</h1>
        <p className="nf__lead">
          We couldn’t find <code translate="no">{pathname}</code>. The page may have moved when the site was redesigned,
          but the door’s still open.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">
          Back to the Upper Room
          <ArrowRight aria-hidden="true" />
        </Link>
        <nav aria-label="Popular pages" className="nf__links">
          {SUGGESTIONS.map((link) => (
            <Link key={link.to} to={link.to} className="chip">
              {link.label}
            </Link>
          ))}
        </nav>
      </section>
    </div>
  )
}
