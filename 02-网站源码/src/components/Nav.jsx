import { profile, navItems } from '../data/site.js'

export default function Nav({ stuck, active }) {
  return (
    <header className={`nav${stuck ? ' is-stuck' : ''}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#home">
          <strong>{profile.name}</strong>
          <small>{profile.latin}</small>
        </a>

        <nav className="nav__list">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={active === item.id ? 'is-active' : ''}
            >
              <span>{item.label}</span>
              <small>{item.en}</small>
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <div className="nav__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <a className="nav__cta" href="#contact">
            联系我
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M1 12 12 1M12 1H4M12 1v8" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
