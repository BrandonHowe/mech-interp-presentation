import type { StageProps } from '../../types'
import { Slide } from './common'
import { Collage } from './Collage'
import { SHOTS } from './data'

const ROWS = [
  [SHOTS.huggingFace, SHOTS.felonyBench, [SHOTS.helloEvaluators, SHOTS.viruses]],
  [SHOTS.selfReplicate, SHOTS.kimi],
]

/** Slide 2: a wall of unsettling recent headlines. */
export function WeirderStage({ step }: StageProps<undefined>) {
  return (
    <Slide heading={step.screen?.heading}>
      <Collage rows={ROWS} />
    </Slide>
  )
}
