import { AnimatePresence, motion } from 'motion/react'
import type { StageProps } from '../../types'
import { score, type ProbeState } from './data'
import { Plot, type PlotVisual } from './Plot'
import { Reset } from '../../shell/icons'
import styles from './StructureTestStage.module.css'

/** Target visual state for each step, so any entry point reaches the same picture. */
const visuals: Record<string, PlotVisual> = {
  points: { points: 'full', means: false, direction: false, boundary: false, probe: false },
  means: { points: 'faint', means: true, direction: false, boundary: false, probe: false },
  direction: { points: 'faint', means: true, direction: true, boundary: false, probe: false },
  boundary: { points: 'full', means: true, direction: true, boundary: true, probe: false },
  probe: { points: 'full', means: true, direction: true, boundary: true, probe: true },
}

export function StructureTestStage({
  step,
  interaction,
  setInteraction,
  resetInteraction,
}: StageProps<ProbeState>) {
  const visual = visuals[step.id] ?? visuals.points
  const { eyebrow, heading, body } = step.screen ?? {}
  const s = score(interaction.probe)

  return (
    <div className={styles.layout}>
      <div className={styles.copy}>
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {heading && <h2 className={styles.heading}>{heading}</h2>}
            {body && <p className={styles.body}>{body}</p>}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {visual.probe && s !== null && (
            <motion.div
              className={styles.readout}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.readoutLabel}>score</span>
              <span className={styles.readoutValue}>
                {s >= 0 ? '+' : '−'}
                {Math.abs(s).toFixed(2)}
              </span>
              <span className={styles.side} data-side={s >= 0 ? 'a' : 'b'}>
                {s >= 0 ? 'Group A side' : 'Group B side'}
              </span>
              <button className={styles.reset} onClick={resetInteraction} title="Reset the probe">
                <Reset />
                Reset
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <figure className={styles.figure}>
        <div className={styles.plotWrap}>
          <Plot
            visual={visual}
            probe={interaction.probe}
            onProbeChange={(probe) => setInteraction({ probe })}
          />
        </div>
        <figcaption className={styles.figcaption}>
          <span className={styles.legend}>
            <svg viewBox="-8 -8 16 16" aria-hidden="true">
              <path d="M0 -7 L6.1 3.6 L-6.1 3.6 Z" fill="var(--group-a)" />
            </svg>
            Group A
          </span>
          <span className={styles.legend}>
            <svg viewBox="-8 -8 16 16" aria-hidden="true">
              <circle r="5.5" fill="var(--group-b)" />
            </svg>
            Group B
          </span>
        </figcaption>
      </figure>
    </div>
  )
}
