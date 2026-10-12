import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

function useStoredState<T extends string | boolean>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch {
      return fallback
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable (private mode); keep the in-memory value.
    }
  }, [key, value])
  return [value, setValue] as const
}

/** Viewing preferences. Deliberately separate from narrative position. */
export function usePreferences() {
  const [captions, setCaptions] = useStoredState<boolean>('mi:captions', false)
  // Follows the OS setting; Motion's MotionConfig reducedMotion="user" does the same.
  const reducedMotion = useReducedMotion() ?? false

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reducedMotion)
  }, [reducedMotion])

  return {
    captions,
    toggleCaptions: () => setCaptions((c) => !c),
    reducedMotion,
  }
}
