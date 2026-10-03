// 成果集锦：一叠可以点的图片卡。
//
// 参考 React Bits 的 BounceCards（gsap 弹入 + hover 把两边推开，见 README/ROADMAP），
// 与参考实现的三处差别：
//   1) 位移按「卡片宽的倍数」算，跟着容器宽度走 —— 手机上换 3 张的落位，放得下才不出血；
//   2) 入场动画等这一叠滚进视口再播（原来一挂载就播，滚到这儿早演完了）；
//   3) 卡片是 <button>，键盘 Tab 能走、回车能进项目。
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/** 落位：x / y 是卡片宽的比例，r 是角度（参考实现那套「扇形摊开」） */
const LAYOUTS = {
  5: [
    { x: -1.62, y: 0.06, r: 9 },
    { x: -0.86, y: -0.05, r: 5 },
    { x: 0, y: 0.03, r: -3 },
    { x: 0.86, y: -0.05, r: -8 },
    { x: 1.62, y: 0.06, r: 4 },
  ],
  3: [
    { x: -1.02, y: 0.05, r: 9 },
    { x: 0, y: -0.05, r: -3 },
    { x: 1.02, y: 0.05, r: -8 },
  ],
}

/** 窄屏（手机上）用 3 张那一套 */
const NARROW = 620

const clamp = (min, value, max) => Math.min(max, Math.max(min, value))

export default function BounceCards({ items = [], onPick, className = '' }) {
  const wrapRef = useRef(null)
  const [width, setWidth] = useState(0)
  const [hovered, setHovered] = useState(-1)

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const measure = () => setWidth(el.clientWidth)
    measure()
    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const narrow = width > 0 && width < NARROW
  const layout = narrow ? LAYOUTS[3] : LAYOUTS[5]
  const cards = items.slice(0, layout.length)
  // 一叠总宽 ≈ 4.24 张（5 张）/ 3.04 张（3 张），再留一点余量
  const cardW = width ? clamp(96, width / (narrow ? 3.3 : 4.5), 250) : 200
  const push = cardW * 0.52

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return undefined
    const slots = el.querySelectorAll('.bounce__slot')
    if (!slots.length) return undefined

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
    const play = () => {
      if (reduced) {
        gsap.set(slots, { scale: 1, opacity: 1 })
        return
      }
      gsap.fromTo(
        slots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.72,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.07,
          delay: 0.1,
          overwrite: true,
        },
      )
    }

    if (reduced || !('IntersectionObserver' in window)) {
      play()
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          play()
          io.disconnect()
        })
      },
      { threshold: 0.28 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [items])

  return (
    <div className={`bounce${narrow ? ' is-narrow' : ''} ${className}`.trim()} ref={wrapRef}>
      <div className="bounce__stack" style={{ width: cardW, height: cardW }}>
        {cards.map((item, i) => {
          const seat = layout[i]
          const on = hovered === i
          const shift = hovered < 0 || on ? 0 : i < hovered ? -push : push
          const x = seat.x * cardW + shift
          const y = seat.y * cardW + (on ? -cardW * 0.06 : 0)
          const rotate = on ? 0 : seat.r

          return (
            <div
              className="bounce__slot"
              key={`${item.src}-${i}`}
              style={{
                width: cardW,
                height: cardW,
                marginLeft: -cardW / 2,
                marginTop: -cardW / 2,
                zIndex: on ? cards.length + 2 : i + 1,
              }}
            >
              <button
                type="button"
                className="bounce__card"
                style={{
                  transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rotate}deg) scale(${
                    on ? 1.04 : 1
                  })`,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((h) => (h === i ? -1 : h))}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered((h) => (h === i ? -1 : h))}
                onClick={() => onPick?.(item)}
                aria-label={`${item.title} — 回到这个项目`}
              >
                <img src={item.src} alt="" loading="lazy" />
                <span className="bounce__no">{item.index}</span>
                <span className="bounce__say">
                  <b>{item.title}</b>
                  <i>回到项目 ↑</i>
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
