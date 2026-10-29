import DeptPage, { DeptSection } from '../components/DeptPage.jsx'
import Reveal from '../components/Reveal.jsx'

const BARS = Array.from({ length: 28 }, (_, i) => ({
  animationDelay: `${(i * 137) % 900}ms`,
  animationDuration: `${700 + ((i * 211) % 700)}ms`,
}))

export default function MusicArts() {
  return (
    <DeptPage
      id="music"
      themeColor="#08040c"
      title="Worship in every art form"
      image="stageWide"
      lead="Led by the Holy Ghost, the purpose of Upper Room COGIC’s Music & Fine Arts department is to equip, empower, and encourage individuals whom God has gifted in the ministry of arts."
      groupsTitle="The lineup"
      groupsNumbered
      join={{
        title: 'Join Music & Fine Arts',
        text: 'Singers, musicians, dancers and actors: tell us your gift and which group you’re drawn to.',
      }}
    >
      <DeptSection eyebrow="One department, many voices" title="A vibrant community of Spirit-filled believers.">
        <Reveal className="dp-prose">
          <p>
            Each group works together to enhance Upper Room’s Music & Fine Arts department as a whole. The result is a
            vibrant community of talented Spirit-filled believers who joyfully worship God through their unique gifts.
          </p>
        </Reveal>
        <div className="ms-eq" aria-hidden="true">
          {BARS.map((style, i) => (
            <span key={i} style={style} />
          ))}
        </div>
      </DeptSection>
    </DeptPage>
  )
}
