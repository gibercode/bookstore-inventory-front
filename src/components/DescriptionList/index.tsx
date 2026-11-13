import type { ReactNode } from 'react'
import styles from './styles.module.css'

type Item = { label: string; value: ReactNode }

type DescriptionListProps = { items: Item[] }

export const DescriptionList = ({ items }: DescriptionListProps) => (
  <dl className={styles.list}>
    {items.map(({ label, value }) => (
      <div key={label} className={styles.row}>
        <dt className={styles.label}>{label}</dt>
        <dd className={styles.value}>{value}</dd>
      </div>
    ))}
  </dl>
)
