"use client";

import Link from "next/link";
import { useCompare } from "@/lib/storage/useCompare";
import { formatPrice } from "@/lib/format";

export function CompararClient() {
  const { list, remove, clear } = useCompare();

  if (list.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-zinc-500 text-lg mb-4">Nenhum produto selecionado para comparação.</p>
        <Link
          href="/catalogo"
          className="bg-zinc-900 text-white text-sm font-medium rounded-lg px-6 py-2.5 hover:bg-zinc-700 transition-colors"
        >
          Ir ao catálogo
        </Link>
      </div>
    );
  }

  // Collect all spec keys present across all products
  const allSpecKeys = Array.from(new Set(list.flatMap((p) => Object.keys(p.specs))));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Comparação de produtos</h1>
        <div className="flex gap-3">
          <button
            onClick={clear}
            className="text-sm font-medium text-zinc-500 hover:text-red-500 transition-colors"
          >
            Limpar tudo
          </button>
          <Link
            href="/catalogo"
            className="text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg px-4 py-2 hover:bg-zinc-50 transition-colors"
          >
            Voltar ao catálogo
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left py-3 pr-6 w-40 text-zinc-500 font-medium border-b border-zinc-200">
                Produto
              </th>
              {list.map((product) => (
                <th
                  key={product.id}
                  className="text-left py-3 px-4 border-b border-zinc-200 min-w-48"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-zinc-900 leading-tight">
                      {product.name}
                    </span>
                    <button
                      onClick={() => remove(product.id)}
                      className="text-xs text-zinc-400 hover:text-red-500 transition-colors text-left"
                    >
                      Remover
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price row */}
            <tr className="bg-zinc-50">
              <td className="py-3 pr-6 text-zinc-500 font-medium border-b border-zinc-100">
                Preço
              </td>
              {list.map((product) => (
                <td
                  key={product.id}
                  className="py-3 px-4 font-bold text-zinc-900 border-b border-zinc-100"
                >
                  {formatPrice(product.priceInCents)}
                </td>
              ))}
            </tr>

            {/* Stock row */}
            <tr>
              <td className="py-3 pr-6 text-zinc-500 font-medium border-b border-zinc-100">
                Estoque
              </td>
              {list.map((product) => (
                <td
                  key={product.id}
                  className={`py-3 px-4 font-medium border-b border-zinc-100 ${
                    product.stock > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} unidades` : "Fora de estoque"}
                </td>
              ))}
            </tr>

            {/* Spec rows */}
            {allSpecKeys.map((key, i) => (
              <tr key={key} className={i % 2 === 0 ? "bg-zinc-50" : ""}>
                <td className="py-3 pr-6 text-zinc-500 font-medium border-b border-zinc-100 capitalize">
                  {key}
                </td>
                {list.map((product) => (
                  <td key={product.id} className="py-3 px-4 text-zinc-700 border-b border-zinc-100">
                    {product.specs[key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}

            {/* Add to cart row */}
            <tr>
              <td className="pt-4 pr-6" />
              {list.map((product) => (
                <td key={product.id} className="pt-4 px-4">
                  <Link
                    href={`/catalogo/${product.id}`}
                    className="block text-center text-sm font-medium border border-zinc-300 text-zinc-700 rounded-lg px-3 py-2 hover:bg-zinc-50 transition-colors"
                  >
                    Ver detalhes
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
