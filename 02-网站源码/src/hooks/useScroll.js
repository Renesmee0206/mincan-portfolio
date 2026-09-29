import { useEffect, useState } from 'react'

/** 顶部滚动进度 0 - 100 */
export function useScrollProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const h = document.documentElement.scrollHeight - window.innerHeight
        setP(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return p
}

/** 当前滚动位置（用于导航吸顶、侧边章节高亮） */
export function useScrollState(ids) {
  const [y, setY] = useState(0)
  const [active, setActive] = useState(ids[0])
  const [dark, setDark] = useState(true)

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const scrollY = window.scrollY
      setY(scrollY)

      const mid = scrollY + window.innerHeight * 0.42
      let current = ids[0]
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= mid) current = id
      })
      setActive(current)
      setDark(current === 'home' || current === 'contact')
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ids])

  return { y, active, dark }
}
