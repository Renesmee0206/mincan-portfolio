// 首页 = What I like：可以拖着流动的作品流（FlexCarousel）
// 文案压到上层，只有链接 / 按钮接收点击，其余区域都交给拖拽
import { useState } from 'react'
import { profile, likes } from '../data/site.js'
import FlexCarousel from './FlexCarousel.jsx'

export default function Hero() {
  const [like, setLike] = useState(0)
  const current = likes[like] || likes[0]

  return (
    <section className="hero" id="home">
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
          <div className="hero__likes-head">
            <span className="hero__likes-label">
              <b>What I like</b>
              影响我的作品与影像
            </span>
            <span className="hero__likes-hint">按住拖动 / 滑动 · 点一下放大</span>
          </div>

          <div className="hero__rail">
            <FlexCarousel
              items={likes}
              preset="liquid"
              intro="rise"
              cardHeight={0.5}
              gap={14}
              squeeze={0.2}
              radius={2}
              focusOnClick
              captions={false}
              captureWheel={false}
              onChange={(index) => setLike(index)}
            />
          </div>

          {/* 来处：作品名 + 作者（原文名），跟着当前居中的那张走 */}
          <div className="hero__caption">
            <span className="hero__caption-index">
              {String(like + 1).padStart(2, '0')}
              <i>/</i>
              {String(likes.length).padStart(2, '0')}
            </span>
            <span className="hero__caption-title">{current.title}</span>
            <span className="hero__caption-author">{current.subtitle}</span>
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
