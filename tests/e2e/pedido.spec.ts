import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("finaliza pedido e exibe tela de confirmação", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.goto("/carrinho");

  await page.getByRole("button", { name: "Finalizar pedido" }).click();

  await expect(page.getByRole("heading", { name: "Pedido realizado!" })).toBeVisible();
  await expect(page.getByText("Número do pedido:")).toBeVisible();
  await expect(page.getByText("Total:")).toBeVisible();
});

test("carrinho fica vazio após finalizar pedido", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.goto("/carrinho");
  await page.getByRole("button", { name: "Finalizar pedido" }).click();

  // Volta ao catálogo e vai ao carrinho novamente
  await page.getByRole("link", { name: "Continuar comprando" }).click();
  await page.goto("/carrinho");

  await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible();
});

test("estoque é reduzido após finalizar pedido", async ({ page }) => {
  // Lê o estoque inicial do primeiro produto
  const stockText = await page.locator(".grid > div p.text-sm.font-medium").first().textContent();
  const initialStock = parseInt(stockText!.match(/\d+/)![0], 10);

  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.goto("/carrinho");
  await page.getByRole("button", { name: "Finalizar pedido" }).click();

  await page.goto("/catalogo");

  const newStockText = await page
    .locator(".grid > div p.text-sm.font-medium")
    .first()
    .textContent();
  const newStock = parseInt(newStockText!.match(/\d+/)![0], 10);

  expect(newStock).toBe(initialStock - 1);
});

test("não finaliza pedido com carrinho vazio", async ({ page }) => {
  await page.goto("/carrinho");
  await expect(page.getByRole("button", { name: "Finalizar pedido" })).not.toBeVisible();
  await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible();
});
