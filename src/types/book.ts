export type Book = {
  id: string
  title: string
  author: string
  isbn: string
  cost_usd: number
  selling_price_local: number | null
  stock_quantity: number
  category: string
  supplier_country: string
  created_at: string
  updated_at: string
}

type BookSortField =
  | 'title'
  | 'author'
  | 'cost_usd'
  | 'selling_price_local'
  | 'stock_quantity'

export type BookOrdering = BookSortField | `-${BookSortField}`

// Cada filtro vive en un endpoint distinto de la API, por eso son excluyentes.
export type BookFilter =
  | { kind: 'none' }
  | { kind: 'category'; categoryId: string }
  | { kind: 'low-stock' }

export type StockLevel = 'ok' | 'low' | 'out'
