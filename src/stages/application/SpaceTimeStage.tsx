import type { StageProps } from '../../types'
import { Slide } from '../ai-safety/common'
import { Collage } from '../ai-safety/Collage'

/*
 * Gurnee & Tegmark, "Language Models Represent Space and Time" (2023):
 * linear probes on Llama-2-70B activations predict where places are and
 * when people lived and works were made. Figures are from the paper.
 */
const SPACE = {
  src: '/images/applications/space-world.png',
  w: 1800,
  h: 767,
  alt: 'World map drawn only from linear probe predictions: each dot is a place, positioned where the probe predicts it is and colored by its true continent. The continents come out in roughly the right shapes and positions.',
}
const TIME = {
  src: '/images/applications/time-scatter.png',
  w: 996,
  h: 276,
  alt: 'Three scatter plots of linear probe predictions against true dates for historical figures’ deaths, artwork releases, and news headlines; the points hug the diagonal.',
}

/** Probes can read quantities, not just yes/no: the map above the timelines, no other text. */
export function SpaceTimeStage({ step }: StageProps<undefined>) {
  return (
    <Slide heading={step.screen?.heading}>
      <Collage rows={[[SPACE], [TIME]]} stagger={0.3} />
    </Slide>
  )
}
