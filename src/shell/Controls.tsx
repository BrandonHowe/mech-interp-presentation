import type { useNavigation } from './useNavigation'
import * as Icon from './icons'
import styles from './Controls.module.css'

interface Props {
  nav: ReturnType<typeof useNavigation>
  captions: boolean
  onToggleCaptions: () => void
  /** Pointer is near the bottom edge. Keyboard focus also reveals the chip. */
  visible: boolean
}

/**
 * Floating chip: back, next, captions. Hidden until the pointer nears the bottom
 * edge (or a chip button has keyboard focus). Everything else is keyboard or
 * stage-owned.
 */
export function Controls({ nav, captions, onToggleCaptions, visible }: Props) {
  return (
    <nav className={styles.chip} data-visible={visible} aria-label="Presentation controls">
      <button
        className={styles.button}
        onClick={nav.back}
        disabled={nav.isFirst}
        aria-label="Previous step"
        title="Previous (←)"
      >
        <Icon.ArrowLeft />
      </button>
      <button
        className={styles.button}
        onClick={nav.next}
        disabled={nav.isLast}
        aria-label="Next step"
        title="Next (→)"
      >
        <Icon.ArrowRight />
      </button>
      <span className={styles.divider} aria-hidden="true" />
      <button
        className={styles.button}
        onClick={onToggleCaptions}
        aria-pressed={captions}
        aria-label="Captions"
        title="Captions (C)"
      >
        <Icon.Captions />
      </button>
    </nav>
  )
}
