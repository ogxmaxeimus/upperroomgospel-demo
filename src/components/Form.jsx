import { CircleAlert, CircleCheck, LoaderCircle } from 'lucide-react'
import { createContext, use, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { SITE } from '../data/site.js'
import { submitForm } from '../lib/forms.js'

const FormContext = createContext({ errors: {}, clearError: () => {} })

function messageFor(el) {
  const v = el.validity
  if (v.valueMissing) {
    return el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT'
      ? 'Please choose an option.'
      : 'This field is required.'
  }
  if (v.typeMismatch && el.type === 'email') return 'Enter an email address like name@example.com.'
  if (v.rangeUnderflow && el.type === 'date') return 'Please choose a date in the future.'
  if (v.tooShort) return `Please use at least ${el.minLength} characters.`
  return el.validationMessage
}

export function FormSuccess({ title, children }) {
  const ref = useRef(null)
  useEffect(() => ref.current?.focus(), [])
  return (
    <div className="form-success" role="status">
      <CircleCheck aria-hidden="true" className="form-success__icon" />
      <h3 ref={ref} tabIndex={-1} className="form-success__title">
        {title}
      </h3>
      <div className="form-success__body">{children}</div>
    </div>
  )
}

export function FormShell({ name, submitLabel = 'Send', success, children, className = '', note }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [failure, setFailure] = useState('')

  const clearError = useCallback((field) => {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }, [])

  const context = useMemo(() => ({ errors, clearError }), [errors, clearError])

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const nextErrors = {}
    let firstInvalid = null
    for (const el of form.elements) {
      if (!el.name || !el.willValidate || el.checkValidity()) continue
      nextErrors[el.name] ??= messageFor(el)
      firstInvalid ??= el
    }
    setErrors(nextErrors)
    if (firstInvalid) {
      firstInvalid.focus()
      return
    }

    setStatus('sending')
    setFailure('')
    try {
      await submitForm(name, form)
      form.reset()
      setStatus('sent')
    } catch (error) {
      setFailure(error.message || 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  if (status === 'sent') return success

  return (
    <FormContext value={context}>
      <form
        className={`form ${className}`}
        name={name}
        method="post"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        noValidate
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value={name} />
        <p className="honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>
        <div className="form-grid">{children}</div>
        {failure && (
          <p className="form-status form-status--error" role="alert">
            <CircleAlert aria-hidden="true" />
            <span>
              {failure} You can also email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </span>
          </p>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn--primary btn--lg" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <LoaderCircle aria-hidden="true" className="spin" />
                Sending…
              </>
            ) : (
              submitLabel
            )}
          </button>
          {note && <p className="form-actions__note">{note}</p>}
        </div>
      </form>
    </FormContext>
  )
}

export function Field({ label, name, as = 'input', optional = false, hint, span = false, className = '', children, onChange, ...props }) {
  const id = useId()
  const { errors, clearError } = use(FormContext)
  const error = errors[name]
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const shared = {
    id,
    name,
    className: 'field__control',
    required: !optional,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    onChange: (event) => {
      clearError(name)
      onChange?.(event)
    },
    ...props,
  }

  let control
  if (as === 'select') control = <select {...shared}>{children}</select>
  else if (as === 'textarea') control = <textarea {...shared} />
  else control = <input {...shared} />

  return (
    <div className={`field${span ? ' span-2' : ''} ${className}`} data-invalid={error ? 'true' : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
        {optional && <span className="optional"> (optional)</span>}
      </label>
      {control}
      {hint && (
        <p className="field__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export function Choices({ legend, name, options, type = 'radio', optional = false, defaultValue, span = true, onChange }) {
  const id = useId()
  const { errors, clearError } = use(FormContext)
  const error = errors[name]
  return (
    <fieldset
      className={`field choices${span ? ' span-2' : ''}`}
      data-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="field__label">
        {legend}
        {optional && <span className="optional"> (optional)</span>}
      </legend>
      <div className="choices__row">
        {options.map((option) => (
          <label className="choice" key={option.value}>
            <input
              type={type}
              name={name}
              value={option.value}
              required={type === 'radio' && !optional}
              defaultChecked={defaultValue === option.value}
              onChange={(event) => {
                clearError(name)
                onChange?.(event)
              }}
            />
            <span className="choice__box">
              <span className="choice__label">{option.label}</span>
              {option.meta && <span className="choice__meta">{option.meta}</span>}
            </span>
          </label>
        ))}
      </div>
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function Check({ name, value = 'yes', span = true, children, ...props }) {
  return (
    <label className={`check${span ? ' span-2' : ''}`}>
      <input type="checkbox" name={name} value={value} {...props} />
      <span>{children}</span>
    </label>
  )
}
