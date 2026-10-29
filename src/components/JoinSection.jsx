import JoinForm from './JoinForm.jsx'
import Reveal from './Reveal.jsx'

export default function JoinSection({ ministry, title, eyebrow = 'How to join', interests, submitLabel, className = '', children }) {
  return (
    <section id="join" className={`join section ${className}`} aria-labelledby="join-title">
      <div className="container join__grid">
        <Reveal className="join__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="join-title" className="join__title h2 display">
            {title}
          </h2>
          {children}
        </Reveal>
        <Reveal className="join__panel" delay={120}>
          <JoinForm ministry={ministry} interests={interests} submitLabel={submitLabel} />
        </Reveal>
      </div>
    </section>
  )
}
