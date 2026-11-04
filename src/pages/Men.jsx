import { ArrowUpRight } from 'lucide-react'
import DeptPage, { DeptSection } from '../components/DeptPage.jsx'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'

const BELIEVE = [
  'Jesus is, and always will be, Lord;',
  'God’s Word should be preached without hesitation;',
  'our senior statesmen have sage wisdom to share; and',
  'men should be men and that testosterone is welcome here.',
]

const BIBLICAL_MAN = [
  ['is of honest report, and full of the Holy Ghost', 'Acts 6:3'],
  ['has a dedicated prayer life', '1 Timothy 2:8'],
  ['desires nothing but God’s Truth', 'Psalm 119:11'],
  ['displays a genuine love for his wife while actively strengthening his marriage', 'Ephesians 5:25'],
]

const SCHEDULE = [
  ['Every Tuesday', 'Men’s Prayer via conference call', '6:00 to 6:30 AM'],
  ['2nd Saturday', 'Serving food to the community', '8:30 to 11:00 AM'],
  ['2nd Saturday', 'Serving at the men’s shelter', '5:30 to 7:30 PM'],
  ['4th Tuesday', 'Men only Bible study with Bishop Wooden', '7:30 to 8:30 PM'],
]

export default function Men() {
  return (
    <DeptPage
      id="men"
      themeColor="#111213"
      video={{ src: '/video/men-hero.mp4', poster: '/video/men-hero-poster.jpg' }}
      title="Mighty men of God"
      hideTitle
      lead="Join us at the Upper Room COGIC as we form a community of mighty men who love God, family, and ministry."
      groupsTitle="Opportunities to serve"
      join={{
        title: 'We need you',
        text: 'Ready to volunteer or just want to show up for Bible study? Raise your hand and the Men’s Department will reach out.',
      }}
    >
      <DeptSection eyebrow="What we believe" title="We believe in the God of the Bible.">
        <div className="dp-split">
          <Reveal className="dp-card">
            <p className="dp-prose">We also believe that:</p>
            <ul className="dp-list">
              {BELIEVE.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="dp-card" delay={80}>
            <p className="dp-prose">A Biblical man is one who:</p>
            <ul className="dp-list">
              {BIBLICAL_MAN.map(([line, ref]) => (
                <li key={ref}>
                  <span>
                    {line} <cite>({ref})</cite>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mn-qualified">
              We are considered “qualified men” when we become men of prayer, men of worship, men of praise, men of pride,
              men of passion, and men of purpose.
            </p>
          </Reveal>
        </div>
      </DeptSection>

      <DeptSection eyebrow="Iron sharpens iron" title="Monthly schedule">
        <ul className="dp-schedule">
          {SCHEDULE.map(([when, what, time]) => (
            <li key={what}>
              <span className="dp-schedule__when">{when}</span>
              <span className="dp-schedule__what">{what}</span>
              <span className="dp-schedule__time">{time}</span>
            </li>
          ))}
        </ul>
      </DeptSection>

      <DeptSection eyebrow="Leadership" title="Men’s Department President">
        <Reveal className="mn-leader dp-card">
          <Img name="anthonyWilson" alt="Elder Anthony Wilson" />
          <div>
            <h3 className="dp-h2">Elder Anthony Wilson</h3>
            <p className="dp-prose">
              The Men Only Bible Study with Bishop Patrick L. Wooden, Sr. is the epitome of Iron Sharpening Iron. We
              gather on 4th Tuesday nights at 7:30 p.m. to dive into the Word of God and learn Christ’s instructions on
              manhood, fidelity, and every responsibility we are called to shoulder as men of God.
            </p>
          </div>
        </Reveal>
      </DeptSection>

      <DeptSection eyebrow="Beyond Sunday" title="Upper Room COGIC Network">
        <Reveal className="dp-card mn-network">
          <p className="dp-prose">
            The Upper Room COGIC Network is an online directory of professionals in our church family. Search by job
            type, specialty, or city to find members who offer their skills, services, and mentorship, from creative
            and technology to trades, healthcare, law, finance, and ministry.
          </p>
          <p className="dp-prose">
            Looking for a mentor, a trusted service provider, or a way to share your own gifts? Browse the network and
            connect with brothers across the community.
          </p>
          <a className="btn btn--primary" href="https://upper-room-cogic-network.netlify.app/" target="_blank" rel="noreferrer">
            Visit the Network
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Reveal>
      </DeptSection>
    </DeptPage>
  )
}
