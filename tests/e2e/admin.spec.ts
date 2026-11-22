import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/admin");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("exibe lista de produtos na página admin", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Admin — Produtos" })).toBeVisible();
  await expect(page.getByText("Produtos cadastrados (18)")).toBeVisible();
});

test("cria novo produto e o exibe na lista admin", async ({ page }) => {
  await page.locator("#admin-name").fill("Teclado de Teste E2E");
  await page.locator("#admin-category").selectOption("keyboard");
  await page.locator("#admin-price").fill("199.90");
  await page.locator("#admin-stock").fill("5");

  await page.getByRole("button", { name: "Criar produto" }).click();

  await expect(page.getByText("Produto criado com sucesso.")).toBeVisible();
  await expect(page.getByText("Teclado de Teste E2E")).toBeVisible();
  await expect(page.getByText("Produtos cadastrados (19)")).toBeVisible();
});

test("produto criado no admin aparece no catálogo", async ({ page }) => {
  await page.locator("#admin-name").fill("Mouse de Teste E2E");
  await page.locator("#admin-category").selectOption("mouse");
  await page.locator("#admin-price").fill("99.90");
  await page.locator("#admin-stock").fill("10");

  await page.getByRole("button", { name: "Criar produto" }).click();

  await page.goto("/catalogo");
  await page.getByLabel("Buscar produto").fill("Mouse de Teste E2E");

  await expect(page.getByText("Mouse de Teste E2E")).toBeVisible();
});

test("edita produto existente na admin", async ({ page }) => {
  await page.getByRole("button", { name: "Editar" }).first().click();

  await page.locator("#admin-stock").fill("99");
  await page.getByRole("button", { name: "Salvar alterações" }).click();

  await expect(page.getByText("Produto atualizado com sucesso.")).toBeVisible();
  await expect(page.getByText("99 em estoque")).toBeVisible();
});

test("remove produto na admin e ele some da lista", async ({ page }) => {
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Remover" }).first().click();

  await expect(page.getByText("Produtos cadastrados (17)")).toBeVisible();
});

test("exibe erro ao tentar criar produto com nome vazio", async ({ page }) => {
  await page.locator("#admin-price").fill("100.00");
  await page.locator("#admin-stock").fill("5");

  await page.getByRole("button", { name: "Criar produto" }).click();

  await expect(page.getByText("Dados inválidos. Verifique os campos.")).toBeVisible();
});
