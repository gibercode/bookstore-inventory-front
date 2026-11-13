import type { ReactNode } from 'react'
import { APP_NAME } from '@/constants/common'
import { BooksIcon } from '../Icons'
import styles from './styles.module.css'

type DashboardLayoutProps = { children: ReactNode }

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className={styles.layout}>
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.mark}>
          <BooksIcon size={20} strokeWidth={2.2} />
        </span>
        <span className={styles.name}>{APP_NAME}</span>
      </div>
      <p className={styles.section}>Principal</p>
      <nav aria-label="Principal">
        <a href="/" className={styles.link} aria-current="page">
          <BooksIcon size={20} />
          Libros
        </a>
      </nav>
    </aside>
    <main className={styles.main}>{children}</main>
  </div>
)
