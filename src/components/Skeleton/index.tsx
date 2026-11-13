import styles from './styles.module.css'

type SkeletonProps = { width?: string; height?: string }

export const Skeleton = ({ width = '100%', height = '12px' }: SkeletonProps) => (
  <span
    className={styles.skeleton}
    style={{ width, height }}
    aria-hidden="true"
  />
)
