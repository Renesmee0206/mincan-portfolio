import { useEffect, useRef, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import ProjectDetail from './ProjectDetail.jsx'
import BounceCards from './BounceCards.jsx'
import { projects, galleryPool, marqueeWords, profile } from '../data/site.js'

/** 成果集锦一叠放几张 */
const HAND = 5

/**
 * 从「项目图片」那一套里随机抽一组：先整池洗乱，再按顺序取，
 * 同一个项目最多出 2 张 —— 不设限的话纯随机偶尔会抽到「5 张里 4 张都是大坝」。
 */
function drawHand() {
  const pool = galleryPool.slice()
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  const hand = []
  const perProject = new Map()
  for (const item of pool) {
    if (hand.length >= HAND) break
    const used = perProject.get(item.project) || 0
    if (used >= 2) continue
    perProject.set(item.project, used + 1)
    hand.push(item)
  }
  return hand
}

export default function Projects() {
  const [openId, setOpenId] = useState(null)
  const [flashId, setFlashId] = useState(null)
  // round 只用来给 BounceCards 换 key —— 换一组就重新弹一次
  const [hand, setHand] = useState(() => drawHand())
  const [round, setRound] = useState(0)
  const openerRef = useRef(null)
  const flashTimer = useRef(0)

  const openProject = projects.find((p) => p.id === openId) || null

  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  /** 成果集锦：滚回对应项目卡片并高亮一下 */
  const jumpToProject = (pid) => {
    const el = document.getElementById(pid)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setFlashId(pid)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlashId(null), 2400)
  }

  const openDetail = (project, el) => {
    openerRef.current = el || null
    setOpenId(project.id)
  }

  /** 洗牌：重抽一组（尽量别跟上一组一模一样），并让卡片重新弹一次 */
  const shuffle = () => {
    let next = drawHand()
    for (let i = 0; i < 4 && next.every((c, j) => c.src === hand[j]?.src); i += 1) next = drawHand()
    setHand(next)
    setRound((r) => r + 1)
  }

  return (
    <section className="projects" id="projects">
      <div className="wrap">
        <SectionHead
          no="02"
          title="精选项目"
          en="Selected Projects"
          note="顺序按最新一版作品集整理，配图从「项目图片」重出——每张卡片都可以点开，看该项目的其他图纸与效果图。"
        />

        <div className="projects__grid">
          {projects.map((p, i) => {
            const shotCount = p.detail.length + 1 + (p.video ? 1 : 0)
            return (
            <article
              className={`pcard${flashId === p.id ? ' is-flash' : ''}`}
              key={p.id}
              id={p.id}
              role="button"
              tabIndex={0}
              aria-label={`查看「${p.title}」的 ${shotCount} 张图`}
              data-reveal
              style={{ transitionDelay: `${(i % 2) * 110}ms` }}
              onClick={(e) => openDetail(p, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openDetail(p, e.currentTarget)
                }
              }}
            >
              <figure className="pcard__figure">
                <img src={p.image} alt={p.title} loading="lazy" />
                <span className="pcard__index">{p.index}</span>
                {p.period && <span className="pcard__period">{p.period}</span>}
                <span className="pcard__open">
                  查看详情
                  <b>{shotCount}</b>
                  张
                </span>
              </figure>

              <div className="pcard__body">
                <div>
                  <h3 className="pcard__title">{p.title}</h3>
                  <p className="pcard__sub">{p.subtitle}</p>
                </div>
                <p className="pcard__desc">{p.desc}</p>

                <div className="pcard__foot">
                  <div className="pcard__tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <p className="pcard__role">
                    {p.org}
                    <br />
                    {p.role}
                  </p>
                </div>
              </div>
            </article>
            )
          })}

          <article className="pcard pcard--quote" data-reveal style={{ transitionDelay: '110ms' }}>
            <div className="quote">
              <span className="quote__label">Statement / 设计主张</span>
              <p className="quote__text">「{profile.tagline}」</p>
              <p className="quote__note">
                环境艺术、视觉表达与概念推演在我这里是同一件事的三面——
                先把问题看清楚，再决定用什么方式让它被理解。
              </p>
              <a className="quote__link" href="#contact">
                聊聊合作
                <span>→</span>
              </a>
            </div>
          </article>
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee__track">
            {[0, 1].map((dup) => (
              <div key={dup} style={{ display: 'flex' }}>
                {marqueeWords.map((w) => (
                  <span className="marquee__item" key={dup + w}>
                    {w}
                    <i />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="gallery">
          <div className="gallery__head" data-reveal>
            <h3>成果集锦</h3>
            <p>Gallery / 每次随机抽一组，点一张回到对应项目</p>
          </div>

          <BounceCards
            key={round}
            items={hand}
            onPick={(item) => jumpToProject(item.project)}
            className="gallery__deck"
          />

          <div className="gallery__foot" data-reveal>
            <button type="button" className="btn btn--ghost gallery__shuffle" onClick={shuffle}>
              <span>洗牌换一组</span>
              <span className="btn__arrow">↺</span>
            </button>
            <p className="gallery__now">
              项目图片 {galleryPool.length} 张 · 每次随机抽一组
            </p>
          </div>
        </div>
      </div>

      {openProject && (
        <ProjectDetail
          key={openProject.id}
          project={openProject}
          onClose={() => setOpenId(null)}
          returnFocusTo={openerRef}
        />
      )}
    </section>
  )
}
