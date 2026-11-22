"use client";

import { useState } from "react";
import { CartItem, Product } from "@/lib/types";
import { addItem, removeItem, updateQuantity, getTotal } from "@/lib/cart/cart";
import { loadCart, saveCart, loadProducts } from "@/lib/storage/storage";

type CartState = {
  cart: CartItem[];
  products: Product[];
};

function loadInitialState(): CartState {
  return {
    cart: loadCart(),
    products: loadProducts(),
  };
}

export function useCart() {
  const [{ cart, products }, setState] = useState<CartState>(loadInitialState);

  function persist(newCart: CartItem[]) {
    setState((prev) => ({ ...prev, cart: newCart }));
    saveCart(newCart);
  }

  function add(product: Product, quantity: number) {
    const result = addItem(cart, product, quantity);
    if (result.ok) persist(result.cart);
    return result.ok;
  }

  function remove(productId: string) {
    persist(removeItem(cart, productId));
  }

  function update(productId: string, quantity: number) {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;
    const result = updateQuantity(cart, productId, quantity, product.stock);
    if (result.ok) persist(result.cart);
    return result.ok;
  }

  function clear() {
    persist([]);
  }

  const total = getTotal(cart, products);

  return { cart, products, total, add, remove, update, clear };
}
