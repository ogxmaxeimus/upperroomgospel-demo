import { useCallback, useSyncExternalStore } from 'react'

const listeners = new Set()
const read = () => document.documentElement.dataset.motion !== 'reduced'

function subscribe(callback) {
  listeners.add(callback)
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const onChange = () => {
    let stored = null
    try {
      stored = localStorage.getItem('ur-motion')
    } catch {
      /* storage unavailable */
    }
    if (!stored) document.documentElement.dataset.motion = media.matches ? 'reduced' : 'full'
    listeners.forEach((listener) => listener())
  }
  media.addEventListener('change', onChange)
  return () => {
    listeners.delete(callback)
    media.removeEventListener('change', onChange)
  }
}

export function useMotion() {
  const enabled = useSyncExternalStore(subscribe, read, () => true)
  const toggle = useCallback(() => {
    const next = read() ? 'reduced' : 'full'
    document.documentElement.dataset.motion = next
    try {
      localStorage.setItem('ur-motion', next)
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((listener) => listener())
  }, [])
  return { enabled, toggle }
}
