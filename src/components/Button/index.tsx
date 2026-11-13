import type { ButtonHTMLAttributes } from 'react'
import styles from './styles.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export const Button = ({
  variant = 'ghost',
  className,
  type = 'button',
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={[styles.button, styles[variant], className]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
)
