import { describe, it, expect } from "vitest";
import { addItem, removeItem, updateQuantity, getTotal } from "@/lib/cart/cart";
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

  it.each([NaN, 1.5])("rejeita quantidade que não é um inteiro (%s)", (quantity) => {
    expect(addItem([], product, quantity)).toEqual({ ok: false, cart: [] });
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

describe("updateQuantity", () => {
  it("atualiza a quantidade de um item existente no carrinho", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = updateQuantity(cart, "kb-1", 3, 5);

    expect(result.ok).toBe(true);
    expect(result.cart[0].quantity).toBe(3);
  });

  it("rejeita quando a nova quantidade excede o estoque", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = updateQuantity(cart, "kb-1", 6, 5);

    expect(result.ok).toBe(false);
    expect(result.cart[0].quantity).toBe(1);
  });

  it("rejeita quantidade zero", () => {
    const cart = [{ productId: "kb-1", quantity: 2 }];

    const result = updateQuantity(cart, "kb-1", 0, 5);

    expect(result.ok).toBe(false);
    expect(result.cart[0].quantity).toBe(2);
  });

  it("rejeita quantidade negativa", () => {
    const cart = [{ productId: "kb-1", quantity: 2 }];

    const result = updateQuantity(cart, "kb-1", -1, 5);

    expect(result.ok).toBe(false);
  });

  it.each([NaN, 1.5])("preserva o carrinho ao receber quantidade inválida (%s)", (quantity) => {
    const cart = [{ productId: "kb-1", quantity: 2 }];

    expect(updateQuantity(cart, "kb-1", quantity, 5)).toEqual({ ok: false, cart });
  });

  it("permite atualizar para exatamente o limite do estoque", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = updateQuantity(cart, "kb-1", 5, 5);

    expect(result.ok).toBe(true);
    expect(result.cart[0].quantity).toBe(5);
  });

  it("retorna ok false quando o produto não está no carrinho", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = updateQuantity(cart, "ms-1", 2, 5);

    expect(result.ok).toBe(false);
  });

  it("não modifica o carrinho original", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    updateQuantity(cart, "kb-1", 3, 5);

    expect(cart[0].quantity).toBe(1);
  });

  it("preserva os outros itens ao atualizar um produto", () => {
    const cart = [
      { productId: "kb-1", quantity: 1 },
      { productId: "ms-1", quantity: 2 },
    ];

    const result = updateQuantity(cart, "kb-1", 3, 5);

    expect(result.ok).toBe(true);
    expect(result.cart).toHaveLength(2);
    expect(result.cart.find((i) => i.productId === "ms-1")?.quantity).toBe(2);
  });
});

const catalogProducts: Product[] = [
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

describe("getTotal", () => {
  it("retorna zero para carrinho vazio", () => {
    const result = getTotal([], catalogProducts);

    expect(result).toBe(0);
  });

  it("calcula o total de um único item com quantidade 1", () => {
    const cart = [{ productId: "kb-1", quantity: 1 }];

    const result = getTotal(cart, catalogProducts);

    expect(result).toBe(25000);
  });

  it("multiplica preço pela quantidade do item", () => {
    const cart = [{ productId: "kb-1", quantity: 3 }];

    const result = getTotal(cart, catalogProducts);

    expect(result).toBe(75000);
  });

  it("soma o total de múltiplos itens", () => {
    const cart = [
      { productId: "kb-1", quantity: 1 },
      { productId: "ms-1", quantity: 2 },
    ];

    const result = getTotal(cart, catalogProducts);

    expect(result).toBe(55000);
  });

  it("ignora itens do carrinho cujo produto não existe no catálogo", () => {
    const cart = [{ productId: "inexistente", quantity: 1 }];

    const result = getTotal(cart, catalogProducts);

    expect(result).toBe(0);
  });
});
