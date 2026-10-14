import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import styles from './FellowshipStage.module.css'
import { asset } from '../../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Call to action: heading, deadline, and details on the left; a QR code
 * (`figure`) with its URL (`body`) on the right, large enough to scan from
 * the back of a room.
 */
export function FellowshipStage({ step }: StageProps<undefined>) {
  const { heading, subheading, bullets = [], figure, body } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      <div className={styles.text}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
        >
          {heading}
        </motion.h2>
        {subheading && (
          <motion.p
            className={styles.deadline}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            {subheading}
          </motion.p>
        )}
        <ul className={styles.list}>
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              className={styles.item}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.45 + i * 0.12 }}
            >
              <Inline text={b.text} />
            </motion.li>
          ))}
        </ul>
      </div>

      {figure && (
        <motion.figure
          className={styles.qr}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
        >
          <img src={asset(figure.src)} alt={figure.alt} draggable={false} />
          {body && <figcaption className={styles.url}>{body}</figcaption>}
        </motion.figure>
      )}
    </div>
  )
}
