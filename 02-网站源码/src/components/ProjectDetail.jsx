import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 项目详情层：主图 →（有视频时）视频 → 其余图片。
 * ESC 关闭，← → 切换，点遮罩关闭，打开时锁定背景滚动。
 */
export default function ProjectDetail({ project, onClose, returnFocusTo }) {
  const shots = useMemo(
    () => [
      { type: 'image', src: project.image },
      ...(project.video ? [{ type: 'video', src: project.video }] : []),
      ...project.detail.map((src) => ({ type: 'image', src })),
    ],
    [project],
  )

  const [active, setActive] = useState(0)
  const closeRef = useRef(null)
  const current = shots[active]

  const step = (delta) => setActive((i) => (i + delta + shots.length) % shots.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.tagName === 'VIDEO') return
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('is-locked')
    closeRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('is-locked')
      returnFocusTo?.current?.focus()
    }
  }, [onClose, returnFocusTo, shots.length])

  const meta = [
    { k: '项目 / Project', v: project.org },
    { k: '时间 / Period', v: project.period },
    { k: '角色 / Role', v: project.role },
  ].filter((m) => m.v)

  return (
    <div className="detail" role="dialog" aria-modal="true" aria-label={project.title}>
      <button
        className="detail__scrim"
        aria-label="关闭详情"
        tabIndex={-1}
        onClick={onClose}
      />

      <div className="detail__panel">
        <header className="detail__bar">
          <div className="detail__heading">
            <span className="detail__no">({project.index})</span>
            <div>
              <h3>{project.title}</h3>
              <p>{project.subtitle}</p>
            </div>
          </div>

          <button className="detail__close" ref={closeRef} onClick={onClose}>
            关闭
            <span>ESC</span>
          </button>
        </header>

        <div className="detail__body">
          <aside className="detail__meta">
            <p className="detail__desc">{project.desc}</p>

            <dl className="detail__list">
              {meta.map((m) => (
                <div key={m.k}>
                  <dt>{m.k}</dt>
                  <dd>{m.v}</dd>
                </div>
              ))}
              <div>
                <dt>关键词 / Tags</dt>
                <dd className="detail__tags">
                  {project.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </aside>

          <div className="detail__viewer">
            {current.type === 'video' ? (
              <video
                key={current.src}
                className="detail__video"
                src={current.src}
                poster={project.image}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img src={current.src} alt={`${project.title} — 第 ${active + 1} 张`} />
            )}

            {shots.length > 1 && (
              <>
                <button
                  className="detail__nav detail__nav--prev"
                  onClick={() => step(-1)}
                  aria-label="上一张"
                >
                  ←
                </button>
                <button
                  className="detail__nav detail__nav--next"
                  onClick={() => step(1)}
                  aria-label="下一张"
                >
                  →
                </button>
                <span className="detail__counter">
                  {String(active + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
                </span>
              </>
            )}
          </div>
        </div>

        {shots.length > 1 && (
          <footer className="detail__thumbs">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                className={`detail__thumb${i === active ? ' is-on' : ''}${
                  shot.type === 'video' ? ' is-video' : ''
                }`}
                onClick={() => setActive(i)}
                aria-label={shot.type === 'video' ? '播放项目视频' : `查看第 ${i + 1} 张`}
              >
                <img src={shot.type === 'video' ? project.image : shot.src} alt="" />
                {shot.type === 'video' && <span className="detail__thumb-play">▶</span>}
              </button>
            ))}
          </footer>
        )}
      </div>
    </div>
  )
}
