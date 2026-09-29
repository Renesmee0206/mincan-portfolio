import { useMemo } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Rail from './components/Rail.jsx'
import { useReveal } from './hooks/useReveal.js'
import { useScrollProgress, useScrollState } from './hooks/useScroll.js'
import { navItems } from './data/site.js'

export default function App() {
  const ids = useMemo(() => navItems.map((n) => n.id), [])
  const progress = useScrollProgress()
  const { y, active, dark } = useScrollState(ids)

  useReveal()

  return (
    <>
      <div className="progress" style={{ width: `${progress}%` }} />
      <Nav stuck={y > 60} active={active} />
      <Rail active={active} dark={dark} />

      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      <div className="grain" aria-hidden="true" />
    </>
  )
}
