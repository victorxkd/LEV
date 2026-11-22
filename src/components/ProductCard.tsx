import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-tight">{product.name}</h2>
        <span className="text-xs bg-zinc-100 text-zinc-500 rounded px-2 py-0.5 whitespace-nowrap">
          {product.category}
        </span>
      </div>

      <p className="text-lg font-bold text-zinc-900">{formatPrice(product.priceInCents)}</p>

      <p className="text-sm text-zinc-500">
        {product.stock > 0 ? `${product.stock} em estoque` : "Fora de estoque"}
      </p>

      <div className="mt-auto pt-2 flex gap-2">
        <Link
          href={`/catalogo/${product.id}`}
          className="flex-1 text-center text-sm font-medium border border-zinc-300 rounded-lg px-3 py-2 hover:bg-zinc-50 transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
