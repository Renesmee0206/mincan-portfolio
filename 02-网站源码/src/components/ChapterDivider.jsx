import ScrollFloat from './ScrollFloat.jsx'

/**
 * 板块之间的过场：**一整屏的黑**（.chapter 高度 = 100svh），
 * 屏幕上只有一行小标注 + 一个英文大字，字滚到跟前逐字从下面浮上来，
 * 浮完再跟着滚出上边，下一部分才接上来。放大 / 缩短都改 global.css 里 .chapter 那几条。
 */
export default function ChapterDivider({ no, en, cn }) {
  return (
    <div className="chapter">
      <div className="wrap chapter__inner">
        <p className="chapter__meta">
          <span>{no}</span>
          {cn}
        </p>

        <ScrollFloat
          containerClassName="chapter__float"
          textClassName="chapter__word"
          animationDuration={1}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          {en}
        </ScrollFloat>
      </div>
    </div>
  )
}
