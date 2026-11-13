import type { ReactNode } from 'react'
import { formatInteger } from '@/utils/format'
import styles from './styles.module.css'

type Tone = 'neutral' | 'warn' | 'danger'

type StatCardProps = {
  label: string
  value: number | null
  hint: string
  pill?: string
  icon: ReactNode
  tone?: Tone
}

export const StatCard = ({
  label,
  value,
  hint,
  pill,
  icon,
  tone = 'neutral',
}: StatCardProps) => (
  <article className={styles.card}>
    <div className={styles.top}>
      <h3 className={styles.label}>{label}</h3>
      <span className={`${styles.icon} ${styles[tone]}`}>{icon}</span>
    </div>
    <p className={styles.value}>{value === null ? '—' : formatInteger(value)}</p>
    <div className={styles.footer}>
      {pill && <span className={`${styles.pill} ${styles[tone]}`}>{pill}</span>}
      <span className={styles.hint}>{hint}</span>
    </div>
  </article>
)
