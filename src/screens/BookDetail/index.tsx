import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeftIcon,
  BookFormModal,
  Button,
  Card,
  ConfirmModal,
  DescriptionList,
  Notice,
  PencilIcon,
  StockBadge,
  TrashIcon,
} from '@/components'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useBookDetailStore } from '@/store/bookDetail'
import { useCategoriesStore } from '@/store/categories'
import { toast } from '@/store/toast'
import { ApiError } from '@/utils/fetchService'
import { formatDateTime, formatUsd } from '@/utils/format'
import { CalculationCard } from './components/CalculationCard'
import { DetailSkeleton } from './components/DetailSkeleton'
import { PricePanel } from './components/PricePanel'
import styles from './styles.module.css'

export const BookDetail = () => {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const book = useBookDetailStore((state) => state.book)
  const status = useBookDetailStore((state) => state.status)
  const error = useBookDetailStore((state) => state.error)
  const notFound = useBookDetailStore((state) => state.notFound)
  const calculation = useBookDetailStore((state) => state.calculation)
  const calculationStatus = useBookDetailStore(
    (state) => state.calculationStatus,
  )
  const fetchBook = useBookDetailStore((state) => state.fetchBook)
  const calculatePrice = useBookDetailStore((state) => state.calculatePrice)
  const updateBook = useBookDetailStore((state) => state.updateBook)
  const deleteBook = useBookDetailStore((state) => state.deleteBook)

  const categoriesStatus = useCategoriesStore((state) => state.status)
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories)

  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const deleted = await deleteBook()
      toast.success(`Libro «${deleted.title}» eliminado.`)
      void navigate('/')
    } catch (error) {
      setIsDeleting(false)
      deleteModal.close()
      toast.error(
        error instanceof ApiError ? error.message : 'No se pudo eliminar el libro',
      )
    }
  }

  useEffect(() => {
    void fetchBook(id)
    void fetchCategories()
  }, [fetchBook, fetchCategories, id])

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div className={styles.screen}>
      <Link to="/" className={styles.back}>
        <ArrowLeftIcon size={16} />
        Libros
      </Link>

      {status === 'error' ? (
        <Card>
          <Notice
            tone={notFound ? 'neutral' : 'error'}
            title={
              notFound ? 'No encontramos este libro' : 'No se pudo cargar el libro'
            }
            action={
              notFound ? (
                <Link to="/" className={styles.back}>
                  Volver al listado
                </Link>
              ) : (
                <Button onClick={() => void fetchBook(id)}>Reintentar</Button>
              )
            }
          >
            {notFound ? 'Puede que haya sido eliminado.' : error}
          </Notice>
        </Card>
      ) : isLoading || !book ? (
        <DetailSkeleton />
      ) : (
        <>
          <header className={styles.header}>
            <div className={styles.heading}>
              <h1 className={styles.title}>{book.title}</h1>
              <p className={styles.subtitle}>{book.author}</p>
            </div>
            {/* El formulario necesita las categorías para preseleccionar la del libro. */}
            <div className={styles.actions}>
              <Button
                onClick={editModal.open}
                disabled={categoriesStatus !== 'success'}
              >
                <PencilIcon size={16} />
                Editar
              </Button>
              <Button className={styles.delete} onClick={deleteModal.open}>
                <TrashIcon size={16} />
                Eliminar
              </Button>
            </div>
          </header>


          <div className={styles.grid}>
            <Card title="Información">
              <DescriptionList
                items={[
                  { label: 'ISBN', value: book.isbn },
                  { label: 'Categoría', value: book.category },
                  { label: 'País del proveedor', value: book.supplier_country },
                  { label: 'Creado', value: formatDateTime(book.created_at) },
                  {
                    label: 'Actualizado',
                    value: formatDateTime(book.updated_at),
                  },
                ]}
              />
            </Card>

            <div className={styles.column}>
              <Card title="Inventario">
                <DescriptionList
                  items={[
                    {
                      label: 'Stock',
                      value: <StockBadge quantity={book.stock_quantity} />,
                    },
                    { label: 'Costo (USD)', value: formatUsd(book.cost_usd) },
                  ]}
                />
              </Card>

              <PricePanel
                book={book}
                status={calculationStatus}
                onCalculate={() => void calculatePrice()}
              />
            </div>
          </div>

          {calculation && <CalculationCard calculation={calculation} />}

          {deleteModal.isOpen && (
            <ConfirmModal
              title="¿Eliminar este libro?"
              confirmLabel="Eliminar"
              loading={isDeleting}
              onConfirm={() => void handleDelete()}
              onClose={deleteModal.close}
            >
              Se eliminará «{book.title}» (ISBN {book.isbn}) de forma permanente.
              Esta acción no se puede deshacer.
            </ConfirmModal>
          )}

          {editModal.isOpen && (
            <BookFormModal
              book={book}
              onSubmit={updateBook}
              onClose={editModal.close}
              onSaved={(updated) => {
                editModal.close()
                toast.success(
                  updated.cost_usd !== book.cost_usd &&
                    updated.selling_price_local !== null
                    ? 'Libro actualizado. El costo cambió: recalcula el precio local.'
                    : 'Libro actualizado.',
                )
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
