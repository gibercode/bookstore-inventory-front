import { useId } from 'react'
import { Card, ChevronDownIcon } from '@/components'
import { useDisclosure } from '@/hooks/useDisclosure'
import type { PriceCalculation } from '@/types/book'
import {
  formatDateTime,
  formatLocal,
  formatRate,
  formatUsd,
} from '@/utils/format'
import styles from './styles.module.css'

type CalculationCardProps = { calculation: PriceCalculation }

export const CalculationCard = ({ calculation }: CalculationCardProps) => {
  const details = useDisclosure()
  const panelId = useId()
  const items = [
    { label: 'Costo (USD)', value: formatUsd(calculation.cost_usd) },
    {
      label: 'Tasa de cambio',
      value: `${formatRate(calculation.exchange_rate)} ${calculation.currency}/USD`,
    },
    {
      label: 'Costo en moneda local',
      value: formatLocal(calculation.cost_local),
    },
    { label: 'Margen', value: `${calculation.margin_percentage}%` },
    {
      label: 'Precio de venta',
      value: formatLocal(calculation.selling_price_local),
    },
    {
      label: 'Calculado',
      value: formatDateTime(calculation.calculation_timestamp),
    },
  ]

  return (
    <Card
      title="Detalle del cálculo"
      collapsed={!details.isOpen}
      actions={
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={details.isOpen}
          aria-controls={panelId}
          onClick={details.toggle}
        >
          {details.isOpen ? 'Ocultar' : 'Ver detalle'}
          <ChevronDownIcon
            size={16}
            className={`${styles.chevron} ${details.isOpen ? styles.open : ''}`}
          />
        </button>
      }
    >
      {details.isOpen && (
        <div id={panelId}>
          {calculation.rate_source === 'default' && (
            <p className={styles.warning} role="status">
              No se pudo consultar la tasa de cambio actual; se usó la tasa por
              defecto.
            </p>
          )}
          <dl className={styles.grid}>
            {items.map(({ label, value }) => (
              <div key={label} className={styles.item}>
                <dt className={styles.label}>{label}</dt>
                <dd className={styles.value}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </Card>
  )
}
