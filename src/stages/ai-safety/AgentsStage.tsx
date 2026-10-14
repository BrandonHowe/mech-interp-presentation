import type { StageProps } from '../../types'
import { Slide } from './common'
import { Collage } from './Collage'
import { PHOTOS, SHOTS } from './data'

/*
 * Slide 4: from question answering to acting. On the left, ChatGPT deploying
 * apps and reporting back, then sixteen agents building a compiler (2026);
 * on the right, a robot.
 */
const ROWS = [[[SHOTS.chatgptAgent, SHOTS.agentSwarm], PHOTOS.optimus]]

export function AgentsStage({ step }: StageProps<undefined>) {
  return (
    <Slide heading={step.screen?.heading}>
      <Collage rows={ROWS} stagger={0.4} />
    </Slide>
  )
}
