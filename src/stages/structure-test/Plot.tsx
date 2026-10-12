import { useId, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { add, scale, type Vec2 } from '../../lib/vec'
import { LIMIT, groupA, groupB, meanA, meanB, mid, score, unit } from './data'
import styles from './Plot.module.css'

export interface PlotVisual {
  points: 'hidden' | 'full' | 'faint'
  means: boolean
  direction: boolean
  boundary: boolean
  probe: boolean
}

interface Props {
  visual: PlotVisual
  probe: Vec2
  onProbeChange: (p: Vec2) => void
}

/** Model units → SVG units (y up). Display only; never used for scores. */
const S = 100
const toScreen = ([x, y]: Vec2): Vec2 => [x * S, -y * S]
const clampModel = (v: number) => Math.min(LIMIT, Math.max(-LIMIT, v))

const TRIANGLE = 'M0 -7 L6.1 3.6 L-6.1 3.6 Z'
const ease = [0.22, 1, 0.36, 1] as const

export function Plot({ visual, probe, onProbeChange }: Props) {
  const clipId = useId()
  const svgRef = useRef<SVGSVGElement>(null)

  const pointOpacity = { hidden: 0, full: 0.82, faint: 0.16 }[visual.points]

  // Direction arrow, shortened so it starts and ends outside the mean markers.
  const [bx, by] = toScreen(meanB)
  const [ax, ay] = toScreen(meanA)
  const len = Math.hypot(ax - bx, ay - by)
  const ux = (ax - bx) / len
  const uy = (ay - by) / len
  const start: Vec2 = [bx + ux * 20, by + uy * 20]
  const end: Vec2 = [ax - ux * 20, ay - uy * 20]
  const head = `M ${end[0] - ux * 14 + uy * 8} ${end[1] - uy * 14 - ux * 8} L ${end[0]} ${end[1]} L ${end[0] - ux * 14 - uy * 8} ${end[1] - uy * 14 + ux * 8}`
  const angle = (Math.atan2(uy, ux) * 180) / Math.PI
  const [mx, my] = toScreen(mid)

  const s = score(probe)
  const foot = unit && s !== null ? add(mid, scale(unit, s)) : mid

  const moveTo = (clientX: number, clientY: number) => {
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!ctm) return
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse())
    onProbeChange([clampModel(p.x / S), clampModel(-p.y / S)])
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
    const [x, y] = add(probe, d)
    onProbeChange([clampModel(x), clampModel(y)])
  }

  return (
    <svg ref={svgRef} className={styles.plot} viewBox="-320 -320 640 640" role="img" aria-label="Two-dimensional placeholder plot">
      <defs>
        <clipPath id={clipId}>
          <rect x={-300} y={-300} width={600} height={600} rx={18} />
        </clipPath>
      </defs>

      <rect className={styles.frame} x={-300} y={-300} width={600} height={600} rx={18} />

      <g clipPath={`url(#${clipId})`}>
        {[-2, -1, 1, 2].map((v) => (
          <g key={v} className={styles.grid}>
            <line x1={v * S} x2={v * S} y1={-300} y2={300} />
            <line y1={v * S} y2={v * S} x1={-300} x2={300} />
          </g>
        ))}
        <g className={styles.axis}>
          <line x1={0} x2={0} y1={-300} y2={300} />
          <line y1={0} y2={0} x1={-300} x2={300} />
        </g>

        {/* Half-planes and boundary, drawn in a frame rotated to the direction. */}
        <g transform={`translate(${mx} ${my}) rotate(${angle})`}>
          <motion.rect
            className={styles.sideA}
            x={0}
            y={-1000}
            width={1000}
            height={2000}
            initial={{ opacity: 0 }}
            animate={{ opacity: visual.boundary ? 1 : 0 }}
          />
          <motion.rect
            className={styles.sideB}
            x={-1000}
            y={-1000}
            width={1000}
            height={2000}
            initial={{ opacity: 0 }}
            animate={{ opacity: visual.boundary ? 1 : 0 }}
          />
          <motion.line
            className={styles.scoreAxis}
            x1={-1000}
            x2={1000}
            y1={0}
            y2={0}
            initial={{ opacity: 0 }}
            animate={{ opacity: visual.probe ? 1 : 0 }}
          />
          {[-1, 1].map((sign) => (
            <motion.path
              key={sign}
              className={styles.boundary}
              d={`M 0 0 L 0 ${sign * 900}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: visual.boundary ? 1 : 0 }}
              transition={{ duration: 0.9, ease }}
            />
          ))}
        </g>

        {groupB.map((p, i) => {
          const [x, y] = toScreen(p)
          return (
            <g key={`b${i}`} transform={`translate(${x} ${y})`}>
              <motion.circle
                className={styles.pointB}
                r={5.5}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: pointOpacity, scale: visual.points === 'hidden' ? 0.3 : 1 }}
                transition={{ duration: 0.5, ease, delay: visual.points === 'full' ? i * 0.012 : 0 }}
              />
            </g>
          )
        })}
        {groupA.map((p, i) => {
          const [x, y] = toScreen(p)
          return (
            <g key={`a${i}`} transform={`translate(${x} ${y})`}>
              <motion.path
                className={styles.pointA}
                d={TRIANGLE}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: pointOpacity, scale: visual.points === 'hidden' ? 0.3 : 1 }}
                transition={{ duration: 0.5, ease, delay: visual.points === 'full' ? i * 0.012 : 0 }}
              />
            </g>
          )
        })}

        <motion.path
          className={styles.arrow}
          d={`M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: visual.direction ? 1 : 0, opacity: visual.direction ? 1 : 0 }}
          transition={{ duration: 0.8, ease }}
        />
        <motion.path
          className={styles.arrow}
          d={head}
          initial={{ opacity: 0 }}
          animate={{ opacity: visual.direction ? 1 : 0 }}
          transition={{ duration: 0.25, delay: visual.direction ? 0.6 : 0 }}
        />

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: visual.boundary ? 1 : 0 }}
          transform={`translate(${mx} ${my})`}
        >
          <rect className={styles.midpoint} x={-5} y={-5} width={10} height={10} transform="rotate(45)" />
        </motion.g>

        <MeanMarker at={toScreen(meanB)} group="b" label="mean B" visible={visual.means} />
        <MeanMarker at={toScreen(meanA)} group="a" label="mean A" visible={visual.means} />

        <AnimatePresence>
          {visual.probe && (
            <motion.g
              key="probe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <line
                className={styles.projection}
                x1={toScreen(probe)[0]}
                y1={toScreen(probe)[1]}
                x2={toScreen(foot)[0]}
                y2={toScreen(foot)[1]}
              />
              <circle className={styles.foot} cx={toScreen(foot)[0]} cy={toScreen(foot)[1]} r={4.5} />
              <g
                className={styles.probe}
                transform={`translate(${toScreen(probe)[0]} ${toScreen(probe)[1]})`}
                tabIndex={0}
                role="button"
                aria-label={`Probe point. Score ${s?.toFixed(2) ?? 'undefined'}. Use arrow keys to move.`}
                data-no-swipe
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onKeyDown={onKeyDown}
              >
                <circle className={styles.hit} r={24} />
                <circle className={styles.ring} r={17} />
                <circle className={styles.probeDot} r={9} />
              </g>
            </motion.g>
          )}
        </AnimatePresence>
      </g>
    </svg>
  )
}

function MeanMarker({ at, group, label, visible }: { at: Vec2; group: 'a' | 'b'; label: string; visible: boolean }) {
  // Labels sit on the outside of each cluster, away from the direction arrow.
  const offset: Vec2 = group === 'a' ? [-26, 34] : [26, -24]
  return (
    <g transform={`translate(${at[0]} ${at[1]})`}>
      <motion.g
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
        transition={{ duration: 0.55, ease }}
      >
        <circle className={group === 'a' ? styles.meanA : styles.meanB} r={14} />
        {group === 'a' ? (
          <path className={styles.pointA} d={TRIANGLE} transform="scale(0.8)" />
        ) : (
          <circle className={styles.pointB} r={4.5} />
        )}
        <text
          className={styles.label}
          x={offset[0]}
          y={offset[1]}
          textAnchor={group === 'a' ? 'end' : 'start'}
        >
          {label}
        </text>
      </motion.g>
    </g>
  )
}
