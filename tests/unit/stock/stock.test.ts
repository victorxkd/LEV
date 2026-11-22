import { describe, it, expect } from "vitest";
import { hasEnoughStock, decrementStock } from "@/lib/stock/stock";
import { Product } from "@/lib/types";

describe("estoque", () => {
  it("permite quantidade igual ao estoque disponível", () => {
    expect(hasEnoughStock(5, 5)).toBe(true);
  });

  it("rejeita quantidade maior que o estoque", () => {
    expect(hasEnoughStock(5, 6)).toBe(false);
  });

  it("rejeita quantidade zero", () => {
    expect(hasEnoughStock(5, 0)).toBe(false);
  });
});

const stockProducts: Product[] = [
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

describe("decrementStock", () => {
  it("reduz o estoque do produto pela quantidade comprada", () => {
    const cart = [{ productId: "kb-1", quantity: 3 }];

    const result = decrementStock(stockProducts, cart);

    expect(result.find((p) => p.id === "kb-1")?.stock).toBe(7);
  });

  it("reduz o estoque de múltiplos produtos de uma vez", () => {
    const cart = [
      { productId: "kb-1", quantity: 2 },
      { productId: "ms-1", quantity: 1 },
    ];

    const result = decrementStock(stockProducts, cart);

    expect(result.find((p) => p.id === "kb-1")?.stock).toBe(8);
    expect(result.find((p) => p.id === "ms-1")?.stock).toBe(4);
  });

  it("zera o estoque quando a quantidade comprada iguala o estoque", () => {
    const cart = [{ productId: "ms-1", quantity: 5 }];

    const result = decrementStock(stockProducts, cart);

    expect(result.find((p) => p.id === "ms-1")?.stock).toBe(0);
  });

  it("não altera produtos que não estão no carrinho", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = decrementStock(stockProducts, cart);

    expect(result.find((p) => p.id === "ms-1")?.stock).toBe(5);
  });

  it("não modifica o array original de produtos", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    decrementStock(stockProducts, cart);

    expect(stockProducts.find((p) => p.id === "kb-1")?.stock).toBe(10);
  });

  it("ignora itens do carrinho cujo produto não existe na lista", () => {
    const cart = [{ productId: "inexistente", quantity: 1 }];

    const result = decrementStock(stockProducts, cart);

    expect(result).toHaveLength(2);
    expect(result.find((p) => p.id === "kb-1")?.stock).toBe(10);
  });
});
