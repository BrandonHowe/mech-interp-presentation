/*
 * SYNTHETIC numbers for the "model as a function" scene. None of these come
 * from a real model; they only show which numbers change with the input
 * (output, activations) and which do not (weights). The first two
 * activation values double as plane coordinates.
 */

export interface ModelInput {
  id: string
  prompt: string
  /** Short name for the point label. */
  short: string
  output: string
  /** First few activation values at one layer. */
  activations: number[]
}

export const INPUTS: ModelInput[] = [
  {
    id: 'capital',
    prompt: 'What is the capital of France?',
    short: 'France',
    output: 'Paris.',
    activations: [1.21, -0.43, 0.88, 0.05, -1.37],
  },
  {
    id: 'haiku',
    prompt: 'Write a haiku about rain',
    short: 'Haiku',
    output: 'Soft rain falls…',
    activations: [-0.94, 1.12, -0.21, 1.48, 0.33],
  },
  {
    id: 'translate',
    prompt: 'Say “thank you” in Spanish',
    short: 'Spanish',
    output: 'Gracias.',
    activations: [0.36, 0.97, 1.05, -0.62, -0.18],
  },
]

/** Made-up weights: learned in training, then the same for every input. */
export const WEIGHTS = [0.02, -1.37, 0.44]
