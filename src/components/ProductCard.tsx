import Link from "next/link";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const CATEGORY_LABELS: Record<string, string> = {
  keyboard: "Teclado",
  mouse: "Mouse",
  mousepad: "Mousepad",
  "monitor-stand": "Suporte de monitor",
  headset: "Headset",
  accessory: "Acessório",
};

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const inStock = product.stock > 0;

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold leading-tight text-zinc-900">{product.name}</h2>
        <span className="text-xs bg-zinc-100 text-zinc-600 rounded px-2 py-0.5 whitespace-nowrap shrink-0">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </span>
      </div>

      <p className="text-xl font-bold text-zinc-900">{formatPrice(product.priceInCents)}</p>

      <p className={`text-sm font-medium ${inStock ? "text-green-600" : "text-red-500"}`}>
        {inStock ? `${product.stock} em estoque` : "Fora de estoque"}
      </p>

      <div className="mt-auto pt-2">
        <Link
          href={`/catalogo/${product.id}`}
          className="block w-full text-center text-sm font-medium bg-zinc-900 text-white rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
