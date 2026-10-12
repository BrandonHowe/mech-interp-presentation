/*
 * SYNTHETIC toy network for the weights-versus-activations slide: 2 inputs →
 * 3 hidden neurons → 2 outputs, hand-picked weights, no biases. The
 * activations are really computed from these weights (ReLU hidden layer,
 * linear outputs), so switching inputs changes them while the weights stay put.
 */

/** W1[h][i]: weight from input i to hidden neuron h. */
export const W1 = [
  [0.9, -0.5],
  [0.4, 0.8],
  [-0.6, 0.7],
]

/** W2[o][h]: weight from hidden neuron h to output o. */
export const W2 = [
  [0.8, -0.4, 0.6],
  [-0.3, 0.9, 0.5],
]

export const INPUTS = [
  { id: 'a', label: 'Input A', x: [1, 0.2] },
  { id: 'b', label: 'Input B', x: [0.1, 1] },
  { id: 'c', label: 'Input C', x: [0.7, 0.7] },
]

const relu = (v: number) => Math.max(0, v)
const dot = (w: number[], x: number[]) => w.reduce((s, wi, i) => s + wi * x[i], 0)

/** Activations of every layer for one input: [inputs, hidden, outputs]. */
export function forward(x: number[]): number[][] {
  const hidden = W1.map((w) => relu(dot(w, x)))
  const out = W2.map((w) => dot(w, hidden))
  return [x, hidden, out]
}

export interface ToyNetworkState {
  input: number
}

export const initialToyNetworkState: ToyNetworkState = { input: 0 }
