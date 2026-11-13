import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { CloseIcon } from "../Icons";
import styles from "./styles.module.css";

type ModalProps = {
  title: string;
  onClose: () => void;
  dismissible?: boolean;
  children: ReactNode;
};

export const Modal = ({
  title,
  onClose,
  dismissible = true,
  children,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (dismissible && event.target === event.currentTarget) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClick={handleBackdropClick}
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      onClose={onClose}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label="Cerrar"
            disabled={!dismissible}
            onClick={onClose}
          >
            <CloseIcon size={18} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
};
