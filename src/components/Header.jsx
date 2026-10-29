import { ChevronDown, Menu } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { NAV } from '../data/site.js'
import LiveBadge from './LiveBadge.jsx'
import Logo from './Logo.jsx'

function isActive(pathname, to) {
  return pathname === to || pathname.startsWith(`${to}/`)
}

function NavDropdown({ item, open, onOpen, onClose }) {
  const panelId = useId()
  const { pathname } = useLocation()
  const closeTimer = useRef(0)
  const triggerRef = useRef(null)
  const active = item.children.some((child) => isActive(pathname, child.to))

  const scheduleClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(onClose, 160)
  }
  const cancelClose = () => clearTimeout(closeTimer.current)

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  return (
    <li
      className="site-nav__item"
      onMouseEnter={() => {
        cancelClose()
        onOpen()
      }}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          onClose()
          triggerRef.current?.focus()
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`site-nav__link${active ? ' active' : ''}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {item.label}
        <ChevronDown aria-hidden="true" className="site-nav__chev" />
      </button>
      <div id={panelId} className={`mega mega--${item.children.length > 4 ? 'grid' : 'list'}`} hidden={!open}>
        <ul role="list">
          {item.children.map((child) => (
            <li key={child.to}>
              <Link to={child.to} className="mega__link" style={{ '--tile-accent': child.accent }} onClick={onClose}>
                <span className="mega__dot" aria-hidden="true" />
                <span className="mega__text">
                  <span className="mega__label">{child.label}</span>
                  <span className="mega__desc">{child.desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function Header({ onOpenMenu }) {
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [openItem, setOpenItem] = useState(null)
  const [closedOnPath, setClosedOnPath] = useState(pathname)

  if (closedOnPath !== pathname) {
    setClosedOnPath(pathname)
    setOpenItem(null)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled || openItem ? ' is-solid' : ''}`}>
      <div className="site-header__inner container--wide">
        <Link to="/" className="site-header__brand" aria-label="Upper Room Church of God in Christ, home">
          <Logo />
        </Link>

        <nav className="site-nav" aria-label="Main">
          <ul role="list">
            {NAV.map((item) =>
              item.children ? (
                <NavDropdown
                  key={item.label}
                  item={item}
                  open={openItem === item.label}
                  onOpen={() => setOpenItem(item.label)}
                  onClose={() => setOpenItem((current) => (current === item.label ? null : current))}
                />
              ) : (
                <li key={item.to} className="site-nav__item">
                  <NavLink to={item.to} className="site-nav__link">
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="site-header__actions">
          <LiveBadge className="site-header__live" />
          <Link to="/give" className="btn btn--primary btn--sm site-header__give">
            Give
          </Link>
          <button type="button" className="site-header__burger" aria-label="Open menu" onClick={onOpenMenu}>
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
