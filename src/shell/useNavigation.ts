import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AnyStage, StepDef } from '../types'

export interface FlatStep {
  stage: AnyStage
  stageIndex: number
  step: StepDef
  stepIndex: number
  /** `stage-id/step-id`, used in the URL path. */
  key: string
}

export type HistoryMode = 'replace' | 'push'

/** The app's base path, e.g. '/mech-interp-presentation/' (always ends in '/'). */
const BASE = import.meta.env.BASE_URL

/** `stage/step` from the current URL: the path after the base, or an old-style `#/stage/step`. */
const currentKey = () => {
  const { pathname, hash } = window.location
  if (hash.startsWith('#/')) return decodeURIComponent(hash.slice(2))
  const rest = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname.replace(/^\//, '')
  return decodeURIComponent(rest.replace(/\/$/, ''))
}

const urlFor = (key: string) => BASE + key

/**
 * Narrative position, synced to the URL path (`<base>/stage/step`). Ordinary
 * next/back replace the current history entry; explicit jumps (chapters,
 * Home/End) push a new one. Old `#/stage/step` links are rewritten on load.
 */
export function useNavigation(stages: AnyStage[]) {
  const steps = useMemo<FlatStep[]>(
    () =>
      stages.flatMap((stage, stageIndex) =>
        stage.steps.map((step, stepIndex) => ({
          stage,
          stageIndex,
          step,
          stepIndex,
          key: `${stage.id}/${step.id}`,
        })),
      ),
    [stages],
  )

  const indexOfKey = useCallback((key: string) => steps.findIndex((s) => s.key === key), [steps])

  const [index, setIndex] = useState(() => Math.max(0, indexOfKey(currentKey())))
  const [direction, setDirection] = useState<1 | -1>(1)
  const indexRef = useRef(index)

  const apply = useCallback((next: number) => {
    const current = indexRef.current
    if (next === current) return false
    indexRef.current = next
    setDirection(next > current ? 1 : -1)
    setIndex(next)
    return true
  }, [])

  const go = useCallback(
    (target: number, mode: HistoryMode = 'replace') => {
      const next = Math.min(Math.max(target, 0), steps.length - 1)
      if (!apply(next)) return
      const url = urlFor(steps[next].key)
      if (mode === 'push') window.history.pushState(null, '', url)
      else window.history.replaceState(null, '', url)
    },
    [apply, steps],
  )

  // Normalize an unknown, missing, or old hash-style location on load.
  useEffect(() => {
    const url = urlFor(steps[indexRef.current].key)
    if (window.location.pathname !== url || window.location.hash) window.history.replaceState(null, '', url)
  }, [steps])

  // Browser back/forward and manual URL edits.
  useEffect(() => {
    const sync = () => {
      const i = indexOfKey(currentKey())
      if (i >= 0) apply(i)
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [apply, indexOfKey])

  const stageStart = useCallback(
    (stageIndex: number) => steps.findIndex((s) => s.stageIndex === stageIndex),
    [steps],
  )

  return {
    steps,
    index,
    current: steps[index],
    direction,
    isFirst: index === 0,
    isLast: index === steps.length - 1,
    next: useCallback(() => go(indexRef.current + 1), [go]),
    back: useCallback(() => go(indexRef.current - 1), [go]),
    first: useCallback(() => go(0, 'push'), [go]),
    last: useCallback(() => go(steps.length - 1, 'push'), [go, steps.length]),
    jumpToStage: useCallback((stageIndex: number) => go(stageStart(stageIndex), 'push'), [go, stageStart]),
  }
}
