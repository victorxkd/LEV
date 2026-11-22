import { Category, Product } from "@/lib/types";

export function searchByName(products: Product[], query: string): Product[] {
  if (query === "") return [...products];
  const lower = query.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower));
}

export function filterByCategory(products: Product[], category: Category): Product[] {
  return products.filter((p) => p.category === category);
}

export function sortByPrice(products: Product[], order: "asc" | "desc"): Product[] {
  return [...products].sort((a, b) =>
    order === "asc" ? a.priceInCents - b.priceInCents : b.priceInCents - a.priceInCents,
  );
}
