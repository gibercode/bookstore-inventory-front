import type { BookOrdering } from '@/types/book'

export const ORDERING_OPTIONS: { value: BookOrdering; label: string }[] = [
  { value: 'title', label: 'Título (A–Z)' },
  { value: '-title', label: 'Título (Z–A)' },
  { value: 'author', label: 'Autor (A–Z)' },
  { value: '-author', label: 'Autor (Z–A)' },
  { value: 'cost_usd', label: 'Costo (menor)' },
  { value: '-cost_usd', label: 'Costo (mayor)' },
  { value: 'stock_quantity', label: 'Stock (menor)' },
  { value: '-stock_quantity', label: 'Stock (mayor)' },
]
