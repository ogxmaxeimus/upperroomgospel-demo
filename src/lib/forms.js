// Submits to Netlify Forms. Every form name must also exist as a static form in index.html.
export async function submitForm(formName, formElement) {
  const data = new FormData(formElement)
  data.set('form-name', formName)
  const body = new URLSearchParams(data).toString()

  if (import.meta.env.DEV) {
    await new Promise((resolve) => setTimeout(resolve, 650))
    return { ok: true, simulated: true }
  }

  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!response.ok) throw new Error(`The form couldn’t be sent (error ${response.status}).`)
  return { ok: true }
}
