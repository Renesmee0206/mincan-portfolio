// React Bits 的 ScrollFloat（JS + CSS 变体，reactbits.dev/text-animations/scroll-float，
// 注册表 reactbits.dev/r/ScrollFloat-JS-CSS.json）。
//
// 与注册表源码的差别只有三处（和当初接 Prism 时一样）：
//   1) 去掉 Next.js 的 'use client'
//   2) 去掉 `import './ScrollFloat.css'` —— esbuild 打包预览时 JS 里的 CSS import 会掉，
//      那三条规则并进了 styles/global.css
//   3) 加 prefers-reduced-motion 保护：不跑动画，字直接停在落点上
import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** 三处过场共用一次 refresh：开场层还在时页面锁着滚动，量出来的位置不可靠 */
let refreshed = false
const scheduleRefresh = () => {
  if (refreshed) return
  refreshed = true
  window.setTimeout(() => ScrollTrigger.refresh(), 60)
}

export default function ScrollFloat({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
}) {
  const containerRef = useRef(null)

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split('').map((char, index) => (
      <span className="char" key={index}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined

    const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window
    const charElements = el.querySelectorAll('.char')

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%',
      },
      {
        duration: animationDuration,
        ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      },
    )

    scheduleRefresh()

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger])

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`.trim()}>
      <span className={`scroll-float-text ${textClassName}`.trim()}>{splitText}</span>
    </h2>
  )
}
