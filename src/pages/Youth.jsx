import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import AddToCalendar from '../components/AddToCalendar.jsx'
import DeptPage, { DeptSection, GroupGrid } from '../components/DeptPage.jsx'
import Reveal from '../components/Reveal.jsx'
import { GROUPS } from '../data/ministries.js'
import { getEvent, nextOccurrence } from '../lib/events.js'
import { formatDate, formatTimeRange } from '../lib/time.js'

const YOUTH = GROUPS.filter((g) => g.dept === 'youth' && g.ages)
const IMPACT = getEvent('impact-saturday')

function NextImpact() {
  const occ = nextOccurrence(IMPACT)
  if (!occ) return null
  return (
    <Reveal className="dp-card yt-next">
      <p className="eyebrow eyebrow--plain">Next Impact Saturday</p>
      <p className="yt-next__date">{formatDate(occ.date)}</p>
      <p className="yt-next__time">
        {formatTimeRange(occ.start, occ.end)} · {IMPACT.location}
      </p>
      <p className="dp-prose">{IMPACT.summary}</p>
      <AddToCalendar occurrence={occ} className="btn btn--primary" />
    </Reveal>
  )
}

export default function Youth() {
  const [age, setAge] = useState(14)
  const matches = YOUTH.filter((g) => age >= g.ages[0] && age <= g.ages[1])

  return (
    <DeptPage
      id="youth"
      themeColor="#07080a"
      title="Impact Saturdays"
      heroWord="IMPACT"
      lead="Every 4th Saturday, elementary through high school students come together at the Upper Room. Our mission is to equip young men and women to become God’s representatives on Earth, fully prepared to stand on God’s Truth in any situation and at any given moment."
      groupsTitle="Every youth program"
      join={{
        title: 'Join Impact Saturdays',
        text: 'Parents and young people, tell us who is joining and which program fits. A youth leader will follow up with details.',
      }}
    >
      <DeptSection eyebrow="When we meet" title="Every 4th Saturday.">
        <NextImpact />
      </DeptSection>

      <DeptSection eyebrow="After high school" title="Keep growing." id="after">
        <div className="yt-after">
          <Link className="dp-card yt-after__link" to="/ministries/thrive">
            <strong>THRIVE</strong>
            <span>College & young professionals, 18 to 25</span>
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className="dp-card yt-after__link" to="/ministries/focus">
            <strong>FOCUS</strong>
            <span>Young Adult Ministry</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </DeptSection>

      <DeptSection eyebrow="Find your fit" title="How old are you?">
        <div className="yt-ages">
          <label htmlFor="yt-age" className="sr-only">
            Age
          </label>
          <output className="yt-ages__value" htmlFor="yt-age">
            {age}
          </output>
          <input id="yt-age" type="range" min="4" max="25" value={age} onChange={(e) => setAge(Number(e.target.value))} />
        </div>
        {matches.length ? (
          <GroupGrid groups={matches} />
        ) : (
          <p className="yt-ages__empty">Talk to a youth leader at Impact Saturdays and we’ll find the right spot for you.</p>
        )}
      </DeptSection>
    </DeptPage>
  )
}
