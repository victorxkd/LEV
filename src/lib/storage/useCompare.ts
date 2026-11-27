"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { addToCompare, removeFromCompare } from "@/lib/compare/compare";
import { loadComparison, saveComparison } from "@/lib/storage/storage";

export function useCompare() {
  const [list, setList] = useState<Product[]>(loadComparison);

  function persist(newList: Product[]) {
    setList(newList);
    saveComparison(newList);
  }

  function add(product: Product): boolean {
    const result = addToCompare(list, product);
    if (result.ok) persist(result.list);
    return result.ok;
  }

  function remove(productId: string) {
    persist(removeFromCompare(list, productId));
  }

  function clear() {
    persist([]);
  }

  return { list, add, remove, clear };
}
