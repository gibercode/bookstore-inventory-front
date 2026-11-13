import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from '../Icons'
import fieldStyles from '../TextField/styles.module.css'
import styles from './styles.module.css'

type Option = { value: string; label: string }

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  options: Option[]
  placeholder: string
  error?: string
  hint?: string
}

export const SelectField = ({
  label,
  options,
  placeholder,
  error,
  hint,
  className,
  ...props
}: SelectFieldProps) => {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={`${fieldStyles.field} ${className ?? ''}`}>
      <label htmlFor={id} className={fieldStyles.label}>
        {label}
      </label>
      <span className={styles.wrapper}>
        <select
          id={id}
          className={`${fieldStyles.control} ${styles.select}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon size={16} className={styles.chevron} />
      </span>
      {message && (
        <p
          id={messageId}
          className={error ? fieldStyles.error : fieldStyles.hint}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  )
}
