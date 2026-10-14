import type { Column } from '../../types'

/** Simple line icons on a 48-unit grid, stroked in the current text color. */
const PATHS: Record<NonNullable<Column['icon']>, React.ReactNode> = {
  compass: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M31 17 L27 27 L17 31 L21 21 Z" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
    </>
  ),
  book: (
    <>
      <path d="M24 13 C19 10 12 10 7 12 V37 C12 35 19 35 24 38 C29 35 36 35 41 37 V12 C36 10 29 10 24 13 Z" />
      <path d="M24 13 V38" />
    </>
  ),
  people: (
    <>
      <circle cx="16" cy="17" r="6" />
      <circle cx="32" cy="17" r="6" />
      <path d="M5 38 C5 31 10 27 16 27 C22 27 27 31 27 38" />
      <path d="M21 38 C21 31 26 27 32 27 C38 27 43 31 43 38" />
    </>
  ),
}

export function CardIcon({ name, className }: { name: NonNullable<Column['icon']>; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  )
}
