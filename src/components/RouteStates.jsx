import { RotateCw } from 'lucide-react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { LogoMark } from './Logo.jsx'

export function Splash() {
  return (
    <div className="splash" role="status">
      <LogoMark />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export function RouteError() {
  const error = useRouteError()
  const chunkFailed = error instanceof TypeError && /dynamically imported module|Importing a module script/i.test(error.message)
  const title = isRouteErrorResponse(error) ? `${error.status} · ${error.statusText}` : 'Something went wrong'

  return (
    <section className="route-error container">
      <p className="eyebrow">Unexpected detour</p>
      <h1 className="h1">{chunkFailed ? 'The site was just updated' : title}</h1>
      <p className="lead">
        {chunkFailed
          ? 'Reload the page to get the newest version.'
          : 'Sorry about that. Try reloading the page, or head back home.'}
      </p>
      <div className="route-error__actions">
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          <RotateCw aria-hidden="true" />
          Reload
        </button>
        <Link to="/" className="btn btn--ghost">
          Go home
        </Link>
      </div>
    </section>
  )
}
