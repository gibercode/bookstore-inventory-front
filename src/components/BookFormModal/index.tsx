import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useBooksStore } from '@/store/books'
import { useCategoriesStore } from '@/store/categories'
import type { Book } from '@/types/book'
import { ApiError } from '@/utils/fetchService'
import { Button } from '../Button'
import { Modal } from '../Modal'
import { SelectField } from '../SelectField'
import { TextField } from '../TextField'
import { bookFormSchema } from './schema'
import type { BookFormInput, BookFormValues } from './schema'
import styles from './styles.module.css'

type BookFormModalProps = {
  onClose: () => void
  onCreated: (book: Book) => void
}

const DEFAULT_VALUES: BookFormInput = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  supplier_country: '',
  cost_usd: '',
  stock_quantity: '0',
}

const FIELD_NAMES = Object.keys(DEFAULT_VALUES) as (keyof BookFormInput)[]

const isFieldName = (name: string): name is keyof BookFormInput =>
  (FIELD_NAMES as string[]).includes(name)

export const BookFormModal = ({ onClose, onCreated }: BookFormModalProps) => {
  const createBook = useBooksStore((state) => state.createBook)
  const categories = useCategoriesStore((state) => state.categories)
  const categoriesStatus = useCategoriesStore((state) => state.status)
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories)

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<BookFormInput, unknown, BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const onSubmit = handleSubmit(async (values) => {
    try {
      onCreated(await createBook(values))
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setError('root.server', { message: 'Error desconocido' })
        return
      }

      // La API valida igual que el formulario; si aun así rechaza un campo
      // (p. ej. ISBN duplicado) el mensaje se muestra junto a ese campo.
      const fieldErrors = Object.entries(error.fields ?? {}).filter(([name]) =>
        isFieldName(name),
      )
      if (fieldErrors.length === 0) {
        setError('root.server', { message: error.message })
        return
      }
      for (const [name, messages] of fieldErrors) {
        const message =
          error.statusCode === 409 && name === 'isbn'
            ? 'Ya existe un libro con este ISBN'
            : messages.join(' ')
        setError(name as keyof BookFormInput, { message })
      }
      setFocus(fieldErrors[0][0] as keyof BookFormInput)
    }
  })

  const categoriesLoading =
    categoriesStatus === 'idle' || categoriesStatus === 'loading'

  return (
    <Modal title="Nuevo libro" onClose={onClose} dismissible={!isSubmitting}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          className={styles.full}
          label="Título"
          autoComplete="off"
          autoFocus
          error={errors.title?.message}
          {...register('title')}
        />
        <TextField
          className={styles.full}
          label="Autor"
          autoComplete="off"
          error={errors.author?.message}
          {...register('author')}
        />
        <TextField
          label="ISBN"
          placeholder="978-0-306-40615-7"
          autoComplete="off"
          hint="10 o 13 dígitos, con o sin guiones"
          error={errors.isbn?.message}
          {...register('isbn')}
        />
        <TextField
          label="País del proveedor"
          placeholder="US"
          maxLength={2}
          autoComplete="off"
          hint="Código de 2 letras"
          error={errors.supplier_country?.message}
          {...register('supplier_country')}
        />
        <div className={styles.full}>
          <SelectField
            label="Categoría"
            placeholder={
              categoriesLoading ? 'Cargando categorías…' : 'Selecciona una categoría'
            }
            disabled={categoriesLoading}
            options={categories.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
            error={
              errors.category?.message ??
              (categoriesStatus === 'error'
                ? 'No se pudieron cargar las categorías'
                : undefined)
            }
            {...register('category')}
          />
          {categoriesStatus === 'error' && (
            <button
              type="button"
              className={styles.retry}
              onClick={() => void fetchCategories()}
            >
              Reintentar
            </button>
          )}
        </div>
        <TextField
          label="Costo (USD)"
          inputMode="decimal"
          placeholder="0.00"
          autoComplete="off"
          error={errors.cost_usd?.message}
          {...register('cost_usd')}
        />
        <TextField
          label="Stock inicial"
          inputMode="numeric"
          autoComplete="off"
          error={errors.stock_quantity?.message}
          {...register('stock_quantity')}
        />

        {errors.root?.server && (
          <p className={`${styles.full} ${styles.serverError}`} role="alert">
            {errors.root.server.message}
          </p>
        )}

        <footer className={`${styles.full} ${styles.actions}`}>
          <Button disabled={isSubmitting} onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creando…' : 'Crear libro'}
          </Button>
        </footer>
      </form>
    </Modal>
  )
}
