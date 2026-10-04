// React Bits 的 InfiniteSpiral（JS + CSS 变体；
// 注册表 reactbits.dev/r/InfiniteSpiral-JS-CSS.json）。
//
// 与注册表源码的差别只有四处，其余逻辑一行没动：
//   1) 去掉 Next.js 的 'use client'，去掉 `import './InfiniteSpiral.css'`
//      —— esbuild 打包预览时 JS 里的 CSS import 会掉，规则并进 styles/global.css
//   2) 拖动只在「精确指针」（鼠标 / 触控板）上开。注册表给根节点写的是
//      touch-action: pan-x，手指竖着划过照片墙会把页面滚动吃掉；
//      触屏上就只保留自动播放 + 点开大图
//   3) 卡片里多套一层 .infinite-spiral__frame：外层的 transform 每帧被 rAF 改写，
//      hover 的「略微放大 + 出现描边」只能挂在内层，否则会被覆盖
//   4) 点一张走 onSelect(index)。拖动是「按下后移开 5px」才开始的——注册表在
//      pointerdown 就 setPointerCapture，普通点击也会被当成拖动、指针被抢走，
//      卡片上的 onClick 收不到（点不开大图）。拖动结束后浏览器补的那一次 click
//      按「按下点 / 松开点的距离」判掉；注册表用的是布尔标记，拖完第一下点不开。
//      另外拖动只在「按着」的时候有效：手指/鼠标松开后划过照片墙，它不该跟着走
import { useEffect, useMemo, useRef } from 'react'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const modulo = (value, divisor) => ((value % divisor) + divisor) % divisor
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min || 1), 0, 1)
  return x * x * (3 - 2 * x)
}

/** 鼠标 / 触控板才开拖动；手指上不开，免得挡掉页面滚动 */
const hasFinePointer = () =>
  typeof window === 'undefined' || !window.matchMedia
    ? true
    : window.matchMedia('(pointer: fine)').matches

export default function InfiniteSpiral({
  items = [],
  speed = 0.55,
  direction = 'up',
  animationMode = 'auto',
  radius = 170,
  cardWidth = 100,
  cardHeight = 100,
  verticalSpacing = 60,
  perspective = 1000,
  cardsPerTurn = 7,
  rotation = 0,
  cardTilt = 0,
  cardRadius = 10,
  centerScale = 1.2,
  edgeFade = 0.3,
  edgeBlur = 6,
  pauseOnHover = true,
  imageFit = 'cover',
  grayscale = 0,
  className = '',
  onSelect,
}) {
  const rootRef = useRef(null)
  const cardRefs = useRef([])
  const progressRef = useRef(0)
  const targetProgressRef = useRef(0)
  const autoSpeedRef = useRef(0)
  const hoveredRef = useRef(false)
  const visibleRef = useRef(true)
  const draggingRef = useRef(false)
  const lastPointerYRef = useRef(0)
  const downAtRef = useRef(null)
  const pointerDownRef = useRef(false)

  const normalizedItems = useMemo(
    () =>
      items.map((item, index) =>
        typeof item === 'string'
          ? { src: item, alt: `照片 ${index + 1}` }
          : { alt: `照片 ${index + 1}`, ...item },
      ),
    [items],
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root || normalizedItems.length === 0) return undefined

    let frameId
    let previousTime = performance.now()
    let bounds = root.getBoundingClientRect()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const scrollEnabled = animationMode === 'scroll' || animationMode === 'all'
    const dragEnabled =
      (animationMode === 'drag' || animationMode === 'all') && hasFinePointer()
    const scrollSpeedMultiplier = Math.max(speed, 0) / 0.55
    let lastScrollY = window.scrollY

    const resizeObserver = new ResizeObserver(() => {
      bounds = root.getBoundingClientRect()
    })
    resizeObserver.observe(root)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0.02 },
    )
    intersectionObserver.observe(root)

    const handleScroll = () => {
      const nextScrollY = window.scrollY
      const scrollDelta = nextScrollY - lastScrollY
      lastScrollY = nextScrollY
      if (!scrollEnabled || !visibleRef.current || scrollDelta === 0) return
      targetProgressRef.current += clamp(
        (scrollDelta * scrollSpeedMultiplier) / Math.max(verticalSpacing * 2, 1),
        -1.5,
        1.5,
      )
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const render = (time) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time

      const autoEnabled = animationMode === 'auto' || animationMode === 'all'
      const motionPaused = draggingRef.current || (pauseOnHover && hoveredRef.current)
      const directionMultiplier = direction === 'down' ? -1 : 1
      const desiredAutoSpeed =
        autoEnabled && visibleRef.current && !reducedMotion.matches && !motionPaused
          ? speed * directionMultiplier
          : 0
      const speedBlend = 1 - Math.exp(-delta * 7)
      autoSpeedRef.current += (desiredAutoSpeed - autoSpeedRef.current) * speedBlend
      targetProgressRef.current += autoSpeedRef.current * delta

      const followBlend = 1 - Math.exp(-delta * (draggingRef.current ? 22 : 11))
      progressRef.current += (targetProgressRef.current - progressRef.current) * followBlend

      const count = normalizedItems.length
      const half = count / 2
      const width = Math.max(bounds.width, 1)
      const height = Math.max(bounds.height, 1)
      const fit = Math.min(1, width / (cardWidth * 2.8), height / (cardHeight * 2.35))
      /* 半径不能大到让边上那张卡片顶出舞台：x = ±r 那两张还带着 ~1.1 倍缩放，
         留出「半个卡片宽 × 0.72」的余量，手机上就不会被硬切掉一条边。 */
      const responsiveRadius =
        Math.min(radius, Math.max(72, width / 2 - cardWidth * 0.72)) * fit
      const fadeStart = clamp(1 - edgeFade, 0, 0.98)
      const turnSize = Math.max(cardsPerTurn, 1)

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        let offset = index - progressRef.current
        offset = modulo(offset + half, count) - half

        const edge = Math.min(Math.abs(offset) / Math.max(half, 1), 1)
        const opacity = 1 - smoothstep(fadeStart, 1, edge)
        const focus = 1 - Math.min(Math.abs(offset) / Math.max(turnSize * 0.65, 1), 1)
        const scale = (1 + (centerScale - 1) * focus) * fit
        const angle = offset * (360 / turnSize) + rotation
        const angleRadians = (angle * Math.PI) / 180
        const x = Math.sin(angleRadians) * responsiveRadius
        const z = Math.cos(angleRadians) * responsiveRadius
        const depthScale = clamp(perspective / Math.max(perspective - z, 1), 0.72, 1.45)
        const visualScale = scale * depthScale
        const depth = (z / Math.max(responsiveRadius, 1) + 1) / 2
        const blur = edgeBlur * smoothstep(0.35, 1, edge)
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${offset * verticalSpacing * fit}px, 0) rotateZ(${cardTilt}deg) scale(${visualScale})`
        card.style.opacity = opacity.toFixed(3)
        card.style.filter = blur > 0.01 ? `blur(${blur.toFixed(2)}px)` : 'none'
        card.style.zIndex = String(Math.round(depth * 100000) + index)
        card.style.pointerEvents = opacity > 0.25 ? 'auto' : 'none'
      })

      frameId = requestAnimationFrame(render)
    }

    frameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [
    normalizedItems,
    speed,
    direction,
    animationMode,
    radius,
    perspective,
    cardWidth,
    cardHeight,
    verticalSpacing,
    cardsPerTurn,
    rotation,
    cardTilt,
    centerScale,
    edgeFade,
    edgeBlur,
    pauseOnHover,
  ])

  const dragEnabled = (animationMode === 'drag' || animationMode === 'all') && hasFinePointer()

  const rootStyle = {
    perspective: `${perspective}px`,
    '--infinite-spiral-card-width': `${cardWidth}px`,
    '--infinite-spiral-card-height': `${cardHeight}px`,
    '--infinite-spiral-card-radius': `${cardRadius}px`,
    cursor: dragEnabled ? 'grab' : 'default',
    touchAction: dragEnabled ? 'pan-x' : 'auto',
    userSelect: dragEnabled ? 'none' : 'auto',
  }

  const stopDragging = (event) => {
    pointerDownRef.current = false
    if (!draggingRef.current) return
    draggingRef.current = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    event.currentTarget.style.cursor = dragEnabled ? 'grab' : 'default'
  }

  return (
    <div
      ref={rootRef}
      className={`infinite-spiral ${className}`.trim()}
      style={rootStyle}
      onMouseEnter={() => {
        hoveredRef.current = true
      }}
      onMouseLeave={() => {
        hoveredRef.current = false
      }}
      onPointerDown={(event) => {
        if (!dragEnabled || event.button !== 0) return
        pointerDownRef.current = true
        downAtRef.current = { x: event.clientX, y: event.clientY }
        lastPointerYRef.current = event.clientY
        /* 先不 setPointerCapture、也不进入拖动：等真的移开 5px 再开始。
           按下就抓指针的话，一次普通点击也会被算成拖动，
           卡片上的 onClick 会被指针捕获改派走，点不开大图。 */
      }}
      onPointerMove={(event) => {
        /* 必须「按着」才可能拖：松开之后鼠标在墙上划来划去不该带着它走
           （按下那一下的位置只留给 onClickCapture 判「这是点击还是拖动的尾巴」）。 */
        if (!pointerDownRef.current) return
        const down = downAtRef.current
        if (!down) return
        if (!draggingRef.current) {
          if (Math.hypot(event.clientX - down.x, event.clientY - down.y) < 5) return
          draggingRef.current = true
          targetProgressRef.current = progressRef.current
          event.currentTarget.setPointerCapture(event.pointerId)
          event.currentTarget.style.cursor = 'grabbing'
        }
        const pointerDelta = event.clientY - lastPointerYRef.current
        lastPointerYRef.current = event.clientY
        targetProgressRef.current -= pointerDelta / Math.max(verticalSpacing, 1)
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      /* 拖动结束后浏览器还会补一次 click —— 只有「按下和松开基本在同一点」才算点击。
         注册表用的是「拖动过就把下一次 click 吃掉」的标记，那样拖完第一下点不开。 */
      onClickCapture={(event) => {
        const down = downAtRef.current
        if (!down) return
        const moved = Math.hypot(event.clientX - down.x, event.clientY - down.y)
        if (moved <= 6) return
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      <div className="infinite-spiral__stage" role="list" aria-label="个人照片墙">
        {normalizedItems.map((item, index) => {
          const Frame = onSelect ? 'button' : 'div'
          return (
            <div
              key={item.id ?? `${item.src}-${index}`}
              ref={(node) => {
                cardRefs.current[index] = node
              }}
              className="infinite-spiral__item"
              style={{ width: cardWidth, height: cardHeight }}
              role="listitem"
            >
              <Frame
                type={onSelect ? 'button' : undefined}
                className="infinite-spiral__frame"
                onClick={onSelect ? () => onSelect(index) : undefined}
                aria-label={item.label ?? item.alt}
              >
                <img
                  className="infinite-spiral__image"
                  src={item.src}
                  alt={item.alt}
                  /* 一律 eager：螺旋两头那些卡片被 overflow 裁在框外，
                     lazy 的话浏览器判定它们永远不会进视口，转到中间时还是灰的。
                     12 张一共 1.4MB，值。 */
                  loading="eager"
                  draggable={false}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    objectFit: imageFit,
                    filter: `grayscale(${Math.min(1, Math.max(0, grayscale))})`,
                  }}
                />
              </Frame>
            </div>
          )
        })}
      </div>
    </div>
  )
}
