import type { CSSProperties, ReactNode } from "react"
import styles from "./rolling-text.module.css"

type RollingTextProps = {
  children: ReactNode
  hoverText?: string
  variant?: "subtle" | "default" | "strong"
  className?: string
}

function CharacterLine({ text, copy }: { text: string; copy: "primary" | "secondary" }) {
  return (
    <span className={`${styles.characterLine} ${styles[`${copy}Line`]}`}>
      {Array.from(text).map((character, index) => (
        <span
          key={`${character}-${index}`}
          className={`${styles.copy} ${styles[copy]}`}
          style={{ "--rolling-index": index } as CSSProperties}
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  )
}

export default function RollingText({ children, hoverText, variant = "default", className = "" }: RollingTextProps) {
  if (typeof children === "string" || typeof children === "number") {
    const text = String(children)

    if (hoverText) {
      return (
        <span className={`${styles.root} ${styles[variant]} ${styles.characterWave} ${className}`} aria-label={text}>
          <span aria-hidden="true" className={styles.alternate}>
            <CharacterLine text={text} copy="primary" />
            <CharacterLine text={hoverText} copy="secondary" />
          </span>
        </span>
      )
    }

    return (
      <span className={`${styles.root} ${styles[variant]} ${styles.characterWave} ${className}`} aria-label={text}>
        <span aria-hidden="true" className={styles.characters}>
          {Array.from(text).map((character, index) => (
            <span
              key={`${character}-${index}`}
              className={styles.character}
              style={{ "--rolling-index": index } as CSSProperties}
            >
              <span className={`${styles.copy} ${styles.primary}`}>{character === " " ? "\u00a0" : character}</span>
              <span className={`${styles.copy} ${styles.secondary}`}>{character === " " ? "\u00a0" : character}</span>
            </span>
          ))}
        </span>
      </span>
    )
  }

  return (
    <span className={`${styles.root} ${styles[variant]} ${className}`}>
      <span className={styles.track}>
        <span className={`${styles.copy} ${styles.primary}`}>{children}</span>
        <span className={`${styles.copy} ${styles.secondary}`} aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
