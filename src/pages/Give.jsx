import { ArrowUpRight, Check, Copy, Mail, MessageSquareText, Play, Smartphone } from 'lucide-react'
import { useRef, useState } from 'react'
import { LogoMark } from '../components/Logo.jsx'
import Reveal from '../components/Reveal.jsx'
import { SITE } from '../data/site.js'
import { usePage } from '../hooks/usePage.js'
import './give.css'

const { giving } = SITE

function FundCard({ fund }) {
  const ref = useRef(null)

  const tilt = (e) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const reset = () => {
    ref.current?.style.removeProperty('--rx')
    ref.current?.style.removeProperty('--ry')
  }

  return (
    <div className="gv-card-wrap" onPointerMove={tilt} onPointerLeave={reset}>
      <div className="gv-card" ref={ref} key={fund.id}>
        <div className="gv-card__top">
          <LogoMark className="gv-card__mark" />
          <span className="gv-card__chip" aria-hidden="true" />
        </div>
        <p className="gv-card__label">Giving to</p>
        <p className="gv-card__name">{fund.long}</p>
        <div className="gv-card__foot">
          <span>Text “{fund.keyword}”</span>
          <span>{giving.textNumber.display}</span>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text, label }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className="gv-copy"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setDone(true)
          setTimeout(() => setDone(false), 1800)
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {done ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span>{done ? 'Copied' : label}</span>
    </button>
  )
}

export default function Give() {
  usePage({
    id: 'give',
    themeColor: '#03140f',
    title: 'Give',
    description: 'Give to the Upper Room Church of God in Christ online with Pushpay, by Text-2-Give, or by mail.',
  })
  const [fundId, setFundId] = useState(giving.funds[0].id)
  const fund = giving.funds.find((f) => f.id === fundId)
  const [playing, setPlaying] = useState(false)
  const smsHref = `sms:${giving.textNumber.raw}?&body=${encodeURIComponent(fund.keyword)}`

  return (
    <div className="pg-give">
      <section className="gv-hero">
        <div className="gv-hero__rays" aria-hidden="true" />
        <div className="container gv-hero__grid">
          <div className="gv-hero__copy">
            <p className="eyebrow">Giving options</p>
            <h1 className="gv-title">
              Give with
              <br />
              <span className="accent-word">a cheerful heart.</span>
            </h1>
            <p className="lead">However God calls you to faithfully give, we make it simple.</p>

            <div className="gv-funds" role="radiogroup" aria-label="Choose where to give">
              {giving.funds.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={f.id === fundId}
                  className="gv-fund"
                  onClick={() => setFundId(f.id)}
                >
                  <span className="gv-fund__dot" aria-hidden="true" />
                  <span className="gv-fund__text">
                    <strong>{f.label}</strong>
                    <small>{f.long}</small>
                  </span>
                </button>
              ))}
            </div>

            <div className="gv-hero__actions">
              <a className="btn btn--primary btn--lg" href={fund.url} target="_blank" rel="noreferrer">
                Give to {fund.label} online
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="btn btn--ghost btn--lg" href={smsHref}>
                <Smartphone aria-hidden="true" />
                Text to give
              </a>
            </div>
            <p className="gv-secure">Secure giving powered by Pushpay</p>
          </div>

          <FundCard fund={fund} />
        </div>
      </section>

      <section className="section container">
        <div className="gv-ways">
          <Reveal className="gv-way gv-way--text">
            <MessageSquareText className="gv-way__icon" aria-hidden="true" />
            <h2 className="gv-h2">Text-2-Give</h2>
            <p className="gv-way__lead">Send one word from your phone. That’s it.</p>
            <ul className="gv-sms">
              {giving.funds.map((f) => (
                <li key={f.id} className="gv-sms__row">
                  <span className="gv-sms__to">To give to {f.label}</span>
                  <span className="gv-sms__bubble">{f.keyword}</span>
                  <span className="gv-sms__num">to {giving.textNumber.display}</span>
                </li>
              ))}
            </ul>
            <CopyButton text={giving.textNumber.display} label="Copy number" />
          </Reveal>

          <Reveal className="gv-way gv-way--mail" delay={90}>
            <Mail className="gv-way__icon" aria-hidden="true" />
            <h2 className="gv-h2">Mail your gift</h2>
            <p className="gv-way__lead">Prefer a check? Send it here.</p>
            <address className="gv-envelope">
              {SITE.mailing.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span className="gv-envelope__stamp" aria-hidden="true">
                <LogoMark />
              </span>
            </address>
            <CopyButton text={SITE.mailing.join('\n')} label="Copy address" />
          </Reveal>
        </div>
      </section>

      <section className="section gv-why" id="why">
        <div className="container gv-why__grid">
          <Reveal className="gv-why__copy">
            <p className="eyebrow">Why we give</p>
            <h2 className="gv-h2">Spend less. Do more ministry.</h2>
            <p>
              We thank you for your kindness and generosity. The Upper Room is always looking for ways to advance the
              Kingdom, and Pushpay allows us the opportunity to spend less and do more ministry. Great things are
              happening at the Upper Room, and we are grateful for your partnership. May God bless you and yours.
            </p>
          </Reveal>
          <Reveal className="gv-video" delay={90}>
            {playing ? (
              <video src={giving.whyWeGiveVideo} controls autoPlay playsInline />
            ) : (
              <button type="button" className="gv-video__poster" onClick={() => setPlaying(true)}>
                <span className="gv-video__play">
                  <Play aria-hidden="true" />
                </span>
                <span>Watch the ministry impact video</span>
              </button>
            )}
          </Reveal>
        </div>
      </section>

      <section className="section--tight container gv-help">
        <p>
          Questions or concerns about your giving? Email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </section>
    </div>
  )
}
