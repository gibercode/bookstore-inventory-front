import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import styles from './styles.module.css'

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
}

export const TextField = ({
  label,
  error,
  hint,
  className,
  ...props
}: TextFieldProps) => {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={`${styles.field} ${className ?? ''}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={styles.control}
        aria-invalid={error ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...props}
      />
      {message && (
        <p
          id={messageId}
          className={error ? styles.error : styles.hint}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  )
}
