import { useState } from 'react'
import DeptPage, { DeptSection, GroupGrid } from '../components/DeptPage.jsx'
import { GROUPS } from '../data/ministries.js'

const YOUTH = GROUPS.filter((g) => g.dept === 'youth' && g.ages)

export default function Youth() {
  const [age, setAge] = useState(14)
  const matches = YOUTH.filter((g) => age >= g.ages[0] && age <= g.ages[1])

  return (
    <DeptPage
      id="youth"
      themeColor="#07080a"
      title="Generation NOW"
      heroWord="NOW"
      lead="Our mission is to equip young men and women with the tools they need to become God’s representatives on Earth, fully prepared to stand on God’s Truth in any situation and at any given moment."
      groupsTitle="Every Generation NOW program"
      join={{
        title: 'Join Generation NOW',
        text: 'Parents and young people, tell us who is joining and which program fits. A youth leader will follow up with details.',
      }}
    >
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
          <p className="yt-ages__empty">Talk to a youth leader on Thursday night and we’ll find the right spot for you.</p>
        )}
      </DeptSection>
    </DeptPage>
  )
}
