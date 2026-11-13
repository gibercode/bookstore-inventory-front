import { create } from 'zustand'
import type { RequestStatus } from '@/types/api'
import type { Category } from '@/types/category'
import { fetchService } from '@/utils/fetchService'

type CategoriesStore = {
  categories: Category[]
  status: RequestStatus
  fetchCategories: () => Promise<void>
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  status: 'idle',

  fetchCategories: async () => {
    if (get().status === 'loading' || get().status === 'success') return
    set({ status: 'loading' })
    try {
      const categories = await fetchService.get<Category[]>('/categories/')
      set({ categories, status: 'success' })
    } catch {
      // El filtro de categoría es opcional: si falla, el listado sigue usable.
      set({ status: 'error' })
    }
  },
}))
