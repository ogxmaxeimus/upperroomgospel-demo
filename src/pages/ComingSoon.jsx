import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { LogoMark } from '../components/Logo.jsx'
import { legacyUrlFor } from '../data/legacy.js'
import { NAV } from '../data/site.js'
import { usePage } from '../hooks/usePage.js'
import './not-found.css'

const PAGE_NAMES = Object.fromEntries(
  [{ label: 'Give', to: '/give' }, ...NAV.flatMap((item) => [item, ...(item.children ?? [])])].map((item) => [
    item.to,
    item.label,
  ]),
)

export default function ComingSoon() {
  const { pathname } = useLocation()
  const name = PAGE_NAMES[pathname] ?? 'This page'
  usePage({ id: 'coming-soon', themeColor: '#040915', title: `${name} (coming soon)` })

  return (
    <div className="pg-404">
      <section className="nf container">
        <div className="nf__mark nf__mark--soon" aria-hidden="true">
          <LogoMark />
        </div>
        <p className="eyebrow eyebrow--plain">Redesign in progress</p>
        <h1 className="nf__title">{name} is being rebuilt.</h1>
        <p className="nf__lead">
          This page is next on the list for the new site. Until it’s ready, you can find everything on the current
          Upper Room website.
        </p>
        <div className="nf__actions">
          <a className="btn btn--primary btn--lg" href={legacyUrlFor(pathname)} target="_blank" rel="noreferrer">
            View it on the current site
            <ArrowUpRight aria-hidden="true" />
          </a>
          <Link to="/" className="btn btn--ghost btn--lg">
            Back to home
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  )
}
