"use client";

import { useState } from "react";
import { initialProducts } from "@/data/products";
import { searchByName, filterByCategory, sortByPrice } from "@/lib/catalog/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Category } from "@/lib/types";

const CATEGORIES: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "keyboard", label: "Teclados" },
  { value: "mouse", label: "Mouses" },
  { value: "mousepad", label: "Mousepads" },
  { value: "monitor-stand", label: "Suportes de monitor" },
  { value: "headset", label: "Headsets" },
  { value: "accessory", label: "Acessórios" },
];

export default function CatalogoPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [order, setOrder] = useState<"asc" | "desc" | "none">("none");

  let products = searchByName(initialProducts, query);
  if (category !== "all") {
    products = filterByCategory(products, category);
  }
  if (order !== "none") {
    products = sortByPrice(products, order);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="search"
          placeholder="Buscar produto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc" | "none")}
          className="border border-zinc-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          <option value="none">Ordenar por preço</option>
          <option value="asc">Menor preço</option>
          <option value="desc">Maior preço</option>
        </select>
      </div>

      {/* Resultados */}
      {products.length === 0 ? (
        <p className="text-zinc-500 text-sm">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
