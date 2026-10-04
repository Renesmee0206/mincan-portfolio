import { useEffect, useRef, useState } from 'react'

/**
 * 照片墙的大图层：点一张放大到中间看，再点一下（或点背景 / Esc）缩回去。
 * 收起时先播完那下「缩小」再卸载，不然是啪一下消失、看不到「变小」的过程。
 * ← → 换上一张 / 下一张，打开时锁背景滚动。
 */
export default function PhotoLightbox({ items, index, onClose, onStep, returnFocusTo }) {
  const [leaving, setLeaving] = useState(false)
  const leavingRef = useRef(false)
  const timerRef = useRef(0)
  const closeRef = useRef(null)

  // 换一张 = 重新进来一次
  useEffect(() => {
    leavingRef.current = false
    setLeaving(false)
  }, [index])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const close = () => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(true)
    timerRef.current = window.setTimeout(onClose, 230)
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('is-locked')
    closeRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
      returnFocusTo?.current?.focus()
    }
    // 换一张就重挂一次：锁屏 / 焦点 / 键盘都跟着当前这张走
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (index == null || !items[index]) return null

  const item = items[index]
  const total = items.length
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <div
      className={`lightbox${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={item.label ?? item.alt}
    >
      <button className="lightbox__scrim" aria-label="收起大图" tabIndex={-1} onClick={close} />

      <figure className="lightbox__panel" onClick={close}>
        <img src={item.src} alt={item.alt} draggable={false} />
        <figcaption className="lightbox__cap">
          <span className="lightbox__no">
            {pad(index + 1)} / {pad(total)}
          </span>
          {item.label ? <span className="lightbox__label">{item.label}</span> : null}
          <span className="lightbox__hint">再点一下收起 · ← → 换一张 · ESC</span>
        </figcaption>
      </figure>

      {total > 1 ? (
        <>
          <button
            className="lightbox__nav is-prev"
            onClick={() => onStep(-1)}
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            className="lightbox__nav is-next"
            onClick={() => onStep(1)}
            aria-label="下一张"
          >
            ›
          </button>
        </>
      ) : null}

      <button className="lightbox__close" ref={closeRef} onClick={close}>
        收起
        <span>ESC</span>
      </button>
    </div>
  )
}
