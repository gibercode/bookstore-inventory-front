import styles from './styles.module.css'

const COLUMNS = 8

type SkeletonRowsProps = { rows?: number }

export const SkeletonRows = ({ rows = 8 }: SkeletonRowsProps) => (
  <>
    {Array.from({ length: rows }, (_, row) => (
      <tr key={row} aria-hidden="true">
        {Array.from({ length: COLUMNS }, (_, column) => (
          <td key={column}>
            <span className={styles.skeleton} />
          </td>
        ))}
      </tr>
    ))}
  </>
)
