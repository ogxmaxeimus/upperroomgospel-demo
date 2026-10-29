import LeaderPage from '../components/LeaderPage.jsx'
import { SITE } from '../data/site.js'

export default function FirstLady() {
  return (
    <LeaderPage
      id="firstlady"
      theme="light"
      themeColor="#fbf3ef"
      name="First Lady Pamela Wooden"
      short="First Lady Wooden"
      role="The jewel of the ministry"
      portrait="firstLadyPortrait"
      action="firstLadyPulpit"
      pdf={SITE.bios.firstLady}
      bio={[
        'First Lady Pamela Wooden is a loving and devoted wife and First Lady working tirelessly with her husband, as she is affectionately called, “the jewel of the ministry.” Her audacious leadership radiates as she passionately directs the Women’s Ministry.',
        'Her desire is to see women grow and live out their God-ordained purpose because only then will they find true contentment. Under First Lady Wooden’s direction, the women’s ministry has taken on a new and exciting focus as they meet on 2nd Tuesday nights to engage in interactive Bible study, fellowship and prayer.',
        'As a result, the women have grown closer to one another and have strengthened their relationships with the Lord. In addition, she is always mindful to reach back and touch the next generation.',
      ]}
    />
  )
}
