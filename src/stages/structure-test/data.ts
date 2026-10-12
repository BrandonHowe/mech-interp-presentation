import { dot, mean, midpoint, normalize, sub, type Vec2 } from '../../lib/vec'
import { gaussian, mulberry32 } from '../../lib/random'

/*
 * SYNTHETIC placeholder geometry for exercising the presentation structure.
 * Not measured activations, and not the refusal teaching data.
 */

const rand = mulberry32(2026)

function cluster(center: Vec2, spread: Vec2, tilt: number, n: number): Vec2[] {
  const c = Math.cos(tilt)
  const s = Math.sin(tilt)
  return Array.from({ length: n }, () => {
    const a = gaussian(rand) * spread[0]
    const b = gaussian(rand) * spread[1]
    return [center[0] + a * c - b * s, center[1] + a * s + b * c] as Vec2
  })
}

export const groupA = cluster([-1.0, -0.85], [0.78, 0.5], -0.6, 26)
export const groupB = cluster([0.95, 0.9], [0.8, 0.5], -0.6, 26)

export const meanA = mean(groupA)
export const meanB = mean(groupB)
/** Points from the group B mean toward the group A mean. */
export const direction = sub(meanA, meanB)
export const unit = normalize(direction)
export const mid = midpoint(meanA, meanB)

/** Signed score relative to the midpoint threshold: dot(h, u) - dot(m, u). */
export const score = (h: Vec2): number | null => (unit ? dot(sub(h, mid), unit) : null)

export const LIMIT = 2.9

export interface ProbeState {
  probe: Vec2
}

export const initialProbeState: ProbeState = { probe: [0.7, -1.6] }
