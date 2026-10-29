import { useEffect } from 'react'

// Writes pointer position into CSS variables (--mx, --my as %, --rx, --ry as tilt degrees).
export function usePointerGlow(ref, { tilt = 0 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    let frame = 0
    const onMove = (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width
        const y = (event.clientY - rect.top) / rect.height
        el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`)
        el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`)
        if (tilt && document.documentElement.dataset.motion !== 'reduced') {
          el.style.setProperty('--rx', `${((0.5 - y) * tilt).toFixed(2)}deg`)
          el.style.setProperty('--ry', `${((x - 0.5) * tilt).toFixed(2)}deg`)
        }
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, tilt])
}
