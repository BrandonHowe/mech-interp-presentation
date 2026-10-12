import { AnimatePresence, motion } from 'motion/react'
import type { StageProps } from '../../types'
import type { DigitState } from './latent'
import { DigitSpace } from './DigitSpace'
import styles from './DigitStage.module.css'

export function DigitStage({ step, interaction, setInteraction }: StageProps<DigitState>) {
  const { heading } = step.screen ?? {}

  return (
    <div className={styles.layout}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.h2
          key={heading}
          className={styles.heading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35 }}
        >
          {heading}
        </motion.h2>
      </AnimatePresence>

      <div className={styles.figure}>
        <DigitSpace
          point={interaction.point}
          onPointChange={(point) => setInteraction({ ...interaction, point })}
          showData={interaction.overlay}
        />
      </div>

      <div className={styles.controls}>
        <button
          className={styles.toggle}
          role="switch"
          aria-checked={interaction.overlay}
          onClick={() => setInteraction({ ...interaction, overlay: !interaction.overlay })}
        >
          <span className={styles.switch} aria-hidden="true" />
          Show real digits
        </button>
      </div>
    </div>
  )
}
