import type { StageProps } from '../../types'
import { Appear, Photo, Slide } from './common'
import { Collage } from './Collage'
import { PHOTOS, SHOTS } from './data'
import styles from './ProgressStage.module.css'

/**
 * Slide 1: photos of AI already in the world, then (second step) the same
 * space fills with math headlines, from botched multiplication to
 * Millennium Prize Problems.
 */
// Math headlines in date order: 2023, Jul 2025, Jul 2026 / Sep 2026, Oct 2026.
const MATH = [
  [SHOTS.multiply, SHOTS.imo, SHOTS.jacobian],
  [[SHOTS.navierStokes, SHOTS.millennium], SHOTS.preprints],
]

export function ProgressStage({ step, stepIndex }: StageProps<undefined>) {
  const showMath = stepIndex >= 1

  return (
    <Slide heading={step.screen?.heading} className={styles.body}>
      <Appear show={!showMath} delay={0.2} className={styles.layer}>
        <div className={styles.mosaic}>
          <Photo {...PHOTOS.waymo} className={styles.waymo} />
          <Photo {...PHOTOS.poke} className={styles.poke} />
          <Photo {...PHOTOS.alphafold} className={styles.alphafold} />
          <Photo {...PHOTOS.rizzbot} className={styles.rizzbot} position="50% 30%" />
        </div>
      </Appear>

      <div className={styles.layer} aria-hidden={!showMath}>
        <Collage show={showMath} delay={0.2} stagger={0.3} rows={MATH} />
      </div>
    </Slide>
  )
}
