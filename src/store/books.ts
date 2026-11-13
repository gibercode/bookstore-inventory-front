import { create } from 'zustand'
import { LOW_STOCK_THRESHOLD, PAGE_SIZE } from '@/constants/common'
import type { Paginated, RequestStatus } from '@/types/api'
import type { Book, BookFilter, BookOrdering } from '@/types/book'
import { fetchService, isAbortError } from '@/utils/fetchService'

type BooksStore = {
  books: Book[]
  totalItems: number
  status: RequestStatus
  error: string | null
  filter: BookFilter
  ordering: BookOrdering
  page: number

  fetchBooks: () => Promise<void>
  setCategoryFilter: (categoryId: string) => void
  toggleLowStockFilter: () => void
  clearFilter: () => void
  setOrdering: (ordering: BookOrdering) => void
  setPage: (page: number) => void
}

const NO_FILTER: BookFilter = { kind: 'none' }

let controller: AbortController | null = null

// Un endpoint por filtro. Solo el listado general acepta `ordering`:
// /search/ y /low-stock/ devuelven su propio orden.
const buildRequest = (
  filter: BookFilter,
  ordering: BookOrdering,
  page: number,
) => {
  const base = { page, page_size: PAGE_SIZE }
  switch (filter.kind) {
    case 'category':
      return {
        path: '/books/search/',
        params: { ...base, category: filter.categoryId },
      }
    case 'low-stock':
      return {
        path: '/books/low-stock/',
        params: { ...base, threshold: LOW_STOCK_THRESHOLD },
      }
    case 'none':
      return { path: '/books/', params: { ...base, ordering } }
  }
}

export const useBooksStore = create<BooksStore>((set, get) => {
  const applyAndFetch = (changes: Partial<BooksStore>) => {
    set({ ...changes, page: changes.page ?? 1 })
    return get().fetchBooks()
  }

  return {
    books: [],
    totalItems: 0,
    status: 'idle',
    error: null,
    filter: NO_FILTER,
    ordering: 'title',
    page: 1,

    fetchBooks: async () => {
      controller?.abort()
      const current = new AbortController()
      controller = current

      const { filter, ordering, page } = get()
      const { path, params } = buildRequest(filter, ordering, page)
      set({ status: 'loading', error: null })

      try {
        const data = await fetchService.get<Paginated<Book>>(path, {
          params,
          signal: current.signal,
        })
        set({ books: data.results, totalItems: data.count, status: 'success' })
      } catch (error) {
        if (isAbortError(error)) return
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido',
        })
      }
    },

    setCategoryFilter: (categoryId) =>
      void applyAndFetch({
        filter: categoryId
          ? { kind: 'category', categoryId }
          : NO_FILTER,
      }),

    toggleLowStockFilter: () =>
      void applyAndFetch({
        filter:
          get().filter.kind === 'low-stock' ? NO_FILTER : { kind: 'low-stock' },
      }),

    clearFilter: () => void applyAndFetch({ filter: NO_FILTER }),

    setOrdering: (ordering) => void applyAndFetch({ ordering }),

    setPage: (page) => void applyAndFetch({ page }),
  }
})
