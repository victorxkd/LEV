import { describe, it, expect } from "vitest";
import { hasEnoughStock } from "@/lib/stock/stock";

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