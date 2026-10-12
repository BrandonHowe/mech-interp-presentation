import type { SVGProps } from 'react'

const base: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const ArrowLeft = () => (
  <svg {...base}>
    <path d="M16 10H4M9 5l-5 5 5 5" />
  </svg>
)

export const ArrowRight = () => (
  <svg {...base}>
    <path d="M4 10h12M11 5l5 5-5 5" />
  </svg>
)

export const Captions = () => (
  <svg {...base}>
    <rect x="2.5" y="4" width="15" height="12" rx="2.5" />
    <path d="M6 9.5h5M6 12.5h3M13 12.5h1" />
  </svg>
)

export const Reset = () => (
  <svg {...base}>
    <path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5v3h3" />
  </svg>
)
