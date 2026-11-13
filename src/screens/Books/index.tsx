import { useEffect } from 'react'
import {
  AlertIcon,
  BooksIcon,
  BooksTable,
  BoxIcon,
  Button,
  Card,
  FilterIcon,
  Notice,
  Pagination,
  RefreshIcon,
  Select,
  SortSelect,
  StatCard,
  TagIcon,
} from '@/components'
import { LOW_STOCK_THRESHOLD, PAGE_SIZE } from '@/constants/common'
import { useBooksStore } from '@/store/books'
import { useCategoriesStore } from '@/store/categories'
import { useStatsStore } from '@/store/stats'
import type { BookFilter } from '@/types/book'
import type { Category } from '@/types/category'
import { formatInteger } from '@/utils/format'
import styles from './styles.module.css'

const getCardTitle = (filter: BookFilter, categories: Category[]) => {
  switch (filter.kind) {
    case 'category':
      return categories.find(({ id }) => id === filter.categoryId)?.name ?? 'Categoría'
    case 'low-stock':
      return 'Stock bajo'
    case 'none':
      return 'Todos los libros'
  }
}

const toPercent = (part: number | null, total: number | null) =>
  part === null || !total ? undefined : `${Math.round((part / total) * 100)}%`

export const Books = () => {
  const books = useBooksStore((state) => state.books)
  const totalItems = useBooksStore((state) => state.totalItems)
  const status = useBooksStore((state) => state.status)
  const error = useBooksStore((state) => state.error)
  const filter = useBooksStore((state) => state.filter)
  const ordering = useBooksStore((state) => state.ordering)
  const page = useBooksStore((state) => state.page)
  const fetchBooks = useBooksStore((state) => state.fetchBooks)
  const setCategoryFilter = useBooksStore((state) => state.setCategoryFilter)
  const toggleLowStockFilter = useBooksStore(
    (state) => state.toggleLowStockFilter,
  )
  const clearFilter = useBooksStore((state) => state.clearFilter)
  const setOrdering = useBooksStore((state) => state.setOrdering)
  const setPage = useBooksStore((state) => state.setPage)

  const categories = useCategoriesStore((state) => state.categories)
  const categoriesStatus = useCategoriesStore((state) => state.status)
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories)

  const stats = useStatsStore()
  const { fetchStats } = stats

  useEffect(() => {
    void fetchBooks()
    void fetchCategories()
    void fetchStats()
  }, [fetchBooks, fetchCategories, fetchStats])

  const refresh = () => {
    void fetchBooks()
    void fetchStats()
  }

  const isLoading = status === 'loading' || status === 'idle'
  const hasFilter = filter.kind !== 'none'
  const hasError = status === 'error'
  const isEmpty = status === 'success' && books.length === 0
  const isLowStock = filter.kind === 'low-stock'

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Libros</h1>
          <p className={styles.subtitle}>
            Consulta el catálogo y vigila las existencias de tu librería.
          </p>
        </div>
        <Button onClick={refresh} disabled={isLoading}>
          <RefreshIcon size={16} />
          Actualizar
        </Button>
      </header>

      <div className={styles.stats}>
        <StatCard
          label="Títulos"
          value={stats.total}
          pill={
            stats.total === null || stats.outOfStock === null
              ? undefined
              : `${formatInteger(stats.total - stats.outOfStock)} con stock`
          }
          hint="en el inventario"
          icon={<BooksIcon />}
        />
        <StatCard
          label="Categorías"
          value={categoriesStatus === 'success' ? categories.length : null}
          hint="registradas"
          icon={<TagIcon />}
        />
        <StatCard
          label="Stock bajo"
          value={stats.lowStock}
          pill={toPercent(stats.lowStock, stats.total)}
          hint={`${LOW_STOCK_THRESHOLD} unidades o menos`}
          icon={<AlertIcon />}
          tone="warn"
        />
        <StatCard
          label="Agotados"
          value={stats.outOfStock}
          pill={toPercent(stats.outOfStock, stats.total)}
          hint="sin existencias"
          icon={<BoxIcon />}
          tone="danger"
        />
      </div>

      <div className={styles.filters}>
        <p className={styles.summary} aria-live="polite">
          {status === 'success'
            ? `${formatInteger(totalItems)} ${totalItems === 1 ? 'libro' : 'libros'}`
            : ''}
          {hasFilter && (
            <button type="button" className={styles.clear} onClick={clearFilter}>
              Quitar filtro
            </button>
          )}
        </p>
        <div className={styles.chips} role="group" aria-label="Filtros">
          <Select
            label="Filtrar por categoría"
            active={filter.kind === 'category'}
            value={filter.kind === 'category' ? filter.categoryId : ''}
            onChange={setCategoryFilter}
            options={[
              { value: '', label: 'Categoría' },
              ...categories.map(({ id, name }) => ({ value: id, label: name })),
            ]}
          />
          <Button
            aria-pressed={isLowStock}
            variant={isLowStock ? 'primary' : 'ghost'}
            onClick={toggleLowStockFilter}
          >
            Stock bajo
          </Button>
          <Button
            aria-label="Quitar filtro"
            disabled={!hasFilter}
            onClick={clearFilter}
          >
            <FilterIcon size={18} />
          </Button>
        </div>
      </div>

      <Card
        title={getCardTitle(filter, categories)}
        actions={
          hasFilter ? undefined : (
            <SortSelect value={ordering} onChange={setOrdering} />
          )
        }
      >
        {hasError ? (
          <Notice
            tone="error"
            title="No se pudo cargar el inventario"
            action={<Button onClick={() => void fetchBooks()}>Reintentar</Button>}
          >
            {error}
          </Notice>
        ) : isEmpty ? (
          <Notice title={hasFilter ? 'Sin resultados' : 'Aún no hay libros'}>
            {hasFilter
              ? 'Ningún libro coincide con el filtro elegido.'
              : 'Cuando registres libros aparecerán aquí.'}
          </Notice>
        ) : (
          <>
            <BooksTable
              books={books}
              isLoading={isLoading}
            />
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              totalItems={totalItems}
              disabled={isLoading}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  )
}
