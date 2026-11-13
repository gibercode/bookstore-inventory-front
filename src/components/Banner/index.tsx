import type { ReactNode } from 'react'
import styles from './styles.module.css'

type BannerProps = {
  children: ReactNode
  onDismiss: () => void
}

export const Banner = ({ children, onDismiss }: BannerProps) => (
  <div className={styles.banner} role="status">
    <p className={styles.text}>{children}</p>
    <button type="button" className={styles.dismiss} onClick={onDismiss}>
      Cerrar
    </button>
  </div>
)
