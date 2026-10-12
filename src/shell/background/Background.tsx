import styles from './Background.module.css'

/** Solid paper color with a faint, static dot lattice. */
export function Background() {
  return <div className={styles.background} aria-hidden="true" />
}
