import { Product } from "@/lib/types";

export function searchByName(products: Product[], query: string): Product[] {
  if (query === "") return [...products];
  const lower = query.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}
