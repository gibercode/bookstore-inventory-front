import styles from './styles.module.css'

type SpinnerProps = { size?: number }

export const Spinner = ({ size = 16 }: SpinnerProps) => (
  <span
    className={styles.spinner}
    style={{ width: size, height: size }}
    aria-hidden="true"
  />
)
