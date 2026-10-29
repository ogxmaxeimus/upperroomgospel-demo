import { useEffect, useRef } from 'react'
import { useMotion } from '../hooks/useMotion.js'

function sprite(color) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, '#ffffff')
  gradient.addColorStop(0.18, color)
  gradient.addColorStop(0.45, `${color}55`)
  gradient.addColorStop(1, `${color}00`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

/*
  Soft glowing particles. "rise" drifts upward like embers (Acts 2: tongues of fire in the upper room);
  "float" drifts slowly in every direction. Pauses offscreen and freezes when motion is reduced.
*/
export default function EmberField({ colors = ['#EEC26A', '#F7DC9C', '#FF9A3D'], density = 1, speed = 1, mode = 'rise', className = '' }) {
  const ref = useRef(null)
  const { enabled } = useMotion()
  const palette = colors.join(',')

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const sprites = palette.split(',').map(sprite)
    let width = 0
    let height = 0
    let particles = []
    let frame = 0
    let visible = true

    const spawn = (anywhere) => {
      const depth = Math.random()
      return {
        x: Math.random() * width,
        y: anywhere || mode === 'float' ? Math.random() * height : height + 20,
        size: 4 + depth * 16,
        vx: (Math.random() - 0.5) * 0.25 * speed,
        vy: mode === 'rise' ? -(0.15 + depth * 0.6) * speed : (Math.random() - 0.5) * 0.2 * speed,
        alpha: 0.25 + depth * 0.6,
        phase: Math.random() * Math.PI * 2,
        sprite: sprites[Math.floor(Math.random() * sprites.length)],
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, (width * height) / 16000) * density)
      particles = Array.from({ length: count }, () => spawn(true))
    }

    const draw = (time = 0) => {
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      for (const p of particles) {
        if (enabled) {
          p.x += p.vx + Math.sin(time / 1600 + p.phase) * 0.18 * speed
          p.y += p.vy
          if (p.y < -30 || p.x < -30 || p.x > width + 30 || (mode === 'float' && p.y > height + 30)) {
            Object.assign(p, spawn(false))
          }
        }
        const flicker = enabled ? 0.75 + Math.sin(time / 380 + p.phase * 3) * 0.25 : 1
        ctx.globalAlpha = p.alpha * flicker
        ctx.drawImage(p.sprite, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
      }
      ctx.globalAlpha = 1
      if (enabled && visible) frame = requestAnimationFrame(draw)
    }

    resize()
    draw()

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (!enabled) draw()
    })
    resizeObserver.observe(canvas)

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible && enabled) frame = requestAnimationFrame(draw)
    })
    intersection.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersection.disconnect()
    }
  }, [enabled, palette, density, speed, mode])

  return <canvas ref={ref} className={`ember-field ${className}`} aria-hidden="true" />
}
