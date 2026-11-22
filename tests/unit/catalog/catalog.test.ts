import { describe, it, expect } from "vitest";
import { searchByName, filterByCategory, sortByPrice } from "@/lib/catalog/catalog";
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

describe("filterByCategory", () => {
  it("retorna apenas os produtos da categoria informada", () => {
    const result = filterByCategory(products, "mouse");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ms-1");
  });

  it("retorna lista vazia quando nenhum produto pertence à categoria", () => {
    const result = filterByCategory(products, "headset");

    expect(result).toHaveLength(0);
  });

  it("retorna múltiplos produtos quando mais de um pertence à categoria", () => {
    const extra: Product[] = [
      ...products,
      {
        id: "ms-2",
        name: "Mouse Sem Fio",
        category: "mouse",
        priceInCents: 12000,
        stock: 8,
        specs: {},
      },
    ];

    const result = filterByCategory(extra, "mouse");

    expect(result).toHaveLength(2);
  });

  it("não modifica a lista original de produtos", () => {
    const original = [...products];

    filterByCategory(products, "keyboard");

    expect(products).toEqual(original);
  });
});

describe("sortByPrice", () => {
  it("ordena produtos do menor para o maior preço", () => {
    const result = sortByPrice(products, "asc");

    expect(result[0].id).toBe("mp-1");
    expect(result[1].id).toBe("ms-1");
    expect(result[2].id).toBe("kb-1");
  });

  it("ordena produtos do maior para o menor preço", () => {
    const result = sortByPrice(products, "desc");

    expect(result[0].id).toBe("kb-1");
    expect(result[1].id).toBe("ms-1");
    expect(result[2].id).toBe("mp-1");
  });

  it("retorna lista vazia quando não há produtos", () => {
    const result = sortByPrice([], "asc");

    expect(result).toHaveLength(0);
  });

  it("retorna lista com um único produto sem alterar nada", () => {
    const single = [products[0]];

    const result = sortByPrice(single, "asc");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("kb-1");
  });

  it("não modifica a lista original de produtos", () => {
    const original = [...products];

    sortByPrice(products, "asc");

    expect(products).toEqual(original);
  });
});
