import { useEffect, useRef, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import ProjectDetail from './ProjectDetail.jsx'
import { projects, gallery, marqueeWords, profile } from '../data/site.js'

export default function Projects() {
  const [openId, setOpenId] = useState(null)
  const [flashId, setFlashId] = useState(null)
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

  return (
    <section className="projects" id="projects">
      <div className="wrap">
        <SectionHead
          no="02"
          title="精选项目"
          en="Selected Projects"
          note="顺序与配图按最新一版作品集整理——每张卡片都可以点开，看该项目的其他图纸与效果图。"
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
            <p>Gallery / 点击任意一张回到对应项目</p>
          </div>
          <div className="gallery__grid">
            {gallery.map((g, i) => (
              <button
                className="gallery__item"
                key={g.src}
                data-reveal
                style={{ transitionDelay: `${(i % 4) * 80}ms` }}
                onClick={() => jumpToProject(g.project)}
                aria-label={`跳转到项目：${g.caption}`}
              >
                <img src={g.src} alt={g.caption} loading="lazy" />
                <span className="gallery__cap">{g.caption}</span>
                <span className="gallery__jump">回到项目 ↑</span>
              </button>
            ))}
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
