import { defineStage, type AnyStage } from '../types'
import { NetworkStage } from '../stages/network/NetworkStage'
import { BulletsStage } from '../stages/bullets/BulletsStage'
import { ToyNetworkStage } from '../stages/toy-network/ToyNetworkStage'
import { initialToyNetworkState } from '../stages/toy-network/data'
import { DigitStage } from '../stages/digit/DigitStage'
import { initialDigitState } from '../stages/digit/latent'

/*
 * Scenes 3 and 4 (draft). The model-as-a-function numbers are made up; the
 * digit space comes from a small VAE trained offline on MNIST
 * (scripts/digit-vae). Step ids appear in URLs; rename them deliberately.
 */
export const networkStages: AnyStage[] = [
  defineStage({
    id: 'network',
    title: 'A model as a function',
    component: NetworkStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'function',
        label: 'What are models?',
        screen: {
          heading: 'What are models?',
          body: 'Fundamentally, a trained LLM is a function from inputs to outputs.',
        },
        caption:
          'From the outside, a language model is a function: text goes in, text comes out. Over the next two steps we’ll look inside just far enough to name the two kinds of numbers that matter.',
      },
      {
        id: 'weights',
        label: 'Weights',
        screen: {
          heading: 'Weights',
          body: 'A trained LLM is characterized by its weights, a set of trained parameters.',
        },
        caption:
          'The model’s behavior is set by its weights: billions of numbers learned during training. Once training is done they stay fixed. All three prompts go through the same weights.\n\nThink of the weights as the physical wiring of a brain. The wiring shapes how someone thinks, but it is the same no matter what they are thinking about right now.',
      },
      {
        id: 'activations',
        label: 'Activations',
        screen: {
          heading: 'Activations',
          body: 'An input is combined with the weights to produce **activations**, which flow through the model and become the output.',
        },
        caption:
          'The input is combined with the weights to produce activations: intermediate numbers, which the rest of the model turns into the output. Each prompt gets its own activations, while all three share the same weights.\n\nActivations are the model’s internal state for this particular input, which is why interpretability mostly studies them.\n\nAt any one layer, the activations are a list of n numbers, a vector in ℝⁿ, where n is in the thousands for real language models. The numbers shown here are made up.',
      },
    ],
  }),
  defineStage({
    id: 'weights-activations',
    title: 'Weights vs. activations',
    component: ToyNetworkStage,
    initialInteraction: initialToyNetworkState,
    steps: [
      {
        id: 'brain',
        label: 'Wiring vs. activity',
        screen: {
          heading: 'Weights vs. Activations',
          body: 'To understand what a model is “thinking”, we study its **activations**.',
        },
        caption:
          'A toy network with 2 inputs, 3 hidden neurons, and 2 outputs. Each line is a weight, labeled with its value (thicker means larger, dashed means negative). Each circle is a neuron, labeled and shaded by its activation, which is computed from the previous layer’s activations and the weights (a weighted sum, with negatives clipped to zero in the hidden layer). Switch inputs: every activation changes, and no weight does.\n\nThe brain analogy: weights are like the brain’s physical structure, which a structural MRI images, and activations are like its activity, which a functional MRI (fMRI) tracks. If you want to know what someone is thinking right now, the activity tells you far more than the structure. (fMRI measures blood-flow changes that follow neural activity rather than the activity itself, and a model is not a brain.)\n\nThis toy network is only for intuition. Language models are not built from small layers like this alone, and real ones have billions of weights. The numbers here are made up, though the activations really are computed from them.',
      },
    ],
  }),
  defineStage({
    id: 'activation-geometry',
    title: 'The geometry of activations',
    component: NetworkStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'point',
        label: 'The geometry of activations',
        screen: {
          heading: 'The Geometry of Model Activations',
          body: 'A 2D grid can only show two numbers at a time. Real models’ activations live in spaces with **thousands of dimensions**!',
        },
        caption:
          'A vector in ℝⁿ is a point in n-dimensional space, so every prompt becomes a point in activation space. We can’t draw thousands of dimensions, so here we plot just the first two numbers as coordinates. Different prompts land at different points.\n\nThis is the picture we’ll keep using: inputs become points in ℝⁿ. Every 2D plot in this talk is a simplification of that space. The numbers here are still made up.',
      },
    ],
  }),
  defineStage({
    id: 'digit-space',
    title: 'Move around a digit space',
    component: DigitStage,
    initialInteraction: initialDigitState,
    steps: [
      {
        id: 'space',
        label: 'Move the point',
        screen: { heading: 'Move Around a Digit Space' },
        caption:
          'This is a real, small model trained on MNIST, a classic dataset of handwritten digits. It learned to squeeze each 28×28 image down to just two numbers, and to turn any two numbers back into an image. So every point on the left is a digit on the right. Drag the point, or click it and use the arrow keys (Shift for bigger steps). Nearby points give similar digits, and moving in one direction gradually changes the digit’s identity or style.\n\n“Show real digits” places real handwritten digits from MNIST’s test set where the model puts them, with a numeral at the middle of each digit’s group. Nobody told the model which digit was which, yet digits of the same kind landed near each other. The groups overlap, and some digits (like 4 and 9) share a region. This is the intuition we’ll carry into language models: inputs with something in common can land in a shared region or direction of activation space.\n\nThe model is a variational autoencoder (VAE) with a 2D latent space; the two axes have no assigned meaning on their own. The images were computed ahead of time on a grid of points; nothing runs live. This is a digit model’s space, which need not behave like a language model’s activations.',
      },
    ],
  }),
  defineStage({
    id: 'recap-activations',
    title: 'Recap: activations',
    component: BulletsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'recap',
        label: 'Recap: activations',
        screen: {
          heading: 'Recap: Activations',
          bullets: [
            {
              text: 'An LLM’s **activations** are what it is currently “thinking about”. At each layer they form a vector in ℝⁿ, where n is usually in the thousands to tens of thousands.',
            },
            {
              text: 'The map from activations to outputs is **continuous**: changing the activations a tiny bit changes the output probabilities a tiny bit.',
            },
            { text: 'Activations contain **structure**!' },
          ],
        },
        caption:
          'Three ideas to carry into the rest of the talk.\n\nFirst, activations are the model’s internal state for a given input: one vector per layer and token position. Its size is the model’s width, from about a thousand numbers in small models to tens of thousands in the largest published ones (GPT-3’s is 12,288).\n\nSecond, the layers after any point are built from continuous operations, so a small nudge to the activations makes a small change to the probabilities of the next token. The chosen word can still flip when two options are nearly tied. This is what makes it sensible to move activations around on purpose.\n\nThird, as with the digits, inputs with something in common tend to land in related places. The rest of the talk looks for that structure in a real behavior: refusal.',
      },
    ],
  }),
  defineStage({
    id: 'linear-representations',
    title: 'Linear representations',
    component: BulletsStage,
    initialInteraction: undefined,
    steps: [
      {
        id: 'linear',
        label: 'Linear representations',
        screen: {
          heading: 'Linear Representations',
          bullets: [
            {
              text: 'Activation spaces have thousands of dimensions, and the model transforms them in highly **nonlinear** ways. In general, that is very hard to analyze.',
            },
            { text: 'By contrast, we are really good at **linear algebra** and at low-dimensional things.' },
            {
              text: 'As it turns out, many high-level concepts are represented roughly **linearly**: as directions in activation space!',
            },
          ],
        },
        caption:
          'The model’s computation is a long chain of nonlinear operations, and the points it produces can lie on curved, tangled surfaces inside a space with thousands of dimensions. Nobody can analyze that in general.\n\nWhat we can analyze well is linear structure: directions, projections, and dot products. The surprise, sometimes called the linear representation hypothesis, is that many concepts seem to correspond roughly to directions. Moving along the direction means “more of the concept”; projecting onto it measures how much of the concept is present.\n\nThis is an empirical pattern, not a law. It holds roughly, for many concepts studied so far, not for everything, and some features are known to be nonlinear (for example, circular representations of days of the week). The rest of the talk uses one such direction: refusal.',
      },
    ],
  }),
]
