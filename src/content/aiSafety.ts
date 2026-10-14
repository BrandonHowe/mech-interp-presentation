import { defineStage } from '../types'
import { ProgressStage } from '../stages/ai-safety/ProgressStage'
import { WeirderStage } from '../stages/ai-safety/WeirderStage'
import { FastStage } from '../stages/ai-safety/FastStage'
import { AgentsStage } from '../stages/ai-safety/AgentsStage'
import { PatchesStage } from '../stages/ai-safety/PatchesStage'
import { GrownStage } from '../stages/ai-safety/GrownStage'
import { BadlyStage } from '../stages/ai-safety/BadlyStage'

/*
 * Part 1: What is AI safety? Slide content lives in src/stages/ai-safety/data.ts.
 * From "agents" on, the screen darkens one theme per slide (dusk → night →
 * abyss), following Linch's "simplest case for AI catastrophe".
 */
export const aiSafetyStages = [
  defineStage({
    id: 'progress',
    title: 'AI progress is increasing rapidly',
    component: ProgressStage,
    initialInteraction: undefined,
    steps: [
      { id: 'world', label: 'AI in the world', screen: { heading: 'AI progress is increasing rapidly!' } },
      { id: 'math', label: 'AI in math', screen: { heading: 'AI progress is increasing rapidly!' } },
    ],
  }),
  defineStage({
    id: 'weirder',
    title: 'Things are getting weirder',
    component: WeirderStage,
    initialInteraction: undefined,
    steps: [{ id: 'weirder', label: 'Things are getting weirder', screen: { heading: 'Things are getting a lot weirder…' } }],
  }),
  defineStage({
    id: 'fast',
    title: 'This might happen really fast',
    component: FastStage,
    initialInteraction: undefined,
    steps: [{ id: 'fast', label: 'This might happen really fast', screen: { heading: 'Things might start to happen really fast' } }],
  }),
  defineStage({
    id: 'agents',
    title: 'Modern LLMs are agents',
    component: AgentsStage,
    initialInteraction: undefined,
    theme: 'dusk',
    steps: [{ id: 'agents', label: 'From answering to acting', screen: { heading: 'Modern LLMs are agents' } }],
  }),
  defineStage({
    id: 'grown',
    title: 'LLMs are grown, not made',
    component: GrownStage,
    initialInteraction: undefined,
    theme: 'night',
    steps: [
      {
        id: 'grown',
        label: 'Grown, then aligned',
        screen: {
          heading: 'LLMs are grown, not made',
          bullets: [
            { text: 'In traditional software, you specify exactly what the software does in a precise way, given a precise condition.' },
            {
              text: 'Modern AI has worked very differently. It is grown and shaped by large amounts of training data, without explicitly specifying behavior.',
            },
            {
              text: 'The model is put into a variety of environments where it assumes the role of an AI assistant and is conditioned to make the right decision in a variety of scenarios.',
              sub: ['This is known as **alignment**.'],
            },
          ],
          body: 'AI openly and transparently defying its users has been mostly patched in the past few years.',
        },
      },
    ],
  }),
  defineStage({
    id: 'patches',
    title: 'Patches are a band-aid',
    component: PatchesStage,
    initialInteraction: undefined,
    theme: 'night',
    steps: [
      {
        id: 'patches',
        label: 'Why the patches may not hold',
        screen: {
          heading: 'LLMs are grown, not made',
          subheading: 'These patchwork solutions are unlikely to be anything but a band-aid in the medium and long term.',
          bullets: [
            { text: 'AIs are becoming evaluation aware. They know when they are being evaluated and are careful to hide signs of misalignment.' },
            { text: 'As AIs become more goal-seeking/agentic, they will develop stronger self-preservation instincts.' },
            { text: 'There are several instances of AIs understanding they are not acting how humans intended, but they did it anyways.' },
          ],
        },
      },
    ],
  }),
  defineStage({
    id: 'badly',
    title: 'This can all end very badly',
    component: BadlyStage,
    initialInteraction: undefined,
    theme: 'abyss',
    // One step per bullet, in reading order (see BADLY).
    steps: ['reshape', 'dying', 'preventative', 'side-effect', 'bats'].map((id) => ({
      id,
      label: 'How it could end badly',
      screen: { heading: 'This can all end very badly' },
    })),
  }),
]
