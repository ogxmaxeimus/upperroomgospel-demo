import { Play } from 'lucide-react'
import { useState } from 'react'

const thumbUrl = (id, size) => `https://i.ytimg.com/vi/${id}/${size}.jpg`

export default function LiteYouTube({ id, title, className = '', priority = false, autoplay = false, children }) {
  const [active, setActive] = useState(autoplay)
  const [size, setSize] = useState('maxresdefault')
  const fallback = () => setSize((current) => (current === 'maxresdefault' ? 'hqdefault' : current))

  if (active) {
    return (
      <div className={`lite-yt is-active ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <button type="button" className={`lite-yt ${className}`} onClick={() => setActive(true)}>
      <img
        src={thumbUrl(id, size)}
        alt=""
        width="1280"
        height="720"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth <= 120) fallback()
        }}
        onError={fallback}
      />
      <span className="lite-yt__shade" aria-hidden="true" />
      <span className="lite-yt__play" aria-hidden="true">
        <Play />
      </span>
      <span className="sr-only">Play video: {title}</span>
      {children}
    </button>
  )
}
