import { useEffect, useRef } from 'react'

let observer = null

function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
  }
  return observer
}

export default function Reveal({ as: Tag = 'div', delay = 0, variant, className = '', style, children, ...rest }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }
    const io = getObserver()
    io.observe(el)
    return () => io.unobserve(el)
  }, [])

  return (
    <Tag
      ref={ref}
      className={['reveal', variant && `reveal--${variant}`, className].filter(Boolean).join(' ')}
      style={delay ? { '--reveal-delay': `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
