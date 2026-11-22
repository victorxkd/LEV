import { describe, it, expect } from "vitest";
import { addToCompare, removeFromCompare } from "@/lib/compare/compare";
import { Product } from "@/lib/types";

const p1: Product = {
  id: "kb-1",
  name: "Teclado Mecânico RGB",
  category: "keyboard",
  priceInCents: 25000,
  stock: 10,
  specs: { switch: "Red", layout: "TKL" },
};

const p2: Product = {
  id: "ms-1",
  name: "Mouse Gamer Pro",
  category: "mouse",
  priceInCents: 15000,
  stock: 5,
  specs: { dpi: "16000", botoes: "6" },
};

const p3: Product = {
  id: "mp-1",
  name: "Mousepad XL",
  category: "mousepad",
  priceInCents: 8000,
  stock: 20,
  specs: { tamanho: "900x400mm" },
};

const p4: Product = {
  id: "hs-1",
  name: "Headset Surround",
  category: "headset",
  priceInCents: 32000,
  stock: 8,
  specs: { driver: "50mm" },
};

describe("addToCompare", () => {
  it("adiciona um produto à lista de comparação vazia", () => {
    const result = addToCompare([], p1);

    expect(result.ok).toBe(true);
    expect(result.list).toHaveLength(1);
    expect(result.list[0].id).toBe("kb-1");
  });

  it("rejeita adição do mesmo produto duas vezes", () => {
    const list = [p1];

    const result = addToCompare(list, p1);

    expect(result.ok).toBe(false);
    expect(result.list).toHaveLength(1);
  });

  it("rejeita quando a lista já tem 3 produtos", () => {
    const list = [p1, p2, p3];

    const result = addToCompare(list, p4);

    expect(result.ok).toBe(false);
    expect(result.list).toHaveLength(3);
  });

  it("permite adicionar até 3 produtos distintos", () => {
    const r1 = addToCompare([], p1);
    const r2 = addToCompare(r1.list, p2);
    const r3 = addToCompare(r2.list, p3);

    expect(r3.ok).toBe(true);
    expect(r3.list).toHaveLength(3);
  });

  it("não modifica a lista original", () => {
    const list = [p1];

    addToCompare(list, p2);

    expect(list).toHaveLength(1);
  });
});

describe("removeFromCompare", () => {
  it("remove o produto da lista pelo id", () => {
    const list = [p1, p2];

    const result = removeFromCompare(list, "kb-1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ms-1");
  });

  it("retorna a mesma lista quando o produto não está nela", () => {
    const list = [p1];

    const result = removeFromCompare(list, "ms-1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("kb-1");
  });

  it("retorna lista vazia ao remover de lista vazia", () => {
    const result = removeFromCompare([], "kb-1");

    expect(result).toHaveLength(0);
  });

  it("não modifica a lista original", () => {
    const list = [p1, p2];

    removeFromCompare(list, "kb-1");

    expect(list).toHaveLength(2);
  });
});
