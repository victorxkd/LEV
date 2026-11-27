import { CartItem, Product } from "@/lib/types";
import { initialProducts } from "@/data/products";
import { validateProduct } from "@/lib/products/products";

const CART_KEY = "lev:cart";
const PRODUCTS_KEY = "lev:products";
const COMPARE_KEY = "lev:compare";

function loadSavedList<T>(key: string, fallback: T[], isItem: (value: unknown) => value is T): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const stored: unknown = JSON.parse(raw);
    if (!Array.isArray(stored)) return fallback;

    const validItems = stored.filter(isItem);
    return stored.length > 0 && validItems.length === 0 ? fallback : validItems;
  } catch {
    return fallback;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isCartItem(value: unknown): value is CartItem {
  return (
    isRecord(value) &&
    typeof value.productId === "string" &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0
  );
}

function isProduct(value: unknown): value is Product {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isRecord(value.specs) &&
    Object.values(value.specs).every((spec) => typeof spec === "string") &&
    validateProduct(value as Product).ok
  );
}

export function loadCart(): CartItem[] {
  return loadSavedList(CART_KEY, [], isCartItem);
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function loadProducts(): Product[] {
  return loadSavedList(PRODUCTS_KEY, initialProducts, isProduct);
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function loadComparison(): Product[] {
  const saved = loadSavedList(COMPARE_KEY, [], isProduct);
  const products = loadProducts();

  return saved.flatMap(({ id }) => {
    const current = products.find((product) => product.id === id);
    return current ? [current] : [];
  });
}

export function saveComparison(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPARE_KEY, JSON.stringify(products));
}
