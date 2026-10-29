import { Check, Copy, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function useFlag(duration = 2200) {
  const [on, setOn] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const flash = () => {
    setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), duration)
  }
  return [on, flash]
}

export default function ShareButton({ title, text, url, label = 'Share', className = 'btn btn--ghost btn--sm' }) {
  const [copied, flash] = useFlag()

  async function share() {
    const shareUrl = url ?? window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
        return
      } catch (error) {
        if (error.name === 'AbortError') return
      }
    }
    await navigator.clipboard?.writeText(shareUrl)
    flash()
  }

  return (
    <>
      <button type="button" className={className} onClick={share}>
        {copied ? <Check aria-hidden="true" /> : <Share2 aria-hidden="true" />}
        {copied ? 'Link copied' : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </>
  )
}

export function CopyButton({ value, label = 'Copy', copiedLabel = 'Copied', className = 'btn btn--ghost btn--sm' }) {
  const [copied, flash] = useFlag()
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={async () => {
          await navigator.clipboard?.writeText(value)
          flash()
        }}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? copiedLabel : label}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `${value} copied to clipboard` : ''}
      </span>
    </>
  )
}
