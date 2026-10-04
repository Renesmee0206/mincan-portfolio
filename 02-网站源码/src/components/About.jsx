import { useCallback, useState } from 'react'
import SectionHead from './SectionHead.jsx'
import InfiniteSpiral from './InfiniteSpiral.jsx'
import PhotoLightbox from './PhotoLightbox.jsx'
import { profile, aboutStats, education, experience, awards, personalPhotos } from '../data/site.js'

export default function About() {
  const rows = [...experience, ...education]
  const [shot, setShot] = useState(null)
  const stepShot = useCallback(
    (delta) =>
      setShot((i) =>
        i == null ? i : (i + delta + personalPhotos.length) % personalPhotos.length,
      ),
    [],
  )

  return (
    <section className="about" id="about">
      <div className="wrap">
        <SectionHead
          no="01"
          title="个人经历"
          en="About & Experience"
          note="兴趣从画画、游戏和为喜欢的作品做延伸创作开始，本硕六年把它带进空间——从画面到场地，从概念到落地。"
        />

        <div className="about__body">
          {/* 左栏：个人照片墙（React Bits 的 InfiniteSpiral），占满这一栏、一直在自己转。
              拿相机那张肖像也在里面（personalPhotos 的第一张）。
              源图在 素材与原件/个人图片/，重出脚本 .codex-build/build-people.py */}
          <figure className="about__wall" data-reveal>
            <div className="about__wall-stage">
              {/* 它得一直在流：鼠标停在墙上不该把它停住（悬停哪一张，那一张照样放大）。
                  想改成「停住方便点」，把 pauseOnHover 换成 true。 */}
              <InfiniteSpiral
                items={personalPhotos}
                animationMode="all"
                speed={0.5}
                radius={260}
                cardWidth={132}
                cardHeight={132}
                verticalSpacing={92}
                perspective={1200}
                cardsPerTurn={9}
                cardRadius={14}
                centerScale={1.2}
                edgeFade={0.34}
                edgeBlur={5}
                pauseOnHover={false}
                onSelect={setShot}
              />
            </div>
            <figcaption className="about__wall-tag">
              <span>Personal / {personalPhotos.length}</span>
              <span>自动流动 · 悬停看 · 点一张放大</span>
            </figcaption>
          </figure>

          <div className="about__intro" data-reveal style={{ transitionDelay: '120ms' }}>
            <h2>
              先有想讲的事，
              <br />
              再想用什么<em>形式</em>讲。
            </h2>

            <div className="about__text">
              {/* 原来放在首页的那段自我介绍，按「介绍我的往后放」挪到这里 */}
              <p className="about__lead">{profile.lede}</p>
              <p>
                我的起点其实不在空间，而在画面。小时候画画、打游戏、为喜欢的作品做延伸创作——
                这件事让我第一次认真去想：一个世界是怎么搭起来的，角色为什么长成这样，
                场景和色彩为什么这样配。那种<strong>「把想象变成看得见的东西」</strong>
                的冲动，比任何一门具体的专业都更早吸引我。
              </p>
              <p>
                本科在湖北美术学院读环境设计（室内设计方向），硕士继续读环境艺术设计。
                专业把我从「画一个画面」推到「造一个空间」——尺度、构造、材料、光线和人的行为，
                都要落到能被建造、被使用的程度。我没有把从前的兴趣放下，而是把它们当成方法：
                <strong>先想清楚要讲什么，再决定用什么手段讲</strong>。
                生活里的观察和想法，最后大多会变成方案里的某一个转折。
                这些想法后来都被放进了竞赛和项目里，也在一轮轮的建模、效果图与方案本中被反复检验。
              </p>
              <p>
                我习惯在多个尺度之间切换：概念、平面、插画，到室内、建筑、景观，再到三维可视化。
                这正是我希望在求职时被看到的部分——不是某一款软件或某一张图，
                而是能从一个念头出发，一路推到建成与表达的<strong>综合能力</strong>。
                下面的项目比我说的更清楚。
              </p>
            </div>

            <dl className="about__contact">
              <a href={`mailto:${profile.email}`}>
                <dt>Email 邮箱</dt>
                <dd>{profile.email}</dd>
              </a>
              <a href={profile.phoneHref}>
                <dt>Phone 电话</dt>
                <dd>{profile.phone}</dd>
              </a>
              <div>
                <dt>WeChat 微信</dt>
                <dd>{profile.wechat}</dd>
              </div>
              <div>
                <dt>Location 所在地</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>籍贯</dt>
                <dd>{profile.hometown}</dd>
              </div>
            </dl>

            <div className="about__stats" data-reveal>
              {aboutStats.map((s) => (
                <div className="about__stat" key={s.label}>
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                  <i>{s.note}</i>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="timeline" data-reveal>
          <div className="timeline__label">
            <h3>经历与教育</h3>
            <p>
              Experience
              <br />&amp; Education
              <br />
              <br />
              2020 — 至今
            </p>
          </div>

          <div className="timeline__rows">
            {rows.map((row) => (
              <article className="timeline__row" key={row.title}>
                <p className="timeline__period">{row.period}</p>
                <div className="timeline__main">
                  <h4>
                    {row.org}
                    <span>　/　{row.title}</span>
                  </h4>
                  <p>{row.desc}</p>
                </div>
                <span className={`timeline__badge${row.current ? ' is-now' : ''}`}>
                  {row.current ? 'Now' : row.period.slice(0, 4)}
                </span>
              </article>
            ))}
          </div>
        </div>

        {/* 荣誉奖项和上面「经历与教育」用同一套两栏骨架（左标签栏 + 右侧行），
            这样日期那一列和右边正文是齐的；单纯放在 .gallery 里会整体贴到左边。 */}
        <div className="timeline timeline--awards" data-reveal>
          <div className="timeline__label">
            <h3>荣誉奖项</h3>
            <p>
              Awards
              <br />
              {awards.length} Items
              <br />
              <br />
              2024 — 2026
            </p>
          </div>

          <div className="timeline__rows">
            {awards.map((a) => (
              <article className="timeline__row" key={a.name}>
                <p className="timeline__period">{a.year}</p>
                <div className="timeline__main">
                  <h4>{a.name}</h4>
                  <p>{a.award}</p>
                </div>
                <span className="timeline__badge">Award</span>
              </article>
            ))}
          </div>
        </div>
      </div>

      {shot != null ? (
        <PhotoLightbox
          items={personalPhotos}
          index={shot}
          onClose={() => setShot(null)}
          onStep={stepShot}
        />
      ) : null}
    </section>
  )
}
