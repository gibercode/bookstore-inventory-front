import type { ReactNode } from 'react'
import styles from './styles.module.css'

type CardProps = {
  title?: string
  actions?: ReactNode
  collapsed?: boolean
  children?: ReactNode
}

export const Card = ({ title, actions, collapsed, children }: CardProps) => (
  <section className={styles.card}>
    {(title || actions) && (
      <header
        className={`${styles.header} ${collapsed ? styles.flush : ''}`}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        {actions}
      </header>
    )}
    {children}
  </section>
)
