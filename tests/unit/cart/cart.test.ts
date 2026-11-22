import { describe, it, expect } from "vitest";
import { addItem, removeItem } from "@/lib/cart/cart";
import { Product } from "@/lib/types";

const product: Product = {
  id: "kb-1",
  name: "Teclado Mecânico RGB",
  category: "keyboard",
  priceInCents: 25000,
  stock: 5,
  specs: {},
};

describe("addItem", () => {
  it("adiciona um novo produto ao carrinho vazio", () => {
    const result = addItem([], product, 1);

    expect(result.ok).toBe(true);
    expect(result.cart).toHaveLength(1);
    expect(result.cart[0]).toEqual({ productId: "kb-1", quantity: 1 });
  });

  it("incrementa a quantidade quando o produto já está no carrinho", () => {
    const cart = [{ productId: "kb-1", quantity: 2 }];

    const result = addItem(cart, product, 2);

    expect(result.ok).toBe(true);
    expect(result.cart).toHaveLength(1);
    expect(result.cart[0].quantity).toBe(4);
  });

  it("rejeita quando a quantidade excede o estoque disponível", () => {
    const result = addItem([], product, 6);

    expect(result.ok).toBe(false);
    expect(result.cart).toHaveLength(0);
  });

  it("rejeita quando a soma com o carrinho existente excede o estoque", () => {
    const cart = [{ productId: "kb-1", quantity: 4 }];

    const result = addItem(cart, product, 2);

    expect(result.ok).toBe(false);
    expect(result.cart[0].quantity).toBe(4);
  });

  it("rejeita quantidade zero", () => {
    const result = addItem([], product, 0);

    expect(result.ok).toBe(false);
  });

  it("rejeita quantidade negativa", () => {
    const result = addItem([], product, -1);

    expect(result.ok).toBe(false);
  });

  it("permite adicionar exatamente o total do estoque", () => {
    const result = addItem([], product, 5);

    expect(result.ok).toBe(true);
    expect(result.cart[0].quantity).toBe(5);
  });

  it("não modifica o carrinho original em caso de rejeição", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    addItem(cart, product, 10);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  it("não modifica o carrinho original em caso de sucesso", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    addItem(cart, product, 1);

    expect(cart[0].quantity).toBe(1);
  });

  it("adiciona segundo produto sem afetar o primeiro", () => {
    const other: Product = {
      id: "ms-1",
      name: "Mouse Gamer",
      category: "mouse",
      priceInCents: 15000,
      stock: 3,
      specs: {},
    };
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = addItem(cart, other, 2);

    expect(result.ok).toBe(true);
    expect(result.cart).toHaveLength(2);
  });

  it("preserva os outros itens do carrinho ao incrementar um produto existente", () => {
    const other: Product = {
      id: "ms-1",
      name: "Mouse Gamer",
      category: "mouse",
      priceInCents: 15000,
      stock: 3,
      specs: {},
    };
    const cart = [
      { productId: "kb-1", quantity: 1 },
      { productId: "ms-1", quantity: 1 },
    ];

    const result = addItem(cart, other, 1);

    expect(result.ok).toBe(true);
    expect(result.cart).toHaveLength(2);
    expect(result.cart.find((i) => i.productId === "kb-1")?.quantity).toBe(1);
    expect(result.cart.find((i) => i.productId === "ms-1")?.quantity).toBe(2);
  });
});

describe("removeItem", () => {
  it("remove o produto do carrinho pelo id", () => {
    const cart = [{ productId: "kb-1", quantity: 2 }];

    const result = removeItem(cart, "kb-1");

    expect(result).toHaveLength(0);
  });

  it("remove apenas o produto indicado, mantendo os demais", () => {
    const cart = [
      { productId: "kb-1", quantity: 1 },
      { productId: "ms-1", quantity: 3 },
    ];

    const result = removeItem(cart, "kb-1");

    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe("ms-1");
  });

  it("retorna o mesmo carrinho quando o produto não está nele", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = removeItem(cart, "ms-1");

    expect(result).toHaveLength(1);
    expect(result[0].productId).toBe("kb-1");
  });

  it("retorna lista vazia ao remover de um carrinho vazio", () => {
    const result = removeItem([], "kb-1");

    expect(result).toHaveLength(0);
  });

  it("não modifica o carrinho original", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    removeItem(cart, "kb-1");

    expect(cart).toHaveLength(1);
  });
});
