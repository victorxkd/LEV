// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  clearCart,
  loadCart,
  loadComparison,
  loadProducts,
  saveCart,
  saveComparison,
  saveProducts,
} from "@/lib/storage/storage";
import { initialProducts } from "@/data/products";

beforeEach(() => {
  localStorage.clear();
});

describe("loadCart", () => {
  it("retorna lista vazia quando não há dados no localStorage", () => {
    const result = loadCart();

    expect(result).toEqual([]);
  });

  it("retorna os itens salvos no localStorage", () => {
    const cart = [{ productId: "kb-1", quantity: 2 }];
    localStorage.setItem("lev:cart", JSON.stringify(cart));

    const result = loadCart();

    expect(result).toEqual(cart);
  });

  it("retorna lista vazia quando o valor salvo é inválido", () => {
    localStorage.setItem("lev:cart", "invalido{{");

    const result = loadCart();

    expect(result).toEqual([]);
  });

  it("retorna lista vazia quando o JSON não representa uma lista", () => {
    localStorage.setItem("lev:cart", "null");

    expect(loadCart()).toEqual([]);
  });

  it("preserva itens válidos quando há entradas incompatíveis", () => {
    const valid = { productId: "kb-1", quantity: 2 };
    const invalid = [
      null,
      [],
      { productId: false, quantity: 2 },
      { productId: "kb-2", quantity: "2" },
      { productId: "kb-2", quantity: 1.5 },
      { productId: "kb-2", quantity: 0 },
    ];
    localStorage.setItem("lev:cart", JSON.stringify([valid, ...invalid]));

    expect(loadCart()).toEqual([valid]);
  });
});

describe("saveCart", () => {
  it("persiste os itens do carrinho no localStorage", () => {
    const cart = [{ productId: "ms-1", quantity: 1 }];

    saveCart(cart);

    expect(JSON.parse(localStorage.getItem("lev:cart")!)).toEqual(cart);
  });
});

describe("clearCart", () => {
  it("remove os dados do carrinho do localStorage", () => {
    localStorage.setItem("lev:cart", JSON.stringify([{ productId: "kb-1", quantity: 1 }]));

    clearCart();

    expect(localStorage.getItem("lev:cart")).toBeNull();
  });
});

describe("loadProducts", () => {
  it("retorna o catálogo inicial quando não há dados no localStorage", () => {
    const result = loadProducts();

    expect(result).toEqual(initialProducts);
  });

  it("retorna os produtos salvos no localStorage", () => {
    const products = [{ ...initialProducts[0], stock: 3 }];
    localStorage.setItem("lev:products", JSON.stringify(products));

    const result = loadProducts();

    expect(result[0].stock).toBe(3);
  });

  it("retorna o catálogo inicial quando o valor salvo é inválido", () => {
    localStorage.setItem("lev:products", "{{invalido");

    const result = loadProducts();

    expect(result).toEqual(initialProducts);
  });

  it("restaura o catálogo inicial quando todos os produtos salvos são inválidos", () => {
    localStorage.setItem("lev:products", JSON.stringify([{ ...initialProducts[0], specs: null }]));

    expect(loadProducts()).toEqual(initialProducts);
  });

  it("preserva o catálogo quando todos os produtos foram removidos", () => {
    saveProducts([]);

    expect(loadProducts()).toEqual([]);
  });

  it("preserva produtos válidos quando há entradas incompatíveis", () => {
    const product = initialProducts[0];
    const invalid = [
      { ...product, id: null },
      { ...product, name: null },
      { ...product, specs: { brand: {} } },
      { ...product, priceInCents: null },
    ];
    localStorage.setItem("lev:products", JSON.stringify([...invalid, product]));

    expect(loadProducts()).toEqual([product]);
  });
});

describe("saveProducts", () => {
  it("persiste os produtos no localStorage", () => {
    const products = [{ ...initialProducts[0], stock: 0 }];

    saveProducts(products);

    const saved = JSON.parse(localStorage.getItem("lev:products")!);
    expect(saved[0].stock).toBe(0);
  });
});

describe("persistência da comparação", () => {
  it("usa preço e estoque atuais para os produtos selecionados", () => {
    const [first, second] = initialProducts;
    const edited = { ...first, priceInCents: 29990, stock: 3 };
    saveComparison([second, first]);
    saveProducts([edited, second]);

    expect(loadComparison()).toEqual([second, edited]);
  });

  it("ignora produtos selecionados que foram removidos do catálogo", () => {
    const [first, second] = initialProducts;
    saveComparison([first, second]);
    saveProducts([second]);

    expect(loadComparison()).toEqual([second]);
  });
});
