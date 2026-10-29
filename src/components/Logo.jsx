import { useId } from 'react'

// The "God First" cross from the official logo, tinted with currentColor.
export function LogoMark({ className }) {
  const id = `mark-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg className={className} viewBox="0 0 313 249" aria-hidden="true">
      <mask id={id}>
        <image href="/brand/emblem-white.png" width="313" height="249" />
      </mask>
      <rect width="313" height="249" fill="currentColor" mask={`url(#${id})`} />
    </svg>
  )
}

export default function Logo() {
  return (
    <span className="logo" translate="no">
      <img className="logo__img logo__img--light" src="/brand/logo-official-white.png" width="556" height="541" alt="" />
      <img className="logo__img logo__img--dark" src="/brand/logo-official-navy.png" width="556" height="541" alt="" />
      <span className="sr-only">Upper Room Church of God in Christ</span>
    </span>
  )
}
