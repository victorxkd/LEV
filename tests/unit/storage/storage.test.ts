// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { loadCart, saveCart, clearCart, loadProducts, saveProducts } from "@/lib/storage/storage";
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
});

describe("saveProducts", () => {
  it("persiste os produtos no localStorage", () => {
    const products = [{ ...initialProducts[0], stock: 0 }];

    saveProducts(products);

    const saved = JSON.parse(localStorage.getItem("lev:products")!);
    expect(saved[0].stock).toBe(0);
  });
});
