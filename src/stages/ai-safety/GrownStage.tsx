import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import { Appear, Slide } from './common'
import { Collage } from './Collage'
import { SHOTS } from './data'
import styles from './GrownStage.module.css'

/**
 * Slide 5a: software is specified; models are grown, then shaped by alignment
 * training. On the right, blatant failures of that shaping, now mostly patched.
 */
const FAILURES = [[SHOTS.mechaHitler], [SHOTS.pleaseDie], [SHOTS.sydney]]

export function GrownStage({ step }: StageProps<undefined>) {
  const { heading, bullets = [], body } = step.screen ?? {}

  return (
    <Slide heading={heading} className={styles.body}>
      <ul className={styles.points}>
        {bullets.map((b, i) => (
          <Appear key={i} delay={0.3 + i * 0.25} className={styles.point}>
            <p>
              <Inline text={b.text} />
            </p>
            {b.sub && (
              <ul className={styles.sub}>
                {b.sub.map((sub) => (
                  <li key={sub}>
                    <Inline text={sub} />
                  </li>
                ))}
              </ul>
            )}
          </Appear>
        ))}
      </ul>
      <div className={styles.side}>
        <Collage rows={FAILURES} delay={0.9} stagger={0.2} className={styles.failures} />
        <Appear delay={1.6}>
          <p className={styles.note}>{body}</p>
        </Appear>
      </div>
    </Slide>
  )
}
