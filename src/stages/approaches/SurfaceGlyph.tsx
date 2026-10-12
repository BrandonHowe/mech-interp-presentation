import styles from './ApproachesStage.module.css'

/*
 * Illustrative wireframe "landscape" of a representation space: a point with
 * a few directions through it. Decorative; no real data.
 */

type P3 = [number, number, number]

const height = (x: number, y: number) =>
  1.7 * Math.exp(-((x - 0.9) ** 2 + (y + 0.7) ** 2) / 1.3) -
  1.6 * Math.exp(-((x + 0.7) ** 2 + (y - 1.0) ** 2) / 1.1) +
  1.1 * Math.exp(-((x + 1.7) ** 2 + (y + 1.5) ** 2) / 0.9) -
  0.9 * Math.exp(-((x - 1.8) ** 2 + (y - 1.6) ** 2) / 0.8)

const YAW = (-35 * Math.PI) / 180
const TILT = (58 * Math.PI) / 180
const SCALE = 24

function project([x, y, z]: P3): [number, number] {
  const rx = x * Math.cos(YAW) - y * Math.sin(YAW)
  const ry = x * Math.sin(YAW) + y * Math.cos(YAW)
  return [rx * SCALE, (-ry * Math.cos(TILT) - z * Math.sin(TILT)) * SCALE]
}

const EXTENT = 3
const LINES = 20
const SAMPLES = 40

const toPath = (pts: [number, number][]) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')

// Grid lines along both axes, computed once.
const gridPaths: string[] = []
for (let i = 0; i <= LINES; i++) {
  const u = -EXTENT + (2 * EXTENT * i) / LINES
  const a: [number, number][] = []
  const b: [number, number][] = []
  for (let j = 0; j <= SAMPLES; j++) {
    const v = -EXTENT + (2 * EXTENT * j) / SAMPLES
    a.push(project([u, v, height(u, v)]))
    b.push(project([v, u, height(v, u)]))
  }
  gridPaths.push(toPath(a), toPath(b))
}

// The point and three directions through it (3D, then projected).
const origin: P3 = [0.15, 0.1, height(0.15, 0.1)]
const DIRECTIONS: { d: P3; className: string }[] = [
  { d: [0.9, 1.1, 1.6], className: 'arrowInk' },
  { d: [-1.5, 0.45, 0.3], className: 'arrowA' },
  { d: [0.8, -1.2, -0.3], className: 'arrowB' },
]

function arrow(d: P3) {
  const [ax, ay] = project(origin)
  const [bx, by] = project([origin[0] + d[0], origin[1] + d[1], origin[2] + d[2]])
  const len = Math.hypot(bx - ax, by - ay)
  const ux = (bx - ax) / len
  const uy = (by - ay) / len
  const head = 9
  const wing = 4.5
  return {
    line: `M${ax} ${ay}L${bx - ux * head * 0.8} ${by - uy * head * 0.8}`,
    head: `M${bx} ${by}L${bx - ux * head + uy * wing} ${by - uy * head - ux * wing}L${bx - ux * head - uy * wing} ${by - uy * head + ux * wing}Z`,
  }
}

// Fit the viewBox to the projected surface.
const allPts = gridPaths.flatMap((p) =>
  p
    .slice(1)
    .split('L')
    .map((s) => s.split(' ').map(Number)),
)
const xs = allPts.map((p) => p[0])
const ys = allPts.map((p) => p[1])
const pad = 6
const VIEWBOX = [
  Math.min(...xs) - pad,
  Math.min(...ys) - pad,
  Math.max(...xs) - Math.min(...xs) + pad * 2,
  Math.max(...ys) - Math.min(...ys) + pad * 2,
].join(' ')

export function SurfaceGlyph() {
  const [ox, oy] = project(origin)
  return (
    <svg className={`${styles.glyph} ${styles.surfaceGlyph}`} viewBox={VIEWBOX} aria-hidden="true">
      {gridPaths.map((d, i) => (
        <path key={i} className={styles.surface} d={d} />
      ))}
      {DIRECTIONS.map(({ d, className }, i) => {
        const a = arrow(d)
        return (
          <g key={i} className={styles[className]}>
            <path className={styles.arrowLine} d={a.line} />
            <path d={a.head} />
          </g>
        )
      })}
      <circle className={styles.point} cx={ox} cy={oy} r={6} />
    </svg>
  )
}
