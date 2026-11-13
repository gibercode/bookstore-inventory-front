import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { APP_NAME } from '@/constants/common'
import { BooksIcon } from '../Icons'
import { Toaster } from '../Toaster'
import styles from './styles.module.css'

type DashboardLayoutProps = { children: ReactNode }

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { pathname } = useLocation()
  const isBooks = pathname === '/' || pathname.startsWith('/books')

  return (
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
        <Link
          to="/"
          className={styles.link}
          aria-current={isBooks ? 'page' : undefined}
        >
          <BooksIcon size={20} />
          Libros
        </Link>
      </nav>
    </aside>
    <main className={styles.main}>{children}</main>
    <Toaster />
  </div>
  )
}
