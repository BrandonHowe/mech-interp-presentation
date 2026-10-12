import type { ScaleComparison } from '../types'
import styles from './ScaleBar.module.css'

const MIN_EXP = 5
const MAX_EXP = 13

/** Log-scale comparison of parameter counts. */
export function ScaleBar({ scale }: { scale: ScaleComparison }) {
  const pos = (v: number) => ((Math.log10(v) - MIN_EXP) / (MAX_EXP - MIN_EXP)) * 100
  const [small, large] = scale.items

  return (
    <div className={styles.scale}>
      <div className={styles.scaleTrack}>
        {Array.from({ length: MAX_EXP - MIN_EXP + 1 }, (_, i) => (
          <span key={i} className={styles.scaleTick} style={{ left: `${(i / (MAX_EXP - MIN_EXP)) * 100}%` }} />
        ))}
        <span
          className={styles.scaleSpan}
          style={{ left: `${pos(small.value)}%`, width: `${pos(large.value) - pos(small.value)}%` }}
        />
        {scale.items.map((item) => (
          <span key={item.display} className={styles.scaleMarker} style={{ left: `${pos(item.value)}%` }} />
        ))}
        {scale.note && <span className={styles.scaleNote}>{scale.note}</span>}
      </div>
      <div className={styles.scaleLabels}>
        <span>
          <strong>{small.display}</strong> {small.label}
        </span>
        <span>
          <strong>{large.display}</strong> {large.label}
        </span>
      </div>
    </div>
  )
}
