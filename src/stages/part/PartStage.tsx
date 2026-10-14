import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import styles from './PartStage.module.css'

const ease = [0.22, 1, 0.36, 1] as const

/** Section divider: "Part n: Title" on one line, centered. Shown on the dark theme. */
export function PartStage({ step }: StageProps<undefined>) {
  const { eyebrow, heading } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      <motion.h1
        className={styles.heading}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 0.25 }}
      >
        <span className={styles.part}>{eyebrow}:</span> {heading}
      </motion.h1>
    </div>
  )
}
