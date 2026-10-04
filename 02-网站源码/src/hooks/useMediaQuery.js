import { useEffect, useState } from 'react'

/**
 * 跟随一个媒体查询。照片墙在手机上要用另一套参数（卡片小一点、间距大一点），
 * 这些是几何量、算不出来，只能这么给。
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])

  return matches
}
