import { totalSections } from '../data/site.js'

export default function SectionHead({ no, title, en, note }) {
  return (
    <header className="sec-head" data-reveal>
      <p className="sec-head__no">
        <b>({no})</b> / {String(totalSections - 1).padStart(2, '0')}
      </p>
      <h2 className="sec-head__title">
        {title}
        <span>{en}</span>
      </h2>
      {note ? <p className="sec-head__note">{note}</p> : <span />}
    </header>
  )
}
