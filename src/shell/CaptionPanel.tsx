import { AnimatePresence, motion } from 'motion/react'
import type { AnyStage, StepDef } from '../types'
import styles from './CaptionPanel.module.css'

interface Props {
  open: boolean
  stage: AnyStage
  step: StepDef
  stepIndex: number
}

/** Self-guided explanation for the current step. Hidden (and inert) in live mode. */
export function CaptionPanel({ open, stage, step, stepIndex }: Props) {
  const paragraphs = step.caption?.split(/\n\s*\n/).map((p) => p.trim()) ?? []

  return (
    <aside className={styles.panel} aria-label="Explanation" aria-hidden={!open} inert={!open}>
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span>{stage.title}</span>
          <span className={styles.count}>
            {stepIndex + 1} / {stage.steps.length}
          </span>
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${stage.id}/${step.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            <h2 className={styles.title}>{step.label}</h2>
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => (
                <p key={i} className={styles.text}>
                  {p}
                </p>
              ))
            ) : (
              <p className={styles.empty}>No explanation written for this step yet.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  )
}
