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
      },
      {
        id: 'weights',
        label: 'Weights',
        screen: {
          heading: 'Weights',
          body: 'A trained LLM is characterized by its weights, a set of trained parameters.',
        },
      },
      {
        id: 'activations',
        label: 'Activations',
        screen: {
          heading: 'Activations',
          body: 'An input is combined with the weights to produce **activations**, which flow through the model and become the output.',
        },
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
          body: "Activations are more relevant when we're trying to analyze what a model is thinking!",
        },
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
          body: 'Because activations are just points in ℝⁿ, we can analyze them using tools from geometry!',
        },
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
              text: 'Activations contain **structure**!',
              points: [
                'The map from activations to outputs is **continuous**: changing the activations a tiny bit changes the output probabilities a tiny bit.',
              ],
            },
          ],
        },
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
      },
    ],
  }),
]
