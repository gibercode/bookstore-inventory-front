import { ORDERING_OPTIONS } from '@/constants/books'
import type { BookOrdering } from '@/types/book'
import { ChevronDownIcon } from '../Icons'
import styles from './styles.module.css'

type SortSelectProps = {
  value: BookOrdering
  onChange: (value: BookOrdering) => void
}

export const SortSelect = ({ value, onChange }: SortSelectProps) => (
  <label className={styles.field}>
    <span className={styles.label}>Ordenar por:</span>
    <span className={styles.control}>
      <select
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value as BookOrdering)}
      >
        {ORDERING_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDownIcon size={16} className={styles.chevron} />
    </span>
  </label>
)
