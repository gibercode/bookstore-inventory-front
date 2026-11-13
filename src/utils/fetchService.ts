import { API_URL } from '@/constants/common'
import type { ApiErrorBody, ApiErrorDetail } from '@/types/api'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type QueryValue = string | number | boolean | null | undefined

type RequestOptions = {
  method?: HttpMethod
  params?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
}

export class ApiError extends Error {
  statusCode: number
  fields?: Record<string, string[]>

  constructor(
    statusCode: number,
    message: string,
    fields?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.fields = fields
  }
}

const buildUrl = (path: string, params?: Record<string, QueryValue>) => {
  const url = new URL(`${API_URL}${path}`)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

const isErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === 'object' && value !== null && 'error' in value

const toFields = (detail: Record<string, string[] | string>) =>
  Object.fromEntries(
    Object.entries(detail).map(([key, value]) => [
      key,
      Array.isArray(value) ? value : [value],
    ]),
  )

const toMessage = (detail: ApiErrorDetail) => {
  if (typeof detail === 'string') return detail
  return Object.entries(toFields(detail))
    .map(([key, messages]) => `${key}: ${messages.join(' ')}`)
    .join(' · ')
}

const toApiError = async (response: Response) => {
  const body: unknown = await response.json().catch(() => null)
  if (!isErrorBody(body)) {
    return new ApiError(response.status, 'No se pudo completar la solicitud')
  }
  const { detail } = body.error
  return new ApiError(
    response.status,
    toMessage(detail),
    typeof detail === 'string' ? undefined : toFields(detail),
  )
}

const request = async <T>(
  path: string,
  { method = 'GET', params, body, signal }: RequestOptions = {},
): Promise<T> => {
  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      signal,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'No se pudo conectar con el servidor')
  }

  if (!response.ok) throw await toApiError(response)
  return (await response.json()) as T
}

export const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError'

export const fetchService = {
  request,
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'POST', body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    request<T>(path, { method: 'PATCH', body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) =>
    request<T>(path, { method: 'DELETE', signal }),
}
