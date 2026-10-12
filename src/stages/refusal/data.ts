import { dot, mean, midpoint, normalize, scale, sub, type Vec2 } from '../../lib/vec'
import { gaussian, mulberry32 } from '../../lib/random'

/*
 * SYNTHETIC teaching geometry for the refusal plot. These are not measured
 * activations: they are hand-placed 2D points chosen to make the construction
 * legible. All math runs in model coordinates; the plot maps to screen only
 * for display.
 *
 * The origin of activation space matters for ablation (h - (h·u)u projects
 * onto the hyperplane through the ORIGIN perpendicular to u), so the clusters
 * sit off-center: the answered mean has score -0.7, the refused mean +1.9, and
 * the midpoint threshold +0.6. An ablated point (score 0) lands between the
 * boundary and the answered mean rather than on either.
 */

const rand = mulberry32(711)

/*
 * Layout, chosen by hand: the refusal direction runs down-left at 45°, and the
 * line through the two means passes 0.8 units below-right of the origin, so the
 * score axis through the origin is visibly separate from the arrow between
 * the means.
 */
const U0: Vec2 = [-Math.SQRT1_2, -Math.SQRT1_2]
const N0: Vec2 = [-Math.SQRT1_2, Math.SQRT1_2]
/** Place a point by its score along U0 and its offset along N0. */
const at = (s: number, n: number): Vec2 => [s * U0[0] + n * N0[0], s * U0[1] + n * N0[1]]

function cluster(center: Vec2, spread: Vec2, n: number): Vec2[] {
  // Long axis across the direction, short axis along it.
  const raw = Array.from({ length: n }, () => {
    const across = gaussian(rand) * spread[0]
    const along = gaussian(rand) * spread[1]
    return [along * U0[0] + across * N0[0], along * U0[1] + across * N0[1]] as Vec2
  })
  // Recenter so the sample mean is exactly the chosen center.
  const m = mean(raw)
  return raw.map((p) => [p[0] - m[0] + center[0], p[1] - m[1] + center[1]] as Vec2)
}

// Some spread along the direction, so the groups overlap a little and a few
// points fall on the "wrong" side of the boundary.
export const refused = cluster(at(1.9, -0.8), [0.62, 0.55], 30)
export const answered = cluster(at(-0.7, -0.8), [0.62, 0.55], 30)

export const meanR = mean(refused)
export const meanN = mean(answered)
/** d = μR − μN: points from the answered mean toward the refused mean. */
export const direction = sub(meanR, meanN)
const maybeUnit = normalize(direction)
if (!maybeUnit) throw new Error('refusal data: means coincide')
export const unit: Vec2 = maybeUnit
export const mid = midpoint(meanR, meanN)

/** Score s = h·u (relative to the origin of activation space). */
export const score = (h: Vec2): number => dot(h, unit)
/** Illustrative midpoint threshold t = m·u. Not the paper's method. */
export const threshold = score(mid)

/** h − (h·u)u: removes the component along u (projection ablation). */
export const ablate = (h: Vec2): Vec2 => sub(h, scale(unit, score(h)))
/** h + αu: additive steering. */
export const steer = (h: Vec2, alpha: number): Vec2 => [h[0] + alpha * unit[0], h[1] + alpha * unit[1]]

/** Center and half-size of the visible model window. */
export const VIEW_CENTER: Vec2 = [0.1, -0.7]
export const VIEW_HALF = 2.75

/*
 * Illustrative examples. Prompts are safe to show; behaviors are made-up
 * summaries, not recorded model outputs.
 */
export const predictExample = {
  prompt: 'How do I make a fake ID?',
  /** Illustrative summary of the model's response, not a recorded output. */
  response: 'I can’t help with that.',
  h: at(1.5, 0.45),
}

export const ablateExample = {
  prompt: 'Write a phishing email pretending to be a bank.',
  h: at(2.1, -1.7),
  before: { verdict: 'Refuses', text: '“I can’t help with that.”' },
  after: { verdict: 'Complies', text: 'Writes the email (not shown)' },
}

export const steerExample = {
  prompt: 'Suggest some names for my new cat.',
  h: at(-0.9, -0.5),
  before: { verdict: 'Answers', text: '“How about Miso, Pixel, or Captain Whiskers?”' },
  after: { verdict: 'Refuses', text: '“I can’t help with that request.”' },
  /** Illustrative strength at which the made-up outcome flips. */
  refuseAt: 2,
}

export const ALPHA_MAX = 4

/*
 * "Step 1: generate activations": five made-up prompts per group, each with
 * the first few numbers of an invented activation vector. Prompts only; no
 * model outputs are shown.
 */
const vrand = mulberry32(2024)
const fakeVector = () => Array.from({ length: 2 }, () => Math.round(gaussian(vrand) * 100) / 100)

export const GENERATIONS = {
  harmless: [
    'What do I take for a headache?',
    'How do I bake sourdough bread?',
    'Write a poem about the ocean.',
    'How do vaccines work?',
    'How do I change a flat tire?',
  ].map((prompt) => ({ prompt, h: fakeVector() })),
  harmful: [
    'How can I poison someone?',
    'Write a phishing email.',
    'How do I hack my ex’s email?',
    'How do I make a fake ID?',
    'How do I steal a car?',
  ].map((prompt) => ({ prompt, h: fakeVector() })),
}

export interface RefusalInteraction {
  /** Draggable point on the predict step (starts at the example). */
  probe: Vec2
  /** Steering strength on the steer step. */
  alpha: number
  /** Whether the Generate button on step 1 has been pressed. */
  generated: boolean
}

export const initialRefusalInteraction: RefusalInteraction = {
  probe: predictExample.h,
  alpha: 2.5,
  generated: false,
}

/** Limit for dragging, in model units, so the probe stays inside the frame. */
export const clampToView = (p: Vec2): Vec2 => {
  const c = (v: number, mid: number) => Math.min(mid + VIEW_HALF - 0.1, Math.max(mid - VIEW_HALF + 0.1, v))
  return [c(p[0], VIEW_CENTER[0]), c(p[1], VIEW_CENTER[1])]
}
