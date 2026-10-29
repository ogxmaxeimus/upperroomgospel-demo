import { useEffect, useLayoutEffect } from 'react'

const BASE_TITLE = 'Upper Room Church of God in Christ · Raleigh, NC'

// Each page declares its personality (scoped CSS variables on <html>), its light/dark base,
// the browser UI color, and its search metadata.
export function usePage({ id, theme = 'dark', themeColor = '#040915', title, description }) {
  useLayoutEffect(() => {
    const root = document.documentElement
    root.dataset.page = id
    root.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)
  }, [id, theme, themeColor])

  useEffect(() => {
    document.title = title ? `${title} · Upper Room COGIC` : BASE_TITLE
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
