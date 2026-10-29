import { Field, FormShell, FormSuccess } from './Form.jsx'

export default function JoinForm({ ministry, interests = [], submitLabel = 'Count me in', successTitle = 'You’re on the list!' }) {
  return (
    <FormShell
      name="join-ministry"
      submitLabel={submitLabel}
      success={
        <FormSuccess title={successTitle}>
          <p>
            Thank you for raising your hand. Someone from the {ministry} will reach out to you soon. Keep God first!
          </p>
        </FormSuccess>
      }
    >
      <input type="hidden" name="ministry" value={ministry} />
      <Field label="Your name" name="name" autoComplete="name" placeholder="First and last name…" />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        placeholder="name@example.com"
      />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" optional placeholder="(919) 555-0123" />
      {interests.length > 0 ? (
        <Field as="select" label="I’m interested in" name="interest" optional defaultValue="">
          <option value="">Not sure yet, tell me more</option>
          {interests.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </Field>
      ) : (
        <span aria-hidden="true" />
      )}
      <Field as="textarea" label="Message" name="message" optional span placeholder="Tell us a little about yourself…" />
    </FormShell>
  )
}
