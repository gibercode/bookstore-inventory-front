import type { CSSProperties, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Book } from "@/types/book";
import { formatLocal, formatUsd, getCategoryColor } from "@/utils/format";
import { StockBadge } from "../StockBadge";
import styles from "./styles.module.css";

type BookRowProps = { book: Book };

export const BookRow = ({ book }: BookRowProps) => {
  const navigate = useNavigate();
  const path = `/books/${book.id}`;

  const handleRowClick = (event: MouseEvent<HTMLTableRowElement>) => {
    if (!(event.target as HTMLElement).closest("a")) void navigate(path);
  };

  return (
    <tr className={styles.clickable} onClick={handleRowClick}>
      <th scope="row" className={styles.title}>
        <Link to={path} className={styles.titleLink}>
          {book.title}
        </Link>
      </th>
      <td className={styles.ellipsis}>{book.author}</td>
      <td className={styles.numbers}>{book.isbn}</td>
      <td>
        <span className={styles.category}>
          <span
            className={styles.dot}
            style={
              { "--dot": getCategoryColor(book.category) } as CSSProperties
            }
            aria-hidden="true"
          />
          {book.category}
        </span>
      </td>
      <td>{book.supplier_country}</td>
      <td className={styles.numbers}>{formatUsd(book.cost_usd)}</td>
      <td className={styles.numbers}>
        {formatLocal(book.selling_price_local)}
      </td>
      <td>
        <StockBadge quantity={book.stock_quantity} />
      </td>
    </tr>
  );
};
