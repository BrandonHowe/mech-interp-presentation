import { AnimatePresence, motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import { INPUTS, W1, W2, forward, type ToyNetworkState } from './data'
import styles from './ToyNetworkStage.module.css'

/*
 * A tiny feedforward network, drawn only to contrast the two kinds of numbers:
 * each edge is labeled with its weight (fixed, the same for every input) and
 * each node with its activation (recomputed for each input, also shown as
 * shading). Beside it, the brain analogy.
 */
const W = 520
const H = 360
const LAYER_X = [70, 260, 450]
const R = 22

const layerY = (n: number) => Array.from({ length: n }, (_, i) => H / 2 + (i - (n - 1) / 2) * 96)
const NODES = [2, 3, 2].map((n, l) => layerY(n).map((y) => ({ x: LAYER_X[l], y })))
const EDGES = [W1, W2].flatMap((m, l) =>
  m.flatMap((row, to) => row.map((w, from) => ({ a: NODES[l][from], b: NODES[l + 1][to], w, key: `${l}-${from}-${to}` }))),
)

const format = (v: number) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(1)

export function ToyNetworkStage({ step, interaction, setInteraction }: StageProps<ToyNetworkState>) {
  const { heading, body } = step.screen ?? {}
  const input = INPUTS[interaction.input] ?? INPUTS[0]
  const acts = forward(input.x)

  return (
    <div className={styles.layout}>
      <h2 className={styles.heading}>{heading}</h2>

      <div className={styles.row}>
        <div className={styles.figure}>
          <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A tiny network: lines are weights, circles are activations">
            {EDGES.map(({ a, b, w, key }) => (
              <line
                key={key}
                className={w < 0 ? styles.edgeNeg : styles.edge}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={0.8 + 3.2 * Math.abs(w)}
                strokeOpacity={0.25 + 0.6 * Math.abs(w)}
              />
            ))}
            {EDGES.map(({ a, b, w, key }) => (
              <text key={key} className={styles.weight} x={a.x + (b.x - a.x) * 0.25} y={a.y + (b.y - a.y) * 0.25}>
                {format(w)}
              </text>
            ))}
            {NODES.map((layer, l) =>
              layer.map(({ x, y }, i) => {
                const v = acts[l][i]
                const level = Math.min(1, Math.max(0, v) / 1.2)
                return (
                  <g key={`${l}-${i}`} transform={`translate(${x} ${y})`}>
                    <circle className={styles.node} r={R} />
                    <motion.circle className={styles.fill} r={R} initial={false} animate={{ opacity: level }} transition={{ duration: 0.5 }} />
                    <motion.text
                      className={styles.value}
                      initial={false}
                      animate={{ fill: level > 0.55 ? 'var(--bg)' : 'var(--ink)' }}
                      transition={{ duration: 0.5 }}
                    >
                      {format(v)}
                    </motion.text>
                  </g>
                )
              }),
            )}
            {[0, 1].map((g) => (
              <text key={g} className={styles.groupLabel} x={(LAYER_X[g] + LAYER_X[g + 1]) / 2} y={18}>
                weights
              </text>
            ))}
            {['input', 'hidden', 'output'].map((name, l) => (
              <text key={name} className={styles.layerLabel} x={LAYER_X[l]} y={H - 6}>
                {name}
              </text>
            ))}
          </svg>
          <div className={styles.picker} role="radiogroup" aria-label="Input">
            {INPUTS.map((option, k) => (
              <button
                key={option.id}
                className={styles.choice}
                role="radio"
                aria-checked={interaction.input === k}
                onClick={() => setInteraction({ input: k })}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.legend}>
          <div className={styles.card}>
            <svg className={styles.icon} viewBox="0 0 40 40" aria-hidden="true">
              <line className={styles.edge} x1={4} y1={32} x2={36} y2={8} strokeWidth={3} strokeOpacity={0.8} />
            </svg>
            <div>
              <h3 className={styles.cardTitle}>Weights</h3>
              <p className={styles.cardBody}>The connections. Learned in training, then fixed.</p>
              <p className={styles.analogy}>Like the brain’s physical structure, which an MRI shows.</p>
            </div>
          </div>
          <div className={styles.card}>
            <svg className={styles.icon} viewBox="0 0 40 40" aria-hidden="true">
              <circle className={styles.node} cx={20} cy={20} r={14} />
              <circle className={styles.fill} cx={20} cy={20} r={14} opacity={0.75} />
            </svg>
            <div>
              <h3 className={styles.cardTitle}>Activations</h3>
              <p className={styles.cardBody}>How strongly each neuron fires for this input.</p>
              <p className={styles.analogy}>Like brain activity, which an fMRI shows.</p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {body && (
          <motion.p key={body} className={styles.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Inline text={body} />
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
