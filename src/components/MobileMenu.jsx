import { ArrowUpRight, CalendarDays, Gift, MapPin, Play, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router'
import { NAV, SITE } from '../data/site.js'
import { FacebookIcon, InstagramIcon, YouTubeIcon } from './BrandIcons.jsx'
import Logo from './Logo.jsx'

export default function MobileMenu({ open, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="mobile-menu"
      aria-label="Site menu"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="mobile-menu__inner">
        <div className="mobile-menu__top">
          <Link to="/" className="site-header__brand" onClick={onClose} aria-label="Home">
            <Logo />
          </Link>
          <button type="button" className="mobile-menu__close" onClick={onClose} aria-label="Close menu">
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="mobile-menu__quick">
          <Link to="/im-new" className="mobile-menu__quick-link" onClick={onClose}>
            <MapPin aria-hidden="true" />
            Plan a Visit
          </Link>
          <Link to="/events" className="mobile-menu__quick-link" onClick={onClose}>
            <CalendarDays aria-hidden="true" />
            Events
          </Link>
          <Link to="/watch" className="mobile-menu__quick-link" onClick={onClose}>
            <Play aria-hidden="true" />
            Watch
          </Link>
          <Link to="/give" className="mobile-menu__quick-link" onClick={onClose}>
            <Gift aria-hidden="true" />
            Give
          </Link>
        </div>

        <nav aria-label="Mobile">
          <ul role="list" className="mobile-menu__list">
            {NAV.map((item) =>
              item.children ? (
                <li key={item.label} className="mobile-menu__group">
                  <span className="mobile-menu__group-label">{item.label}</span>
                  <ul role="list">
                    {item.children.map((child) => (
                      <li key={child.to}>
                        <NavLink
                          to={child.to}
                          end
                          className="mobile-menu__sublink"
                          style={{ '--tile-accent': child.accent }}
                          onClick={onClose}
                        >
                          <span className="mega__dot" aria-hidden="true" />
                          {child.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink to={item.to} className="mobile-menu__link" onClick={onClose}>
                    {item.label}
                    <ArrowUpRight aria-hidden="true" />
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="mobile-menu__foot">
          <p className="label-font">Sunday 8 &amp; 11 AM · Thursday 7:30 PM</p>
          <p>{SITE.address.street}, {SITE.address.city}</p>
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
          </div>
        </div>
      </div>
    </dialog>
  )
}
