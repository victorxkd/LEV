import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("exibe todos os produtos ao abrir o catálogo", async ({ page }) => {
  const cards = page.locator(".grid > div");
  await expect(cards).toHaveCount(18);
});

test("filtra produtos pelo campo de busca", async ({ page }) => {
  await page.getByLabel("Buscar produto").fill("Logitech");
  const cards = page.locator(".grid > div");
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  const names = await cards.allTextContents();
  expect(names.every((t) => t.toLowerCase().includes("logitech"))).toBe(true);
});

test("exibe mensagem quando busca não retorna resultados", async ({ page }) => {
  await page.getByLabel("Buscar produto").fill("produto inexistente xyz123");
  await expect(page.getByText("Nenhum produto encontrado.")).toBeVisible();
});

test("filtra produtos por categoria", async ({ page }) => {
  await page.getByLabel("Filtrar por categoria").selectOption("mouse");
  const cards = page.locator(".grid > div");
  await expect(cards).toHaveCount(3);
});

test("ordena produtos do menor para o maior preço", async ({ page }) => {
  await page.getByLabel("Ordenar por preço").selectOption("asc");
  const prices = page.locator(".grid > div p.text-xl");
  const texts = await prices.allTextContents();
  const values = texts.map((t) =>
    parseFloat(t.replace("R$\u00a0", "").replace(".", "").replace(",", ".")),
  );
  for (let i = 0; i < values.length - 1; i++) {
    expect(values[i]).toBeLessThanOrEqual(values[i + 1]);
  }
});

test("ordena produtos do maior para o menor preço", async ({ page }) => {
  await page.getByLabel("Ordenar por preço").selectOption("desc");
  const prices = page.locator(".grid > div p.text-xl");
  const texts = await prices.allTextContents();
  const values = texts.map((t) =>
    parseFloat(t.replace("R$\u00a0", "").replace(".", "").replace(",", ".")),
  );
  for (let i = 0; i < values.length - 1; i++) {
    expect(values[i]).toBeGreaterThanOrEqual(values[i + 1]);
  }
});
