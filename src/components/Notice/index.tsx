import type { ReactNode } from 'react'
import styles from './styles.module.css'

type NoticeProps = {
  title: string
  children?: ReactNode
  action?: ReactNode
  tone?: 'neutral' | 'error'
}

export const Notice = ({
  title,
  children,
  action,
  tone = 'neutral',
}: NoticeProps) => (
  <div
    className={`${styles.notice} ${styles[tone]}`}
    role={tone === 'error' ? 'alert' : 'status'}
  >
    <p className={styles.title}>{title}</p>
    {children && <p className={styles.text}>{children}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
)
