// 首页 = What I like：可以拖着流动的作品流（FlexCarousel）
// 背景是 React Bits 的 Prism（WebGL，见 Prism.jsx）
// 版面：作品流是这一屏面积最大的一层，左边的名字块压在它上面（允许遮挡）
// 交互：文案层不吃指针事件，只有链接 / 按钮接收点击，其余区域都交给拖拽
import { useEffect, useState } from 'react'
import { profile, likes } from '../data/site.js'
import FlexCarousel from './FlexCarousel.jsx'
import Prism from './Prism.jsx'

/** 系统开了「减少动态效果」就不挂 WebGL 背景：省电，也照顾前庭敏感的人 */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return undefined
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export default function Hero() {
  const [like, setLike] = useState(0)
  const reduced = useReducedMotion()
  const current = likes[like] || likes[0]

  return (
    <section className="hero" id="home">
      {!reduced && (
        <div className="hero__prism" aria-hidden="true">
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0.5}
            glow={1}
            suspendWhenOffscreen
          />
        </div>
      )}

      <div className="hero__scrim" />
      <div className="hero__grid" />

      <div className="wrap hero__inner">
        <div className="hero__top">
          <p className="eyebrow">
            Portfolio 2026 — 湖北美术学院
            <i className="hero__eyebrow-tail"> · 环境艺术设计</i>
          </p>
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

        <div className="hero__lead">
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

        <div className="hero__likes">
          <div className="hero__rail">
            <FlexCarousel
              items={likes}
              preset="liquid"
              intro="rise"
              cardHeight={0.73}
              gap={16}
              squeeze={0.2}
              radius={2}
              focusOnClick
              captions={false}
              captureWheel={false}
              onChange={(index) => setLike(index)}
            />
          </div>

          {/* 卡片下面一条：名号 + 当前这张的来处 + 操作提示。
              放在底部而不是压在卡片上，卡片整块才留得住。 */}
          <div className="hero__likes-foot">
            <span className="hero__likes-label">
              <b>What I like</b>
              影响我的作品与影像
            </span>

            <span className="hero__caption">
              <span className="hero__caption-index">
                {String(like + 1).padStart(2, '0')}
                <i>/</i>
                {String(likes.length).padStart(2, '0')}
              </span>
              <span className="hero__caption-title">{current.title}</span>
              <span className="hero__caption-author">{current.subtitle}</span>
            </span>

            <span className="hero__likes-hint">按住拖动 / 滑动 · 点一下放大</span>
          </div>
        </div>

        <div className="hero__foot">
          <div className="hero__scroll">
            <span>Scroll</span>
            <i />
          </div>
        </div>
      </div>
    </section>
  )
}
