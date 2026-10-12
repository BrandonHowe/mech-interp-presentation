import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AnyStage, StepDef } from '../types'

export interface FlatStep {
  stage: AnyStage
  stageIndex: number
  step: StepDef
  stepIndex: number
  /** `stage-id/step-id`, used in the URL fragment. */
  key: string
}

export type HistoryMode = 'replace' | 'push'

const keyFromHash = (hash: string) => decodeURIComponent(hash.replace(/^#\/?/, ''))

/**
 * Narrative position, synced to the URL fragment. Ordinary next/back replace the
 * current history entry; explicit jumps (chapters, Home/End) push a new one.
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

  const indexOfHash = useCallback(
    (hash: string) => steps.findIndex((s) => s.key === keyFromHash(hash)),
    [steps],
  )

  const [index, setIndex] = useState(() => Math.max(0, indexOfHash(window.location.hash)))
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
      const url = `#/${steps[next].key}`
      if (mode === 'push') window.history.pushState(null, '', url)
      else window.history.replaceState(null, '', url)
    },
    [apply, steps],
  )

  // Normalize an unknown or missing fragment on load.
  useEffect(() => {
    if (indexOfHash(window.location.hash) < 0) {
      window.history.replaceState(null, '', `#/${steps[indexRef.current].key}`)
    }
  }, [indexOfHash, steps])

  // Browser back/forward and manual fragment edits.
  useEffect(() => {
    const sync = () => {
      const i = indexOfHash(window.location.hash)
      if (i >= 0) apply(i)
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [apply, indexOfHash])

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
