import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '../components/BrandIcons.jsx'
import JoinSection from '../components/JoinSection.jsx'
import Reveal from '../components/Reveal.jsx'
import { DEPARTMENTS } from '../data/ministries.js'
import { usePage } from '../hooks/usePage.js'
import './focus.css'

const FB = 'https://www.facebook.com/focusyoungadultministry/'
const IG = 'https://www.instagram.com/focusyoungadultministry'
const WORDS = ['FOCUS', 'GOD FIRST', 'YOUNG ADULTS', 'UPPER ROOM', 'FOCUS', 'GOD FIRST', 'YOUNG ADULTS', 'UPPER ROOM']
const TAGS = ['Young adults', 'God first', 'Fellowship', 'Bible study', 'Serving']

function Ticker({ reverse = false }) {
  return (
    <div className={`fc-ticker${reverse ? ' fc-ticker--rev' : ''}`} aria-hidden="true">
      <div className="fc-ticker__track">
        {[0, 1].map((n) => (
          <span key={n} className="fc-ticker__set">
            {WORDS.map((w, i) => (
              <span key={i}>
                {w}
                <b>{'\u2726'}</b>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Focus() {
  const dept = DEPARTMENTS.focus
  usePage({ id: 'dept-focus', themeColor: '#2b2b2b', title: dept.name, description: dept.blurb })

  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    const set = (name, value) => el.style.setProperty(name, value)
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      set('--mx', `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`)
      set('--my', `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`)
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => set('--spin', `${(window.scrollY * 0.06).toFixed(2)}deg`))
    }
    el.addEventListener('pointermove', onMove)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="pg-focus">
      <section className="fc-hero" ref={heroRef}>
        <div className="fc-hero__rays" aria-hidden="true" />
        <div className="fc-hero__beam" aria-hidden="true" />
        <div className="fc-hero__spot" aria-hidden="true" />
        <div className="fc-grain" aria-hidden="true" />
        <div className="container fc-hero__inner">
          <div>
            <p className="fc-kicker">{dept.kicker}</p>
            <h1 className="fc-title">
              FOCUS <span>Young Adult Ministry</span>
            </h1>
            <p className="fc-hero__lead">The young adult ministry of the Upper Room Church of God in Christ.</p>
            <ul className="fc-tags" aria-label="FOCUS in a few words">
              {TAGS.map((t, i) => (
                <li key={t} className={`fc-tag fc-tag--${i % 3}`}>
                  {t}
                </li>
              ))}
            </ul>
            <div className="fc-hero__actions">
              <a className="btn btn--primary btn--lg" href="#join">
                How to join
                <ArrowDown aria-hidden="true" />
              </a>
              <a className="btn btn--ghost btn--lg" href={FB} target="_blank" rel="noreferrer">
                <FacebookIcon width="18" height="18" />
                Facebook
              </a>
              <a className="btn btn--ghost btn--lg" href={IG} target="_blank" rel="noreferrer">
                <InstagramIcon width="18" height="18" />
                Instagram
              </a>
            </div>
          </div>
          <div className="fc-hero__logowrap">
            <img className="fc-hero__logo" src="/brand/focus-young-adults.jpg" width="720" height="720" alt="FOCUS Young Adult Ministry logo" />
          </div>
        </div>
      </section>

      <Ticker />

      <section className="section fc-first" aria-labelledby="fc-first-title">
        <div className="fc-grain" aria-hidden="true" />
        <Reveal className="container">
          <p className="fc-kicker">Our focus</p>
          <h2 id="fc-first-title" className="fc-motto">
            God <mark>First.</mark>
          </h2>
        </Reveal>
      </section>

      <Ticker reverse />

      <section className="section fc-follow">
        <div className="container">
          <Reveal>
            <p className="fc-kicker">Stay connected</p>
            <h2 className="fc-h2">Follow FOCUS.</h2>
            <p className="fc-follow__lead">Gatherings, announcements, and ways to get connected are shared on the FOCUS social pages.</p>
          </Reveal>
          <Reveal className="fc-follow__grid">
            <a className="fc-social fc-social--ig" href={IG} target="_blank" rel="noreferrer">
              <InstagramIcon className="fc-social__icon" />
              <span className="fc-social__body">
                <strong>Instagram</strong>
                <span>@focusyoungadultministry</span>
              </span>
              <ArrowUpRight className="fc-social__arrow" aria-hidden="true" />
            </a>
            <a className="fc-social" href={FB} target="_blank" rel="noreferrer">
              <FacebookIcon className="fc-social__icon" />
              <span className="fc-social__body">
                <strong>Facebook</strong>
                <span>FOCUS Young Adult Ministry</span>
              </span>
              <ArrowUpRight className="fc-social__arrow" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>

      <JoinSection ministry={dept.name} title="Join FOCUS" interests={['Fellowship', 'Bible study', 'Serving']} className="fc-join">
        <p>Tell us how to reach you and a FOCUS leader will follow up.</p>
      </JoinSection>
    </div>
  )
}
