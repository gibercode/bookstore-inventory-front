import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { Modal } from '../Modal'
import styles from './styles.module.css'

type ConfirmModalProps = {
  title: string
  children: ReactNode
  confirmLabel: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmModal = ({
  title,
  children,
  confirmLabel,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // En acciones destructivas el foco inicial va en «Cancelar».
  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  return (
    <Modal title={title} size="sm" onClose={onClose} dismissible={!loading}>
      <p className={styles.message}>{children}</p>
      <footer className={styles.actions}>
        <Button ref={cancelRef} disabled={loading} onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </footer>
    </Modal>
  )
}
