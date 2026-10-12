import { useEffect, useState } from 'react'

/**
 * True while the pointer is within `px` of the bottom edge. Tracked on window
 * rather than with a hover-zone element so nothing blocks stage interactions.
 */
export function useNearBottom(px: number) {
  const [near, setNear] = useState(false)
  useEffect(() => {
    const update = (e: PointerEvent) => setNear(e.clientY >= window.innerHeight - px)
    const leave = () => setNear(false)
    window.addEventListener('pointermove', update, { passive: true })
    window.addEventListener('pointerdown', update, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', update)
      window.removeEventListener('pointerdown', update)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [px])
  return near
}
