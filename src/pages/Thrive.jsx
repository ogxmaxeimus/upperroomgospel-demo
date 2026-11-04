import { ArrowDown, ArrowUpRight } from 'lucide-react'
import JoinSection from '../components/JoinSection.jsx'
import Reveal from '../components/Reveal.jsx'
import { DEPARTMENTS } from '../data/ministries.js'
import { usePage } from '../hooks/usePage.js'
import './thrive.css'

const IG = 'https://www.instagram.com/urthrive_1825/'

const STAGES = [
  { word: 'Arise', text: 'Wherever this season finds you, stand up in your faith and step into what God has for you.' },
  { word: 'Be planted', text: 'Put down roots in a church family and a community of people your age walking the same road.' },
  { word: 'Thrive', text: 'Grow into who God called you to be, in the classroom, in your career, and in your walk with Him.' },
]

function Leaf({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 160" aria-hidden="true">
      <path d="M60 154C60 110 60 70 60 20" />
      <path d="M60 120C20 112 8 76 14 44c34 4 50 34 46 76Z" />
      <path d="M60 92c36-6 50-36 44-66-32 4-48 30-44 66Z" />
      <path d="M60 20c-8 10-8 22 0 32 8-10 8-22 0-32Z" />
    </svg>
  )
}

export default function Thrive() {
  const dept = DEPARTMENTS.thrive
  usePage({ id: 'dept-thrive', themeColor: '#1f3557', title: dept.name, description: dept.blurb })

  return (
    <div className="pg-thrive">
      <section className="th-hero">
        <Leaf className="th-hero__leaf" />
        <div className="container th-hero__inner">
          <p className="th-kicker">{dept.kicker}</p>
          <h1 className="th-title">THRIVE</h1>
          <p className="th-hero__lead">
            A community for students and young adults, ages 18 to 25. College or career, it’s a place to arise, be planted, and thrive.
          </p>
          <div className="th-hero__actions">
            <a className="btn btn--primary btn--lg" href="#join">
              How to join
              <ArrowDown aria-hidden="true" />
            </a>
            <a className="btn btn--ghost btn--lg" href={IG} target="_blank" rel="noreferrer">
              @urthrive_1825
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="section th-growth" aria-labelledby="th-growth-title">
        <div className="container">
          <Reveal>
            <p className="th-kicker">College or career</p>
            <h2 id="th-growth-title" className="th-h2">
              A place to grow.
            </h2>
          </Reveal>
          <ol className="th-stages">
            {STAGES.map((s, i) => (
              <Reveal as="li" key={s.word} className="th-stage" delay={i * 90}>
                <span className="th-stage__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="th-stage__word">{s.word}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section th-follow">
        <Reveal className="container th-follow__card">
          <Leaf className="th-follow__leaf" />
          <div>
            <p className="th-kicker">Thrive Upper Room College &amp; YA</p>
            <h2 className="th-h2">Follow along on Instagram.</h2>
            <p>Gatherings, announcements, and ways to connect are posted on @urthrive_1825.</p>
          </div>
          <a className="btn btn--primary btn--lg" href={IG} target="_blank" rel="noreferrer">
            Follow @urthrive_1825
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Reveal>
      </section>

      <JoinSection ministry={dept.name} title="Get planted with THRIVE" interests={['College', 'Career', 'Serving']} className="th-join">
        <p>Tell us a little about you and where you are in this season. Someone from THRIVE will reach out.</p>
      </JoinSection>
    </div>
  )
}
