export default function Marquee({ children, reverse = false, speed = 40, className = '', label }) {
  return (
    <div
      className={`marquee ${className}`}
      data-reverse={reverse ? 'true' : undefined}
      style={{ '--marquee-speed': `${speed}s` }}
      role={label ? 'region' : undefined}
      aria-label={label}
    >
      <div className="marquee__track">{children}</div>
      <div className="marquee__track" aria-hidden="true" inert>
        {children}
      </div>
    </div>
  )
}
