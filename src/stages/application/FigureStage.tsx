import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import shared from './application.module.css'
import styles from './FigureStage.module.css'
import { asset } from '../../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

/** A heading over one wide paper figure, for results that need the whole slide. */
export function FigureStage({ step }: StageProps<undefined>) {
  const { heading, figure } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      <h2 className={shared.heading}>{heading}</h2>
      {figure && (
        <motion.figure
          className={styles.figure}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.25 }}
        >
          <img src={asset(figure.src)} alt={figure.alt} draggable={false} />
        </motion.figure>
      )}
    </div>
  )
}
