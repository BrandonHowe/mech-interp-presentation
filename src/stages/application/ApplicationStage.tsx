import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import shared from './application.module.css'
import styles from './ApplicationStage.module.css'
import { asset } from '../../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

/** A research result: short bullet points on the left, the paper's figure on the right. */
export function ApplicationStage({ step }: StageProps<undefined>) {
  const { heading, bullets = [], figure } = step.screen ?? {}

  return (
    <div className={shared.layout}>
      <div className={shared.copy}>
        <h2 className={shared.heading}>{heading}</h2>
        <ol className={shared.steps}>
          {bullets.map((b, i) => (
            <motion.li
              key={i}
              className={shared.step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.2 }}
            >
              <span>
                <Inline text={b.text} />
              </span>
            </motion.li>
          ))}
        </ol>
      </div>

      {figure && (
        <figure className={shared.figure}>
          <div className={`${shared.card} ${styles.paper}`}>
            <img src={asset(figure.src)} alt={figure.alt} draggable={false} />
          </div>
        </figure>
      )}
    </div>
  )
}
