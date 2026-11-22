import { CartItem, Product } from "@/lib/types";

type CartResult = { ok: boolean; cart: CartItem[] };

export function addItem(cart: CartItem[], product: Product, quantity: number): CartResult {
  if (quantity < 1) return { ok: false, cart: [...cart] };

  const existing = cart.find((item) => item.productId === product.id);
  const currentQty = existing ? existing.quantity : 0;
  const newQty = currentQty + quantity;

  if (newQty > product.stock) return { ok: false, cart: [...cart] };

  if (existing) {
    return {
      ok: true,
      cart: cart.map((item) =>
        item.productId === product.id ? { ...item, quantity: newQty } : { ...item },
      ),
    };
  }

  return {
    ok: true,
    cart: [...cart, { productId: product.id, quantity }],
  };
}
