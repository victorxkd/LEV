import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("exibe mensagem quando não há produtos na comparação", async ({ page }) => {
  await page.goto("/comparar");
  await expect(page.getByText("Nenhum produto selecionado para comparação.")).toBeVisible();
});

test("adiciona produto à comparação e exibe feedback", async ({ page }) => {
  await page.getByRole("button", { name: "Comparar" }).first().click();
  await expect(page.getByRole("status")).toContainText("adicionado à comparação");
});

test("botão muda para 'Na comparação' após adicionar", async ({ page }) => {
  await page.getByRole("button", { name: "Comparar" }).first().click();
  await expect(page.getByRole("button", { name: "Na comparação" }).first()).toBeDisabled();
});

test("link de comparação aparece após adicionar produto", async ({ page }) => {
  await page.getByRole("button", { name: "Comparar" }).first().click();
  await expect(page.getByRole("link", { name: /Comparar \(1\)/ })).toBeVisible();
});

test("compara dois produtos lado a lado na página de comparação", async ({ page }) => {
  const buttons = page.getByRole("button", { name: "Comparar" });
  await buttons.nth(0).click();
  await buttons.nth(1).click();

  await page.getByRole("link", { name: /Comparar \(2\)/ }).click();

  await expect(page.getByRole("heading", { name: "Comparação de produtos" })).toBeVisible();
  // Duas colunas de produto na tabela
  const headers = page.locator("thead th").filter({ hasNotText: "Produto" });
  await expect(headers).toHaveCount(2);
});

test("bloqueia adição de mais de 3 produtos na comparação", async ({ page }) => {
  const buttons = page.getByRole("button", { name: "Comparar" });
  await buttons.nth(0).click();
  await buttons.nth(1).click();
  await buttons.nth(2).click();
  // Quarto produto deve falhar
  await buttons.nth(3).click();
  await expect(page.getByRole("status")).toContainText("Comparação cheia");
});

test("remove produto da comparação na página /comparar", async ({ page }) => {
  const buttons = page.getByRole("button", { name: "Comparar" });
  await buttons.nth(0).click();
  await buttons.nth(1).click();

  await page.getByRole("link", { name: /Comparar \(2\)/ }).click();

  await page.getByRole("button", { name: "Remover" }).first().click();
  const headers = page.locator("thead th").filter({ hasNotText: "Produto" });
  await expect(headers).toHaveCount(1);
});
