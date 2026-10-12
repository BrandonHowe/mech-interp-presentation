import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import styles from './BulletsStage.module.css'

const ease = [0.22, 1, 0.36, 1] as const

/** Centered heading with a short list of points that fade in one after another. */
export function BulletsStage({ step }: StageProps<undefined>) {
  const { heading, bullets = [] } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      {heading && (
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          {heading}
        </motion.h2>
      )}
      <ul className={styles.list}>
        {bullets.map((b, i) => (
          <motion.li
            key={i}
            className={styles.item}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.6 + i * 0.35 }}
          >
            <p>
              <Inline text={b.text} />
            </p>
            {b.sub && (
              <ul className={styles.subList}>
                {b.sub.map((sub, j) => (
                  <li key={j}>{sub}</li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
