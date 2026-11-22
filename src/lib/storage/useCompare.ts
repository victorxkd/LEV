"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { addToCompare, removeFromCompare } from "@/lib/compare/compare";

const COMPARE_KEY = "lev:compare";

function loadCompare(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function saveCompare(list: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));
}

export function useCompare() {
  const [list, setList] = useState<Product[]>(loadCompare);

  function persist(newList: Product[]) {
    setList(newList);
    saveCompare(newList);
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
