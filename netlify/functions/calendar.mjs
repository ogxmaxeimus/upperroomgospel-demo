import { buildICS } from '../../src/lib/calendar.js'
import { calendarFeedItems } from '../../src/lib/events.js'

// Subscribable feed: webcal://upperroomgospel.org/calendar.ics
export default async () =>
  new Response(buildICS(calendarFeedItems()), {
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  })

export const config = { path: '/calendar.ics' }
