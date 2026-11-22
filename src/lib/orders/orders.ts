import { CartItem, Order, Product } from "@/lib/types";
import { getTotal } from "@/lib/cart/cart";
import { hasEnoughStock } from "@/lib/stock/stock";

type OrderResult = { ok: boolean; order?: Order };

export function createOrder(
  cart: CartItem[],
  products: Product[],
  now: Date,
): OrderResult {
  if (cart.length === 0) return { ok: false };

  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return { ok: false };
    if (!hasEnoughStock(product.stock, item.quantity)) return { ok: false };
  }

  const order: Order = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 9)}`,
    items: cart.map((i) => ({ ...i })),
    totalInCents: getTotal(cart, products),
    createdAt: now,
  };

  return { ok: true, order };
}
