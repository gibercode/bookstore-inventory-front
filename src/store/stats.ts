import { create } from "zustand";
import {
  LOW_STOCK_THRESHOLD,
  OUT_OF_STOCK_THRESHOLD,
} from "@/constants/common";
import type { Paginated, RequestStatus } from "@/types/api";
import type { Book } from "@/types/book";
import { fetchService } from "@/utils/fetchService";

type StatsStore = {
  total: number | null;
  lowStock: number | null;
  outOfStock: number | null;
  status: RequestStatus;
  fetchStats: () => Promise<void>;
};

const countOf = async (path: string, params: Record<string, number> = {}) => {
  const data = await fetchService.get<Paginated<Book>>(path, {
    params: { ...params, page_size: 1 },
  });
  return data.count;
};

export const useStatsStore = create<StatsStore>((set) => ({
  total: null,
  lowStock: null,
  outOfStock: null,
  status: "idle",

  fetchStats: async () => {
    set({ status: "loading" });
    try {
      const [total, lowStock, outOfStock] = await Promise.all([
        countOf("/books/"),
        countOf("/books/low-stock/", { threshold: LOW_STOCK_THRESHOLD }),
        countOf("/books/low-stock/", { threshold: OUT_OF_STOCK_THRESHOLD }),
      ]);
      set({ total, lowStock, outOfStock, status: "success" });
    } catch {
      set({ status: "error" });
    }
  },
}));
