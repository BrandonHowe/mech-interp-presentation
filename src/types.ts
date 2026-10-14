import type { ComponentType } from 'react'

/** Copy shown on screen in both viewing modes. Keep it minimal. */
export interface ScreenCopy {
  eyebrow?: string
  heading?: string
  body?: string
  bullets?: Bullet[]
  /** Show only the first n bullets; the rest keep their space but stay invisible. */
  reveal?: number
  /** Split the bullets into this many columns, filled top to bottom. */
  bulletColumns?: number
  /** Side-by-side items, e.g. two contrasting approaches. */
  columns?: Column[]
  /** Secondary heading, e.g. a question introducing the bullets. */
  subheading?: string
  scale?: ScaleComparison
  figure?: Figure
}

export interface Figure {
  /** Path under /public, e.g. '/images/x.png'. */
  src: string
  alt: string
  credit?: string
}

/** Two quantities compared on a log scale. Values must be sourced or labeled. */
export interface ScaleComparison {
  items: { value: number; display: string; label: string }[]
  note?: string
}

export interface Column {
  id: string
  title: string
  body: string
  /** Small label under the column's figure. */
  figureNote?: string
  /** Line icon drawn above the title (CardsStage). */
  icon?: 'compass' | 'book' | 'people'
}

export interface Bullet {
  /** `**bold**` is supported. */
  text: string
  /** Indented supporting points beneath this bullet (italic asides in BulletsStage). */
  sub?: string[]
  /** Indented sub-bullets with a hollow dot; `**bold**` is supported. */
  points?: string[]
}

/** One authored narrative step. Its id is stable and appears in the URL. */
export interface StepDef {
  id: string
  /** Short name used in captions and navigation. */
  label: string
  screen?: ScreenCopy
  /** Self-guided explanation. Blank lines separate paragraphs. */
  caption?: string
  /** Presenter notes; not displayed yet. */
  notes?: string
}

export interface StageProps<I> {
  step: StepDef
  /** Every step of this stage, so components can reserve space for all of them. */
  steps: StepDef[]
  stepIndex: number
  interaction: I
  setInteraction: (next: I) => void
  /** Restore this stage's authored interaction defaults. */
  resetInteraction: () => void
}

/**
 * A stage owns one visual composition that stays mounted while its steps change.
 * The component derives its visual state from the current step and interaction
 * state, never from the history of previous steps.
 */
export interface StageDef<I = undefined> {
  id: string
  title: string
  steps: StepDef[]
  component: ComponentType<StageProps<I>>
  initialInteraction: I
  /**
   * 'dramatic': entering or leaving this stage fades the old stage out
   * completely, slowly, before the new one fades in. Default is a quicker
   * overlapping slide-and-fade.
   */
  transition?: 'default' | 'dramatic'
  /**
   * Palette for the whole screen while this stage is shown; changes fade.
   * 'dark' is for part titles; 'dusk', 'night', and 'abyss' darken step by
   * step through Part 1's risk slides.
   */
  theme?: Theme
}

export type Theme = 'light' | 'dusk' | 'night' | 'abyss' | 'dark'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyStage = StageDef<any>

export const defineStage = <I,>(stage: StageDef<I>): AnyStage => stage
