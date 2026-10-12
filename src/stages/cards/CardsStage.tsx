import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import styles from './CardsStage.module.css'

const ease = [0.22, 1, 0.36, 1] as const

/** Centered heading over a wrapping grid of short cards that fade in one after another. */
export function CardsStage({ step }: StageProps<undefined>) {
  const { heading, columns = [] } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      {heading && (
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {heading}
        </motion.h2>
      )}
      <ul className={styles.cards}>
        {columns.map((c, i) => (
          <motion.li
            key={c.id}
            className={styles.card}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.4 + i * 0.15 }}
          >
            <h3 className={styles.cardTitle}>{c.title}</h3>
            <p className={styles.cardBody}>
              <Inline text={c.body} />
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
