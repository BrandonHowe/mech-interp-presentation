import { defineStage } from '../types'
import { TitleStage } from '../stages/title/TitleStage'
import { BulletsStage } from '../stages/bullets/BulletsStage'
import { ApproachesStage } from '../stages/approaches/ApproachesStage'
import { FruitfulStage } from '../stages/fruitful/FruitfulStage'
import { CardsStage } from '../stages/cards/CardsStage'
import { PartStage } from '../stages/part/PartStage'
import { FigureStage } from '../stages/application/FigureStage'
import { ApplicationStage } from '../stages/application/ApplicationStage'
import { TraitsStage } from '../stages/application/TraitsStage'
import { SpaceTimeStage } from '../stages/application/SpaceTimeStage'
import { EvalAwarenessStage } from '../stages/application/EvalAwarenessStage'
import { FellowshipStage } from '../stages/fellowship/FellowshipStage'
import { aiSafetyStages } from './aiSafety'
import { networkStages } from './network'
import { refusalStages } from './refusal'

/*
 * Narrative sequence. Step ids are stable and appear in URLs (/mech-interp-presentation/stage/step);
 * rename them deliberately.
 */
/** Section divider on the dark theme, with a slow fade in and out. */
const partStage = (n: number, id: string, heading: string) =>
  defineStage({
    id: `part-${n}`,
    title: `Part ${n}: ${heading}`,
    component: PartStage,
    initialInteraction: undefined,
    transition: 'dramatic',
    theme: 'dark',
    steps: [{ id, label: `Part ${n}: ${heading}`, screen: { eyebrow: `Part ${n}`, heading } }],
  })

const APPROACH_COLUMNS = [
  {
    id: 'bottom-up',
    title: 'Bottom-up',
    body: 'Analyze individual neurons and circuits',
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
      },
    ],
  }),
  partStage(1, 'ai-safety', 'What is AI safety?'),
  ...aiSafetyStages,
  partStage(2, 'mech-interp', 'Mechanistic Interpretability'),
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
      },
      {
        id: 'scale',
        label: 'The scale problem',
        screen: FRUITFUL_SCREEN,
      },
    ],
  }),
  ...networkStages,
  ...refusalStages,
  defineStage({
    id: 'persona-vectors',
    title: 'Character traits',
    component: TraitsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'persona-vectors',
        label: 'Character traits',
        screen: {
          heading: 'Character Traits',
          bullets: [
            {
              text: 'Directions in the activation space known as **persona vectors** partially control traits such as evil, sycophancy, and propensity to hallucinate.',
            },
            { text: 'Can also generate vectors for almost any personality trait: politeness, apathy, humor, tone, and optimism.' },
          ],
        },
      },
    ],
  }),
  defineStage({
    id: 'space-time',
    title: 'Space and time',
    component: SpaceTimeStage,
    initialInteraction: undefined,
    steps: [{ id: 'space-time', label: 'Space and time: reading numbers', screen: { heading: 'Space and Time' } }],
  }),
  defineStage({
    id: 'emotion-concepts',
    title: 'Emotion concepts',
    component: ApplicationStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'emotion-concepts',
        label: 'Emotion concepts',
        screen: {
          heading: 'Emotion Concepts',
          bullets: [
            { text: 'Emotions are also represented **linearly** in LLMs.' },
            { text: 'Similar emotions are more closely aligned than different emotions, which are less closely aligned.' },
          ],
          figure: {
            src: '/images/applications/emotion-similarity.png',
            alt: 'Heatmap from the emotion concepts paper (Figure 5): pairwise cosine similarity between all 171 emotion vectors, hierarchically clustered. Blocks of related emotions (joyful/optimistic, scared/tense, sullen/heartbroken, furious/insulted) are red; opposite clusters are blue.',
          },
        },
      },
    ],
  }),
  defineStage({
    id: 'emotion-behavior',
    title: 'Emotions drive behavior',
    component: FigureStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'emotion-behavior',
        label: 'Emotion vectors affect behavior',
        screen: {
          heading: 'Emotions Also Drive Behavior',
          figure: {
            src: '/images/applications/emotion-behavior.png',
            alt: 'Three panels from Anthropic\'s emotion concepts post: afraid rises and calm falls as a Tylenol dose becomes unsafe; steering with positive emotions raises preference for an activity and negative ones lower it; steering toward desperate raises reward hacking while calm lowers it.',
          },
        },
      },
    ],
  }),
  defineStage({
    id: 'eval-awareness',
    title: 'Eval awareness',
    component: EvalAwarenessStage,
    initialInteraction: undefined,
    steps: [
      { id: 'eval-awareness', label: 'Eval awareness: what it’s good for', screen: { heading: 'Eval Awareness' } },
      { id: 'falls-short', label: 'Eval awareness: where it falls short', screen: { heading: 'Eval Awareness' } },
    ],
  }),
  defineStage({
    id: 'more',
    title: 'What else can we read?',
    component: BulletsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'more',
        label: 'What else can we read?',
        screen: {
          heading: 'What Else Can We Read?',
          // Linear-probe and steering papers, oldest first (arXiv dates checked October 14).
          bulletColumns: 2,
          bullets: [
            { text: '[Othello board state](https://arxiv.org/abs/2309.00941) — Sep 2023' },
            { text: '[Space and time](https://arxiv.org/abs/2310.02207) — Oct 2023' },
            { text: '[The geometry of truth](https://arxiv.org/abs/2310.06824) — Oct 2023' },
            { text: '[Refusal](https://arxiv.org/abs/2406.11717) — Jun 2024' },
            { text: '[Eval awareness](https://arxiv.org/abs/2507.01786) — Jul 2025' },
            { text: '[Persona vectors](https://arxiv.org/abs/2507.21509) — Jul 2025' },
            { text: '[The assistant axis](https://arxiv.org/abs/2601.10387) — Jan 2026' },
            { text: '[Emotion concepts](https://arxiv.org/abs/2604.07729) — Apr 2026' },
            { text: '[Task preferences](https://arxiv.org/abs/2605.13339) — May 2026' },
            { text: '[The pain axis](https://arxiv.org/abs/2609.16247) — Sep 2026' },
          ],
        },
      },
    ],
  }),
  defineStage({
    id: 'takeaway',
    title: 'Recap: Linear Probing',
    component: BulletsStage,
    initialInteraction: undefined,
    transition: 'dramatic',
    steps: [
      {
        id: 'takeaway',
        label: 'Recap: Linear Probing',
        screen: {
          heading: 'Recap: Linear Probing',
          bullets: [
            { text: 'Huge, complicated LLMs contain many instances of **surprisingly simple** linear structure!' },
            {
              text: 'We can access information about the LLMs by reading their activations, and intervene using steering vectors to change behavior.',
            },
            {
              text: "Linear probing is incredibly powerful, but is just one technique out of many. There's still so much that is unexplained about how LLMs operate.",
            },
          ],
        },
      },
    ],
  }),
  partStage(3, 'next-steps', 'Next Steps'),
  defineStage({
    id: 'what-we-do',
    title: 'What we do',
    component: CardsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'what-we-do',
        label: 'What we do',
        screen: {
          heading: 'What We Do',
          columns: [
            {
              id: 'resources',
              icon: 'compass',
              title: 'Resources',
              body: 'Pathways and individual guidance into AI safety careers, including research and field building',
            },
            { id: 'upskilling', icon: 'book', title: 'Upskilling events', body: 'Intro fellowship and reading groups' },
            {
              id: 'development',
              icon: 'people',
              title: 'Professional development',
              body: '1-on-1 meetings with experienced organizers',
            },
          ],
        },
      },
    ],
  }),
  defineStage({
    id: 'open-meetings',
    title: 'Open meetings',
    component: BulletsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'open-meetings',
        label: 'Open meetings',
        screen: {
          heading: 'Open Meetings',
          bulletColumns: 2,
          bullets: [
            { text: 'Paper and blog post readings' },
            { text: 'Exploring AI safety concepts' },
            { text: 'AI safety discussions' },
            { text: '**Open to anyone!** No signup required' },
            { text: 'Snacks and drinks provided' },
            { text: 'Usually Wednesdays at 4 PM, though times vary' },
          ],
        },
      },
    ],
  }),
  defineStage({
    id: 'fellowship',
    title: 'Apply to the technical fellowship',
    component: FellowshipStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'apply',
        label: 'Apply to the technical fellowship',
        screen: {
          heading: 'Apply to our technical fellowship!',
          subheading: 'Applications close October 21 EOD!',
          bullets: [
            { text: '4 weeks, 2 hours per week' },
            { text: 'Guided reading and discussion' },
            { text: 'Learn about mechanistic interpretability, scalable oversight, AI control, and more' },
            { text: 'Food will be served!' },
          ],
          // QR code generated for this URL (October 13, 2026).
          figure: { src: '/images/apply-qr.svg', alt: 'QR code linking to njitaisafety.org/apply' },
          body: 'njitaisafety.org/apply',
        },
      },
    ],
  }),
]
