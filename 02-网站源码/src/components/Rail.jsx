import { navItems } from '../data/site.js'

export default function Rail({ active, dark }) {
  return (
    <nav className={`rail${dark ? ' is-dark' : ''}`} aria-label="章节导航">
      {navItems.map((item, i) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={active === item.id ? 'is-active' : ''}
        >
          <span>
            {String(i + 1).padStart(2, '0')} {item.label}
          </span>
          <i />
        </a>
      ))}
    </nav>
  )
}
