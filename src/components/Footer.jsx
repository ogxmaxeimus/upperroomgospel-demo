import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router'
import { fullAddress, SITE } from '../data/site.js'
import { useMotion } from '../hooks/useMotion.js'
import { useNow } from '../hooks/useNow.js'
import { hmToMinutes, nowMinutes, weekdayOf, todayKey } from '../lib/time.js'
import { FacebookIcon, InstagramIcon, XIcon, YouTubeIcon } from './BrandIcons.jsx'
import Img from './Img.jsx'

export function isOfficeOpen(now = Date.now()) {
  const { days, open, close } = SITE.officeHours
  const minutes = nowMinutes(now)
  return days.includes(weekdayOf(todayKey(now))) && minutes >= hmToMinutes(open) && minutes < hmToMinutes(close)
}

const EXPLORE = [
  { to: '/im-new', label: 'I’m New' },
  { to: '/events', label: 'Events' },
  { to: '/watch', label: 'Watch Messages' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/about/bishop-wooden', label: 'Our Pastor' },
  { to: '/beliefs', label: 'What We Believe' },
  { to: '/follow-jesus', label: 'Follow Jesus' },
  { to: '/give', label: 'Give' },
  { to: '/contact', label: 'Contact & Prayer' },
]

export default function Footer() {
  const { enabled, toggle } = useMotion()
  const now = useNow(60000)
  const officeOpen = isOfficeOpen(now)

  return (
    <footer className="site-footer force-dark">
      <div className="site-footer__cta container--wide">
        <p className="site-footer__motto display">
          Keep <span className="accent-word">God</span> First.
        </p>
        <div className="site-footer__cta-actions">
          <Link to="/im-new" className="btn btn--primary btn--lg">
            Plan Your Visit
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <a href={SITE.social.youtubeLive} className="btn btn--ghost btn--lg" target="_blank" rel="noreferrer">
            Watch Live
          </a>
        </div>
      </div>

      <div className="site-footer__grid container--wide">
        <div className="site-footer__brand">
          <Img name="logoWhite" className="site-footer__logo" alt="Upper Room Church of God in Christ, God First" />
          <p>
            A Church of God in Christ family in Raleigh, North Carolina, and headquarters of the{' '}
            {SITE.jurisdiction}.
          </p>
          <div className="social-row">
            <a href={SITE.social.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
              <YouTubeIcon />
            </a>
            <a href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <FacebookIcon />
            </a>
            <a href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={SITE.social.x} target="_blank" rel="noreferrer" aria-label="X (Twitter)">
              <XIcon />
            </a>
          </div>
        </div>

        <div>
          <h2 className="site-footer__heading">Visit</h2>
          <a className="site-footer__line" href={SITE.directionsUrl} target="_blank" rel="noreferrer">
            <MapPin aria-hidden="true" />
            <span>{fullAddress}</span>
          </a>
          <ul role="list" className="site-footer__services">
            {SITE.services.map((service) => (
              <li key={service.id}>
                <span>
                  {service.day} {service.label}
                </span>
                <span className="tabular">{service.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="site-footer__heading">Church Office</h2>
          <a className="site-footer__line" href={SITE.phone.href}>
            <Phone aria-hidden="true" />
            <span className="tabular">{SITE.phone.display}</span>
          </a>
          <a className="site-footer__line" href={`mailto:${SITE.email}`}>
            <Mail aria-hidden="true" />
            <span>{SITE.email}</span>
          </a>
          <p className="site-footer__line">
            <Clock aria-hidden="true" />
            <span>
              {SITE.officeHours.label}
              <span className={`office-status${officeOpen ? ' is-open' : ''}`}>
                {officeOpen ? 'Open now' : 'Closed now'}
              </span>
            </span>
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="site-footer__heading">Explore</h2>
          <ul role="list" className="site-footer__links">
            {EXPLORE.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer__bottom container--wide">
        <p>
          © {new Date().getFullYear()} <span translate="no">Upper Room Church of God in Christ</span>
        </p>
        <div className="site-footer__bottom-links">
          <a href={SITE.memberPortal} target="_blank" rel="noreferrer">
            Member Portal
          </a>
          <button type="button" className="motion-toggle" aria-pressed={!enabled} onClick={toggle}>
            <span className="motion-toggle__track" aria-hidden="true" />
            Reduce Motion
          </button>
        </div>
      </div>
    </footer>
  )
}
