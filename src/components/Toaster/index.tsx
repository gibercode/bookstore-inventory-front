import { useToastStore } from '@/store/toast'
import { CheckCircleIcon, CloseIcon, XCircleIcon } from '../Icons'
import styles from './styles.module.css'

export const Toaster = () => {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className={styles.region} aria-live="polite">
      {toasts.map(({ id, kind, message }) => (
        <div
          key={id}
          className={`${styles.toast} ${styles[kind]}`}
          role={kind === 'error' ? 'alert' : 'status'}
        >
          <span className={styles.icon}>
            {kind === 'success' ? (
              <CheckCircleIcon size={20} />
            ) : (
              <XCircleIcon size={20} />
            )}
          </span>
          <p className={styles.message}>{message}</p>
          <button
            type="button"
            className={styles.close}
            aria-label="Cerrar notificación"
            onClick={() => dismiss(id)}
          >
            <CloseIcon size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
