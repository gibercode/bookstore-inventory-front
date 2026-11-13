import type { Book } from '@/types/book'
import { BookRow } from './BookRow'
import { SkeletonRows } from './SkeletonRows'
import styles from './styles.module.css'

type BooksTableProps = {
  books: Book[]
  isLoading: boolean
}

export const BooksTable = ({ books, isLoading }: BooksTableProps) => {
  const isFirstLoad = isLoading && books.length === 0

  return (
    <div className={styles.wrapper}>
      <table
        className={`${styles.table} ${isLoading ? styles.refreshing : ''}`}
        aria-busy={isLoading}
      >
        <caption className={styles.caption}>Libros del inventario</caption>
        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col">Autor</th>
            <th scope="col">ISBN</th>
            <th scope="col">Categoría</th>
            <th scope="col">País</th>
            <th scope="col">Costo</th>
            <th scope="col">Precio local</th>
            <th scope="col">Stock</th>
          </tr>
        </thead>
        <tbody>
          {isFirstLoad ? (
            <SkeletonRows />
          ) : (
            books.map((book) => <BookRow key={book.id} book={book} />)
          )}
        </tbody>
      </table>
    </div>
  )
}
