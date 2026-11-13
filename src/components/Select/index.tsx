import type { SelectHTMLAttributes } from 'react'
import { ChevronDownIcon } from '../Icons'
import styles from './styles.module.css'

type Option = { value: string; label: string }

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  label: string
  options: Option[]
  active?: boolean
  onChange: (value: string) => void
}

export const Select = ({
  label,
  options,
  active,
  onChange,
  ...props
}: SelectProps) => (
  <span className={`${styles.field} ${active ? styles.active : ''}`}>
    <select
      className={styles.select}
      aria-label={label}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDownIcon size={16} className={styles.chevron} />
  </span>
)
