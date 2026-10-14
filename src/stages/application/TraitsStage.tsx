import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import styles from './TraitsStage.module.css'
import { asset } from '../../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

/*
 * Persona vectors (Chen et al., Anthropic, arXiv 2507.21509). The figure is
 * the "examples of steered responses" panel from anthropic.com/research/persona-vectors.
 */
const FIGURE = {
  src: '/images/applications/persona-steered.png',
  alt: 'Examples of steered responses from Anthropic’s persona vectors post: steering toward evil produces a cruel list of ways to harm vulnerable people; toward sycophancy, gushing agreement that coding should be mandatory; toward hallucination, a confident recipe for Martian dust soup from a made-up cookbook.',
}

/** Heading, one bullet, the paper's steered-response examples, then a second bullet. */
export function TraitsStage({ step }: StageProps<undefined>) {
  const { heading, bullets = [] } = step.screen ?? {}
  const [first, ...rest] = bullets
  const fade = (delay: number) =>
    ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease, delay } }) as const

  return (
    <div className={styles.layout}>
      <motion.h2 className={styles.heading} {...fade(0.1)}>
        {heading}
      </motion.h2>
      {first && (
        <motion.ul className={styles.list} {...fade(0.4)}>
          <li>
            <Inline text={first.text} />
          </li>
        </motion.ul>
      )}
      <motion.img className={styles.figure} src={asset(FIGURE.src)} alt={FIGURE.alt} draggable={false} {...fade(0.7)} />
      {rest.length > 0 && (
        <motion.ul className={styles.list} {...fade(1)}>
          {rest.map((b) => (
            <li key={b.text}>
              <Inline text={b.text} />
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  )
}
