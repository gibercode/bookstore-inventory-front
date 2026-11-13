export const APP_NAME = 'Librook'

export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export const PAGE_SIZE = 20

// Mismo umbral por defecto que el endpoint /books/low-stock/ de la API.
export const LOW_STOCK_THRESHOLD = 10

export const OUT_OF_STOCK_THRESHOLD = 0

export const LOCAL_CURRENCY = 'VES'
