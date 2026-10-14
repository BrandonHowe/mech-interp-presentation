import type { StageProps } from '../../types'
import { Appear, Slide } from './common'
import { SHOTS } from './data'
import styles from './GrownStage.module.css'
import { asset } from '../../lib/asset'

/**
 * Slide 5b: why alignment patches may not hold. Each point is captioned under
 * its evidence: a model greeting its evaluators, blackmail rates under
 * replacement threat, and an agent breaking out of its sandbox. Columns are
 * sized by each image's aspect ratio, so all three images share one height.
 */
const EVIDENCE = [SHOTS.helloEvaluators, SHOTS.blackmailRates, SHOTS.huggingFace]

export function PatchesStage({ step }: StageProps<undefined>) {
  const { heading, subheading, bullets = [] } = step.screen ?? {}

  return (
    <Slide heading={heading} className={styles.patches}>
      <Appear delay={0.3}>
        <p className={styles.lead}>{subheading}</p>
      </Appear>
      <ul
        className={styles.columns}
        style={{ gridTemplateColumns: EVIDENCE.map((e) => `${e.w / e.h}fr`).join(' ') }}
      >
        {bullets.map((b, i) => (
          <Appear key={i} delay={0.7 + i * 0.35} className={styles.column}>
            <div className={styles.evidence}>
              <img src={asset(EVIDENCE[i].src)} alt={EVIDENCE[i].alt} draggable={false} />
            </div>
            <p className={styles.caption}>{b.text}</p>
          </Appear>
        ))}
      </ul>
    </Slide>
  )
}
