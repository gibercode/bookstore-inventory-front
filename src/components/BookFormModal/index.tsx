import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCategoriesStore } from "@/store/categories";
import { toast } from "@/store/toast";
import type { Book } from "@/types/book";
import { ApiError } from "@/utils/fetchService";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { SelectField } from "../SelectField";
import { TextField } from "../TextField";
import { bookFormSchema } from "./schema";
import type { BookFormInput, BookFormValues } from "./schema";
import styles from "./styles.module.css";

type BookFormModalProps = {
  book?: Book;
  onSubmit: (values: BookFormValues) => Promise<Book>;
  onSaved: (book: Book) => void;
  onClose: () => void;
};

const EMPTY_VALUES: BookFormInput = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  supplier_country: "",
  cost_usd: "",
  stock_quantity: "0",
};

const FIELD_NAMES = Object.keys(EMPTY_VALUES) as (keyof BookFormInput)[];

const isFieldName = (name: string): name is keyof BookFormInput =>
  (FIELD_NAMES as string[]).includes(name);

export const BookFormModal = ({
  book,
  onSubmit: submitBook,
  onSaved,
  onClose,
}: BookFormModalProps) => {
  const isEditing = book !== undefined;
  const categories = useCategoriesStore((state) => state.categories);
  const categoriesStatus = useCategoriesStore((state) => state.status);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<BookFormInput, unknown, BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          category:
            categories.find(({ name }) => name === book.category)?.id ?? "",
          supplier_country: book.supplier_country,
          cost_usd: String(book.cost_usd),
          stock_quantity: String(book.stock_quantity),
        }
      : EMPTY_VALUES,
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      onSaved(await submitBook(values));
    } catch (error) {
      if (!(error instanceof ApiError)) {
        toast.error("Error desconocido");
        return;
      }

      const fieldErrors = Object.entries(error.fields ?? {}).filter(([name]) =>
        isFieldName(name),
      );
      if (fieldErrors.length === 0) {
        toast.error(error.message);
        return;
      }
      for (const [name, messages] of fieldErrors) {
        const message =
          error.statusCode === 409 && name === "isbn"
            ? "Ya existe un libro con este ISBN"
            : messages.join(" ");
        setError(name as keyof BookFormInput, { message });
      }
      setFocus(fieldErrors[0][0] as keyof BookFormInput);
    }
  });

  const categoriesLoading =
    categoriesStatus === "idle" || categoriesStatus === "loading";

  return (
    <Modal
      title={isEditing ? "Editar libro" : "Nuevo libro"}
      onClose={onClose}
      dismissible={!isSubmitting}
    >
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <TextField
          className={styles.full}
          label="Título"
          autoComplete="off"
          autoFocus
          error={errors.title?.message}
          {...register("title")}
        />
        <TextField
          className={styles.full}
          label="Autor"
          autoComplete="off"
          error={errors.author?.message}
          {...register("author")}
        />
        <TextField
          label="ISBN"
          placeholder="978-0-306-40615-7"
          autoComplete="off"
          hint="10 o 13 dígitos, con o sin guiones"
          error={errors.isbn?.message}
          {...register("isbn")}
        />
        <TextField
          label="País del proveedor"
          placeholder="US"
          maxLength={2}
          autoComplete="off"
          hint="Código de 2 letras"
          error={errors.supplier_country?.message}
          {...register("supplier_country")}
        />
        <div className={styles.full}>
          <SelectField
            label="Categoría"
            placeholder={
              categoriesLoading
                ? "Cargando categorías…"
                : "Selecciona una categoría"
            }
            disabled={categoriesLoading}
            options={categories.map(({ id, name }) => ({
              value: id,
              label: name,
            }))}
            error={
              errors.category?.message ??
              (categoriesStatus === "error"
                ? "No se pudieron cargar las categorías"
                : undefined)
            }
            {...register("category")}
          />
          {categoriesStatus === "error" && (
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
          {...register("cost_usd")}
        />
        <TextField
          label={isEditing ? "Stock" : "Stock inicial"}
          inputMode="numeric"
          autoComplete="off"
          error={errors.stock_quantity?.message}
          {...register("stock_quantity")}
        />

        <footer className={`${styles.full} ${styles.actions}`}>
          <Button disabled={isSubmitting} onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Guardando…"
                : "Creando…"
              : isEditing
                ? "Guardar cambios"
                : "Crear libro"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
};
