"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/storage/useCart";
import { createOrder } from "@/lib/orders/orders";
import { decrementStock } from "@/lib/stock/stock";
import { saveProducts } from "@/lib/storage/storage";
import { formatPrice } from "@/lib/format";
import { Order } from "@/lib/types";

export function CarrinhoClient() {
  const { cart, products, total, remove, update, clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  if (order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white border border-zinc-200 rounded-2xl p-10 flex flex-col items-center gap-4">
          <span className="text-5xl">✅</span>
          <h1 className="text-2xl font-bold text-zinc-900">Pedido realizado!</h1>
          <p className="text-zinc-500 text-sm">
            Número do pedido: <span className="font-mono text-zinc-700">{order.id}</span>
          </p>
          <p className="text-zinc-500 text-sm">
            Total:{" "}
            <span className="font-semibold text-zinc-900">{formatPrice(order.totalInCents)}</span>
          </p>
          <p className="text-zinc-400 text-xs mt-2">
            {new Date(order.createdAt).toLocaleString("pt-BR")}
          </p>
          <Link
            href="/catalogo"
            className="mt-4 bg-zinc-900 text-white text-sm font-medium rounded-lg px-6 py-2.5 hover:bg-zinc-700 transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-zinc-500 text-lg mb-4">Seu carrinho está vazio.</p>
        <Link
          href="/catalogo"
          className="bg-zinc-900 text-white text-sm font-medium rounded-lg px-6 py-2.5 hover:bg-zinc-700 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  function handleFinalize() {
    setError("");
    const result = createOrder(cart, products, new Date());
    if (!result.ok || !result.order) {
      setError("Não foi possível finalizar o pedido. Verifique o estoque dos itens.");
      return;
    }
    const updatedProducts = decrementStock(products, cart);
    saveProducts(updatedProducts);
    clear();
    setOrder(result.order);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 mb-6">Carrinho</h1>

      <div className="flex flex-col gap-4">
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return (
            <div
              key={item.productId}
              className="bg-white border border-zinc-200 rounded-xl p-5 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 truncate">
                  {product?.name ?? "Produto indisponível"}
                </p>
                {product ? (
                  <p className="text-sm text-zinc-500">{formatPrice(product.priceInCents)} cada</p>
                ) : (
                  <p className="text-sm text-zinc-500">Remova este item para finalizar o pedido.</p>
                )}
                {product && item.quantity > product.stock && (
                  <p className="text-sm text-red-600">{product.stock} em estoque</p>
                )}
              </div>

              {product && (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Diminuir quantidade"
                      onClick={() => {
                        update(item.productId, Math.min(item.quantity - 1, product.stock));
                        setError("");
                      }}
                      disabled={item.quantity <= 1 || product.stock === 0}
                      className="w-8 h-8 rounded-lg border border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-zinc-900">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Aumentar quantidade"
                      onClick={() => update(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= product.stock}
                      className="w-8 h-8 rounded-lg border border-zinc-300 text-zinc-700 font-bold hover:bg-zinc-50 disabled:opacity-40 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-24 text-right font-semibold text-zinc-900">
                    {formatPrice(product.priceInCents * item.quantity)}
                  </p>
                </>
              )}

              <button
                onClick={() => {
                  remove(item.productId);
                  setError("");
                }}
                className="text-zinc-400 hover:text-red-500 transition-colors text-sm"
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-zinc-600 font-medium">Total</span>
          <output aria-label="Total do carrinho" className="text-2xl font-bold text-zinc-900">
            {formatPrice(total)}
          </output>
        </div>

        {error && (
          <p role="alert" className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          onClick={handleFinalize}
          className="w-full bg-zinc-900 text-white font-semibold rounded-lg py-3 hover:bg-zinc-700 transition-colors"
        >
          Finalizar pedido
        </button>
      </div>
    </div>
  );
}
