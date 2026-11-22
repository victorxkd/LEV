"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { createProduct, editProduct, removeProduct } from "@/lib/products/products";
import { loadProducts, saveProducts } from "@/lib/storage/storage";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  function persist(newProducts: Product[]) {
    setProducts(newProducts);
    saveProducts(newProducts);
  }

  function add(input: Omit<Product, "id">): boolean {
    const result = createProduct(products, input);
    if (result.ok) persist(result.products);
    return result.ok;
  }

  function edit(id: string, changes: Partial<Omit<Product, "id">>): boolean {
    const result = editProduct(products, id, changes);
    if (result.ok) persist(result.products);
    return result.ok;
  }

  function remove(id: string) {
    persist(removeProduct(products, id));
  }

  return { products, add, edit, remove };
}
