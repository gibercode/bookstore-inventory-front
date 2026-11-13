export type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export type ApiErrorDetail = string | Record<string, string[] | string>

export type ApiErrorBody = {
  error: {
    status_code: number
    detail: ApiErrorDetail
  }
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
