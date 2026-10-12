import { useEffect, useRef } from 'react'

interface KeyActions {
  next: () => void
  back: () => void
  first: () => void
  last: () => void
  toggleCaptions: () => void
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.isContentEditable ||
    target.closest('input, textarea, select, [role="slider"], [data-captures-keys]') !== null
  )
}

/**
 * Presentation shortcuts. Clickers usually send PageDown/PageUp. Interactive
 * elements keep their keys: anything that handled the event (defaultPrevented)
 * or is editable/slider-like is left alone.
 */
export function useKeyboard(actions: KeyActions) {
  const ref = useRef(actions)
  useEffect(() => {
    ref.current = actions
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (isEditable(e.target)) return
      const onButton = e.target instanceof HTMLElement && e.target.closest('button, a, summary')
      const a = ref.current

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          a.next()
          break
        case ' ':
          if (onButton) return
          if (e.shiftKey) a.back()
          else a.next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          a.back()
          break
        case 'Home':
          a.first()
          break
        case 'End':
          a.last()
          break
        case 'c':
        case 'C':
          a.toggleCaptions()
          break
        default:
          return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
