import { describe, it, expect } from "vitest";
import {
  validateProduct,
  createProduct,
  editProduct,
  removeProduct,
} from "@/lib/products/products";
import { Product } from "@/lib/types";

const validInput = {
  name: "Teclado Mecânico RGB",
  category: "keyboard" as const,
  priceInCents: 25000,
  stock: 10,
  specs: {},
};

describe("validateProduct", () => {
  it("aceita produto com todos os campos válidos", () => {
    const result = validateProduct(validInput);

    expect(result.ok).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const result = validateProduct({ ...validInput, name: "" });

    expect(result.ok).toBe(false);
  });

  it("rejeita nome apenas com espaços", () => {
    const result = validateProduct({ ...validInput, name: "   " });

    expect(result.ok).toBe(false);
  });

  it("rejeita categoria inválida", () => {
    const result = validateProduct({ ...validInput, category: "invalida" as never });

    expect(result.ok).toBe(false);
  });

  it("rejeita preço zero", () => {
    const result = validateProduct({ ...validInput, priceInCents: 0 });

    expect(result.ok).toBe(false);
  });

  it("rejeita preço negativo", () => {
    const result = validateProduct({ ...validInput, priceInCents: -100 });

    expect(result.ok).toBe(false);
  });

  it.each([NaN, Infinity, 199.5])(
    "rejeita preço que não é um inteiro de centavos (%s)",
    (priceInCents) => {
      expect(validateProduct({ ...validInput, priceInCents }).ok).toBe(false);
    },
  );

  it("rejeita estoque negativo", () => {
    const result = validateProduct({ ...validInput, stock: -1 });

    expect(result.ok).toBe(false);
  });

  it("rejeita estoque com valor não inteiro", () => {
    const result = validateProduct({ ...validInput, stock: 2.5 });

    expect(result.ok).toBe(false);
  });

  it("aceita estoque zero", () => {
    const result = validateProduct({ ...validInput, stock: 0 });

    expect(result.ok).toBe(true);
  });

  it("aceita todas as categorias válidas", () => {
    const categories = [
      "keyboard",
      "mouse",
      "mousepad",
      "monitor-stand",
      "headset",
      "accessory",
    ] as const;

    for (const category of categories) {
      const result = validateProduct({ ...validInput, category });
      expect(result.ok).toBe(true);
    }
  });
});

describe("createProduct", () => {
  it("cria um produto com id gerado e dados informados", () => {
    const result = createProduct([], validInput);

    expect(result.ok).toBe(true);
    expect(result.products).toHaveLength(1);
    expect(result.products[0].name).toBe("Teclado Mecânico RGB");
    expect(typeof result.products[0].id).toBe("string");
  });

  it("rejeita criação quando os dados são inválidos", () => {
    const result = createProduct([], { ...validInput, priceInCents: 0 });

    expect(result.ok).toBe(false);
    expect(result.products).toHaveLength(0);
  });

  it("adiciona o novo produto à lista existente", () => {
    const existing: Product[] = [{ id: "ms-1", ...validInput, name: "Mouse", category: "mouse" }];

    const result = createProduct(existing, validInput);

    expect(result.ok).toBe(true);
    expect(result.products).toHaveLength(2);
  });

  it("não modifica a lista original", () => {
    const existing: Product[] = [];

    createProduct(existing, validInput);

    expect(existing).toHaveLength(0);
  });
});

describe("editProduct", () => {
  const existing: Product[] = [{ id: "kb-1", ...validInput }];

  it("atualiza os dados do produto existente", () => {
    const result = editProduct(existing, "kb-1", { name: "Teclado Novo" });

    expect(result.ok).toBe(true);
    expect(result.products[0].name).toBe("Teclado Novo");
  });

  it("rejeita edição com dados inválidos", () => {
    const result = editProduct(existing, "kb-1", { priceInCents: -1 });

    expect(result.ok).toBe(false);
    expect(result.products[0].priceInCents).toBe(25000);
  });

  it("retorna ok false quando o produto não existe", () => {
    const result = editProduct(existing, "inexistente", { name: "X" });

    expect(result.ok).toBe(false);
  });

  it("não modifica a lista original", () => {
    editProduct(existing, "kb-1", { name: "Outro" });

    expect(existing[0].name).toBe("Teclado Mecânico RGB");
  });

  it("preserva os outros produtos ao editar um", () => {
    const list: Product[] = [
      { id: "kb-1", ...validInput },
      { id: "ms-1", ...validInput, name: "Mouse", category: "mouse" },
    ];

    const result = editProduct(list, "kb-1", { name: "Teclado Novo" });

    expect(result.products).toHaveLength(2);
    expect(result.products.find((p) => p.id === "ms-1")?.name).toBe("Mouse");
  });
});

describe("removeProduct", () => {
  const existing: Product[] = [
    { id: "kb-1", ...validInput },
    { id: "ms-1", ...validInput, name: "Mouse", category: "mouse" },
  ];

  it("remove o produto da lista pelo id", () => {
    const result = removeProduct(existing, "kb-1");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ms-1");
  });

  it("retorna a mesma lista quando o produto não existe", () => {
    const result = removeProduct(existing, "inexistente");

    expect(result).toHaveLength(2);
  });

  it("retorna lista vazia ao remover o único produto", () => {
    const single: Product[] = [{ id: "kb-1", ...validInput }];

    const result = removeProduct(single, "kb-1");

    expect(result).toHaveLength(0);
  });

  it("não modifica a lista original", () => {
    removeProduct(existing, "kb-1");

    expect(existing).toHaveLength(2);
  });
});
