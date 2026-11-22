import { describe, it, expect } from "vitest";
import { createOrder } from "@/lib/orders/orders";
import { Product } from "@/lib/types";

const products: Product[] = [
  {
    id: "kb-1",
    name: "Teclado Mecânico RGB",
    category: "keyboard",
    priceInCents: 25000,
    stock: 10,
    specs: {},
  },
  {
    id: "ms-1",
    name: "Mouse Gamer Pro",
    category: "mouse",
    priceInCents: 15000,
    stock: 5,
    specs: {},
  },
];

const now = new Date("2026-11-22T15:00:00.000Z");

describe("createOrder", () => {
  it("rejeita pedido com carrinho vazio", () => {
    const result = createOrder([], products, now);

    expect(result.ok).toBe(false);
    expect(result.order).toBeUndefined();
  });

  it("cria pedido com os itens do carrinho", () => {
    const cart = [{ productId: "kb-1", quantity: 2 }];

    const result = createOrder(cart, products, now);

    expect(result.ok).toBe(true);
    expect(result.order?.items).toEqual(cart);
  });

  it("calcula o total correto em centavos", () => {
    const cart = [
      { productId: "kb-1", quantity: 1 },
      { productId: "ms-1", quantity: 2 },
    ];

    const result = createOrder(cart, products, now);

    expect(result.ok).toBe(true);
    expect(result.order?.totalInCents).toBe(55000);
  });

  it("registra a data de criação do pedido", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = createOrder(cart, products, now);

    expect(result.order?.createdAt).toEqual(now);
  });

  it("gera um id único para o pedido", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = createOrder(cart, products, now);

    expect(typeof result.order?.id).toBe("string");
    expect(result.order?.id.length).toBeGreaterThan(0);
  });

  it("rejeita pedido quando um item excede o estoque disponível", () => {
    const cart = [{ productId: "ms-1", quantity: 10 }];

    const result = createOrder(cart, products, now);

    expect(result.ok).toBe(false);
    expect(result.order).toBeUndefined();
  });

  it("rejeita pedido quando um produto do carrinho não existe no catálogo", () => {
    const cart = [{ productId: "inexistente", quantity: 1 }];

    const result = createOrder(cart, products, now);

    expect(result.ok).toBe(false);
  });
});
