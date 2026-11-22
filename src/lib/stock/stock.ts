import { CartItem, Product } from "@/lib/types";

export function hasEnoughStock(stock: number, quantity: number): boolean {
  return quantity >= 1 && quantity <= stock;
}

export function decrementStock(products: Product[], cart: CartItem[]): Product[] {
  return products.map((product) => {
    const item = cart.find((i) => i.productId === product.id);
    if (!item) return { ...product };
    return { ...product, stock: product.stock - item.quantity };
  });
}