import { Category, Product } from "@/lib/types";

const VALID_CATEGORIES: Category[] = [
  "keyboard",
  "mouse",
  "mousepad",
  "monitor-stand",
  "headset",
  "accessory",
];

type ProductInput = Omit<Product, "id">;
type ValidationResult = { ok: boolean; error?: string };
type ProductsResult = { ok: boolean; products: Product[] };

export function validateProduct(input: ProductInput): ValidationResult {
  if (!input.name || input.name.trim() === "") {
    return { ok: false, error: "Nome é obrigatório" };
  }
  if (!VALID_CATEGORIES.includes(input.category)) {
    return { ok: false, error: "Categoria inválida" };
  }
  if (input.priceInCents <= 0) {
    return { ok: false, error: "Preço deve ser maior que zero" };
  }
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    return { ok: false, error: "Estoque deve ser um inteiro maior ou igual a zero" };
  }
  return { ok: true };
}

export function createProduct(products: Product[], input: ProductInput): ProductsResult {
  const validation = validateProduct(input);
  if (!validation.ok) return { ok: false, products: [...products] };

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const newProduct: Product = { id, ...input };

  return { ok: true, products: [...products, newProduct] };
}

export function editProduct(
  products: Product[],
  id: string,
  changes: Partial<ProductInput>,
): ProductsResult {
  const target = products.find((p) => p.id === id);
  if (!target) return { ok: false, products: [...products] };

  const updated = { ...target, ...changes };
  const validation = validateProduct(updated);
  if (!validation.ok) return { ok: false, products: [...products] };

  return {
    ok: true,
    products: products.map((p) => (p.id === id ? updated : { ...p })),
  };
}

export function removeProduct(products: Product[], id: string): Product[] {
  return products.filter((p) => p.id !== id);
}
