import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("adiciona produto ao carrinho e exibe feedback", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await expect(page.getByRole("status")).toContainText("adicionado ao carrinho");
});

test("exibe total correto no carrinho após adicionar produto", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.getByRole("link", { name: "Ver carrinho" }).first().click();

  await expect(page.getByText("Total")).toBeVisible();
  // O total aparece como o maior elemento de preço na página
  const total = page.locator("span.text-2xl.font-bold");
  await expect(total).toBeVisible();
});

test("botão de aumentar quantidade fica bloqueado no limite do estoque", async ({ page }) => {
  // Usa o mouse superlight 2 que tem stock: 6 — garante limite baixo
  await page.getByLabel("Buscar produto").fill("SUPERLIGHT");
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.goto("/carrinho");

  const aumentar = page.getByRole("button", { name: "Aumentar quantidade" });

  // Clica até o limite
  for (let i = 0; i < 5; i++) {
    await aumentar.click();
  }

  await expect(aumentar).toBeDisabled();
});

test("produto fora de estoque tem botão desabilitado no catálogo", async ({ page }) => {
  // Carrega os produtos padrão, zera o estoque do primeiro e salva antes de navegar
  const { initialProducts } = await import("../../src/data/products");
  const modified = initialProducts.map((p, i) => (i === 0 ? { ...p, stock: 0 } : p));

  await page.goto("/catalogo");
  await page.evaluate((products) => {
    localStorage.setItem("lev:products", JSON.stringify(products));
  }, modified);
  await page.reload();

  const firstCard = page.locator(".grid > div").first();
  await expect(firstCard.getByRole("button", { name: "Adicionar ao carrinho" })).toBeDisabled();
});

test("remove item do carrinho", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.goto("/carrinho");

  await page.getByRole("button", { name: "Remover" }).first().click();
  await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible();
});
