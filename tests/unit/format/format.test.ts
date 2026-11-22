import { describe, it, expect } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formata centavos como moeda brasileira", () => {
    const result = formatPrice(18990);

    expect(result).toBe("R$\u00a0189,90");
  });

  it("formata valor inteiro sem centavos", () => {
    const result = formatPrice(10000);

    expect(result).toBe("R$\u00a0100,00");
  });

  it("formata zero como R$ 0,00", () => {
    const result = formatPrice(0);

    expect(result).toBe("R$\u00a00,00");
  });

  it("formata valor acima de mil com separador de milhar", () => {
    const result = formatPrice(1000000);

    expect(result).toBe("R$\u00a010.000,00");
  });
});
