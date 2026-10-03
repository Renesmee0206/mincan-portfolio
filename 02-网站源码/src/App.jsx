import { useEffect, useMemo, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Projects from './components/Projects.jsx'
import Contact from './components/Contact.jsx'
import Rail from './components/Rail.jsx'
import Intro from './components/Intro.jsx'
import { useReveal } from './hooks/useReveal.js'
import { useScrollProgress, useScrollState } from './hooks/useScroll.js'
import { navItems } from './data/site.js'

/** 每次进站都播开场；只有「减少动态效果」的用户直接进站 */
const skipIntro = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true

export default function App() {
  const ids = useMemo(() => navItems.map((n) => n.id), [])
  const progress = useScrollProgress()
  const { y, active, dark } = useScrollState(ids)
  const [introOn, setIntroOn] = useState(() => !skipIntro())
  const [locked, setLocked] = useState(() => !skipIntro())

  useReveal()

  useEffect(() => {
    document.body.classList.toggle('is-locked', locked)
  }, [locked])

  return (
    <>
      {introOn && (
        <Intro onEnter={() => setLocked(false)} onGone={() => setIntroOn(false)} />
      )}

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
