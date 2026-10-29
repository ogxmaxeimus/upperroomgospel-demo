import { ArrowRight, Search } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router'
import Img from '../components/Img.jsx'
import Reveal from '../components/Reveal.jsx'
import { DEPARTMENTS, FINDER_FILTERS, GROUPS } from '../data/ministries.js'
import { usePage } from '../hooks/usePage.js'
import './ministries.css'

export default function Ministries() {
  usePage({
    id: 'ministries',
    themeColor: '#070b16',
    title: 'Ministries',
    description: 'Find your place at the Upper Room. Browse every ministry, choir, and auxiliary.',
  })
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const q = useDeferredValue(query.trim().toLowerCase())

  const results = GROUPS.filter(
    (g) =>
      (filter === 'all' || g.tags?.includes(filter)) &&
      (!q || `${g.name} ${g.desc} ${DEPARTMENTS[g.dept].name}`.toLowerCase().includes(q)),
  )

  return (
    <div className="pg-ministries">
      <section className="mi-hero container">
        <p className="eyebrow">Ministries</p>
        <h1 className="mi-title">
          There’s a place
          <br />
          <span className="accent-word">for you here.</span>
        </h1>
        <p className="lead">{GROUPS.length} groups across five departments. Tell us who you are and we’ll show you where to start.</p>
      </section>

      <section className="container mi-depts">
        {Object.values(DEPARTMENTS).map((d, i) => (
          <Reveal key={d.id} delay={i * 60}>
            <Link to={d.to} className="mi-dept" style={{ '--dept': d.accent }}>
              <Img name={d.image} alt="" />
              <span className="mi-dept__kicker">{d.kicker}</span>
              <strong className="mi-dept__name">{d.name}</strong>
              <ArrowRight className="mi-dept__arrow" aria-hidden="true" />
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="section container" aria-labelledby="finder-title">
        <h2 id="finder-title" className="mi-h2">
          Find your place
        </h2>
        <div className="mi-finder">
          <label className="mi-search">
            <Search aria-hidden="true" />
            <span className="sr-only">Search ministries</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search choirs, outreach, kids…" />
          </label>
          <div className="mi-chips" role="group" aria-label="Who is it for?">
            {FINDER_FILTERS.map((f) => (
              <button key={f.id} type="button" className="mi-chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mi-count" aria-live="polite">
          {results.length} {results.length === 1 ? 'ministry' : 'ministries'}
        </p>
        <ul className="mi-results">
          {results.map((g) => {
            const d = DEPARTMENTS[g.dept]
            return (
              <li key={`${g.dept}-${g.name}`} className="mi-result" style={{ '--dept': d.accent }}>
                <Link to={`${d.to}#join`}>
                  <span className="mi-result__dept">{d.name}</span>
                  <strong>{g.name}</strong>
                  <p>{g.desc}</p>
                  {g.status && <em className="mi-result__status">{g.status}</em>}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
