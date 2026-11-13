import type { StockLevel } from '@/types/book'
import { formatInteger, getStockLevel } from '@/utils/format'
import styles from './styles.module.css'

const LABELS: Record<StockLevel, string> = {
  ok: 'Disponible',
  low: 'Bajo',
  out: 'Agotado',
}

type StockBadgeProps = { quantity: number }

export const StockBadge = ({ quantity }: StockBadgeProps) => {
  const level = getStockLevel(quantity)
  return (
    <span className={`${styles.badge} ${styles[level]}`}>
      <span className={styles.quantity}>{formatInteger(quantity)}</span>
      {LABELS[level]}
    </span>
  )
}
