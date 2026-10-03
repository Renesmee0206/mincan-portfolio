import ScrollFloat from './ScrollFloat.jsx'

/**
 * 板块之间那一小条过场：一个英文大字（滚到跟前逐字浮上来）+ 一行小标注。
 * 上下留白刻意收得比较窄（.chapter 的 padding），别让它变成一整屏。
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
