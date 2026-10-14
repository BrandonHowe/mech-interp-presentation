import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'motion/react'
import styles from './common.module.css'
import { asset } from '../../lib/asset'

export const ease = [0.22, 1, 0.36, 1] as const

/** Heading over a full-height body area. Shared by every Part 1 slide. */
export function Slide({ heading, children, className }: { heading?: string; children: ReactNode; className?: string }) {
  return (
    <div className={styles.slide}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
      >
        {heading}
      </motion.h2>
      <div className={className ? `${styles.body} ${className}` : styles.body}>{children}</div>
    </div>
  )
}

/**
 * Fades its children in once `show` is true. Hidden content keeps its space,
 * so later steps never move earlier ones.
 */
export function Appear({
  show = true,
  delay = 0,
  className,
  style,
  children,
}: {
  show?: boolean
  delay?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.7, ease, delay: show ? delay : 0 }}
      aria-hidden={!show}
    >
      {children}
    </motion.div>
  )
}

export function Photo({
  src,
  alt,
  label,
  className,
  position,
}: {
  src: string
  alt: string
  label?: string
  className?: string
  /** CSS object-position, to keep the subject in frame when cropped. */
  position?: string
}) {
  return (
    <figure className={`${styles.photo} ${className ?? ''}`}>
      <img src={asset(src)} alt={alt} style={position ? { objectPosition: position } : undefined} draggable={false} />
      {label && <figcaption className={styles.photoLabel}>{label}</figcaption>}
    </figure>
  )
}
