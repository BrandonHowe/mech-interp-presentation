import { AnimatePresence, motion } from 'motion/react'
import type { StageProps, StepDef } from '../../types'
import { Reset } from '../../shell/icons'
import { Inline } from '../Inline'
import { Reserve } from '../Reserve'
import {
  ALPHA_MAX,
  GENERATIONS,
  ablateExample,
  predictExample,
  score,
  steerExample,
  threshold,
  type RefusalInteraction,
} from './data'
import { RefusalPlot, type RefusalVisual } from './RefusalPlot'
import styles from './RefusalStage.module.css'

const base = { points: 'full', means: false, direction: false, boundary: false, axis: false, example: 'none' } as const
const built = { ...base, means: true, direction: true, boundary: true }
// Interventions hide the toy boundary (they are tested by behavior, not by
// crossing a line) and the d arrow (u at the origin carries the direction).
const intervene = { ...base, points: 'dim', means: true, axis: true } as const

/** Target visual state for each step, so any entry point reaches the same picture. */
const visuals: Record<string, RefusalVisual> = {
  generate: { ...base, points: 'hidden' },
  examples: base,
  means: { ...base, points: 'faint', means: true },
  direction: { ...base, points: 'faint', means: true, direction: true },
  boundary: built,
  'new-example': { ...built, example: 'new' },
  predict: { ...built, points: 'dim', example: 'predict' },
  response: { ...built, points: 'dim', example: 'predict' },
  causation: built,
  'ablate-before': { ...intervene, example: 'ablate-before' },
  ablate: { ...intervene, example: 'ablate' },
  'steer-before': { ...intervene, example: 'steer-before' },
  steer: { ...intervene, example: 'steer' },
}

const signed = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toFixed(2)}`
const near = (a: readonly number[], b: readonly number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6

type Panel = 'generate' | 'predict' | 'ablate' | 'steer' | null

const panelFor = (stepId: string): Panel => {
  const ex = (visuals[stepId] ?? visuals.examples).example
  if (stepId === 'generate' || stepId === 'examples') return 'generate'
  if (ex === 'new' || ex === 'predict') return 'predict'
  if (ex === 'ablate-before' || ex === 'ablate') return 'ablate'
  if (ex === 'steer-before' || ex === 'steer') return 'steer'
  return null
}

/** Steps whose copy and panel match share one slot, so changing between them doesn't crossfade. */
const copyKey = (step: StepDef) => {
  const { heading, body, subheading, bullets } = step.screen ?? {}
  return JSON.stringify([heading, body, subheading, bullets?.map((b) => b.text), panelFor(step.id)])
}

export function RefusalStage({ step, steps, interaction, setInteraction, resetInteraction }: StageProps<RefusalInteraction>) {
  const visual = visuals[step.id] ?? visuals.examples
  const chart = step.id !== 'generate'

  const renderCopy = (s: StepDef) => {
    const { heading, body, subheading: formula, bullets, reveal } = s.screen ?? {}
    const ex = (visuals[s.id] ?? visuals.examples).example
    const panel = panelFor(s.id)
    const shown = reveal ?? bullets?.length ?? 0
    return (
      <>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {body && (
          <p className={styles.body}>
            <Inline text={body} />
          </p>
        )}
        {formula && <p className={styles.formula}>{formula}</p>}
        {bullets && (
          <ol className={styles.steps}>
            {bullets.map((b, i) => (
              <motion.li
                key={b.text}
                className={styles.stepItem}
                initial={false}
                animate={{ opacity: i < shown ? 1 : 0, y: i < shown ? 0 : 6 }}
                transition={{ duration: 0.4 }}
                aria-hidden={i >= shown}
              >
                <span>
                  <Inline text={b.text} />
                </span>
                {b.sub?.map((line) => (
                  <span key={line} className={styles.formula}>
                    {line}
                  </span>
                ))}
              </motion.li>
            ))}
          </ol>
        )}
        {panel === 'generate' && (
          <GeneratePanel
            generated={interaction.generated || s.id !== 'generate'}
            onGenerate={() => setInteraction({ ...interaction, generated: true })}
          />
        )}
        {panel === 'predict' && (
          <ValidatePanel
            interaction={interaction}
            stage={s.id === 'new-example' ? 0 : s.id === 'predict' ? 1 : 2}
            onReset={resetInteraction}
          />
        )}
        {panel === 'ablate' && (
          <BehaviorCard
            prompt={ablateExample.prompt}
            shape="r"
            before={ablateExample.before}
            afterLabel="After removing"
            after={ex === 'ablate' ? ablateExample.after : null}
            afterShape="n"
          />
        )}
        {panel === 'steer' && (
          <SteerPanel
            active={ex === 'steer'}
            alpha={interaction.alpha}
            onAlpha={(alpha) => setInteraction({ ...interaction, alpha })}
          />
        )}
      </>
    )
  }

  return (
    <div className={styles.layout}>
      <Reserve className={styles.copy} items={steps} current={step} getKey={copyKey}>
        {renderCopy}
      </Reserve>

      <motion.figure
        className={styles.figure}
        initial={false}
        animate={{ opacity: chart ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        aria-hidden={!chart}
      >
        <div className={styles.plotWrap}>
          <RefusalPlot
            visual={visual}
            probe={interaction.probe}
            alpha={interaction.alpha}
            onProbeChange={(probe) => setInteraction({ ...interaction, probe })}
          />
        </div>
      </motion.figure>
    </div>
  )
}

/** Step 1: run prompts through the model and record an activation vector for each. */
function GeneratePanel({
  generated,
  onGenerate,
}: {
  generated: boolean
  onGenerate: () => void
}) {
  const sections = [
    { key: 'harmless', title: 'Harmless prompts', shape: 'n' as const, rows: GENERATIONS.harmless, offset: 0 },
    { key: 'harmful', title: 'Harmful prompts', shape: 'r' as const, rows: GENERATIONS.harmful, offset: 5 },
  ]
  return (
    <div className={styles.generate}>
      {sections.map((section) => (
        <section key={section.key} className={styles.genSection}>
          <h3 className={styles.genTitle}>
            <Shape shape={section.shape} />
            {section.title}
          </h3>
          <ul className={styles.genRows}>
            {section.rows.map((row, i) => (
              <li key={row.prompt} className={styles.genRow}>
                <motion.span
                  className={styles.genPrompt}
                  initial={false}
                  animate={{ opacity: generated ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: generated ? (section.offset + i) * 0.12 : 0 }}
                >
                  {row.prompt}
                </motion.span>
                <motion.span
                  className={styles.genVector}
                  initial={false}
                  animate={{ opacity: generated ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: generated ? (section.offset + i) * 0.12 + 0.25 : 0 }}
                >
                  [ {row.h.map((v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2)).join(', ')}, … ]
                </motion.span>
              </li>
            ))}
          </ul>
          <motion.p
            className={styles.genMore}
            initial={false}
            animate={{ opacity: generated ? 1 : 0 }}
            transition={{ duration: 0.3, delay: generated ? (section.offset + section.rows.length) * 0.12 + 0.2 : 0 }}
          >
            …995 more
          </motion.p>
        </section>
      ))}
      <button className={styles.generateButton} onClick={onGenerate} disabled={generated}>
        {generated ? 'Generated' : 'Generate'}
      </button>
    </div>
  )
}

function Shape({ shape }: { shape: 'r' | 'n' }) {
  return (
    <svg className={styles.shape} viewBox="-8 -8 16 16" aria-hidden="true">
      {shape === 'r' ? (
        <path d="M0 -7 L6.1 3.6 L-6.1 3.6 Z" fill="var(--group-a)" />
      ) : (
        <circle r="5.5" fill="var(--group-b)" />
      )}
    </svg>
  )
}

function Prompt({ text }: { text: string }) {
  return <p className={styles.prompt}>{text}</p>
}

/**
 * Step 3: a new prompt (stage 0), its projection onto the direction (1), and
 * the model's response (2). Every row is laid out from the start and only
 * fades in, so nothing shifts.
 */
function ValidatePanel({
  interaction,
  stage,
  onReset,
}: {
  interaction: RefusalInteraction
  stage: 0 | 1 | 2
  onReset: () => void
}) {
  const moved = !near(interaction.probe, predictExample.h)
  const s = score(interaction.probe)
  const refuses = s > threshold
  const show = (n: number) => ({ initial: false, animate: { opacity: stage >= n ? 1 : 0 }, transition: { duration: 0.4 } }) as const
  return (
    <div className={styles.panel}>
      {moved && stage >= 1 ? <p className={styles.promptMoved}>A point you placed</p> : <Prompt text={predictExample.prompt} />}
      <ol className={styles.steps}>
        <motion.li className={styles.stepItem} {...show(1)} aria-hidden={stage < 1}>
          <span>Project onto the refusal direction:</span>
          <span className={styles.formula}>
            h · u = {signed(s)} {refuses ? '>' : '<'} m · u = {signed(threshold)}
          </span>
          <span className={styles.predictionLine}>
            <span className={styles.verdict} data-side={refuses ? 'r' : 'n'}>
              <Shape shape={refuses ? 'r' : 'n'} />
              {refuses ? 'Refusal region: predicts a refusal' : 'Non-refusal region: predicts an answer'}
            </span>
            <button
              className={styles.reset}
              onClick={onReset}
              title="Put the point back"
              style={{ visibility: moved && stage >= 1 ? 'visible' : 'hidden' }}
            >
              <Reset />
              Reset
            </button>
          </span>
        </motion.li>
        <motion.li className={styles.stepItem} {...show(2)} aria-hidden={stage < 2}>
          <span>Generate the model’s response:</span>
          <span className={styles.reply} data-empty={moved}>
            {moved ? 'No prompt for a placed point' : `“${predictExample.response}”`}
          </span>
        </motion.li>
      </ol>
    </div>
  )
}

interface Outcome {
  verdict: string
  text: string
}

function BehaviorCard({
  prompt,
  shape,
  before,
  afterLabel,
  after,
  afterShape,
}: {
  prompt: string
  shape: 'r' | 'n'
  before: Outcome
  afterLabel: string
  after: Outcome | null
  afterShape: 'r' | 'n'
}) {
  return (
    <div className={styles.panel}>
      <Prompt text={prompt} />
      <div className={styles.card}>
        <OutcomeRow label="Normally" shape={shape} outcome={before} />
        <OutcomeRow label={afterLabel} shape={afterShape} outcome={after} delay={0.8} />
      </div>
    </div>
  )
}

function OutcomeRow({
  label,
  shape,
  outcome,
  delay = 0,
}: {
  label: string
  shape: 'r' | 'n'
  outcome: Outcome | null
  /** Wait for the plot animation before revealing the outcome. */
  delay?: number
}) {
  return (
    <div className={styles.outcome}>
      <span className={styles.outcomeLabel}>{label}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={outcome?.verdict ?? 'pending'}
          className={styles.outcomeBody}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.25, delay: outcome ? delay : 0 }}
        >
          {outcome ? (
            <>
              <span className={styles.verdict} data-side={shape}>
                <Shape shape={shape} />
                {outcome.verdict}
              </span>
              <span className={styles.outcomeText}>{outcome.text}</span>
            </>
          ) : (
            <span className={styles.pending}>?</span>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function SteerPanel({ active, alpha, onAlpha }: { active: boolean; alpha: number; onAlpha: (a: number) => void }) {
  const refuses = active && alpha >= steerExample.refuseAt
  return (
    <div className={styles.panel}>
      <Prompt text={steerExample.prompt} />
      <div className={styles.card}>
        <OutcomeRow label="Normally" shape="n" outcome={steerExample.before} />
        <OutcomeRow
          label="After adding"
          shape={refuses ? 'r' : 'n'}
          outcome={active ? (refuses ? steerExample.after : steerExample.before) : null}
        />
        <motion.label
          className={styles.slider}
          initial={false}
          animate={{ opacity: active ? 1 : 0.35 }}
          data-no-swipe
        >
          <span className={styles.alpha}>α = {(active ? alpha : 0).toFixed(1)}</span>
          <input
            type="range"
            min={0}
            max={ALPHA_MAX}
            step={0.1}
            value={active ? alpha : 0}
            disabled={!active}
            onChange={(e) => onAlpha(Number(e.target.value))}
            aria-label="Steering strength alpha"
          />
        </motion.label>
      </div>
    </div>
  )
}
