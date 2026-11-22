import { describe, it, expect } from "vitest";
import { searchByName } from "@/lib/catalog/catalog";
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
  {
    id: "mp-1",
    name: "Mousepad XL",
    category: "mousepad",
    priceInCents: 8000,
    stock: 20,
    specs: {},
  },
];

describe("searchByName", () => {
  it("retorna todos os produtos quando a busca é uma string vazia", () => {
    const result = searchByName(products, "");

    expect(result).toHaveLength(3);
  });

  it("retorna o produto cujo nome contém o termo buscado", () => {
    const result = searchByName(products, "Mouse Gamer");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ms-1");
  });

  it("busca é case-insensitive", () => {
    const result = searchByName(products, "teclado mecânico");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("kb-1");
  });

  it("retorna múltiplos produtos quando o termo aparece em mais de um nome", () => {
    const result = searchByName(products, "mouse");

    expect(result).toHaveLength(2);
  });

  it("retorna lista vazia quando nenhum produto corresponde à busca", () => {
    const result = searchByName(products, "headset");

    expect(result).toHaveLength(0);
  });

  it("busca por termo parcial do nome", () => {
    const result = searchByName(products, "RGB");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("kb-1");
  });

  it("não modifica a lista original de produtos", () => {
    const original = [...products];

    searchByName(products, "mouse");

    expect(products).toEqual(original);
  });
});
