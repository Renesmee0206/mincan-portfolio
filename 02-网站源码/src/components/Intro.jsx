// 开场动画：拖拽撕开牛皮纸快递箱 → 黑场折字 → 进入网站
// 交互：鼠标拖拽 / 手指左右滑动控制撕裂进度；Enter / 空格直接开箱；右上角可跳过。
import { useCallback, useEffect, useRef, useState } from 'react'
import FoldText from './FoldText.jsx'

const VEIL_FADE = 600 // 黑场淡入时长（毫秒）
const TEXT_DELAY = 220 // 黑场之后，第二个 FoldText 的延迟
const CONFIRM_DELAY = 900 // 「确定」出现的延迟
const LEAVE_FADE = 700 // 点「确定」后整层淡出，让网站露出来

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/** 撕纸音效：不依赖任何音频文件，用白噪声 + 带通滤波现场合成一小段“撕”的沙沙声 */
function createTearSound() {
  let ctx = null
  let gain = null
  let filter = null
  let raf = 0
  let current = 0
  let target = 0

  const ensure = () => {
    if (ctx) return ctx
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    ctx.resume?.()

    const len = Math.floor(ctx.sampleRate * 1.5)
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1

    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    noise.loop = true

    filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1700
    filter.Q.value = 0.85

    const highpass = ctx.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.value = 480

    gain = ctx.createGain()
    gain.gain.value = 0

    noise.connect(filter)
    filter.connect(highpass)
    highpass.connect(gain)
    gain.connect(ctx.destination)
    noise.start()
    return ctx
  }

  const tick = () => {
    if (!ctx || !gain) return
    current += (target - current) * 0.2
    gain.gain.setTargetAtTime(current, ctx.currentTime, 0.045)
    raf = requestAnimationFrame(tick)
  }

  return {
    /** 拖拽中：速度决定音量与音色，越撕越响（音量上限刻意压得很低） */
    move(px) {
      if (!ensure()) return
      const speed = Math.min(1, Math.abs(px) / 26)
      target = 0.012 + speed * 0.055
      filter.frequency.setTargetAtTime(1250 + Math.random() * 1600, ctx.currentTime, 0.05)
      if (!raf) raf = requestAnimationFrame(tick)
    },
    /** 键盘开箱：给一段稳定的轻响 */
    hold() {
      if (!ensure()) return
      target = 0.045
      if (!raf) raf = requestAnimationFrame(tick)
    },
    stop() {
      target = 0
      if (ctx && gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08)
    },
    close() {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      try {
        ctx?.close()
      } catch {
        /* 忽略 */
      }
      ctx = null
    },
  }
}

export default function Intro({ onEnter, onGone }) {
  // box：等撕 → seal：撕到底、黑场淡入 → text：折字 → leave：整层淡出
  const [stage, setStage] = useState('box')
  const [dragging, setDragging] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showLatin, setShowLatin] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showFrom2, setShowFrom2] = useState(false)

  const videoRef = useRef(null)
  const barRef = useRef(null)
  const pctRef = useRef(null)
  const accRef = useRef(0) // 已撕开的进度 0 - 1
  const dragRef = useRef(null)
  const seekRef = useRef(-1)
  const autoRef = useRef(0)
  const sealedRef = useRef(false)
  const timersRef = useRef([])
  const soundRef = useRef(null)

  const later = useCallback((fn, ms) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }, [])

  const sound = useCallback(() => {
    if (!soundRef.current) soundRef.current = createTearSound()
    return soundRef.current
  }, [])

  /**
   * 进度条 + 百分比文字：直接写 DOM，不走 setState。
   * 走 state 的话每次 pointermove 都要等一次 re-render 才动，手感就是「拉条跟不上鼠标」。
   */
  const paint = useCallback((v) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${v})`
    if (pctRef.current) {
      pctRef.current.textContent =
        v > 0 && v < 1 ? `已撕开 ${Math.round(v * 100)}%` : '也可以直接按 Enter / 空格'
    }
  }, [])

  // 视频元数据：拿到时长后才能把拖拽进度换算成 currentTime
  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined
    const onMeta = () => {
      setReady(video.duration > 0)
      // 有些浏览器首帧要主动 seek 一次才会绘制
      try {
        video.currentTime = 0.001
      } catch {
        /* 忽略 */
      }
    }
    const onError = () => setFailed(true)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('loadeddata', onMeta)
    video.addEventListener('error', onError)
    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('loadeddata', onMeta)
      video.removeEventListener('error', onError)
    }
  }, [])

  useEffect(
    () => () => {
      timersRef.current.forEach((t) => window.clearTimeout(t))
      if (autoRef.current) cancelAnimationFrame(autoRef.current)
      soundRef.current?.close()
      soundRef.current = null
    },
    [],
  )

  // 拖拽进度 → video.currentTime。
  // 常驻一条 rAF 循环盯着 accRef，每帧最多写一次 seek，避免抖动、也避免 seek 排队。
  // （之前是「setState → useEffect → seek」，比指针慢一帧，所以拖起来发黏。）
  useEffect(() => {
    if (!ready) return undefined
    let raf = 0
    const tick = () => {
      const video = videoRef.current
      if (video && video.duration) {
        const t = Math.min(video.duration - 0.02, accRef.current * video.duration)
        if (Math.abs(t - seekRef.current) > 0.004) {
          seekRef.current = t
          try {
            video.currentTime = t
          } catch {
            /* 忽略 */
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [ready])

  // React 重渲染会把提示文字刷回默认值，这里按当前进度补一次
  useEffect(() => {
    paint(accRef.current)
  }, [dragging, stage, failed, paint])

  // 快递单第二行比第一行晚一点折出来
  useEffect(() => {
    later(() => setShowFrom2(true), 320)
  }, [later])

  const seal = useCallback(() => {
    if (sealedRef.current) return
    sealedRef.current = true
    accRef.current = 1
    paint(1)
    setDragging(false)
    soundRef.current?.stop()
    setStage('seal') // 黑场开始淡入
    later(() => setStage('text'), VEIL_FADE - 120)
    later(() => setShowLatin(true), VEIL_FADE - 120 + TEXT_DELAY)
    later(() => setShowConfirm(true), VEIL_FADE - 120 + CONFIRM_DELAY)
  }, [later, paint])

  const dragSpan = () => Math.min(560, Math.max(240, window.innerWidth * 0.42))

  const onPointerDown = (e) => {
    if (stage !== 'box' || failed) return
    if (e.target?.closest?.('button')) return // 「跳过」等按钮不触发撕扯
    dragRef.current = { id: e.pointerId, x: e.clientX }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* 忽略 */
    }
    setDragging(true)
    sound().hold()
  }

  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag || drag.id !== e.pointerId || stage !== 'box' || failed) return
    const dx = e.clientX - drag.x
    drag.x = e.clientX
    accRef.current = clamp(accRef.current + dx / dragSpan(), 0, 1)
    paint(accRef.current)
    if (dx !== 0) sound().move(dx)
    if (accRef.current >= 1) seal()
  }

  const endDrag = (e) => {
    if (dragRef.current && e && dragRef.current.id !== e.pointerId) return
    dragRef.current = null
    setDragging(false)
    soundRef.current?.stop()
  }

  /** Enter / 空格：不用拖，自动撕到底 */
  const autoOpen = useCallback(() => {
    if (stage !== 'box' || failed) return
    const from = accRef.current
    const start = performance.now()
    soundRef.current?.hold()
    const step = (now) => {
      const k = Math.min(1, (now - start) / 900)
      const eased = 1 - (1 - k) ** 3
      accRef.current = from + (1 - from) * eased
      paint(accRef.current)
      if (k < 1) autoRef.current = requestAnimationFrame(step)
      else {
        autoRef.current = 0
        seal()
      }
    }
    autoRef.current = requestAnimationFrame(step)
  }, [failed, paint, seal, stage])

  /** 进入网站：解锁滚动（onEnter），等淡出结束再从 DOM 里摘掉（onGone） */
  const enter = useCallback(() => {
    if (stage === 'leave') return
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
    if (autoRef.current) cancelAnimationFrame(autoRef.current)
    soundRef.current?.stop()
    onEnter()
    setStage('leave')
    later(onGone, LEAVE_FADE)
  }, [later, onEnter, onGone, stage])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        if (stage === 'box') autoOpen()
        else enter()
      } else if (e.key === 'Escape') {
        enter()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [autoOpen, enter, stage])

  const isDragging = dragging && stage === 'box'

  return (
    <div
      className={`intro${stage === 'seal' || stage === 'text' ? ' is-sealing' : ''}${
        stage === 'leave' ? ' is-leaving' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="开箱动画"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="intro__stage">
        <video
          ref={videoRef}
          className="intro__video"
          src="/media/intro-open.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        />
      </div>

      <div className={`intro__veil${stage === 'seal' || stage === 'text' ? ' is-on' : ''}`} />

      <div className="intro__scrim" />

      {/* 左边那条黑边是补出来的，做成快递单：FROM / 收件提示。
          两行都用「欢迎来到闵灿的频道」那一套折字特效（FoldText）。 */}
      <div className="intro__from">
        <FoldText
          text="FROM: MIN CAN."
          splitBy="char"
          hinge="top"
          duration={0.65}
          stagger={0.045}
          ease="power3.out"
          perspective={700}
          creaseShading={0.55}
          trigger="mount"
          fontSize="clamp(15px, 1.15vw, 19px)"
          fontWeight={700}
          color="#f7f2e8"
          className="intro__from-main"
        />
        <span className="intro__from-sub">
          {showFrom2 && (
            <FoldText
              text="Please claim your exclusive parcel."
              splitBy="char"
              hinge="top"
              duration={0.65}
              stagger={0.03}
              ease="power3.out"
              perspective={700}
              creaseShading={0.4}
              trigger="mount"
              fontSize="clamp(12px, 0.95vw, 14px)"
              fontWeight={400}
              color="rgba(247, 242, 232, 0.62)"
            />
          )}
        </span>
      </div>

      <p className="intro__sr">
        开场动画：拖动撕开一个牛皮纸快递箱，然后进入网站。也可以直接按 Enter 或空格。
      </p>

      <button type="button" className="intro__skip" onClick={enter}>
        跳过
        <svg width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M1 12 12 1M12 1H4M12 1v8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {stage === 'box' && (
        <div className={`intro__hint${isDragging ? ' is-dragging' : ''}${failed ? ' is-failed' : ''}`}>
          {failed ? (
            <button type="button" className="btn btn--solid intro__enter" onClick={enter}>
              <span>进入网站</span>
              <span className="btn__arrow">→</span>
            </button>
          ) : (
            <>
              <span className="intro__hint-line">
                {isDragging ? '继续向右拖 · 撕开' : '按住向右拖动 · 撕开纸箱'}
              </span>
              <span className="intro__hint-arrow" aria-hidden="true">
                →
              </span>
              {/* 文字由 paint() 直接写，不走 state —— 所以这里不能有 children */}
              <span className="intro__hint-sub" ref={pctRef} />
            </>
          )}
        </div>
      )}

      <div className="intro__bar" aria-hidden="true">
        <i ref={barRef} />
      </div>

      {stage === 'text' || stage === 'leave' ? (
        <div className="intro__text">
          <FoldText
            text="欢迎来到闵灿的频道"
            splitBy="char"
            hinge="top"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            trigger="mount"
            fontSize="clamp(2.6rem, 7vw, 5.5rem)"
            fontWeight={800}
            color="#f7f2e8"
            className="intro__cjk"
            style={{ letterSpacing: '0.01em' }}
          />

          <div className="intro__latin">{showLatin && <FoldText
            text="WELCOME TO MY CHANNEL"
            splitBy="word"
            hinge="top"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.4}
            trigger="mount"
            fontSize="clamp(11px, 1.05vw, 15px)"
            fontWeight={500}
            color="rgba(247, 242, 232, 0.55)"
            style={{ letterSpacing: '0.34em' }}
          />}</div>

          <button
            type="button"
            className={`intro__confirm${showConfirm ? ' is-on' : ''}`}
            onClick={enter}
          >
            <span>确定</span>
            <span className="intro__confirm-arrow">↓</span>
          </button>
          <p className={`intro__confirm-hint${showConfirm ? ' is-on' : ''}`}>
            进入网站 · 或按 Enter
          </p>
        </div>
      ) : null}
    </div>
  )
}
