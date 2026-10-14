import { useId, useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { add, scale, sub, type Vec2 } from '../../lib/vec'
import {
  VIEW_CENTER,
  VIEW_HALF,
  answered,
  clampToView,
  meanN,
  meanR,
  mid,
  refused,
  score,
  steer,
  steerExample,
  subtractExample,
  unit,
} from './data'
import styles from './RefusalPlot.module.css'

export type ExampleMode = 'none' | 'new' | 'predict' | 'subtract-before' | 'subtract' | 'steer-before' | 'steer'

export interface RefusalVisual {
  points: 'hidden' | 'full' | 'faint' | 'dim'
  means: boolean
  direction: boolean
  boundary: boolean
  example: ExampleMode
}

interface Props {
  visual: RefusalVisual
  probe: Vec2
  onProbeChange: (p: Vec2) => void
  alpha: number
  removeAlpha: number
}

/** Model units → SVG units (y up). Display only; never used for scores. */
const S = 100
const H = VIEW_HALF * S
const toScreen = ([x, y]: Vec2): Vec2 => [(x - VIEW_CENTER[0]) * S, -(y - VIEW_CENTER[1]) * S]
const fromScreen = ([x, y]: Vec2): Vec2 => [x / S + VIEW_CENTER[0], -y / S + VIEW_CENTER[1]]

const TRIANGLE = 'M0 -7 L6.1 3.6 L-6.1 3.6 Z'
const ease = [0.22, 1, 0.36, 1] as const

// Unit vector in screen space (y flipped), for drawing.
const su: Vec2 = [unit[0], -unit[1]]
const perp: Vec2 = [-su[1], su[0]]
const angle = (Math.atan2(su[1], su[0]) * 180) / Math.PI

function arrowHead(tip: Vec2, dir: Vec2, size = 12): string {
  const [dx, dy] = dir
  return `M ${tip[0] - dx * size + dy * size * 0.6} ${tip[1] - dy * size - dx * size * 0.6} L ${tip[0]} ${tip[1]} L ${tip[0] - dx * size - dy * size * 0.6} ${tip[1] - dy * size + dx * size * 0.6}`
}

/** Fades a group in or out; it stays mounted so going back retargets smoothly. */
function Fade({ show, children, delay = 0 }: { show: boolean; children: ReactNode; delay?: number }) {
  return (
    <motion.g
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.45, delay: show ? delay : 0 }}
      style={{ pointerEvents: show ? undefined : 'none' }}
      aria-hidden={!show}
    >
      {children}
    </motion.g>
  )
}

export function RefusalPlot({ visual, probe, onProbeChange, alpha, removeAlpha }: Props) {
  const clipId = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const ex = visual.example

  const pointOpacity = { hidden: 0, full: 0.8, faint: 0.14, dim: 0.28 }[visual.points]

  // d arrow between the means, shortened to clear the mean markers.
  const [nx, ny] = toScreen(meanN)
  const [rx, ry] = toScreen(meanR)
  const dStart: Vec2 = [nx + su[0] * 20, ny + su[1] * 20]
  const dEnd: Vec2 = [rx - su[0] * 20, ry - su[1] * 20]
  const [mx, my] = toScreen(mid)

  // Predict: projection of the probe onto the line through the means (along u).
  // Its signed distance from the midpoint m is h·u − m·u, the score minus the threshold.
  const probeScreen = toScreen(probe)
  const probeFoot = toScreen(add(mid, scale(unit, score(sub(probe, mid)))))
  const probeRefuses = score(sub(probe, mid)) > 0

  // Subtract: h and h − d.
  const xH = toScreen(subtractExample.h)
  // The removed example stays on the plot through the adding steps, so both show at once.
  const subtracting = ex === 'subtract-before' || ex === 'subtract' || ex === 'steer-before' || ex === 'steer'
  const xShift = subtracting && ex !== 'subtract-before' ? removeAlpha : 0
  const xNow = toScreen(steer(subtractExample.h, -xShift))

  // Steer: h and h + αd.
  const sH = steerExample.h
  const sHs = toScreen(sH)
  const steered = ex === 'steer'
  const sNow = toScreen(steered ? steer(sH, alpha) : sH)
  const sShift = steered ? alpha : 0

  const moveTo = (clientX: number, clientY: number) => {
    const ctm = svgRef.current?.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    onProbeChange(clampToView(fromScreen([p.x, p.y])))
  }
  const onPointerDown = (e: PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX, e.clientY)
  }
  const onPointerMove = (e: PointerEvent<SVGGElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX, e.clientY)
  }
  const onKeyDown = (e: KeyboardEvent<SVGGElement>) => {
    const step = e.shiftKey ? 0.5 : 0.1
    const delta: Record<string, Vec2> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    const d = delta[e.key]
    if (!d) return
    e.preventDefault()
    onProbeChange(clampToView(add(probe, d)))
  }

  const gridValues = [-3, -2, -1, 1, 2].filter(
    (v) => Math.abs(v - VIEW_CENTER[0]) < VIEW_HALF || Math.abs(v - VIEW_CENTER[1]) < VIEW_HALF,
  )

  return (
    <svg
      ref={svgRef}
      className={styles.plot}
      viewBox={`${-H - 12} ${-H - 12} ${2 * H + 24} ${2 * H + 24}`}
      role="img"
      aria-label="Illustrative two-dimensional activation plot of harmful and harmless prompts"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={-H} y={-H} width={2 * H} height={2 * H} rx={18} />
        </clipPath>
      </defs>

      <rect className={styles.frame} x={-H} y={-H} width={2 * H} height={2 * H} rx={18} />

      <g clipPath={`url(#${clipId})`}>
        {gridValues.map((v) => {
          const [gx, gy] = toScreen([v, v])
          return (
            <g key={v} className={styles.grid}>
              <line x1={gx} x2={gx} y1={-H} y2={H} />
              <line y1={gy} y2={gy} x1={-H} x2={H} />
            </g>
          )
        })}
        {/* Half-planes and boundary, in a frame rotated to the direction. */}
        <g transform={`translate(${mx} ${my}) rotate(${angle})`}>
          <motion.rect
            className={styles.sideR}
            x={0}
            y={-1000}
            width={1000}
            height={2000}
            initial={false}
            animate={{ opacity: visual.boundary ? 1 : 0 }}
          />
          <motion.rect
            className={styles.sideN}
            x={-1000}
            y={-1000}
            width={1000}
            height={2000}
            initial={false}
            animate={{ opacity: visual.boundary ? 1 : 0 }}
          />
          {[-1, 1].map((sign) => (
            <motion.path
              key={sign}
              className={styles.boundary}
              d={`M 0 0 L 0 ${sign * 900}`}
              initial={false}
              animate={{ pathLength: visual.boundary ? 1 : 0, opacity: visual.boundary ? 1 : 0 }}
              transition={{ duration: 0.9, ease }}
            />
          ))}
        </g>

        {answered.map((p, i) => {
          const [x, y] = toScreen(p)
          return (
            <g key={`n${i}`} transform={`translate(${x} ${y})`}>
              <motion.circle
                className={styles.pointN}
                r={5.5}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: pointOpacity, scale: visual.points === 'hidden' ? 0.3 : 1 }}
                transition={{ duration: 0.5, ease, delay: visual.points === 'full' ? i * 0.01 : 0 }}
              />
            </g>
          )
        })}
        {refused.map((p, i) => {
          const [x, y] = toScreen(p)
          return (
            <g key={`r${i}`} transform={`translate(${x} ${y})`}>
              <motion.path
                className={styles.pointR}
                d={TRIANGLE}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: pointOpacity, scale: visual.points === 'hidden' ? 0.3 : 1 }}
                transition={{ duration: 0.5, ease, delay: visual.points === 'full' ? i * 0.01 : 0 }}
              />
            </g>
          )
        })}

        {/* d = μR − μN */}
        <motion.path
          className={styles.dArrow}
          d={`M ${dStart[0]} ${dStart[1]} L ${dEnd[0]} ${dEnd[1]}`}
          initial={false}
          animate={{ pathLength: visual.direction ? 1 : 0, opacity: visual.direction ? 1 : 0 }}
          transition={{ duration: 0.8, ease }}
        />
        <Fade show={visual.direction} delay={0.6}>
          <path className={styles.dArrow} d={arrowHead(dEnd, su, 14)} />
          <text
            className={styles.label}
            x={dStart[0] + (dEnd[0] - dStart[0]) * 0.3 + perp[0] * 18}
            y={dStart[1] + (dEnd[1] - dStart[1]) * 0.3 + perp[1] * 18 + 6}
          >
            d
          </text>
        </Fade>

        <Fade show={visual.boundary}>
          <text className={styles.regionR} x={-H + 18} y={H - 18}>
            refusal region
          </text>
          <text className={styles.regionN} x={H - 18} y={-H + 30} textAnchor="end">
            non-refusal region
          </text>
        </Fade>

        <Fade show={visual.boundary}>
          <text className={styles.labelSmall} x={mx + perp[0] * 16 + 6} y={my + perp[1] * 16 + 5}>
            m
          </text>
          <rect
            className={styles.midpoint}
            x={mx - 5}
            y={my - 5}
            width={10}
            height={10}
            transform={`rotate(45 ${mx} ${my})`}
          />
        </Fade>

        <MeanMarker at={toScreen(meanN)} group="n" visible={visual.means} />
        <MeanMarker at={toScreen(meanR)} group="r" visible={visual.means} />

        {/* Predict: a new example, its projection, and a draggable point. */}
        <Fade show={ex === 'new' || ex === 'predict'}>
          <Fade show={ex === 'predict'}>
            <line
              className={probeRefuses ? styles.componentR : styles.componentN}
              x1={mx}
              y1={my}
              x2={probeFoot[0]}
              y2={probeFoot[1]}
            />
            <line
              className={styles.projection}
              x1={probeScreen[0]}
              y1={probeScreen[1]}
              x2={probeFoot[0]}
              y2={probeFoot[1]}
            />
            <circle className={styles.foot} cx={probeFoot[0]} cy={probeFoot[1]} r={4.5} />
          </Fade>
          <g
            className={ex === 'predict' ? styles.probe : undefined}
            transform={`translate(${probeScreen[0]} ${probeScreen[1]})`}
            tabIndex={ex === 'predict' ? 0 : -1}
            role={ex === 'predict' ? 'button' : undefined}
            aria-label={ex === 'predict' ? `New example. Score ${score(probe).toFixed(2)}. Use arrow keys to move.` : undefined}
            data-no-swipe
            onPointerDown={ex === 'predict' ? onPointerDown : undefined}
            onPointerMove={ex === 'predict' ? onPointerMove : undefined}
            onKeyDown={ex === 'predict' ? onKeyDown : undefined}
          >
            <circle className={styles.hit} r={24} />
            <circle className={styles.ring} r={17} />
            <motion.circle
              className={styles.probeDot}
              r={9}
              initial={false}
              animate={{ scale: ex === 'new' || ex === 'predict' ? 1 : 0.3 }}
              transition={{ duration: 0.6, ease }}
            />
            <text className={styles.label} x={14} y={-12}>
              h
            </text>
          </g>
        </Fade>

        {/* Subtract: move h by a copy of d, backwards. */}
        <Fade show={subtracting}>
          <Fade show={xShift > 0.05}>
            <path className={styles.ghostR} d={TRIANGLE} transform={`translate(${xH[0]} ${xH[1]}) scale(1.6)`} />
            <DCopy from={xH} alpha={-xShift} />
          </Fade>
          <motion.g initial={false} animate={{ x: xNow[0], y: xNow[1] }} transition={{ duration: 0.5, ease }}>
            <path className={styles.exampleR} d={TRIANGLE} transform="scale(1.6)" />
            <text className={styles.label} x={-16} y={-12} textAnchor="end">
              {xShift > 0.05 ? 'h − αd' : 'h'}
            </text>
          </motion.g>
        </Fade>

        {/* Steer: move h by α copies of d. */}
        <Fade show={ex === 'steer-before' || ex === 'steer'}>
          <Fade show={steered && sShift > 0.05}>
            <circle className={styles.ghostN} cx={sHs[0]} cy={sHs[1]} r={9} />
            <DCopy from={sHs} alpha={sShift} />
          </Fade>
          <motion.g initial={false} animate={{ x: sNow[0], y: sNow[1] }} transition={{ duration: 0.5, ease }}>
            <circle className={styles.exampleN} r={9} />
            <text className={styles.label} x={-14} y={-12} textAnchor="end">
              {steered && sShift > 0.05 ? 'h + αd' : 'h'}
            </text>
          </motion.g>
        </Fade>
      </g>

      {/* Legend, on the plot itself. */}
      <g transform={`translate(${-H + 18} ${-H + 26})`} className={styles.legend}>
        <path className={styles.pointR} d={TRIANGLE} transform="translate(6 -4)" />
        <text x={20} y={0}>
          Harmful prompts
        </text>
        <circle className={styles.pointN} cx={6} cy={20} r={5.5} />
        <text x={20} y={25}>
          Harmless prompts
        </text>
      </g>
    </svg>
  )
}

/** A dashed copy of the d arrow, scaled by α and starting at a point. */
function DCopy({ from, alpha }: { from: Vec2; alpha: number }) {
  const to = toScreen(steer(fromScreen(from), alpha))
  const len = Math.hypot(to[0] - from[0], to[1] - from[1])
  const dir: Vec2 = len > 0 ? [(to[0] - from[0]) / len, (to[1] - from[1]) / len] : su
  // Stop short of the moved marker.
  const tip: Vec2 = [to[0] - dir[0] * 14, to[1] - dir[1] * 14]
  return (
    <g className={styles.dCopy}>
      <motion.line
        initial={false}
        x1={from[0]}
        y1={from[1]}
        animate={{ x2: tip[0], y2: tip[1] }}
        transition={{ duration: 0.5, ease }}
      />
      {len > 30 && <path d={arrowHead(tip, dir, 12)} />}
    </g>
  )
}

function MeanMarker({ at, group, visible }: { at: Vec2; group: 'r' | 'n'; visible: boolean }) {
  // Labels sit on the outside of each cluster, away from the arrow.
  const offset: Vec2 = group === 'r' ? [-24, 32] : [24, -20]
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <motion.g
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
        transition={{ duration: 0.55, ease }}
      >
        <circle className={group === 'r' ? styles.meanR : styles.meanN} r={14} />
        {group === 'r' ? (
          <path className={styles.pointR} d={TRIANGLE} transform="scale(0.8)" />
        ) : (
          <circle className={styles.pointN} r={4.5} />
        )}
        <text className={styles.label} x={offset[0]} y={offset[1]} textAnchor={group === 'r' ? 'end' : 'start'}>
          μ<tspan className={styles.sub} dy={5}>
            {group === 'r' ? 'harmful' : 'harmless'}
          </tspan>
        </text>
      </motion.g>
    </g>
  )
}
