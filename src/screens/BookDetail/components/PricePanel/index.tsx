import { Button, CalculatorIcon, Card } from '@/components'
import type { RequestStatus } from '@/types/api'
import type { Book } from '@/types/book'
import { formatLocal } from '@/utils/format'
import styles from './styles.module.css'

type PricePanelProps = {
  book: Book
  status: RequestStatus
  onCalculate: () => void
}

export const PricePanel = ({
  book,
  status,
  onCalculate,
}: PricePanelProps) => {
  const isCalculating = status === 'loading'
  const hasPrice = book.selling_price_local !== null

  return (
    <Card
      title="Precio local"
      actions={
        <Button
          variant={hasPrice ? 'ghost' : 'primary'}
          onClick={onCalculate}
          loading={isCalculating}
        >
          {!isCalculating && <CalculatorIcon size={16} />}
          {isCalculating
            ? 'Calculando…'
            : hasPrice
              ? 'Recalcular'
              : 'Calcular precio'}
        </Button>
      }
    >
      <p className={styles.price}>{formatLocal(book.selling_price_local)}</p>
      {!hasPrice && (
        <p className={styles.muted}>
          Todavía no se calculó el precio de venta de este libro.
        </p>
      )}

    </Card>
  )
}
