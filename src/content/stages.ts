import { defineStage } from '../types'
import { TitleStage } from '../stages/title/TitleStage'
import { BulletsStage } from '../stages/bullets/BulletsStage'
import { ApproachesStage } from '../stages/approaches/ApproachesStage'
import { FruitfulStage } from '../stages/fruitful/FruitfulStage'
import { CardsStage } from '../stages/cards/CardsStage'
import { networkStages } from './network'
import { refusalStages } from './refusal'
import { StructureTestStage } from '../stages/structure-test/StructureTestStage'
import { initialProbeState } from '../stages/structure-test/data'

/*
 * Narrative sequence. Step ids are stable and appear in URLs (#/stage/step);
 * rename them deliberately. Real content is not written yet: the title copy is
 * a placeholder, and the structure test exists only to exercise the shell.
 */
const APPROACH_COLUMNS = [
  {
    id: 'bottom-up',
    title: 'Bottom-up',
    body: 'Analyze individual neurons and circuits',
    figureNote: 'e.g. the induction-head circuit',
  },
  {
    id: 'top-down',
    title: 'Top-down',
    body: 'Find how concepts are represented across many neurons',
  },
]

const FRUITFUL_INDUCTION = {
  heading: 'Which is more fruitful?',
  subheading: 'Bottom-up is painstaking',
  // Wang et al., “Interpretability in the Wild” (arXiv Nov 2022, ICLR 2023): 25 pages; circuit of 26 attention heads in 7 classes.
  body: 'In 2022, researchers studied how GPT-2 small predicted the next word for “When Mary and John went to the store, John gave a drink to”, and published a [25-page paper](https://arxiv.org/abs/2211.00593) explaining the 26 attention heads that contributed to the prediction. Even after this, we are still far from a comprehensive explanation of why it predicted “Mary”.',
  figure: {
    src: '/images/ioi-circuit.png',
    alt: 'Circuit diagram from Wang et al.: the sentence “When Mary and John went to the store, John gave a drink to” flows through Previous Token, Duplicate Token, Induction, S-Inhibition, and Name Mover attention heads in GPT-2 small, which together output “Mary”.',
  },
}

// Both steps share this screen; the first step lays out the scale block but hides it.
const FRUITFUL_SCREEN = {
  ...FRUITFUL_INDUCTION,
  bullets: [
    {
      text: 'Modern language models have up to **trillions** of parameters. Analyzing this bottom-up is not practical.',
    },
  ],
  // ~225K: one-layer transformer, d=128, 4 heads, 512 MLP units, p=113
  // (Nanda et al. 2023). GPT-6 size is unpublished; ~10T is a widely
  // reported rumor (checked October 2026).
  scale: {
    items: [
      { value: 2.25e5, display: '~200K', label: 'fully reverse-engineered (modular addition)' },
      { value: 1e13, display: '~10T', label: 'GPT-6' },
    ],
    note: '~44 million× larger',
  },
}

export const stages = [
  defineStage({
    id: 'opening',
    title: 'Opening',
    component: TitleStage,
    initialInteraction: undefined,
    transition: 'dramatic',
    steps: [
      {
        id: 'title',
        label: 'Title',
        screen: {
          heading: 'Mind-reading LLMs with Mechanistic Interpretability',
          body: 'NJIT AI Safety',
        },
        caption:
          'Placeholder caption for the title. In self-guided mode, this panel explains what the presenter would say aloud.\n\nUse the arrow keys, Page Up/Down, or the buttons below to move between steps. Press C to toggle this panel.',
      },
    ],
  }),
  defineStage({
    id: 'why',
    title: 'Why mech interp',
    component: BulletsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'why',
        label: 'Why Mech Interp?',
        screen: {
          heading: 'Why Mech Interp?',
          bullets: [
            {
              text: 'Mechanistic Interpretability deals with discovering and understanding how LLMs work internally, as a foundation for AI safety and positive outcomes.',
            },
            {
              text: 'If you only look at an intelligent agent’s outputs, it’s hard to guarantee they are doing what you want.',
              sub: ['(consider someone you know, or an AI agent, intentionally lying to you)'],
            },
            {
              text: 'By contrast, if you could fully understand someone’s internal states, you would be able to tell whether they are lying.',
            },
          ],
        },
        caption:
          'Watching outputs tells us what a model does, not why. A model, like a person, could give convincing answers while internally pursuing something else.\n\nIn principle, a complete understanding of a model’s internal states would reveal that. In practice we are far from complete understanding, so the rest of this talk looks at what we can already read from inside a model, and how to test whether it matters.',
      },
    ],
  }),
  defineStage({
    id: 'approaches',
    title: 'Main approaches',
    component: ApproachesStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'approaches',
        label: 'Main approaches',
        screen: {
          heading: 'Main Approaches',
          columns: APPROACH_COLUMNS,
        },
        caption:
          'Bottom-up work starts from the smallest parts: what does this neuron respond to, and which connections between neurons implement a particular computation (a “circuit”)?\n\nTop-down work starts from something we already care about, like a concept or a behavior, and asks how the model represents it across many neurons at once.',
      },
    ],
  }),
  defineStage({
    id: 'fruitful',
    title: 'Which is more fruitful?',
    component: FruitfulStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'induction',
        label: 'Bottom-up is painstaking',
        screen: FRUITFUL_SCREEN,
        caption:
          'The indirect-object-identification study (Wang et al., “Interpretability in the Wild”) traced how GPT-2 small completes “…John gave a drink to” with “Mary”. The diagram is the paper’s summary: 26 attention heads in 7 functional groups pass information about which names appeared and which one was repeated, and the Name Mover Heads finally copy “Mary” to the output.\n\nIt is one of the most detailed circuit analyses of a real language model, it took a 25-page paper, and it is still only a partial account of the behavior.',
      },
      {
        id: 'scale',
        label: 'The scale problem',
        screen: FRUITFUL_SCREEN,
        caption:
          'Both approaches are active research areas, and bottom-up work has produced detailed explanations of specific mechanisms, like the circuit above or induction heads (Olsson et al., 2022).\n\nBut complete reverse-engineering has only been achieved for tiny models. One example is a ~200K-parameter transformer trained on modular addition (Nanda et al., 2023). OpenAI has not published GPT-6’s size; ~10 trillion parameters is a widely reported estimate. That gap of roughly 7–8 orders of magnitude is why this talk takes the top-down route: pick a behavior that matters for safety and look for how it is represented.',
      },
    ],
  }),
  ...networkStages,
  ...refusalStages,
  defineStage({
    id: 'more',
    title: 'What else can we read?',
    component: CardsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'more',
        label: 'What else can we read?',
        screen: {
          heading: 'What Else Can We Read?',
          // Draft: each card is a research lead from the plan, not yet re-verified.
          columns: [
            { id: 'truth', title: 'True or false', body: 'Whether a statement is factually true' },
            { id: 'space-time', title: 'Space and time', body: 'Where places are and when events happened' },
            { id: 'othello', title: 'Board state', body: 'The Othello board, in a model trained only on moves' },
            { id: 'persona', title: 'Personality traits', body: 'Sycophancy, hallucination, and other character traits' },
            { id: 'assistant', title: 'The assistant persona', body: 'How much the model is acting as its usual assistant' },
          ],
        },
        caption:
          'Refusal is one example among many. Researchers have found information that can be read out of activations, often with simple linear methods: whether a factual statement is true (Marks & Tegmark, 2023), the coordinates of places and dates of events (Gurnee & Tegmark, 2023), the board state in a model trained only on Othello moves (Li et al., 2022; Nanda, 2023), and character traits like sycophancy (Anthropic’s persona vectors, 2025), including how strongly a model is in its assistant persona (Anthropic’s assistant axis).\n\nThese results come from particular models and setups, use different methods, and differ in how much causal evidence they have: some only show the information is readable, others also steer behavior with it. Reading “true versus false” is also not the same as detecting a deliberate lie.',
      },
    ],
  }),
  defineStage({
    id: 'takeaway',
    title: 'Takeaways',
    component: BulletsStage,
    initialInteraction: undefined,
    transition: 'dramatic',
    steps: [
      {
        id: 'takeaway',
        label: 'Takeaways',
        screen: {
          heading: 'Takeaways',
          bullets: [
            { text: 'Huge, complicated models sometimes contain **surprisingly simple** structure.' },
            { text: 'We can **read** information from activations, and **test** whether it drives behavior.' },
            { text: 'Most of it is still unexplained, and you can help work on it.' },
          ],
        },
        caption:
          'We went from an intuition (activations are points in a space) to a measurement (a direction that predicts refusal) to an intervention (removing or adding that direction changes whether the model refuses, in the reported setup).\n\nThe limits matter as much as the results: being able to read a signal is not the same as it causing behavior, controlling one behavior is not a full explanation of the model, and a refusal direction is not a safety solution. Most of what happens inside these models is still unexplained, which is exactly why this is a good time to get involved. NJIT AI Safety’s technical fellowship is one place to start.',
      },
    ],
  }),
  defineStage({
    id: 'structure-test',
    title: 'Structure test',
    component: StructureTestStage,
    initialInteraction: initialProbeState,
    steps: [
      {
        id: 'points',
        label: 'Reveal points',
        screen: {
          eyebrow: 'Structure test',
          heading: 'Two groups of points',
          body: 'Synthetic placeholder data for testing a diagram that persists across steps.',
        },
        caption:
          'This stage stays mounted while its steps change. The plot should evolve in place rather than being replaced.\n\nCheck: jumping straight to a later step (or reloading) should land on the same picture as stepping through in order.',
      },
      {
        id: 'means',
        label: 'Show means',
        screen: {
          eyebrow: 'Structure test',
          heading: 'Each group’s mean',
          body: 'Individual points fade back so the two averages stand out.',
        },
        caption:
          'Means are computed from the data in model coordinates and only then mapped to the screen.\n\nCheck: advance and go back quickly. Animations should retarget smoothly rather than queueing stale reveals.',
      },
      {
        id: 'direction',
        label: 'Draw direction',
        screen: {
          eyebrow: 'Structure test',
          heading: 'A direction between the means',
          body: 'The arrow points from the group B mean toward the group A mean.',
        },
        caption:
          'The arrow draws itself in, then its head appears. With reduced motion (menu → Motion → Reduced), the same endpoint appears without movement.',
      },
      {
        id: 'boundary',
        label: 'Add boundary',
        screen: {
          eyebrow: 'Structure test',
          heading: 'A perpendicular boundary',
          body: 'A line through the midpoint, perpendicular to the direction. Points return so the overlap stays visible.',
        },
        caption:
          'The boundary passes through the midpoint between the means. Some points sit on the “wrong” side on purpose: the placeholder data overlaps.',
      },
      {
        id: 'probe',
        label: 'Drag the probe',
        screen: {
          eyebrow: 'Structure test',
          heading: 'Drag the probe',
          body: 'Its score is the signed distance along the direction, measured from the midpoint.',
        },
        caption:
          'Drag the dark point, or focus it with Tab and use the arrow keys (Shift for bigger steps). While it is focused, arrow keys move the probe instead of changing steps.\n\nCheck: leave this section and come back. The probe should stay where you left it. Reset restores the default position.',
      },
    ],
  }),
]
