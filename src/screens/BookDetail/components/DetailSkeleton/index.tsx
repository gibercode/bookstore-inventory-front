import { Card, Skeleton } from '@/components'
import styles from './styles.module.css'

const Rows = ({ count }: { count: number }) => (
  <div className={styles.rows}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className={styles.row}>
        <Skeleton width="30%" height="12px" />
        <Skeleton width="24%" height="12px" />
      </div>
    ))}
  </div>
)

export const DetailSkeleton = () => (
  <div className={styles.wrapper} aria-busy="true" aria-label="Cargando libro">
    <div className={styles.header}>
      <Skeleton width="38%" height="28px" />
      <Skeleton width="20%" height="16px" />
    </div>
    <div className={styles.grid}>
      <Card title="Información">
        <Rows count={5} />
      </Card>
      <div className={styles.column}>
        <Card title="Inventario">
          <Rows count={2} />
        </Card>
        <Card title="Precio local">
          <Skeleton width="45%" height="32px" />
        </Card>
      </div>
    </div>
  </div>
)
