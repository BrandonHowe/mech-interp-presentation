import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Slide, ease } from './common'
import { BADLY, type Point } from './data'
import styles from './BadlyStage.module.css'

/**
 * Slide 6: how this ends badly, as nested bullets in the style of "Why Mech Interp?".
 * One bullet per step, in reading order; hidden bullets keep their space.
 */
export function BadlyStage({ step, stepIndex }: StageProps<undefined>) {
  let order = 0
  const list = (points: Point[], depth: number) => (
    <ul className={styles.list} data-depth={depth}>
      {points.map((p) => {
        const shown = order++ <= stepIndex
        return (
          <motion.li
            key={p.text}
            className={styles.item}
            initial={{ opacity: 0, y: 10 }}
            animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.7, ease, delay: shown ? 0.15 : 0 }}
            aria-hidden={!shown}
          >
            <p>{p.text}</p>
            {p.sub && list(p.sub, depth + 1)}
          </motion.li>
        )
      })}
    </ul>
  )

  return (
    <Slide heading={step.screen?.heading} className={styles.body}>
      {list(BADLY, 0)}
    </Slide>
  )
}
