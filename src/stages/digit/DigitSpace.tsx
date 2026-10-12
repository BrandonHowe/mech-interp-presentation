import { useId, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { motion } from 'motion/react'
import { add, type Vec2 } from '../../lib/vec'
import { GRID, RANGE, TILE, cellFor, classCenters, points } from './latent'
import styles from './DigitStage.module.css'

interface Props {
  point: Vec2
  onPointChange: (p: Vec2) => void
  /** Show where encoded MNIST test digits land. */
  showData: boolean
}


/* Plane: model units → SVG units (y up), centered at PLANE. */
const PLANE: Vec2 = [235, 235]
const S = 195 / RANGE
const HALF = 215
const toScreen = ([x, y]: Vec2): Vec2 => [PLANE[0] + x * S, PLANE[1] - y * S]
const clampModel = (v: number) => Math.min(RANGE, Math.max(-RANGE, v))

/* Digit card. */
const CARD = { x: 560, y: 20, size: 430 }
const DIGIT_SIZE = 360

export function DigitSpace({ point, onPointChange, showData }: Props) {
  const clipId = useId()
  const svgRef = useRef<SVGSVGElement>(null)
  const [px, py] = toScreen(point)
  const [col, row] = cellFor(point)

  const moveTo = (clientX: number, clientY: number) => {
    const ctm = svgRef.current?.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    onPointChange([clampModel((p.x - PLANE[0]) / S), clampModel((PLANE[1] - p.y) / S)])
  }

  // The whole plane is a drag surface: press anywhere to jump the point there.
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
    const [x, y] = add(point, d)
    onPointChange([clampModel(x), clampModel(y)])
  }

  return (
    <svg ref={svgRef} className={styles.svg} viewBox="0 0 1000 470" role="img" aria-label="A 2D space beside the digit drawn from the selected point">
      <defs>
        <clipPath id={clipId}>
          <rect x={PLANE[0] - HALF} y={PLANE[1] - HALF} width={HALF * 2} height={HALF * 2} rx={18} />
        </clipPath>
      </defs>

      {/* The plane. */}
      <g className={styles.plane} data-no-swipe onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
        <rect className={styles.frame} x={PLANE[0] - HALF} y={PLANE[1] - HALF} width={HALF * 2} height={HALF * 2} rx={18} />
        <g clipPath={`url(#${clipId})`}>
          {[-RANGE / 2, RANGE / 2].map((v) => (
            <g key={v} className={styles.grid}>
              <line x1={toScreen([v, 0])[0]} x2={toScreen([v, 0])[0]} y1={PLANE[1] - HALF} y2={PLANE[1] + HALF} />
              <line y1={toScreen([0, v])[1]} y2={toScreen([0, v])[1]} x1={PLANE[0] - HALF} x2={PLANE[0] + HALF} />
            </g>
          ))}
          <g className={styles.axis}>
            <line x1={PLANE[0]} x2={PLANE[0]} y1={PLANE[1] - HALF} y2={PLANE[1] + HALF} />
            <line y1={PLANE[1]} y2={PLANE[1]} x1={PLANE[0] - HALF} x2={PLANE[0] + HALF} />
          </g>

          {/* Step 2: where real test digits land, labeled by class. */}
          <motion.g
            initial={false}
            animate={{ opacity: showData ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            pointerEvents="none"
          >
            {points.map(([x, y], i) => {
              const [sx, sy] = toScreen([x, y])
              return <circle key={i} className={styles.datum} cx={sx} cy={sy} r={2.2} />
            })}
            {classCenters.map(({ label, at }) => {
              const [sx, sy] = toScreen(at)
              return (
                <text key={label} className={styles.classLabel} x={sx} y={sy}>
                  {label}
                </text>
              )
            })}
          </motion.g>
        </g>

        <g
          className={styles.handle}
          transform={`translate(${px} ${py})`}
          tabIndex={0}
          role="button"
          aria-label={`Point in digit space at ${point[0].toFixed(2)}, ${point[1].toFixed(2)}. Use arrow keys to move.`}
          onKeyDown={onKeyDown}
        >
          <circle className={styles.hit} r={26} />
          <circle className={styles.ring} r={18} />
          <circle className={styles.handleDot} r={10} />
        </g>
      </g>

      {/* Point → image. */}
      <path className={styles.link} d={`M ${PLANE[0] + HALF + 22} ${PLANE[1]} L ${CARD.x - 22} ${PLANE[1]}`} />
      <path className={styles.linkHead} d={`M ${CARD.x - 30} ${PLANE[1] - 7} L ${CARD.x - 20} ${PLANE[1]} L ${CARD.x - 30} ${PLANE[1] + 7}`} />

      {/* The decoder's output for this point: one 28×28 tile of the precomputed grid. */}
      <rect className={styles.card} x={CARD.x} y={CARD.y} width={CARD.size} height={CARD.size} rx={18} />
      <svg
        x={CARD.x + (CARD.size - DIGIT_SIZE) / 2}
        y={CARD.y + (CARD.size - DIGIT_SIZE) / 2}
        width={DIGIT_SIZE}
        height={DIGIT_SIZE}
        viewBox={`${col * TILE} ${row * TILE} ${TILE} ${TILE}`}
      >
        <image className={styles.digit} href="/digits/grid.png" width={GRID * TILE} height={GRID * TILE} />
      </svg>
    </svg>
  )
}
