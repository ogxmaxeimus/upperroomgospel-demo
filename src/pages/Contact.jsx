import { Clock, Mail, MapPin, Navigation, Phone } from 'lucide-react'
import { useState } from 'react'
import { Check, Field, FormShell, FormSuccess } from '../components/Form.jsx'
import { fullAddress, SITE } from '../data/site.js'
import { useNow } from '../hooks/useNow.js'
import { usePage } from '../hooks/usePage.js'
import { hmToMinutes, nowMinutes, todayKey, weekdayOf } from '../lib/time.js'
import './contact.css'

function OfficeStatus() {
  const now = useNow(30000)
  const { days, open, close, label } = SITE.officeHours
  const minutes = nowMinutes(now)
  const isOpen = days.includes(weekdayOf(todayKey(now))) && minutes >= hmToMinutes(open) && minutes < hmToMinutes(close)
  return (
    <div className="ct-status" data-open={isOpen}>
      <span className="ct-status__dot" aria-hidden="true" />
      <div>
        <strong>{isOpen ? 'The office is open now' : 'The office is closed right now'}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

function PrayerForm() {
  return (
    <FormShell
      name="prayer-request"
      submitLabel="Send my prayer request"
      success={
        <FormSuccess title="We’re praying with you">
          <p>Your request has been received. Keep God first, and know that you are not alone.</p>
        </FormSuccess>
      }
    >
      <Field label="Your name" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" spellCheck={false} />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
      <Field label="Subject" name="subject" optional />
      <Field as="textarea" label="How can we pray for you?" name="message" span />
      <Check name="private">Keep my request private to the pastoral team</Check>
    </FormShell>
  )
}

function ContactForm() {
  return (
    <FormShell
      name="contact"
      submitLabel="Send message"
      success={
        <FormSuccess title="Message sent">
          <p>Thank you for reaching out. Someone from the church office will get back to you soon.</p>
        </FormSuccess>
      }
    >
      <Field label="Your name" name="name" autoComplete="name" />
      <Field label="Email" name="email" type="email" autoComplete="email" spellCheck={false} />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" optional />
      <Field as="select" label="Topic" name="topic" optional defaultValue="">
        <option value="">General question</option>
        <option>Visiting the church</option>
        <option>Giving</option>
        <option>Ministries</option>
        <option>Media and livestream</option>
      </Field>
      <Field as="textarea" label="Message" name="message" span />
    </FormShell>
  )
}

const TABS = [
  { id: 'prayer', label: 'I need prayer', Form: PrayerForm },
  { id: 'contact', label: 'Send a message', Form: ContactForm },
]

export default function Contact() {
  usePage({
    id: 'contact',
    themeColor: '#06101f',
    title: 'Contact',
    description: `Visit, call, or write the Upper Room Church of God in Christ at ${fullAddress}.`,
  })
  const [tab, setTab] = useState('prayer')
  const Active = TABS.find((t) => t.id === tab).Form

  return (
    <div className="pg-contact">
      <section className="ct-hero container">
        <p className="eyebrow">Contact us</p>
        <h1 className="ct-title">We’d love to hear from you.</h1>
        <OfficeStatus />
      </section>

      <section className="container ct-grid">
        <div className="ct-info">
          <a className="ct-tile" href={SITE.phone.href}>
            <Phone aria-hidden="true" />
            <span>Call</span>
            <strong>{SITE.phone.display}</strong>
          </a>
          <a className="ct-tile" href={`mailto:${SITE.email}`}>
            <Mail aria-hidden="true" />
            <span>Email</span>
            <strong>{SITE.email}</strong>
          </a>
          <a className="ct-tile ct-tile--wide" href={SITE.directionsUrl} target="_blank" rel="noreferrer">
            <MapPin aria-hidden="true" />
            <span>Visit us</span>
            <strong>{fullAddress}</strong>
            <em className="ct-tile__cta">
              <Navigation aria-hidden="true" /> Get directions
            </em>
          </a>
          <div className="ct-tile ct-tile--wide">
            <Clock aria-hidden="true" />
            <span>Service times</span>
            <ul className="ct-times">
              {SITE.services.map((s) => (
                <li key={s.id}>
                  <strong>
                    {s.day} {s.time}
                  </strong>
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="ct-map">
            <iframe title="Map to the Upper Room" src={SITE.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>

        <div className="ct-panel">
          <div className="ct-tabs" role="tablist" aria-label="How can we help?">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="ct-tabpanel"
                className="ct-tab"
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div id="ct-tabpanel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            <Active key={tab} />
          </div>
        </div>
      </section>
    </div>
  )
}
