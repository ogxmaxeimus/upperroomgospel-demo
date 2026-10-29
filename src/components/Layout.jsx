import { useEffect, useRef, useState, ViewTransition } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import MobileDock from './MobileDock.jsx'
import MobileMenu from './MobileMenu.jsx'
import '../styles/chrome.css'

export default function Layout() {
  const { pathname } = useLocation()
  const navigation = useNavigation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)
  const firstRender = useRef(true)

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="app grain">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className={`route-progress${navigation.state !== 'idle' ? ' is-active' : ''}`} aria-hidden="true" />
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <ViewTransition key={pathname} enter="page-in" exit="page-out" update="none" default="none">
        <main id="main" tabIndex={-1} className="site-main">
          <Outlet />
        </main>
      </ViewTransition>
      <Footer />
      <MobileDock onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <ScrollRestoration />
    </div>
  )
}
