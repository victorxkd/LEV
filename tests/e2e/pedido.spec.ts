import { test, expect } from "@playwright/test";

const mouse = "Mouse Gamer Logitech G PRO X SUPERLIGHT 2";

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
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
  const card = page.getByRole("article").filter({ hasText: mouse });
  await expect(card.getByText("6 em estoque", { exact: true })).toBeVisible();

  await card.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.goto("/carrinho");
  await page.getByRole("button", { name: "Finalizar pedido" }).click();

  await page.goto("/catalogo");
  await expect(card.getByText("5 em estoque", { exact: true })).toBeVisible();
});

test("não finaliza pedido com carrinho vazio", async ({ page }) => {
  await page.goto("/carrinho");
  await expect(page.getByRole("button", { name: "Finalizar pedido" })).not.toBeVisible();
  await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible();
});

test("permite ajustar a quantidade após redução de estoque no admin", async ({ page }) => {
  const card = page.getByRole("article").filter({ hasText: mouse });
  const add = card.getByRole("button", { name: "Adicionar ao carrinho" });
  await add.click();
  await add.click();
  await add.click();

  await page.goto("/admin");
  const product = page.getByRole("listitem").filter({ hasText: mouse });
  await product.getByRole("button", { name: "Editar", exact: true }).click();
  await page.getByLabel("Estoque", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(product.getByText(/· 1 em estoque$/)).toBeVisible();

  await page.goto("/carrinho");
  const finalize = page.getByRole("button", { name: "Finalizar pedido" });
  await finalize.click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Verifique o estoque");

  await page.getByRole("button", { name: "Diminuir quantidade" }).click();
  await expect(page.getByLabel("Total do carrinho")).toHaveText("R$ 899,90");
  await finalize.click();
  await expect(page.getByRole("heading", { name: "Pedido realizado!" })).toBeVisible();
});
