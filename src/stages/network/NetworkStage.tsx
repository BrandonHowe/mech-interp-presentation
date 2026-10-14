import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import { Reserve } from '../Reserve'
import { INPUTS, WEIGHTS } from './data'
import styles from './NetworkStage.module.css'

/*
 * One persistent SVG (1000 × 440 units). Three prompts run through one model
 * at once, so it is visible that they share the weights but each get their own
 * activations. The model starts as a closed box, widens to show its weights,
 * fed by weights from outside, then widens and turns light to reveal one list
 * of activations per prompt: no neurons
 * or layers are ever drawn. Each step only moves, shows, or hides pieces.
 */
interface Visual {
  /** Box state: closed (narrow, dark), open (open, light), hidden. */
  box: 'closed' | 'open' | 'hidden'
  weights: boolean
  activations: boolean
  plane: boolean
}

const visuals: Record<string, Visual> = {
  function: { box: 'closed', weights: false, activations: false, plane: false },
  weights: { box: 'closed', weights: true, activations: false, plane: false },
  activations: { box: 'open', weights: true, activations: true, plane: false },
  point: { box: 'hidden', weights: false, activations: true, plane: true },
}

const ease = [0.22, 1, 0.36, 1] as const
const move = { duration: 0.7, ease }
const fade = { duration: 0.4 }

/** Center lines of the three input → model → output rows. */
const ROWS = [190, 270, 350]
const CHIP_H = 48
const IN_X = 30
const IN_W = 250
const OUT_W = 250
const OUT_X = 1000 - 30 - OUT_W
/** Horizontal center of the model; the layout is symmetric around it. */
const CX = 500

const CLOSED = {
  x: CX - 90,
  y: ROWS[0] - 36,
  width: 180,
  height: ROWS[2] - ROWS[0] + 72,
}
const WIDE = { x: CX - 180, y: 140, width: 360, height: 285 }

/** The weights sit above the box, outside it, feeding in. */
const WEIGHTS_Y = 82
const WEIGHTS_W = 230

const SLOT = 70
const N_SHOWN = 3
const VECTOR_W = (N_SHOWN + 1) * SLOT
/** Left edge of the activation vectors inside the model, and beside the plane. */
const VECTOR_X_IN = CX - VECTOR_W / 2
const VECTOR_X_PLANE = 130

/** Plane: centered at (PX, PY), half-size PH in SVG units; values span ±2. */
const PX = 790
const PY = 190
const PH = 140
/** Beside the plane, the activation rows shift up to center on it. */
const PLANE_SHIFT = PY - ROWS[1]
const PLANE_NOTE = '2D grids are great for visualization, but real model activations live in spaces with **thousands of dimensions!**'
const toPlane = (a: number, b: number) => [PX + (a / 2) * PH, PY - (b / 2) * PH] as const

export function NetworkStage({ step, steps }: StageProps<undefined>) {
  const visual = visuals[step.id] ?? visuals.function
  const { heading, body } = step.screen ?? {}

  const open = visual.box === 'open'
  const ends = visual.box !== 'hidden'
  const vectorX = visual.plane ? VECTOR_X_PLANE : VECTOR_X_IN
  const arrowIn = visual.activations ? VECTOR_X_IN - 12 : open ? WIDE.x - 10 : CLOSED.x - 10
  const arrowOut = visual.activations
    ? VECTOR_X_IN + VECTOR_W + 12
    : open
      ? WIDE.x + WIDE.width + 10
      : CLOSED.x + CLOSED.width + 10

  return (
    <div className={styles.layout}>
      <Reserve items={steps.map((s) => s.screen?.heading ?? '')} current={heading ?? ''} getKey={(h) => h}>
        {(h) => <h2 className={styles.heading}>{h}</h2>}
      </Reserve>

      <div className={styles.figure}>
        <svg
          className={styles.svg}
          viewBox="0 0 1000 440"
          role="img"
          aria-label="Three prompts share the model's weights; each produces its own activations, which become its output"
        >
          {/* The model: a closed box that widens and then opens */}
          <motion.g
            className={open ? styles.open : styles.closed}
            initial={false}
            animate={{ opacity: ends ? 1 : 0 }}
            transition={fade}
          >
            <motion.rect className={styles.box} rx={18} initial={false} animate={open ? WIDE : CLOSED} transition={move} />
            <motion.text
              className={styles.boxLabel}
              x={CX}
              y={ROWS[1]}
              initial={false}
              animate={{ opacity: open ? 0 : 1 }}
              transition={fade}
            >
              model
            </motion.text>
            <motion.g initial={false} animate={{ opacity: open ? 1 : 0 }} transition={fade}>
              <text className={styles.tag} x={CX} y={ROWS[2] + 46}>
                activations <tspan className={styles.math}>∈ ℝ</tspan>
                <tspan className={styles.math} dy={-8} fontSize="0.75em">
                  n
                </tspan>
                <tspan dy={8}> · internal state</tspan>
              </text>
            </motion.g>
          </motion.g>

          {/* Weights: outside the box, shared by every input */}
          <motion.g initial={false} animate={{ opacity: visual.weights ? 1 : 0 }} transition={fade}>
            <text className={styles.weightsLabel} x={CX} y={WEIGHTS_Y - 32}>
              weights · fixed after training
            </text>
            <rect className={styles.weights} x={CX - WEIGHTS_W / 2} y={WEIGHTS_Y - 21} width={WEIGHTS_W} height={42} rx={12} />
            <text className={styles.numbers} x={CX} y={WEIGHTS_Y}>
              {list(WEIGHTS)}
            </text>
            <VArrow x={CX} y1={WEIGHTS_Y + 27} y2={(open ? WIDE.y : CLOSED.y) - 6} />
          </motion.g>

          {/* Inputs → … → outputs */}
          <motion.g initial={false} animate={{ opacity: ends ? 1 : 0 }} transition={fade}>
            <text className={styles.chipLabel} x={IN_X + IN_W / 2} y={ROWS[0] - CHIP_H / 2 - 12}>
              inputs
            </text>
            <text className={styles.chipLabel} x={OUT_X + OUT_W / 2} y={ROWS[0] - CHIP_H / 2 - 12}>
              outputs
            </text>
            {INPUTS.map((input, k) => (
              <g key={input.id}>
                <Chip x={IN_X} y={ROWS[k]} width={IN_W} text={input.prompt} />
                <Arrow x1={IN_X + IN_W + 10} x2={arrowIn} y={ROWS[k]} />
                <Arrow x1={arrowOut} x2={OUT_X - 10} y={ROWS[k]} />
                <Chip x={OUT_X} y={ROWS[k]} width={OUT_W} text={input.output} />
              </g>
            ))}
          </motion.g>

          {/* Activations: one list per prompt */}
          <motion.g
            initial={false}
            animate={{ opacity: visual.activations ? 1 : 0, x: vectorX, y: visual.plane ? PLANE_SHIFT : 0 }}
            transition={{
              opacity: {
                ...fade,
                delay: visual.activations && !visual.plane ? 0.3 : 0,
              },
              x: move,
              y: move,
            }}
          >
            {INPUTS.map((input, k) => (
              <g key={input.id} transform={`translate(0 ${ROWS[k]})`}>
                <motion.text
                  className={styles.rowName}
                  x={-14}
                  initial={false}
                  animate={{ opacity: visual.plane ? 1 : 0 }}
                  transition={fade}
                >
                  {input.short}
                </motion.text>
                <text className={styles.bracket} x={0}>
                  [
                </text>
                {input.activations.slice(0, N_SHOWN).map((v, i) => (
                  <g key={i}>
                    <motion.rect
                      className={styles.highlight}
                      x={(i + 0.5) * SLOT - 31}
                      y={-19}
                      width={62}
                      height={38}
                      rx={8}
                      initial={false}
                      animate={{ opacity: visual.plane && i < 2 ? 1 : 0 }}
                    />
                    <text className={styles.value} x={(i + 0.5) * SLOT}>
                      {format(v)}
                    </text>
                  </g>
                ))}
                <text className={styles.value} x={(N_SHOWN + 0.4) * SLOT}>
                  …
                </text>
                <text className={styles.bracket} x={VECTOR_W}>
                  ]
                </text>
              </g>
            ))}
          </motion.g>

          {/* The first two numbers of each list as a point */}
          <motion.g
            initial={false}
            animate={{ opacity: visual.plane ? 1 : 0 }}
            transition={{ duration: 0.5, delay: visual.plane ? 0.3 : 0 }}
          >
            <rect className={styles.planeFrame} x={PX - PH} y={PY - PH} width={PH * 2} height={PH * 2} rx={16} />
            <g className={styles.planeAxis}>
              <line x1={PX - PH} x2={PX + PH} y1={PY} y2={PY} />
              <line x1={PX} x2={PX} y1={PY - PH} y2={PY + PH} />
            </g>
            <text className={styles.axisLabel} x={PX + PH - 10} y={PY - 10} textAnchor="end">
              1st number
            </text>
            <text className={styles.axisLabel} x={PX + 10} y={PY - PH + 22}>
              2nd number
            </text>
            {INPUTS.map((input) => {
              const [x, y] = toPlane(input.activations[0], input.activations[1])
              return (
                <g key={input.id}>
                  <circle className={styles.dot} cx={x} cy={y} r={9} />
                  <text className={styles.dotLabel} x={x + 14} y={y - 12}>
                    {input.short}
                  </text>
                </g>
              )
            })}
            <foreignObject x={PX - 200} y={PY + PH + 14} width={400} height={80}>
              <p className={styles.planeNote}>
                <Inline text={PLANE_NOTE} />
              </p>
            </foreignObject>
          </motion.g>
        </svg>
      </div>

      <Reserve items={steps.map((s) => s.screen?.body ?? '')} current={body ?? ''} getKey={(b) => b}>
        {(b) => (
          <p className={styles.note}>
            <Inline text={b} />
          </p>
        )}
      </Reserve>
    </div>
  )
}

const format = (v: number) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2)
const list = (values: number[]) => `[ ${values.map(format).join(', ')}, … ]`

function Chip({ x, y, width, text }: { x: number; y: number; width: number; text: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={styles.chip} y={-CHIP_H / 2} width={width} height={CHIP_H} rx={12} />
      <text className={styles.chipText} x={width / 2}>
        {text}
      </text>
    </g>
  )
}

function Arrow({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g>
      <motion.line className={styles.arrow} initial={false} animate={{ x1, x2 }} y1={y} y2={y} transition={move} />
      <motion.path
        className={styles.arrow}
        d={`M -9 ${y - 6} L 0 ${y} L -9 ${y + 6}`}
        initial={false}
        animate={{ x: x2 }}
        transition={move}
      />
    </g>
  )
}

function VArrow({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <g className={styles.arrow}>
      <line x1={x} x2={x} y1={y1} y2={y2} />
      <path d={`M ${x - 6} ${y2 - 9} L ${x} ${y2} L ${x + 6} ${y2 - 9}`} />
    </g>
  )
}
