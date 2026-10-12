import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './Reserve.module.css'

/*
 * Pre-allocates space for content that changes between steps. Every distinct
 * variant is rendered in the same grid cell, so the slot is always as large
 * as its largest variant and nothing around it moves; only the current one
 * is visible.
 */
export function Reserve<T>({
  items,
  current,
  getKey,
  children,
  className,
}: {
  items: T[]
  current: T
  /** Variants with equal keys are rendered once and don't crossfade. */
  getKey: (item: T) => string
  children: (item: T) => ReactNode
  className?: string
}) {
  const currentKey = getKey(current)
  const unique = new Map<string, T>()
  for (const item of items) if (!unique.has(getKey(item))) unique.set(getKey(item), item)
  // The current variant renders its own (possibly newer) props.
  unique.set(currentKey, current)

  return (
    <div className={className ? `${styles.reserve} ${className}` : styles.reserve}>
      {[...unique].map(([key, item]) => {
        const active = key === currentKey
        return (
          <motion.div
            key={key}
            className={styles.cell}
            initial={false}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.35, delay: active ? 0.15 : 0 }}
            aria-hidden={!active}
            inert={!active}
          >
            {children(item)}
          </motion.div>
        )
      })}
    </div>
  )
}
