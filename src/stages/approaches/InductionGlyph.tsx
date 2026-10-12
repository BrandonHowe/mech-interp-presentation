import styles from './ApproachesStage.module.css'

/*
 * Our own schematic of the induction-head circuit (Olsson et al., 2022,
 * "In-context Learning and Induction Heads"). Given "… A B … A", the model
 * predicts B: a previous-token head at B records "the token before me was A";
 * an induction head at the second A attends to that B and copies it forward.
 */

const Y = 58
const H = 22
const W = 26
const TOKENS = [
  { x: 6, text: 'A' },
  { x: 40, text: 'B' },
  { x: 74, text: '…', bare: true },
  { x: 108, text: 'A' },
]
const PRED_X = 168
const cx = (x: number) => x + W / 2

export function InductionGlyph() {
  const a1 = cx(TOKENS[0].x)
  const b1 = cx(TOKENS[1].x)
  const a2 = cx(TOKENS[3].x)

  return (
    <svg className={`${styles.glyph} ${styles.inductionGlyph}`} viewBox="0 0 200 112" aria-hidden="true">
      {/* Induction head: second A attends to the B that followed the first A. */}
      <path className={styles.inductionArc} d={`M${a2} ${Y - 2} C ${a2 - 10} ${Y - 46}, ${b1 + 10} ${Y - 46}, ${b1} ${Y - 4}`} />
      <path className={styles.inductionHead} d={`M${b1} ${Y - 2} l-4 -8 l8 0 Z`} />
      <text className={styles.glyphLabel} x={(a2 + b1) / 2} y={Y - 40}>
        induction head
      </text>

      {/* Previous-token head: B attends to the token before it. */}
      <path className={styles.prevArc} d={`M${b1} ${Y + H + 2} C ${b1 - 4} ${Y + H + 20}, ${a1 + 4} ${Y + H + 20}, ${a1} ${Y + H + 4}`} />
      <path className={styles.prevHead} d={`M${a1} ${Y + H + 2} l-3.5 7 l7 0 Z`} />
      <text className={styles.glyphLabelSoft} x={(a1 + b1) / 2} y={Y + H + 28}>
        previous-token head
      </text>

      {TOKENS.map((t, i) =>
        t.bare ? (
          <text key={i} className={styles.tokenText} x={cx(t.x)} y={Y + H / 2}>
            {t.text}
          </text>
        ) : (
          <g key={i}>
            <rect className={styles.token} x={t.x} y={Y} width={W} height={H} rx={5} />
            <text className={styles.tokenText} x={cx(t.x)} y={Y + H / 2}>
              {t.text}
            </text>
          </g>
        ),
      )}

      {/* Prediction */}
      <path className={styles.predArrow} d={`M${TOKENS[3].x + W + 6} ${Y + H / 2} L${PRED_X - 6} ${Y + H / 2}`} />
      <path className={styles.inductionHead} d={`M${PRED_X - 4} ${Y + H / 2} l-7 -4 l0 8 Z`} />
      <rect className={styles.tokenPred} x={PRED_X} y={Y} width={W} height={H} rx={5} />
      <text className={styles.tokenPredText} x={cx(PRED_X)} y={Y + H / 2}>
        B
      </text>
    </svg>
  )
}
