import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import { ScaleBar } from '../ScaleBar'
import styles from './FruitfulStage.module.css'
import { asset } from '../../lib/asset'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Steps: 'induction' shows the circuit figure and what bottom-up work took;
 * 'scale' fades in the parameter-count comparison. The scale column is always
 * laid out so revealing it never shifts the rest of the slide.
 */
export function FruitfulStage({ step }: StageProps<undefined>) {
  const { heading, subheading, body, figure, bullets = [], scale } = step.screen ?? {}
  const showScale = step.id === 'scale'

  return (
    <div className={styles.layout}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        {heading}
      </motion.h2>

      <div className={styles.top}>
        {figure && (
          <motion.figure
            className={styles.figure}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
          >
            <img src={asset(figure.src)} alt={figure.alt} />
          </motion.figure>
        )}

        <motion.div
          className={styles.text}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.6 }}
        >
          {subheading && <h3 className={styles.subheading}>{subheading}</h3>}
          {body && (
            <p className={styles.paragraph}>
              <Inline text={body} />
            </p>
          )}
          {figure?.credit && <p className={styles.credit}>{figure.credit}</p>}
        </motion.div>
      </div>

        {(bullets.length > 0 || scale) && (
          <motion.div
            className={styles.scaleBlock}
            initial={false}
            animate={{ opacity: showScale ? 1 : 0, y: showScale ? 0 : 12 }}
            transition={{ duration: 0.7, ease }}
            aria-hidden={!showScale}
          >
            {bullets.map((b, i) => (
              <p key={i} className={styles.point}>
                <Inline text={b.text} />
              </p>
            ))}
            {scale && <ScaleBar scale={scale} />}
          </motion.div>
        )}
    </div>
  )
}
