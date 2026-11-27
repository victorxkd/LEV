"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/storage/useCart";
import { formatPrice } from "@/lib/format";
import { useState } from "react";

export function ProdutoDetalheClient() {
  const { id } = useParams<{ id: string }>();
  const { products, add } = useCart();
  const [feedback, setFeedback] = useState<string | null>(null);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-zinc-900 mb-4">Produto não encontrado</h1>
        <Link href="/catalogo" className="text-sm text-zinc-700 underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleAddToCart = () => {
    const ok = add(product, 1);
    setFeedback(ok ? "Adicionado ao carrinho!" : "Estoque insuficiente.");
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/catalogo"
        className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-6 inline-block"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="bg-white border border-zinc-200 rounded-2xl p-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-zinc-900 leading-tight">{product.name}</h1>
          <span className="text-xs bg-zinc-100 text-zinc-600 rounded px-2 py-1 whitespace-nowrap shrink-0 mt-1">
            {product.category}
          </span>
        </div>

        <p className="text-3xl font-bold text-zinc-900 mb-2">{formatPrice(product.priceInCents)}</p>

        <p className={`text-sm font-medium mb-6 ${inStock ? "text-green-600" : "text-red-500"}`}>
          {inStock ? `${product.stock} em estoque` : "Fora de estoque"}
        </p>

        {feedback && (
          <div className="mb-6 px-4 py-3 bg-zinc-900 text-white text-sm rounded-lg" role="status">
            {feedback}
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="bg-zinc-900 text-white text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
          >
            Adicionar ao carrinho
          </button>
          <Link
            href="/carrinho"
            className="text-sm font-medium border border-zinc-300 text-zinc-700 rounded-lg px-6 py-2.5 hover:bg-zinc-50 transition-colors"
          >
            Ver carrinho
          </Link>
        </div>

        {Object.keys(product.specs).length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-zinc-900 mb-3">Especificações</h2>
            <table className="w-full text-sm border-collapse">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-zinc-50" : ""}>
                    <td className="py-2 px-3 text-zinc-500 font-medium capitalize w-40 rounded-l">
                      {key}
                    </td>
                    <td className="py-2 px-3 text-zinc-800 rounded-r">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
