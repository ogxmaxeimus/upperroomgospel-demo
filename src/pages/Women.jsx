import { Pause, Play } from 'lucide-react'
import { useRef, useState } from 'react'
import DeptPage, { DeptSection } from '../components/DeptPage.jsx'
import Reveal from '../components/Reveal.jsx'
import { PRAYER_TRACKS } from '../data/media.js'

function PrayerPlayer() {
  const audio = useRef(null)
  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)

  const choose = (track) => {
    const el = audio.current
    if (current?.src === track.src) {
      if (el.paused) el.play()
      else el.pause()
      return
    }
    setCurrent(track)
    el.src = track.src
    el.play()
  }

  return (
    <div>
      <ul className="wm-player">
        {PRAYER_TRACKS.map((t) => {
          const active = current?.src === t.src
          return (
            <li key={t.src}>
              <button type="button" className="wm-track" aria-pressed={active} onClick={() => choose(t)}>
                <span className="wm-track__btn" aria-hidden="true">
                  {active && playing ? <Pause /> : <Play />}
                </span>
                <span className="wm-track__title">
                  {t.title}
                  <small>{t.by}</small>
                </span>
                <span className="wm-track__len">{t.length}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <audio
        ref={audio}
        className="wm-audio"
        controls
        hidden={!current}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  )
}

export default function Women() {
  return (
    <DeptPage
      id="women"
      themeColor="#1a0b1e"
      title="A spiritual sisterhood"
      lead="Join us as we inspire each other to live a purposeful life in Christ, grow in our relationship with God and each other, and share our faith with those who’ve yet to know the Lord."
      groupsTitle="Auxiliaries"
      join={{
        title: 'Join the Women’s Ministry',
        text: 'There are many opportunities to serve, learn, and use your God-given gifts. Tell us where your heart is and we’ll help you find one that suits you.',
      }}
    >
      <DeptSection eyebrow="2nd Tuesday Night Sisters" title="The focal point of our women’s ministry.">
        <Reveal className="dp-prose">
          <p>
            2nd Tuesday Night Sisters is an interactive and socially engaging Bible study in which women meet monthly
            from March to October. It is an opportunity for women to experience unprecedented spiritual and social
            growth. If you’ve been searching for an invigorating community that fosters growth, healing, and
            connection, we look forward to meeting you.
          </p>
        </Reveal>
        <div className="wm-pillars">
          {['Discipleship', 'Mentorship', 'Fellowship'].map((p, i) => (
            <Reveal key={p} className="wm-pillar" delay={i * 80}>
              {p}
            </Reveal>
          ))}
        </div>
      </DeptSection>

      <DeptSection eyebrow="Pray along" title="Prayers from First Lady Wooden">
        <PrayerPlayer />
      </DeptSection>
    </DeptPage>
  )
}
