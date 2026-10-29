import LeaderPage from '../components/LeaderPage.jsx'
import { SITE } from '../data/site.js'

export default function Bishop() {
  return (
    <LeaderPage
      id="bishop"
      themeColor="#0a0a0a"
      name="Bishop Patrick L. Wooden, Sr."
      short="Bishop Wooden"
      role="Pastor · Upper Room Church of God in Christ"
      portrait="bishopPortrait"
      action="bishopPreachingBw"
      pdf={SITE.bios.bishop}
      quote="I love you enough to tell you the truth."
      bio={[
        'Bishop Patrick L. Wooden, Sr. is a soul-stirring gospel preacher and an influential voice for God who courageously speaks about the moral and social issues of our day. He concerns himself with delivering a word that is biblically relevant and life changing without focusing upon what is popular or politically correct.',
        'Bishop Wooden has been the pastor of Upper Room for over 38 years and leads with love, compassion, strength and sincerity. He takes seriously his responsibility as a “watchman on the wall,” keeping the congregants informed so that they will not be deceived.',
        'He is also a significant voice in the community, known as a voice for the voiceless.',
      ]}
    />
  )
}
