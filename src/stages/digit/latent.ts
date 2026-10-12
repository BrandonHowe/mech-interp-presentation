import type { Vec2 } from '../../lib/vec'
import latent from './latent.json'

/*
 * A real (small) trained model: a VAE with a 2D latent space, trained offline
 * on MNIST by scripts/digit-vae/train.py. Decoded digits for a grid of latent
 * points are precomputed into /digits/grid.png; nothing runs in the browser.
 * `points` are latent means of 2,000 MNIST test digits, with their labels.
 */

export const GRID: number = latent.grid
/** Latent coordinates shown span [-RANGE, RANGE] on both axes. */
export const RANGE: number = latent.range
export const TILE: number = latent.tile
export const points = latent.points as [number, number, number][]

/** Grid cell (column, row) of the precomputed digit nearest to a latent point. Row 0 is the top. */
export function cellFor([x, y]: Vec2): [number, number] {
  const toIndex = (v: number) => Math.round(((v + RANGE) / (2 * RANGE)) * (GRID - 1))
  return [toIndex(x), GRID - 1 - toIndex(y)]
}

/** Median latent position of each digit class, for labeling clusters. */
export const classCenters: { label: number; at: Vec2 }[] = Array.from({ length: 10 }, (_, label) => {
  const mine = points.filter((p) => p[2] === label)
  const median = (vals: number[]) => vals.sort((a, b) => a - b)[Math.floor(vals.length / 2)]
  return { label, at: [median(mine.map((p) => p[0])), median(mine.map((p) => p[1]))] as Vec2 }
})

export interface DigitState {
  point: Vec2
  /** Whether the real MNIST digits and their labels are drawn over the plane. */
  overlay: boolean
}

export const initialDigitState: DigitState = { point: [0, 0], overlay: false }
