import { useLayoutEffect, useRef, useState } from 'react'
import { Appear } from './common'
import styles from './Collage.module.css'
import { asset } from '../../lib/asset'

export interface ShotImage {
  src: string
  /** Pixel size, for the aspect ratio. */
  w: number
  h: number
  alt: string
}

/** One image, or several stacked in a column at a shared width. */
export type CollageCell = ShotImage | ShotImage[]

/*
 * Rows of screenshots laid out like a justified photo gallery: every image
 * in a row has the same height, rows share one width, and the whole collage
 * is scaled to the largest size that fits its box. Sizes are computed from
 * each image's pixel dimensions, so nothing is cropped or stretched.
 */
export function Collage({
  rows,
  show = true,
  shown = Infinity,
  delay = 0.3,
  stagger = 0.15,
  className,
}: {
  rows: CollageCell[][]
  show?: boolean
  /** Show only the first n cells; the rest keep their space but stay hidden. */
  shown?: number
  delay?: number
  stagger?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ width: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const layout = box && fit(rows, box.width, box.height)
  let index = 0

  return (
    <div ref={ref} className={className ? `${styles.collage} ${className}` : styles.collage}>
      {layout && (
        <div className={styles.rows} style={{ gap: layout.gap }}>
          {rows.map((row, r) => (
            <div key={r} className={styles.row} style={{ gap: layout.gap }}>
              {row.map((cell, c) => {
                const size = layout.cells[r][c]
                const images = Array.isArray(cell) ? cell : [cell]
                const i = index++
                return (
                  <Appear
                    key={images[0].src}
                    show={show && i < shown}
                    delay={delay + i * stagger}
                    className={styles.cell}
                    style={{ width: size.width, gap: layout.gap }}
                  >
                    {images.map((image) => (
                      <img
                        key={image.src}
                        className={styles.image}
                        src={asset(image.src)}
                        alt={image.alt}
                        draggable={false}
                        style={{ width: size.width, height: (size.width * image.h) / image.w }}
                      />
                    ))}
                  </Appear>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * A row's width is linear in its height h: width = a * h + b. Justify every
 * row to the same width, then pick the largest width at which the rows'
 * total height still fits.
 */
function fit(rows: CollageCell[][], boxWidth: number, boxHeight: number) {
  const gap = Math.max(8, Math.min(28, boxWidth * 0.018))
  const lines = rows.map((row) => {
    let a = 0
    let b = (row.length - 1) * gap
    for (const cell of row) {
      const images = Array.isArray(cell) ? cell : [cell]
      // A stack of n images at width w is sum(w * h_i / w_i) + (n - 1) * gap tall.
      const tallness = images.reduce((sum, image) => sum + image.h / image.w, 0)
      a += 1 / tallness
      b -= ((images.length - 1) * gap) / tallness
    }
    return { a, b }
  })
  // Row height at shared width T is (T - b) / a; total height is linear in T.
  const slope = lines.reduce((sum, l) => sum + 1 / l.a, 0)
  const offset = lines.reduce((sum, l) => sum - l.b / l.a, 0) + (rows.length - 1) * gap
  const width = Math.max(0, Math.min(boxWidth, (boxHeight - offset) / slope))

  const cells = rows.map((row, r) => {
    const height = (width - lines[r].b) / lines[r].a
    return row.map((cell) => {
      const images = Array.isArray(cell) ? cell : [cell]
      const tallness = images.reduce((sum, image) => sum + image.h / image.w, 0)
      return { width: (height - (images.length - 1) * gap) / tallness }
    })
  })
  return { gap, cells }
}
