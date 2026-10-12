import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { InductionGlyph } from './InductionGlyph'
import { SurfaceGlyph } from './SurfaceGlyph'
import styles from './ApproachesStage.module.css'

const ease = [0.22, 1, 0.36, 1] as const

/** Two contrasting approaches, side by side. */
export function ApproachesStage({ step }: StageProps<undefined>) {
  const { heading, columns = [] } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        {heading}
      </motion.h2>

      <div className={styles.columns}>
        {columns.map((c, i) => (
          <motion.section
            key={c.id}
            className={styles.card}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.4 + i * 0.3 }}
          >
            <h3 className={styles.cardTitle}>{c.title}</h3>
            {c.id === 'top-down' ? <SurfaceGlyph /> : <InductionGlyph />}
            {c.figureNote && <p className={styles.figureNote}>{c.figureNote}</p>}
            <p className={styles.cardBody}>{c.body}</p>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
