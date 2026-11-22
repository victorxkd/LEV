import { Product } from "@/lib/types";

const MAX_COMPARE = 3;

type CompareResult = { ok: boolean; list: Product[] };

export function addToCompare(list: Product[], product: Product): CompareResult {
  if (list.some((p) => p.id === product.id)) return { ok: false, list: [...list] };
  if (list.length >= MAX_COMPARE) return { ok: false, list: [...list] };
  return { ok: true, list: [...list, product] };
}

export function removeFromCompare(list: Product[], productId: string): Product[] {
  return list.filter((p) => p.id !== productId);
}
