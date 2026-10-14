import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, MotionConfig, motion, type Variants } from 'motion/react'
import type { AnyStage } from '../types'
import { useNavigation } from './useNavigation'
import { usePreferences } from './usePreferences'
import { useKeyboard } from './useKeyboard'
import { useIdle } from './useIdle'
import { useNearBottom } from './useNearBottom'
import { Background } from './background/Background'
import { CaptionPanel } from './CaptionPanel'
import { Controls } from './Controls'
import styles from './Presentation.module.css'

type TransitionKind = 'default' | 'dramatic'
interface TransitionCustom {
  direction: 1 | -1
  kind: TransitionKind
}

const DRAMATIC_FADE = { duration: 0.8, ease: [0.4, 0, 0.2, 1] } as const

const stageVariants: Variants = {
  enter: ({ direction, kind }: TransitionCustom) =>
    kind === 'dramatic' ? { opacity: 0, x: 0 } : { opacity: 0, x: direction * 48 },
  center: ({ kind }: TransitionCustom) => ({
    opacity: 1,
    x: 0,
    transition: kind === 'dramatic' ? DRAMATIC_FADE : undefined,
  }),
  exit: ({ direction, kind }: TransitionCustom) =>
    kind === 'dramatic'
      ? { opacity: 0, transition: DRAMATIC_FADE }
      : { opacity: 0, x: direction * -48 },
}

export function Presentation({ stages }: { stages: AnyStage[] }) {
  const nav = useNavigation(stages)
  const prefs = usePreferences()
  const idle = useIdle(2500)
  const nearBottom = useNearBottom(72)
  const { stage, step, stepIndex } = nav.current

  // Transition style is decided when the stage changes, from the stage being
  // left and the one being entered, and held until the next stage change.
  const [transition, setTransition] = useState<{ stageId: string; kind: TransitionKind }>({
    stageId: stage.id,
    kind: 'default',
  })
  if (transition.stageId !== stage.id) {
    const leaving = stages.find((s) => s.id === transition.stageId)
    const dramatic = leaving?.transition === 'dramatic' || stage.transition === 'dramatic'
    setTransition({ stageId: stage.id, kind: dramatic ? 'dramatic' : 'default' })
  }
  const custom: TransitionCustom = { direction: nav.direction, kind: transition.kind }

  // Per-stage interaction state for this session; survives leaving a stage.
  const [interactions, setInteractions] = useState<Record<string, unknown>>({})
  const interaction = stage.id in interactions ? interactions[stage.id] : stage.initialInteraction
  const setInteraction = useCallback(
    (value: unknown) => setInteractions((all) => ({ ...all, [stage.id]: value })),
    [stage.id],
  )
  const resetInteraction = () =>
    setInteractions((all) => {
      const rest = { ...all }
      delete rest[stage.id]
      return rest
    })

  useKeyboard({
    next: nav.next,
    back: nav.back,
    first: nav.first,
    last: nav.last,
    toggleCaptions: prefs.toggleCaptions,
  })

  // Horizontal touch swipes advance; drags that start on interactive elements don't.
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement
    swipe.current =
      e.pointerType === 'touch' && !target.closest('[data-no-swipe], button, input')
        ? { x: e.clientX, y: e.clientY }
        : null
  }
  const onPointerUp = (e: PointerEvent) => {
    if (!swipe.current) return
    const dx = e.clientX - swipe.current.x
    const dy = e.clientY - swipe.current.y
    swipe.current = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      if (dx < 0) nav.next()
      else nav.back()
    }
  }

  const StageComponent = stage.component

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={styles.root}
        data-captions={prefs.captions}
        data-idle={idle}
        data-theme={stage.theme ?? 'light'}
      >
        <Background />
        <main className={styles.main}>
          <div
            className={styles.stageArea}
            data-selectable={stage.initialInteraction === undefined}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            <AnimatePresence
              initial={false}
              custom={custom}
              mode={transition.kind === 'dramatic' ? 'wait' : 'sync'}
            >
              <motion.section
                key={stage.id}
                className={styles.stage}
                aria-label={stage.title}
                custom={custom}
                variants={stageVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <StageComponent
                  step={step}
                  steps={stage.steps}
                  stepIndex={stepIndex}
                  interaction={interaction}
                  setInteraction={setInteraction}
                  resetInteraction={resetInteraction}
                />
              </motion.section>
            </AnimatePresence>
          </div>
          <CaptionPanel
            open={prefs.captions}
            stage={stage}
            step={step}
            stepIndex={stepIndex}
          />
        </main>
        <Controls
          nav={nav}
          captions={prefs.captions}
          onToggleCaptions={prefs.toggleCaptions}
          visible={nearBottom}
        />
        <p className={styles.srOnly} aria-live="polite">
          {`${stage.title}: ${step.label}`}
        </p>
      </div>
    </MotionConfig>
  )
}
