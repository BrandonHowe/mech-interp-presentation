import { motion } from 'motion/react'
import type { StageProps } from '../../types'
import { Inline } from '../Inline'
import styles from './RefusalQuestionStage.module.css'

const ease = [0.22, 1, 0.36, 1] as const

/**
 * Steps: 'chat' shows two illustrative exchanges (columns: title = request,
 * body = reply; id 'refused' marks the refusal). 'question' quiets them and
 * reveals the subheading. Both steps share one screen so nothing re-lays out.
 */
export function RefusalQuestionStage({ step }: StageProps<undefined>) {
  const { heading, columns = [], subheading, body } = step.screen ?? {}
  const asking = step.id === 'question'

  return (
    <div className={styles.layout}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
      >
        {heading}
      </motion.h2>

      <motion.div
        className={styles.chats}
        initial={false}
        animate={{ opacity: asking ? 0.45 : 1, scale: asking ? 0.94 : 1 }}
        transition={{ duration: 0.7, ease }}
      >
        {columns.map((c, i) => {
          const refused = c.id === 'refused'
          return (
            <motion.div
              key={c.id}
              className={styles.chat}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.4 + i * 0.5 }}
            >
              <p className={styles.user}>{c.title}</p>
              <motion.div
                className={styles.reply}
                data-refused={refused}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.75 + i * 0.5 }}
              >
                <p>{c.body}</p>
                <span className={styles.tag}>
                  <svg viewBox="-8 -8 16 16" aria-hidden="true">
                    {refused ? (
                      <path d="M0 -7 L6.1 3.6 L-6.1 3.6 Z" fill="var(--group-a)" />
                    ) : (
                      <circle r="5.5" fill="var(--group-b)" />
                    )}
                  </svg>
                  {refused ? 'Refused' : 'Answered'}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div
        className={styles.question}
        initial={false}
        animate={{ opacity: asking ? 1 : 0, y: asking ? 0 : 12 }}
        transition={{ duration: 0.8, ease, delay: asking ? 0.25 : 0 }}
        aria-hidden={!asking}
      >
        {subheading && <p className={styles.questionText}>{subheading}</p>}
        {body && (
          <p className={styles.questionBody}>
            <Inline text={body} />
          </p>
        )}
      </motion.div>
    </div>
  )
}
