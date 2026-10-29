import { ArrowRight, Baby, Car, HandHeart, MapPin, Navigation, Phone, Plus, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router'
import AddToCalendar from '../components/AddToCalendar.jsx'
import { Choices, Field, FormShell, FormSuccess } from '../components/Form.jsx'
import Img from '../components/Img.jsx'
import { nextService } from '../components/LiveBadge.jsx'
import Reveal from '../components/Reveal.jsx'
import { fullAddress, SITE } from '../data/site.js'
import { useNow } from '../hooks/useNow.js'
import { usePage } from '../hooks/usePage.js'
import { getEvent, nextOccurrence } from '../lib/events.js'
import { formatDate, formatTime, relativeDayLabel, todayKey } from '../lib/time.js'
import './im-new.css'

const SERVICES = [
  {
    id: 'sunday-worship-8am',
    day: 'Sunday',
    time: '8:00',
    meridiem: 'AM',
    name: 'Morning Worship',
    perks: [
      'Children’s Church for ages 4–11',
      'Park in the back lot unless you have special needs',
      'Nursing stations and a room for little ones',
    ],
  },
  {
    id: 'sunday-worship-11am',
    day: 'Sunday',
    time: '11:00',
    meridiem: 'AM',
    name: 'Morning Worship',
    perks: ['Front and back parking lots open', 'Streamed live on YouTube and Facebook', 'Ushers ready to help you find a seat'],
  },
  {
    id: 'thursday-bible-study',
    day: 'Thursday',
    time: '7:30',
    meridiem: 'PM',
    name: 'Bible Study',
    perks: ['Midweek teaching with Bishop Wooden', 'Generation NOW teens meet the same night', 'Streamed live on YouTube and Facebook'],
  },
]

const STEPS = [
  {
    icon: Car,
    title: 'Pull in & park',
    text: 'For the 8 AM service, please park in the back of the church unless you have special needs. For the 11 AM service, both the front and back lots are open.',
  },
  {
    icon: HandHeart,
    title: 'Find a friendly face',
    text: 'Our hospitality team greets you at the door. If you need anything during the service, let an usher or hospitality team member know.',
  },
  {
    icon: Baby,
    title: 'Bring the kids',
    text: 'During the 8 AM service, children ages 4–11 head to Children’s Church, fully synced with the “God First” message. Nursing stations and a special room for young children are available.',
  },
  {
    icon: Sparkles,
    title: 'Worship with us',
    text: 'Praise, prayer, and the preached Word with Bishop Patrick L. Wooden, Sr., delivered with love and without hesitation.',
  },
  {
    icon: Users,
    title: 'Find your place',
    text: 'Upper Room offers many opportunities for fellowship. No matter what your gifts are, there’s a ministry where you can develop and use them for the Lord.',
    link: { to: '/ministries', label: 'Explore ministries' },
  },
]

const FAQS = [
  {
    q: 'Is everyone welcome?',
    a: 'Yes. We welcome everyone to our church, including all ethnic groups. Come as you are.',
  },
  {
    q: 'Where should I park?',
    a: 'For the 8 AM service, please park in the back of the church unless you have special needs. For the 11 AM service, both the front and back parking lots are open for your use.',
  },
  {
    q: 'Is there anything for my kids?',
    a: 'Children ages 4–11 attend Children’s Church during the 8 AM service. We also have nursing stations and a special room for young children who may need to step out of the sanctuary. Teens up to 18 meet for Generation NOW on Thursdays at 7:30 PM.',
  },
  {
    q: 'Can I watch online first?',
    a: (
      <>
        Absolutely. The 11 AM Sunday service and Thursday Bible Study stream live on YouTube and Facebook. <Link to="/watch">Watch the latest message</Link>.
      </>
    ),
  },
  {
    q: 'What if I need help during the service?',
    a: 'Just let the hospitality team or an usher know. They’re there to help with anything you need.',
  },
  {
    q: 'What does Upper Room believe?',
    a: (
      <>
        We’re a Church of God in Christ congregation. Read our <Link to="/beliefs">Statement of Faith</Link>, or learn how to{' '}
        <Link to="/follow-jesus">begin a relationship with Jesus</Link>.
      </>
    ),
  },
]

function dayLabel(date, now) {
  const relative = relativeDayLabel(date, todayKey(now))
  return relative === 'Today' || relative === 'Tomorrow' ? relative : formatDate(date, { weekday: 'short', month: 'short', day: 'numeric' })
}

function VisitorPass({ now }) {
  const next = nextService(now)
  if (!next) return null
  return (
    <div className="nv-pass" aria-label="Your next chance to visit">
      <div className="nv-pass__main">
        <p className="nv-pass__kicker">Visitor pass · Admit all</p>
        <p className="nv-pass__title">{next.event.title}</p>
        <dl className="nv-pass__grid">
          <div>
            <dt>Date</dt>
            <dd>{dayLabel(next.date, now)}</dd>
          </div>
          <div>
            <dt>Time</dt>
            <dd className="tabular">{formatTime(next.start)}</dd>
          </div>
          <div>
            <dt>Seat</dt>
            <dd>Saved</dd>
          </div>
        </dl>
      </div>
      <div className="nv-pass__stub" aria-hidden="true">
        <span>Upper Room</span>
        <span className="nv-pass__barcode" />
      </div>
    </div>
  )
}

function PlanVisitForm() {
  return (
    <FormShell
      name="plan-visit"
      submitLabel="Save my seat"
      success={
        <FormSuccess title="We can’t wait to meet you!">
          <p>Thanks for letting us know you’re coming. Our hospitality team will be looking for you. If you have questions before then, call us at {SITE.phone.display}.</p>
        </FormSuccess>
      }
    >
      <Field label="Your name" name="name" autoComplete="name" placeholder="First and last name…" />
      <Field label="Email" name="email" type="email" autoComplete="email" inputMode="email" spellCheck={false} placeholder="name@example.com" />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" optional placeholder="(919) 555-0123" />
      <Field as="select" label="Party size" name="party-size" optional defaultValue="">
        <option value="">Choose…</option>
        <option value="Just me">Just me</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5+">5 or more</option>
      </Field>
      <Choices
        legend="Which service?"
        name="service"
        options={[
          { value: 'Sunday 8:00 AM', label: 'Sunday 8 AM', meta: 'Children’s Church' },
          { value: 'Sunday 11:00 AM', label: 'Sunday 11 AM', meta: 'Both lots open' },
          { value: 'Thursday 7:30 PM', label: 'Thursday 7:30 PM', meta: 'Bible Study' },
        ]}
      />
      <Field label="Visit date" name="visit-date" type="date" optional min={todayKey()} />
      <Choices
        legend="Kids coming?"
        name="kids"
        optional
        span={false}
        options={[
          { value: 'Yes', label: 'Yes' },
          { value: 'No', label: 'No' },
        ]}
      />
      <Field as="textarea" label="Anything we should know?" name="notes" optional span placeholder="Accessibility needs, questions, prayer requests…" />
    </FormShell>
  )
}

export default function ImNew() {
  const now = useNow(60000)
  usePage({
    id: 'im-new',
    theme: 'light',
    themeColor: '#f6f1e7',
    title: 'I’m New',
    description: 'Planning your first visit to Upper Room COGIC in Raleigh? Service times, parking, kids, and what to expect.',
  })

  return (
    <div className="pg-new">
      <section className="nv-hero">
        <div className="container nv-hero__grid">
          <div className="nv-hero__copy">
            <p className="nv-hero__badge">
              <span className="nv-hero__dot" aria-hidden="true" />
              Welcome to the Upper Room
            </p>
            <h1 className="nv-hero__title display">
              First time?
              <span className="nv-hero__accent accent-word">
                <span>We saved you a seat.</span>
              </span>
            </h1>
            <p className="nv-hero__lead">
              We welcome everyone to our church, including all ethnic groups. Here’s everything you need for an easy first visit, from parking to
              kids to what happens when you walk in.
            </p>
            <div className="nv-hero__actions">
              <a href="#plan" className="btn btn--primary btn--lg">
                Plan your visit
                <ArrowRight aria-hidden="true" />
              </a>
              <a href={SITE.directionsUrl} className="btn btn--ghost btn--lg" target="_blank" rel="noreferrer">
                <Navigation aria-hidden="true" />
                Directions
              </a>
            </div>
          </div>

          <div className="nv-hero__visual">
            <div className="nv-hero__photo">
              <Img name="greeting" priority />
            </div>
            <span className="nv-hero__stamp" aria-hidden="true">
              <span>All are</span>
              <strong>Welcome</strong>
            </span>
            <VisitorPass now={now} />
          </div>
        </div>
      </section>

      <section className="nv-services section--tight" aria-labelledby="nv-services-title">
        <div className="container">
          <Reveal className="nv-head">
            <p className="eyebrow">Step one</p>
            <h2 id="nv-services-title" className="h2 display">
              Pick your <span className="accent-word">service.</span>
            </h2>
          </Reveal>
          <ol className="nv-tickets" role="list">
            {SERVICES.map((service, index) => {
              const occurrence = nextOccurrence(getEvent(service.id), now)
              return (
                <Reveal as="li" key={service.id} className="nv-ticket" delay={index * 90}>
                  <div className="nv-ticket__top">
                    <p className="nv-ticket__day">{service.day}</p>
                    <p className="nv-ticket__time tabular">
                      {service.time}
                      <span>{service.meridiem}</span>
                    </p>
                    <h3 className="nv-ticket__name">{service.name}</h3>
                  </div>
                  <ul className="nv-ticket__perks" role="list">
                    {service.perks.map((perk) => (
                      <li key={perk}>{perk}</li>
                    ))}
                  </ul>
                  {occurrence && (
                    <div className="nv-ticket__foot">
                      <p>
                        <span>Next</span>
                        {dayLabel(occurrence.date, now)}
                      </p>
                      <AddToCalendar occurrence={occurrence} label="Add" className="btn btn--ghost btn--sm" />
                    </div>
                  )}
                </Reveal>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="nv-steps section" aria-labelledby="nv-steps-title">
        <div className="container nv-steps__grid">
          <Reveal className="nv-steps__intro">
            <p className="eyebrow">What to expect</p>
            <h2 id="nv-steps-title" className="h2 display">
              Your first visit, <span className="accent-word">step by step.</span>
            </h2>
            <div className="nv-steps__photo">
              <Img name="congregationPraise" />
            </div>
          </Reveal>
          <ol className="nv-route" role="list">
            {STEPS.map(({ icon: Icon, title, text, link }, index) => (
              <Reveal as="li" key={title} className="nv-route__stop" delay={index * 60}>
                <span className="nv-route__pin" aria-hidden="true">
                  <Icon />
                </span>
                <div>
                  <p className="nv-route__num label-font">Stop {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="nv-route__title">{title}</h3>
                  <p className="nv-route__text">{text}</p>
                  {link && (
                    <Link to={link.to} className="text-link">
                      {link.label}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="nv-faq section--tight" aria-labelledby="nv-faq-title">
        <div className="container nv-faq__grid">
          <Reveal>
            <p className="eyebrow">Good questions</p>
            <h2 id="nv-faq-title" className="h2 display">
              Ask <span className="accent-word">anything.</span>
            </h2>
            <p className="nv-faq__aside">
              Still wondering about something? Call the church office at{' '}
              <a href={SITE.phone.href} className="nowrap">
                {SITE.phone.display}
              </a>
              , {SITE.officeHours.label}.
            </p>
          </Reveal>
          <div className="faq">
            {FAQS.map((item) => (
              <details key={item.q} className="faq__item">
                <summary>
                  {item.q}
                  <Plus aria-hidden="true" />
                </summary>
                <p className="faq__answer">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="plan" className="nv-plan section" aria-labelledby="nv-plan-title">
        <div className="container nv-plan__grid">
          <Reveal className="nv-plan__copy">
            <p className="eyebrow">Plan your visit</p>
            <h2 id="nv-plan-title" className="h2 display">
              Let us know <span className="accent-word">you’re coming.</span>
            </h2>
            <p>Tell us when to expect you and our hospitality team will be looking for you. Have a question first? Add it to the form.</p>
          </Reveal>
          <Reveal className="nv-plan__card" delay={120}>
            <PlanVisitForm />
          </Reveal>
        </div>
      </section>

      <section className="nv-map section--tight" aria-labelledby="nv-map-title">
        <div className="container nv-map__grid">
          <div className="nv-map__frame">
            <iframe
              src={SITE.mapEmbedUrl}
              title="Map showing Upper Room Church of God in Christ in Raleigh"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <Reveal className="nv-map__card">
            <p className="eyebrow">Find us</p>
            <h2 id="nv-map-title" className="h3 display">
              Come see us in Raleigh
            </h2>
            <p className="nv-map__addr">
              <MapPin aria-hidden="true" />
              {fullAddress}
            </p>
            <p className="nv-map__addr">
              <Phone aria-hidden="true" />
              <a href={SITE.phone.href}>{SITE.phone.display}</a>
            </p>
            <div className="nv-map__actions">
              <a className="btn btn--primary" href={SITE.directionsUrl} target="_blank" rel="noreferrer">
                Google Maps
              </a>
              <a className="btn btn--ghost" href={SITE.appleMapsUrl} target="_blank" rel="noreferrer">
                Apple Maps
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
