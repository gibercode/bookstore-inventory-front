import { LOCAL_CURRENCY, LOW_STOCK_THRESHOLD } from "@/constants/common";
import type { StockLevel } from "@/types/book";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const local = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: LOCAL_CURRENCY,
});

const integer = new Intl.NumberFormat("en-US");

export const formatUsd = (value: number) => usd.format(value);

export const formatLocal = (value: number | null) =>
  value === null ? "—" : local.format(value);

export const formatInteger = (value: number) => integer.format(value);

export const getStockLevel = (quantity: number): StockLevel => {
  if (quantity === 0) return "out";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
};

const CATEGORY_COLORS = [
  "#7c3aed",
  "#2563eb",
  "#059669",
  "#db2777",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
  "#dc2626",
];

export const getCategoryColor = (seed: string) => {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length];
};
