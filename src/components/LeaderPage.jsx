import { ArrowDown, FileText } from 'lucide-react'
import { usePage } from '../hooks/usePage.js'
import BookingForm from './BookingForm.jsx'
import Img from './Img.jsx'
import Reveal from './Reveal.jsx'
import '../pages/leader.css'

export default function LeaderPage({ id, theme, themeColor, name, short, role, portrait, action, bio, quote, pdf }) {
  usePage({ id, theme, themeColor, title: name, description: bio[0] })

  return (
    <div className={`pg-leader ld--${id}`}>
      <section className="ld-hero">
        <div className="container ld-hero__grid">
          <div className="ld-hero__copy">
            <p className="eyebrow">{role}</p>
            <h1 className="ld-title">{name}</h1>
            {quote && <p className="ld-quote">“{quote}”</p>}
            <div className="ld-hero__actions">
              <a className="btn btn--primary btn--lg" href="#book">
                Book {short}
                <ArrowDown aria-hidden="true" />
              </a>
              <a className="btn btn--ghost btn--lg" href={pdf} target="_blank" rel="noreferrer">
                <FileText aria-hidden="true" />
                Full biography
              </a>
            </div>
          </div>
          <figure className="ld-portrait">
            <Img name={portrait} alt={name} priority />
          </figure>
        </div>
      </section>

      <section className="section container ld-bio">
        <Reveal className="ld-bio__text">
          {bio.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </Reveal>
        <Reveal className="ld-bio__photo" delay={90}>
          <Img name={action} alt="" />
        </Reveal>
      </section>

      <section className="section ld-book" id="book">
        <div className="container ld-book__grid">
          <Reveal>
            <p className="eyebrow">Speaking invitations</p>
            <h2 className="ld-h2">Book {name}</h2>
            <p className="ld-book__lead">
              Share the details of your event and the executive office will follow up about availability.
            </p>
          </Reveal>
          <Reveal className="ld-book__panel" delay={90}>
            <BookingForm speaker={name} />
          </Reveal>
        </div>
      </section>
    </div>
  )
}
