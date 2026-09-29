import { useEffect, useRef, useState } from 'react'
import { profile, heroStats } from '../data/site.js'

// 轮播画面：夜 / 昼交替，切换时对比更明显
const REEL = Array.from(
  { length: 10 },
  (_, i) => `/media/hero-${String(i + 1).padStart(2, '0')}.webp`,
)
const INTERVAL = 4000

export default function Hero() {
  const [frame, setFrame] = useState(0)
  const [hasVideo, setHasVideo] = useState(false)
  const stageRef = useRef(null)

  // 循环切换画面；若 public/media/hero-loop.mp4 存在，视频会覆盖在上层
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f + 1) % REEL.length), INTERVAL)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    let alive = true
    fetch('/media/hero-loop.mp4', { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || ''
        if (alive && r.ok && !type.includes('text/html')) setHasVideo(true)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  // 轻微鼠标视差
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      el.style.transform = `translate3d(${(-x * 16).toFixed(1)}px, ${(-y * 12).toFixed(1)}px, 0) scale(1.02)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero__stage" ref={stageRef}>
        {hasVideo && (
          <video
            className="hero__video is-ready"
            src="/media/hero-loop.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setHasVideo(false)}
          />
        )}
        {REEL.map((src, i) => (
          <div key={src} className={`hero__frame${i === frame ? ' is-on' : ''}`}>
            <img src={src} alt="" aria-hidden="true" />
          </div>
        ))}
      </div>

      <div className="hero__scrim" />
      <div className="hero__grid" />

      <div className="wrap hero__inner">
        <div className="hero__top">
          <p className="eyebrow">Portfolio 2026 — 湖北美术学院 · 环境艺术设计</p>
          <div className="hero__top-right">
            <p className="hero__meta">
              <b>Base</b>
              湖北 · 武汉
            </p>
            <p className="hero__meta">
              <b>Status</b>
              {profile.status}
            </p>
            <p className="hero__meta">
              <b>Contact</b>
              {profile.email}
            </p>
          </div>
        </div>

        <div className="hero__mid">
          <h1 className="hero__name">
            <span className="hero__name-cn">{profile.name}</span>
            <span className="hero__name-en">{profile.latin}</span>
          </h1>

          <p className="hero__roles">
            {profile.roles.map((r, i) => (
              <span key={r} style={{ display: 'contents' }}>
                {i > 0 && <i />}
                <span>{r}</span>
              </span>
            ))}
          </p>

          <p className="hero__lede">{profile.lede}</p>

          <div className="hero__cta">
            <a className="btn btn--solid" href="#contact">
              <span>联系我</span>
              <span className="btn__arrow">→</span>
            </a>
            <a className="btn btn--ghost" href="#projects">
              <span>查看精选项目</span>
            </a>
          </div>
        </div>

        <div className="hero__foot">
          <ul className="hero__stats">
            {heroStats.map((s) => (
              <li className="hero__stat" key={s.label}>
                <span className="value">
                  {s.value}
                  <em>{s.unit}</em>
                </span>
                <span className="label">{s.label}</span>
              </li>
            ))}
          </ul>

          <div className="hero__footright">
            <div className="hero__reel" aria-hidden="true">
              <span className="hero__reel-index">
                {String(frame + 1).padStart(2, '0')} / {String(REEL.length).padStart(2, '0')}
              </span>
              <div className="hero__reel-track" style={{ '--dur': `${INTERVAL}ms` }}>
                {REEL.map((src, i) => (
                  <i key={src} className={i === frame ? 'on' : ''} />
                ))}
              </div>
            </div>

            <div className="hero__scroll">
              <span>Scroll</span>
              <i />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
