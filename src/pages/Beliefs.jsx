import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Reveal from '../components/Reveal.jsx'
import { BELIEFS } from '../data/beliefs.js'
import { usePage } from '../hooks/usePage.js'
import './beliefs.css'

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

export default function Beliefs() {
  usePage({
    id: 'beliefs',
    theme: 'light',
    themeColor: '#f4ecdc',
    title: 'What We Believe',
    description: 'The Statement of Faith of the Upper Room Church of God in Christ.',
  })
  const [active, setActive] = useState(BELIEFS[0].id)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    BELIEFS.forEach((b) => {
      const el = document.getElementById(b.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <div className="pg-beliefs">
      <section className="bl-hero container">
        <p className="eyebrow">Statement of faith</p>
        <h1 className="bl-title">What we believe</h1>
        <p className="lead">Eight convictions, straight from the Word, that shape everything we do at the Upper Room.</p>
      </section>

      <div className="container bl-layout">
        <nav className="bl-index" aria-label="Beliefs">
          <ol>
            {BELIEFS.map((b, i) => (
              <li key={b.id}>
                <a href={`#${b.id}`} aria-current={active === b.id ? 'true' : undefined}>
                  <span>{ROMAN[i]}</span>
                  {b.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="bl-list">
          {BELIEFS.map((b, i) => (
            <li key={b.id} id={b.id} className="bl-item">
              <Reveal>
                <span className="bl-item__num" aria-hidden="true">
                  {ROMAN[i]}
                </span>
                <h2 className="bl-item__title">{b.title}</h2>
                <p className="bl-item__text">{b.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <section className="section container bl-cta">
        <h2 className="bl-cta__title">Ready to take the first step?</h2>
        <Link to="/follow-jesus" className="btn btn--primary btn--lg">
          Follow Jesus
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
