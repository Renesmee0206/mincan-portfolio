import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/site.js'

/** 复制到剪贴板：本地用 file:// 打开时 navigator.clipboard 不可用，退回 execCommand */
async function writeClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 继续走兜底方案 */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export default function Contact() {
  const [toast, setToast] = useState('')
  const timer = useRef(0)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async (text, label) => {
    const ok = await writeClipboard(text)
    setToast(ok ? `${label}已复制` : '复制失败，请手动选择')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(''), 2200)
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__glow" />
      <div className="contact__grid" />

      <div className="wrap" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <p className="eyebrow" style={{ color: 'rgba(255,255,255,.5)' }}>
          Get in touch — 03 / 03
        </p>

        <div className="contact__body">
          <div data-reveal>
            <h2 className="contact__title">
              一起把下一个设计
              <br />
              做成<em>可以流通的故事</em>。
            </h2>
            <span className="contact__title-latin">Let&apos;s build something spatial</span>

            <a className="contact__mail" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>

            <div className="contact__actions">
              <button
                type="button"
                className="btn btn--solid"
                onClick={() => copy(profile.email, '邮箱')}
              >
                <span>复制邮箱</span>
                <span className="btn__arrow">⧉</span>
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => copy(profile.phone, '电话')}
              >
                <span>{profile.phone}</span>
                <span className="btn__arrow">⧉</span>
              </button>
              <a className="btn btn--ghost" href="/resume.pdf" target="_blank" rel="noreferrer">
                <span>下载简历 PDF</span>
              </a>
            </div>
            <p className="contact__hint">点按钮即可复制，也可以直接点上面的邮箱发信。</p>
          </div>

          <div className="contact__side" id="contact-info" data-reveal style={{ transitionDelay: '120ms' }}>
            <div className="contact__qr">
              <img src={profile.wechatQr} alt="微信二维码" />
              <div className="contact__qr-text">
                <span className="contact__qr-label">微信 / WeChat</span>
                <button
                  type="button"
                  className="contact__wechat"
                  onClick={() => copy(profile.wechat, '微信号')}
                  title="点击复制微信号"
                >
                  {profile.wechat}
                  <i>⧉</i>
                </button>
                <p>扫码或点微信号复制，邮件回复会更快一些。</p>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </div>

            <dl className="contact__list">
              <div className="contact__item">
                <dt>Phone</dt>
                <dd>
                  <a href={profile.phoneHref}>{profile.phone}</a>
                </dd>
              </div>
              <div className="contact__item">
                <dt>Location</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className="contact__item">
                <dt>求职意向</dt>
                <dd>{profile.intent}</dd>
              </div>
              <div className="contact__item">
                <dt>教育背景</dt>
                <dd>湖北美术学院 · 环境艺术设计 硕士</dd>
              </div>
              <div className="contact__item">
                <dt>Status</dt>
                <dd>{profile.status}</dd>
              </div>
              <div className="contact__item">
                <dt>简历</dt>
                <dd>
                  <a href="/resume.pdf" target="_blank" rel="noreferrer">
                    下载 PDF
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="wrap">
        <footer className="contact__foot">
          <span>© 2026 {profile.latin} · 环境艺术 / 视觉艺术 / 概念艺术</span>
          <span>Designed &amp; Built with React + Vite</span>
          <a className="contact__top" href="#home">
            Back to top
            <i>↑</i>
          </a>
        </footer>
      </div>

      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </section>
  )
}
