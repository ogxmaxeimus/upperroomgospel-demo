import '@fontsource-variable/source-sans-3/wght.css'
import '@fontsource-variable/source-sans-3/wght-italic.css'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/archivo-narrow'
import '@fontsource-variable/source-serif-4/opsz.css'
import './styles/global.css'
import './styles/components.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Layout from './components/Layout.jsx'
import { RouteError, Splash } from './components/RouteStates.jsx'
import { LEGACY } from './data/legacy.js'

const modules = import.meta.glob('./pages/*.jsx')
const load = (name) => modules[`./pages/${name}.jsx`] ?? modules['./pages/ComingSoon.jsx']

const pages = {
  home: load('Home'),
  imNew: load('ImNew'),
  events: load('Events'),
  eventDetail: load('EventDetail'),
  watch: load('Watch'),
  give: load('Give'),
  bishop: load('Bishop'),
  firstLady: load('FirstLady'),
  beliefs: load('Beliefs'),
  followJesus: load('FollowJesus'),
  ministries: load('Ministries'),
  youth: load('Youth'),
  men: load('Men'),
  women: load('Women'),
  musicArts: load('MusicArts'),
  evangelism: load('Evangelism'),
  thrive: load('Thrive'),
  focus: load('Focus'),
  contact: load('Contact'),
  notFound: load('NotFound'),
}

const page = (load) => async () => ({ Component: (await load()).default })

const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    ErrorBoundary: RouteError,
    HydrateFallback: Splash,
    children: [
      {
        ErrorBoundary: RouteError,
        children: [
          { index: true, lazy: page(pages.home) },
          { path: 'im-new', lazy: page(pages.imNew) },
          { path: 'events', lazy: page(pages.events) },
          { path: 'events/:eventId', lazy: page(pages.eventDetail) },
          { path: 'watch', lazy: page(pages.watch) },
          { path: 'give', lazy: page(pages.give) },
          { path: 'about/bishop-wooden', lazy: page(pages.bishop) },
          { path: 'about/first-lady-wooden', lazy: page(pages.firstLady) },
          { path: 'beliefs', lazy: page(pages.beliefs) },
          { path: 'follow-jesus', lazy: page(pages.followJesus) },
          { path: 'ministries', lazy: page(pages.ministries) },
          { path: 'ministries/youth', lazy: page(pages.youth) },
          { path: 'ministries/men', lazy: page(pages.men) },
          { path: 'ministries/women', lazy: page(pages.women) },
          { path: 'ministries/music-arts', lazy: page(pages.musicArts) },
          { path: 'ministries/evangelism', lazy: page(pages.evangelism) },
          { path: 'ministries/thrive', lazy: page(pages.thrive) },
          { path: 'ministries/focus', lazy: page(pages.focus) },
          { path: 'contact', lazy: page(pages.contact) },
          ...Object.entries(LEGACY).map(([path, to]) => ({ path, element: <Navigate to={to} replace /> })),
          { path: '*', lazy: page(pages.notFound) },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

const idle = window.requestIdleCallback ?? ((callback) => setTimeout(callback, 1500))
idle(() => [pages.events, pages.imNew, pages.watch, pages.give, pages.home].forEach((load) => load().catch(() => {})))
