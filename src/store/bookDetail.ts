import { create } from "zustand";
import type { RequestStatus } from "@/types/api";
import type { Book, BookPayload, PriceCalculation } from "@/types/book";
import { ApiError, fetchService, isAbortError } from "@/utils/fetchService";
import { toast } from "./toast";

type BookDetailStore = {
  book: Book | null;
  status: RequestStatus;
  error: string | null;
  notFound: boolean;

  calculation: PriceCalculation | null;
  calculationStatus: RequestStatus;

  fetchBook: (id: string) => Promise<void>;
  calculatePrice: () => Promise<void>;
  updateBook: (payload: BookPayload) => Promise<Book>;
};

let controller: AbortController | null = null;

export const useBookDetailStore = create<BookDetailStore>((set, get) => ({
  book: null,
  status: "idle",
  error: null,
  notFound: false,

  calculation: null,
  calculationStatus: "idle",

  fetchBook: async (id) => {
    controller?.abort();
    const current = new AbortController();
    controller = current;

    if (get().book?.id !== id) {
      set({ book: null, calculation: null, calculationStatus: "idle" });
    }
    set({ status: "loading", error: null, notFound: false });

    try {
      const book = await fetchService.get<Book>(`/books/${id}/`, {
        signal: current.signal,
      });
      set({ book, status: "success" });
    } catch (error) {
      if (isAbortError(error)) return;
      set({
        status: "error",
        notFound: error instanceof ApiError && error.statusCode === 404,
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  },

  calculatePrice: async () => {
    const { book } = get();
    if (!book) return;

    set({ calculationStatus: "loading" });
    try {
      const calculation = await fetchService.post<PriceCalculation>(
        `/books/${book.id}/calculate-price/`,
      );
      set({
        calculation,
        calculationStatus: "success",
        book: { ...book, selling_price_local: calculation.selling_price_local },
      });
      toast.success("Precio local calculado.");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? (error.fields?.selling_price_local?.join(" ") ?? error.message)
          : "Error desconocido";
      set({ calculationStatus: "error" });
      toast.error(message);
    }
  },

  updateBook: async (payload) => {
    const { book } = get();
    if (!book) throw new Error("No hay un libro cargado");

    const updated = await fetchService.put<Book>(`/books/${book.id}/`, {
      ...payload,
      selling_price_local: book.selling_price_local,
    });
    const costChanged = updated.cost_usd !== book.cost_usd;
    set({
      book: updated,
      ...(costChanged && { calculation: null, calculationStatus: "idle" }),
    });
    return updated;
  },
}));
