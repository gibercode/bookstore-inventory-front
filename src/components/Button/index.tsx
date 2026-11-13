import type { ButtonHTMLAttributes } from 'react'
import { Spinner } from '../Spinner'
import styles from './styles.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  loading?: boolean
}

export const Button = ({
  variant = 'ghost',
  loading = false,
  className,
  type = 'button',
  disabled,
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={[styles.button, styles[variant], className]
      .filter(Boolean)
      .join(' ')}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {...props}
  >
    {loading && <Spinner />}
    {children}
  </button>
)
