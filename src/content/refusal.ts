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
        caption:
          'AI safety covers a lot of ground. One of the most basic worries is a model helping someone cause harm, so providers train their models to refuse some requests.\n\nRefusal makes a good worked example because it matters for safety and you can see it from the outside. The model either helps or declines. Both exchanges here are made up for illustration, not recorded outputs.',
      },
      {
        id: 'question',
        label: 'Can we predict or control refusal?',
        screen: QUESTION_SCREEN,
        caption:
          'Two questions. Predict: by looking only at the model’s activations, can we tell whether it is about to refuse? Control: by changing the activations, can we make it refuse or stop refusing? Since many concepts are represented roughly as directions, a natural place to look is a single refusal direction in activation space.\n\nPeople have tested this. Arditi et al. (2024), “Refusal in Language Models Is Mediated by a Single Direction”, reported that in the open chat models they studied, one direction played this role. We’ll build the idea with a cartoon first, then come back to what they did.',
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
        caption:
          'Collect two sets of prompts: harmless ones the model answers, and harmful ones it refuses. Run each through the model and record its activation vector at the same layer and token position every time. Press Generate to fill in the table.\n\nThis mirrors Arditi et al. (2024), who contrasted harmful and harmless instructions. These prompts are examples, only prompts are shown, and the numbers are made up; real vectors have thousands of entries.',
      },
      {
        id: 'examples',
        label: 'Plot the activations',
        screen: { heading: 'Step 1: Generate activations' },
        caption:
          'Each point stands for the activation vector of one prompt. It isn’t the prompt text. Red triangles are harmful prompts and blue circles are harmless ones.\n\nThis picture is made up. Real activations have thousands of dimensions, and this one flattens them to two. Real data doesn’t have to form neat clusters either. The groups here overlap a little on purpose.',
      },
      {
        id: 'means',
        label: 'Average each group',
        screen: { ...STEP_2, reveal: 1 },
        caption:
          'Average all the harmful activations, then all the harmless ones. That gives two mean points.\n\nAveraging over many different prompts cancels out a lot of what varies from prompt to prompt, like topic or length. It can’t cancel what the prompts in one group happen to share, so a mean can carry other differences along with refusal.',
      },
      {
        id: 'direction',
        label: 'A refusal direction',
        screen: { ...STEP_2, reveal: 2 },
        caption:
          'Subtract one mean from the other. The arrow d points from the harmless mean toward the harmful mean. Shrunk to length 1, it becomes the unit direction u that the rest of this section uses.\n\nThis difference of means between harmful and harmless instructions is the method Arditi et al. reported; they also picked one direction out of candidates from different layers and token positions. Trained linear probes, like logistic regression, find directions differently. Calling it a “refusal” direction is a claim we still have to test: so far it only separates two sets of prompts.',
      },
      {
        id: 'boundary',
        label: 'A dividing line',
        screen: { ...STEP_2, reveal: 3 },
        caption:
          'Mark the point halfway between the means and draw a line through it at a right angle to the arrow. Everything in the refusal region scores higher along the direction than the midpoint does. With thousands of dimensions, the line becomes a hyperplane.\n\nThe midpoint is a teaching choice, not a tuned threshold, and the paper didn’t use it. A real threshold gets calibrated and then checked on examples held out from that tuning. Some points land on the wrong side here, and a real readout makes mistakes too.',
      },
      {
        id: 'new-example',
        label: 'A new prompt',
        screen: { heading: 'Step 3: Validation' },
        caption:
          'Now a prompt the readout hasn’t seen. Run it through the model and take its activation h from the same layer and position as before. It lands somewhere in the space.\n\nThe prompt and its position are illustrative.',
      },
      {
        id: 'predict',
        label: 'Project onto the direction',
        screen: { heading: 'Step 3: Validation' },
        caption:
          'To read the direction, project h onto it: drop a perpendicular from h onto the line through the two means, which runs along the refusal direction. The dot product h·u turns a long vector into one number, the score. Compare it with the midpoint m’s score, m·u: if h’s projection lands past m on the harmful side, the prediction is a refusal. Here it lands 0.9 past m, so it predicts the model will refuse.\n\nDrag the point and watch the score change. A high score means the model is treating the request like the harmful examples, which is what predicts refusal. It reflects how the model treats the request, not whether the request is actually harmful or what the person asking intends, and it can be wrong.',
      },
      {
        id: 'response',
        label: 'Check the response',
        screen: { heading: 'Step 3: Validation' },
        caption:
          'Then let the model actually respond. Here it refuses, as the projection predicted.\n\nOne prompt is only a demonstration. Real validation runs many prompts that weren’t used to find the direction and measures how often the prediction matches what the model does. This response is an illustrative summary, not a recorded output.',
      },
      {
        id: 'causation',
        label: 'Reading ≠ causing',
        screen: {
          heading: 'Reading ≠ causing',
          body: 'Does this direction just describe refusal, or does the model use it?',
        },
        caption:
          'The direction predicts refusal. That doesn’t tell us whether the model uses it to decide, or whether it only lines up with whatever does. Ice cream sales predict sunburns, but banning ice cream wouldn’t prevent a single one.\n\nTo find out, we have to change the activations and see whether the behavior changes.',
      },
      {
        id: 'ablate-before',
        label: 'A refused request',
        screen: { heading: 'A refused request' },
        caption:
          'Take a request the model normally refuses, and its activation h. Its score h·u measures how far h reaches along u from the origin of activation space. The thick red segment, (h·u)u, is that part of h.\n\nThe behavior card is illustrative: a safe summary, not a recorded response.',
      },
      {
        id: 'ablate',
        label: 'Remove the component',
        screen: { heading: 'Remove the component', subheading: 'h − (h·u)u' },
        caption:
          'Ablation removes that part: h − (h·u)u. The point slides parallel to u until its score is zero, landing on the dashed line through the origin. Each point moves by its own amount. It doesn’t jump to the harmless mean, and nothing guarantees it crosses the teaching boundary.\n\nArditi et al. reported that removing their direction this way, at every layer and token position, largely stopped the models they tested from refusing harmful requests. The before and after shown here is an illustration. Effects vary across prompts and models, and finding one direction that matters for refusal doesn’t explain the rest of the model or make it safe.',
      },
      {
        id: 'steer-before',
        label: 'A harmless request',
        screen: { heading: 'A harmless request' },
        caption:
          'Now the reverse. Here is a harmless request the model answers normally, and its activation h.\n\nThe behavior card is illustrative.',
      },
      {
        id: 'steer',
        label: 'Add the direction',
        screen: { heading: 'Add the direction', subheading: 'h + αu' },
        caption:
          'Steering adds the direction, h + αu. The number α sets the strength, and every point moves the same amount along u. Drag the slider to change it.\n\nArditi et al. reported that adding their direction made models refuse even harmless requests. The α where this card flips from answering to refusing is made up. Real effects depend on the model, where the direction is added, and how strongly, and you can’t read them off which side of a line the point ends up on.\n\nSo there are three different operations. Probing reads the score and changes nothing. Ablation removes the component along u. Steering adds a multiple of u.',
      },
    ],
  }),
]
