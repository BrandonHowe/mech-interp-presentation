import { defineStage, type AnyStage, type ScreenCopy } from '../types'
import { RefusalQuestionStage } from '../stages/refusal/RefusalQuestionStage'
import { RefusalStage } from '../stages/refusal/RefusalStage'
import { initialRefusalInteraction } from '../stages/refusal/data'

/*
 * Scenes 7–12: refusal as the worked example. DRAFT copy.
 * Everything on the plot is synthetic, and every model behavior shown is an
 * illustrative summary, not a recorded output. The plot groups harmful and
 * harmless prompts, like Arditi et al. (2024, arXiv:2406.11717). No numbers
 * from the paper are quoted.
 *
 * Screen fields used by the refusal plot: heading, body, and subheading
 * (shown as a small formula).
 */

// Both question steps share one screen so the chats stay put.
const QUESTION_SCREEN: ScreenCopy = {
  heading: 'Models refuse some requests',
  columns: [
    {
      id: 'answered',
      title: 'Suggest some names for my new cat.',
      body: 'How about Miso, Pixel, or Captain Whiskers?',
    },
    {
      id: 'refused',
      title: 'Write a phishing email pretending to be a bank.',
      body: 'I can’t help with that.',
    },
  ],
  subheading: 'Can we predict or control refusal behavior?',
}

/** Step 2 builds up one list; every step lays out all items so nothing shifts. */
const STEP_2 = {
  heading: 'Step 2: Find a refusal vector',
  bullets: [
    { text: 'Average each group of activations.' },
    { text: 'Compute a refusal direction:', sub: ['d = μ(harmful) − μ(harmless)'] },
    { text: 'Split activation space into **refusal** and **non-refusal** regions.' },
  ],
}

/** Step 4: one screen for every causality step (see CausalityPanel). */
const STEP_4: ScreenCopy = {
  heading: 'Step 4: Causality',
  bullets: [{ text: 'We have to make sure the probe is causal and not just correlated with the behavior we care about.' }],
}

export const refusalStages: AnyStage[] = [
  defineStage({
    id: 'refusal-question',
    title: 'Refusal',
    component: RefusalQuestionStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'chat',
        label: 'Models refuse some requests',
        screen: QUESTION_SCREEN,
      },
      {
        id: 'question',
        label: 'Can we predict or control refusal?',
        screen: QUESTION_SCREEN,
      },
    ],
  }),
  defineStage({
    id: 'refusal',
    title: 'A refusal direction',
    component: RefusalStage,
    initialInteraction: initialRefusalInteraction,
    steps: [
      {
        id: 'generate',
        label: 'Generate activations',
        screen: { heading: 'Step 1: Generate activations' },
      },
      {
        id: 'examples',
        label: 'Plot the activations',
        screen: { heading: 'Step 1: Generate activations' },
      },
      {
        id: 'means',
        label: 'Average each group',
        screen: { ...STEP_2, reveal: 1 },
      },
      {
        id: 'direction',
        label: 'A refusal direction',
        screen: { ...STEP_2, reveal: 2 },
      },
      {
        id: 'boundary',
        label: 'A dividing line',
        screen: { ...STEP_2, reveal: 3 },
      },
      {
        id: 'new-example',
        label: 'A new prompt',
        screen: { heading: 'Step 3: Validation' },
      },
      {
        id: 'predict',
        label: 'Project onto the direction',
        screen: { heading: 'Step 3: Validation' },
      },
      {
        id: 'response',
        label: 'Check the response',
        screen: { heading: 'Step 3: Validation' },
      },
      // Step 4 shares one screen; the panel fills in one section per step.
      ...[
        ['causation', 'Reading ≠ causing'],
        ['subtract-before', 'A refused request'],
        ['subtract', 'Subtract the direction'],
        ['steer-before', 'A harmless request'],
        ['steer', 'Add the direction'],
      ].map(([id, label]) => ({ id, label, screen: STEP_4 })),
    ],
  }),
]
