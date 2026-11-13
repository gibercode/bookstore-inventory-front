import { create } from "zustand";

export type ToastKind = "success" | "error";

export type Toast = {
  id: number;
  kind: ToastKind;
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  show: (kind: ToastKind, message: string) => void;
  dismiss: (id: number) => void;
};

const DURATION_MS: Record<ToastKind, number> = {
  success: 4000,
  error: 7000,
};

let nextId = 0;

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  show: (kind, message) => {
    const id = (nextId += 1);
    set((state) => ({ toasts: [...state.toasts, { id, kind, message }] }));
    setTimeout(() => get().dismiss(id), DURATION_MS[kind]);
  },

  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

export const toast = {
  success: (message: string) =>
    useToastStore.getState().show("success", message),
  error: (message: string) => useToastStore.getState().show("error", message),
};
