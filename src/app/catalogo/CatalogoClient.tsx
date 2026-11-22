"use client";

import { useState } from "react";
import Link from "next/link";
import { searchByName, filterByCategory, sortByPrice } from "@/lib/catalog/catalog";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/lib/storage/useCart";
import { useCompare } from "@/lib/storage/useCompare";
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

export function CatalogoClient() {
  const { products, add } = useCart();
  const { list: compareList, add: addToCompare } = useCompare();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [order, setOrder] = useState<"asc" | "desc" | "none">("none");
  const [feedback, setFeedback] = useState<string | null>(null);

  let filtered = searchByName(products, query);
  if (category !== "all") filtered = filterByCategory(filtered, category);
  if (order !== "none") filtered = sortByPrice(filtered, order);

  function handleAddToCart(product: Parameters<typeof add>[0]) {
    const ok = add(product, 1);
    setFeedback(ok ? `"${product.name}" adicionado ao carrinho.` : `Estoque insuficiente.`);
    setTimeout(() => setFeedback(null), 2500);
  }

  function handleAddToCompare(product: Parameters<typeof addToCompare>[0]) {
    const ok = addToCompare(product);
    setFeedback(
      ok ? `"${product.name}" adicionado à comparação.` : `Comparação cheia (máx. 3 produtos).`,
    );
    setTimeout(() => setFeedback(null), 2500);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Catálogo</h1>
        <div className="flex gap-3">
          {compareList.length > 0 && (
            <Link
              href="/comparar"
              className="text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg px-4 py-2 hover:bg-zinc-50 transition-colors"
            >
              Comparar ({compareList.length})
            </Link>
          )}
          <Link
            href="/carrinho"
            className="text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg px-4 py-2 hover:bg-zinc-50 transition-colors"
          >
            Ver carrinho
          </Link>
        </div>
      </div>

      {feedback && (
        <div className="mb-4 px-4 py-3 bg-zinc-900 text-white text-sm rounded-lg" role="status">
          {feedback}
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="search"
          placeholder="Buscar produto..."
          aria-label="Buscar produto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-zinc-300 rounded-lg px-4 py-2 text-sm text-zinc-900 w-64 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />

        <select
          value={category}
          aria-label="Filtrar por categoria"
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="border border-zinc-300 rounded-lg px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={order}
          aria-label="Ordenar por preço"
          onChange={(e) => setOrder(e.target.value as "asc" | "desc" | "none")}
          className="border border-zinc-300 rounded-lg px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400"
        >
          <option value="none">Ordenar por preço</option>
          <option value="asc">Menor preço</option>
          <option value="desc">Maior preço</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToCompare={handleAddToCompare}
              inCompare={compareList.some((p) => p.id === product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
