import { formatInteger } from "@/utils/format";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "../Icons";
import styles from "./styles.module.css";

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions: number[];
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const getPageItems = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const items: (number | "gap")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push("gap");
  for (let value = start; value <= end; value += 1) items.push(value);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);
  return items;
};

export const Pagination = ({
  page,
  pageSize,
  totalItems,
  pageSizeOptions,
  disabled,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <nav className={styles.pagination} aria-label="Paginación">
      <div className={styles.size}>
        <label className={styles.sizeLabel}>
          Mostrar
          <span className={styles.sizeControl}>
            <select
              className={styles.sizeSelect}
              value={pageSize}
              disabled={disabled}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDownIcon size={14} className={styles.sizeChevron} />
          </span>
          por página
        </label>
        <span className={styles.range}>
          {formatInteger(from)}–{formatInteger(to)} de {formatInteger(totalItems)}
        </span>
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.item}
          aria-label="Primera página"
          disabled={disabled || atStart}
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeftIcon size={16} />
        </button>
        <button
          type="button"
          className={styles.item}
          aria-label="Página anterior"
          disabled={disabled || atStart}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon size={16} />
        </button>
        {getPageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className={styles.gap}>
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${styles.item} ${item === page ? styles.current : ""}`}
              aria-current={item === page ? "page" : undefined}
              disabled={disabled}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          className={styles.item}
          aria-label="Página siguiente"
          disabled={disabled || atEnd}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRightIcon size={16} />
        </button>
        <button
          type="button"
          className={styles.item}
          aria-label="Última página"
          disabled={disabled || atEnd}
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRightIcon size={16} />
        </button>
      </div>
    </nav>
  );
};
