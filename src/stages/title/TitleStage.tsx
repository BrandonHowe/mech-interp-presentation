import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { gaussian, mulberry32 } from '../../lib/random'
import styles from './TitleStage.module.css'

// Decorative field of points; fixed seed so it never changes between rehearsals.
const rand = mulberry32(11)
const dots = Array.from({ length: 70 }, (_, i) => {
  const group = i % 2
  const cx = group ? 120 : -120
  const cy = group ? -80 : 80
  return { x: cx + gaussian(rand) * 78, y: cy + gaussian(rand) * 66, group }
})

const ease = [0.22, 1, 0.36, 1] as const

export function TitleStage({ step }: StageProps<undefined>) {
  const { eyebrow, heading, body } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      <div className={styles.copy}>
        {eyebrow && (
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          {heading}
        </motion.h1>
        {body && (
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
          >
            {body}
          </motion.p>
        )}
      </div>

      <svg className={styles.graphic} viewBox="-330 -310 660 620" aria-hidden="true">
        {dots.map((d, i) => (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={d.group ? 5 : 4}
            className={d.group ? styles.dotB : styles.dotA}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.35 + i * 0.012 }}
          />
        ))}
        <motion.path
          d="M -110 80 L 106 -71"
          className={styles.arrow}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 1.2 }}
        />
        <motion.path
          d="M 88 -69 L 108 -72 L 98 -54"
          className={styles.arrow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.1 }}
        />
      </svg>

    </div>
  )
}
