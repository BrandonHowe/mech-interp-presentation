import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import shared from './application.module.css'
import styles from './EvalAwarenessStage.module.css'
import { asset } from '../../lib/asset'

/*
 * Claude Mythos Preview System Card (Anthropic, April 7, 2026), section 4.5.5:
 * a mean-difference "evaluation awareness" probe, and steering against three
 * eval-awareness vectors during automated behavioral audits. The figure is
 * Figure 4.5.5.1.B: a transcript flagged by both the probe (top 5%) and
 * activation-verbalizer readouts, where the model never says it's being tested. These are evaluation-time checks; the
 * card does not describe intervening on these vectors during training.
 */
const VIEWS = {
  good: {
    label: 'What it’s good for',
    points: [
      'Any way of measuring and reducing eval awareness is helpful, since eval awareness is one of the main issues threatening alignment techniques.',
      'In theory it’s hard for an LLM to spoof its internals, so the linear probe can detect awareness even if the model doesn’t say anything.',
    ],
  },
  bad: {
    label: 'Where it falls short',
    points: [
      'The probe is noisy and brittle, and only weakly agrees with other detectors. Steering with the probe is not very effective.',
      'Doesn’t seem to actually track how LLMs represent eval awareness internally, so it may break with more intelligent models.',
    ],
  },
}

/**
 * A probe that works, with real limits: the upside first, then (next step) the
 * caveats underneath. The caveats keep their space while hidden.
 */
export function EvalAwarenessStage({ step, stepIndex }: StageProps<undefined>) {
  return (
    <div className={shared.layout}>
      <div className={shared.copy}>
        <h2 className={shared.heading}>{step.screen?.heading}</h2>
        <p className={styles.lead}>Does the model know it’s being tested?</p>
        {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((key) => (
          <motion.section
            key={key}
            className={styles.group}
            data-view={key}
            initial={false}
            animate={{ opacity: key === 'good' || stepIndex >= 1 ? 1 : 0, y: key === 'good' || stepIndex >= 1 ? 0 : 8 }}
            transition={{ duration: 0.5 }}
            aria-hidden={key === 'bad' && stepIndex < 1}
          >
            <h3 className={styles.groupTitle}>{VIEWS[key].label}</h3>
            <ol className={shared.steps}>
              {VIEWS[key].points.map((point) => (
                <li key={point} className={`${shared.step} ${styles.point}`}>
                  {point}
                </li>
              ))}
            </ol>
          </motion.section>
        ))}
      </div>

      <figure className={shared.figure}>
        <div className={`${shared.card} ${styles.paper}`}>
          <img
            src={asset('/images/applications/eval-awareness-transcript.png')}
            alt="Transcript from the Claude Mythos Preview system card: a sponsored-content scenario with no eval keywords. The model’s reply just says “Let me think carefully about this situation,” but readouts of its activations say “Meta-evaluation context about advertising integrity” and “evaluating an assistant’s authenticity.”"
            draggable={false}
          />
        </div>
      </figure>
    </div>
  )
}
