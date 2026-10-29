import { Field, FormShell, FormSuccess } from '../components/Form.jsx'
import Reveal from '../components/Reveal.jsx'
import { usePage } from '../hooks/usePage.js'
import './follow-jesus.css'

const PRAYER = [
  'Lord Jesus,',
  'I believe that you came in the flesh and died on the cross to save me from my sins.',
  'I believe that God raised you on the third day with all power in your hands and you are seated at the right hand of the Father.',
  'I acknowledge that I am a sinner and have fallen short of your glory.',
  'I repent of my sins and I ask you to come into my heart to live and make me new.',
  'I ask that you fill me with the Holy Spirit of promise.',
  'I thank you, Lord, for saving me and from this day forward I choose to serve you.',
  'In Jesus’ name,',
  'Amen.',
]

export default function FollowJesus() {
  usePage({
    id: 'follow-jesus',
    themeColor: '#05060c',
    title: 'Follow Jesus',
    description: 'How to become a follower of Jesus Christ. Today is the day of salvation.',
  })

  return (
    <div className="pg-follow">
      <section className="fj-hero">
        <div className="fj-hero__light" aria-hidden="true" />
        <div className="container fj-hero__inner">
          <p className="eyebrow">How to become a follower of Christ</p>
          <h1 className="fj-title">Today is the day of salvation.</h1>
          <p className="lead">
            We at Upper Room COGIC want everyone to become a follower of Jesus Christ. None of us are promised
            tomorrow.
          </p>
        </div>
      </section>

      <section className="section fj-step fj-step--1">
        <Reveal className="container fj-narrow">
          <p className="fj-step__n">Believe and confess</p>
          <blockquote className="fj-verse">
            “That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath
            raised him from the dead, thou shalt be saved. For with the heart man believeth unto righteousness; and
            with the mouth confession is made unto salvation.”
            <footer>Romans 10:9-10</footer>
          </blockquote>
        </Reveal>
      </section>

      <section className="section fj-step fj-step--2">
        <div className="container fj-narrow">
          <Reveal>
            <p className="fj-step__n">Pray this prayer</p>
            <p className="fj-intro">
              If you do not yet know Jesus Christ, the best decision you will ever make is to accept Jesus as your LORD
              and SAVIOR today. You can make that happen right now by saying this prayer:
            </p>
          </Reveal>
          <div className="fj-prayer">
            {PRAYER.map((line, i) => (
              <Reveal as="p" key={line} delay={i * 60}>
                {line}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section fj-step fj-step--3">
        <div className="container fj-split">
          <Reveal>
            <p className="fj-step__n">Tell someone</p>
            <h2 className="fj-h2">Did you pray that prayer?</h2>
            <p className="fj-intro">
              Be sure to share this wonderful news with someone else by telling them that you have accepted Jesus Christ
              as your Lord and Savior. We would love to celebrate with you and help you take your next steps.
            </p>
          </Reveal>
          <Reveal className="fj-form" delay={90}>
            <FormShell
              name="salvation-decision"
              submitLabel="Share my decision"
              success={
                <FormSuccess title="Welcome to the family!">
                  <p>Heaven is rejoicing, and so are we. Someone from the Upper Room will reach out to you soon.</p>
                </FormSuccess>
              }
            >
              <Field label="Your name" name="name" autoComplete="name" />
              <Field label="Email" name="email" type="email" autoComplete="email" spellCheck={false} />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
              <Field as="textarea" label="Anything you want to share?" name="message" optional span />
            </FormShell>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
