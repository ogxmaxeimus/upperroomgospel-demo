import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { DEPARTMENTS, GROUPS } from '../data/ministries.js'
import { usePage } from '../hooks/usePage.js'
import Img from './Img.jsx'
import JoinSection from './JoinSection.jsx'
import Reveal from './Reveal.jsx'
import '../pages/dept.css'

export function GroupGrid({ groups, numbered = false }) {
  return (
    <ul className="dp-groups">
      {groups.map((g, i) => (
        <Reveal as="li" key={g.name} className="dp-group" delay={(i % 3) * 70}>
          {numbered && <span className="dp-group__num">{String(i + 1).padStart(2, '0')}</span>}
          <div className="dp-group__meta">
            {g.kind && <span>{g.kind}</span>}
            {g.ages && (
              <span>
                Ages {g.ages[0]} to {g.ages[1]}
              </span>
            )}
            {g.status && <span className="dp-group__status">{g.status}</span>}
          </div>
          <h3 className="dp-group__name">{g.name}</h3>
          <p className="dp-group__desc">{g.desc}</p>
          {g.when && <p className="dp-group__when">{g.when}</p>}
          {(g.links || (g.link ? [g.link] : [])).map((l) => (
            <a key={l.href} className="dp-group__link" href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </Reveal>
      ))}
    </ul>
  )
}

export function DeptSection({ eyebrow, title, children, className = '', id }) {
  return (
    <section className={`section dp-section ${className}`} id={id}>
      <div className="container">
        <Reveal className="dp-section__head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="dp-h2">{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

export default function DeptPage({ id, themeColor, title, lead, heroWord, image, heroExtra, children, groupsTitle, groupsNumbered, join }) {
  const dept = DEPARTMENTS[id]
  usePage({ id: `dept-${id}`, themeColor, title: dept.name, description: dept.blurb })
  const groups = GROUPS.filter((g) => g.dept === id)

  return (
    <div className={`pg-dept dp--${id}`}>
      <section className="dp-hero">
        <div className="dp-hero__media" aria-hidden="true">
          <Img name={image ?? dept.image} alt="" priority />
        </div>
        <div className="dp-hero__fx" aria-hidden="true" />
        {heroExtra}
        {heroWord && (
          <p className="dp-hero__word" aria-hidden="true">
            {heroWord}
          </p>
        )}
        <div className="container dp-hero__inner">
          <p className="eyebrow">{dept.kicker}</p>
          <h1 className="dp-title">{title}</h1>
          <p className="lead dp-hero__lead">{lead}</p>
          <div className="dp-hero__actions">
            <a className="btn btn--primary btn--lg" href="#join">
              How to join
              <ArrowDown aria-hidden="true" />
            </a>
            <Link className="btn btn--ghost btn--lg" to="/events">
              See events
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {children}

      {groups.length > 0 && (
        <DeptSection eyebrow="Get involved" title={groupsTitle ?? 'Find your group'} className="dp-section--groups">
          <GroupGrid groups={groups} numbered={groupsNumbered} />
        </DeptSection>
      )}

      <JoinSection ministry={dept.name} title={join.title} interests={join.interests ?? groups.map((g) => g.name)} className="dp-join">
        <p>{join.text}</p>
      </JoinSection>
    </div>
  )
}
