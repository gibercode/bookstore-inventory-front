import { z } from 'zod'
import { isValidIsbn } from '@/utils/isbn'

// Límites de apps/books/models.py (DecimalField y PositiveIntegerField).
const MAX_COST_USD = 99_999_999.99 // max_digits=10, decimal_places=2
const MAX_STOCK = 2_147_483_647
const MIN_AMOUNT = 0.01

const requiredMessage = 'Este campo es obligatorio'

const text = z
  .string()
  .trim()
  .min(1, requiredMessage)
  .max(255, 'Máximo 255 caracteres')

const parseAmount =
  (max: number) => (value: string, ctx: z.RefinementCtx) => {
    const normalized = value.replace(',', '.')
    const fail = (message: string) => {
      ctx.addIssue({ code: 'custom', message })
      return z.NEVER
    }

    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
      return fail('Usa un número positivo con hasta 2 decimales')
    }
    const amount = Number(normalized)
    if (amount < MIN_AMOUNT) return fail(`El mínimo es ${MIN_AMOUNT}`)
    if (amount > max) return fail('El valor es demasiado grande')
    return amount
  }

export const bookFormSchema = z.object({
  title: text,
  author: text,
  isbn: z
    .string()
    .trim()
    .min(1, requiredMessage)
    .max(17, 'Máximo 17 caracteres')
    .refine(
      isValidIsbn,
      'ISBN inválido: usa 10 o 13 dígitos con dígito de control correcto',
    ),
  category: z.string().min(1, 'Elige una categoría'),
  supplier_country: z
    .string()
    .trim()
    .min(1, requiredMessage)
    .regex(/^[A-Za-z]{2}$/, 'Usa el código de 2 letras (ej. US, VE)')
    .transform((value) => value.toUpperCase()),
  cost_usd: z
    .string()
    .trim()
    .min(1, requiredMessage)
    .transform(parseAmount(MAX_COST_USD)),
  stock_quantity: z
    .string()
    .trim()
    .min(1, requiredMessage)
    .regex(/^\d+$/, 'Usa un número entero, 0 o mayor')
    .transform(Number)
    .refine((value) => value <= MAX_STOCK, 'El valor es demasiado grande'),
})

export type BookFormInput = z.input<typeof bookFormSchema>
export type BookFormValues = z.output<typeof bookFormSchema>
