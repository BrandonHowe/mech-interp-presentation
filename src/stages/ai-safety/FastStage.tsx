import type { StageProps } from '../../types'
import { Slide } from './common'
import { Collage } from './Collage'
import { SHOTS } from './data'

const ROWS = [
  [SHOTS.waitButWhy, SHOTS.chess],
  [SHOTS.researchIntern, SHOTS.buildsItself],
]

/** Slide 3: the "you are here" curve, human vs AI chess, and AI building AI. */
export function FastStage({ step }: StageProps<undefined>) {
  return (
    <Slide heading={step.screen?.heading}>
      <Collage rows={ROWS} stagger={0.25} />
    </Slide>
  )
}
