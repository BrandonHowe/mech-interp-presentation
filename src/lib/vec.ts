/** Small 2D vector helpers, in model coordinates (not screen coordinates). */
export type Vec2 = readonly [number, number]

export const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]]
export const sub = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]]
export const scale = (a: Vec2, k: number): Vec2 => [a[0] * k, a[1] * k]
export const dot = (a: Vec2, b: Vec2): number => a[0] * b[0] + a[1] * b[1]
export const norm = (a: Vec2): number => Math.hypot(a[0], a[1])
export const midpoint = (a: Vec2, b: Vec2): Vec2 => scale(add(a, b), 0.5)

/** Unit vector, or null for a (near-)zero vector rather than NaNs. */
export function normalize(a: Vec2): Vec2 | null {
  const n = norm(a)
  return n < 1e-9 ? null : scale(a, 1 / n)
}

export function mean(points: readonly Vec2[]): Vec2 {
  const total = points.reduce<Vec2>((acc, p) => add(acc, p), [0, 0])
  return scale(total, 1 / points.length)
}
