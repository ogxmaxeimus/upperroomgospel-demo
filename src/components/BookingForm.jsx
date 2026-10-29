import { SITE } from '../data/site.js'
import { todayKey } from '../lib/time.js'
import { Field, FormShell, FormSuccess } from './Form.jsx'

export default function BookingForm({ speaker }) {
  return (
    <FormShell
      name="booking-request"
      submitLabel="Send booking request"
      note={
        <>
          Prefer to call? {SITE.booking.role} {SITE.booking.contact}:{' '}
          <a href={SITE.booking.phone.href} className="nowrap">
            {SITE.booking.phone.display}
          </a>
        </>
      }
      success={
        <FormSuccess title="Request received">
          <p>
            Thank you for inviting {speaker}. {SITE.booking.contact} will follow up with you about availability.
            Remember to keep God first!
          </p>
        </FormSuccess>
      }
    >
      <input type="hidden" name="speaker" value={speaker} />
      <Field label="Church or organization" name="organization" autoComplete="organization" />
      <Field label="Pastor or director name" name="pastor" />
      <Field label="Your first name" name="first-name" autoComplete="given-name" optional />
      <Field label="Your last name" name="last-name" autoComplete="family-name" optional />
      <Field label="Requested date" name="requested-date" type="date" min={todayKey()} />
      <Field label="Requested time" name="requested-time" type="time" step={900} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        placeholder="name@example.com"
      />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(919) 555-0123" />
      <Field label="Venue street address" name="venue-street" autoComplete="off" optional span />
      <Field label="City" name="venue-city" autoComplete="off" optional />
      <div className="field-pair">
        <Field label="State" name="venue-state" autoComplete="off" optional maxLength={2} placeholder="NC" />
        <Field label="ZIP" name="venue-zip" autoComplete="off" inputMode="numeric" optional maxLength={10} />
      </div>
      <Field
        label="Website"
        name="website"
        inputMode="url"
        autoComplete="url"
        spellCheck={false}
        optional
        span
        placeholder="www.yourchurch.org"
      />
      <Field
        as="textarea"
        label="Additional comments"
        name="comments"
        optional
        span
        placeholder="Event name, theme, expected attendance, anything we should know…"
        hint={`Have a flyer or letter of invitation? Email it to ${SITE.email}.`}
      />
    </FormShell>
  )
}
