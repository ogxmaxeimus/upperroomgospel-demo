import DeptPage, { DeptSection } from '../components/DeptPage.jsx'
import Reveal from '../components/Reveal.jsx'
import { useNow } from '../hooks/useNow.js'
import { durationParts, todayKey, weekdayOf, zonedToEpoch } from '../lib/time.js'

// Start of the current or next third Saturday of the month, Eastern time.
function nextThirdSaturday(now) {
  const [y, m] = todayKey(now).split('-').map(Number)
  for (let i = 0; i < 3; i++) {
    const year = y + Math.floor((m - 1 + i) / 12)
    const month = ((m - 1 + i) % 12) + 1
    const first = `${year}-${String(month).padStart(2, '0')}-01`
    const offset = (6 - weekdayOf(first) + 7) % 7
    const day = 1 + offset + 14
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    if (zonedToEpoch(key, 24 * 60) > now) return zonedToEpoch(key, 0)
  }
  return null
}

function Countdown() {
  const now = useNow(1000)
  const target = nextThirdSaturday(now)
  if (!target) return null
  if (target <= now) return <p className="ev-count__today">Today is Great Commission Saturday.</p>
  const parts = durationParts(target - now)
  const units = [
    ['days', parts.days],
    ['hours', parts.hours],
    ['minutes', parts.minutes],
  ]
  return (
    <div className="ev-count" role="timer" aria-label="Time until the next Great Commission Saturday">
      {units.map(([label, value]) => (
        <div key={label} className="ev-count__unit">
          <strong>{value ?? 0}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function Evangelism() {
  return (
    <DeptPage
      id="evangelism"
      themeColor="#031417"
      title="Raleigh and beyond"
      heroExtra={<div className="ev-radar" aria-hidden="true" />}
      lead="Here are some of the ways we show the love and mercy of Christ to Raleigh and our regional community."
      groupsTitle="Ways we reach out"
      join={{
        title: 'Join the Evangelism Ministry',
        text: 'Have a burning passion to reach the lost? Tell us how you’d like to serve and we’ll connect you with the team.',
      }}
    >
      <DeptSection eyebrow="The Great Commission" title="Third Saturdays, out in the community.">
        <div className="dp-split">
          <Reveal className="dp-prose">
            <p>
              We have a burning passion to reach the lost with the message of Jesus Christ and to help those who are in
              need. This ministry meets on the third Saturday of each month to canvass the community with the gospel of
              Jesus Christ.
            </p>
            <Countdown />
          </Reveal>
          <Reveal className="dp-card" delay={80}>
            <p className="eyebrow eyebrow--plain">Happy Warriors</p>
            <blockquote className="ev-verse">
              “Speak up for those who cannot speak for themselves…”
              <footer className="dp-prose">Proverbs 31:8</footer>
            </blockquote>
            <p className="dp-prose">
              Inspired by these words, our Happy Warriors share the gospel of Jesus Christ every Saturday while
              providing help and support to women who are afraid and discouraged.
            </p>
          </Reveal>
        </div>
      </DeptSection>
    </DeptPage>
  )
}
