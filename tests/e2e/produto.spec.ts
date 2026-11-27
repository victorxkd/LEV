import { expect, test } from "@playwright/test";

const productName = "Teclado Mecânico Redragon Kumara K552";

test("abre os detalhes do produto e adiciona o item ao carrinho", async ({ page }) => {
  await page.goto("/catalogo");
  const card = page.getByRole("article").filter({ hasText: productName });
  await card.getByRole("link", { name: "Ver detalhes" }).click();

  await expect(page.getByRole("heading", { name: productName, exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Outemu Blue", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.getByRole("link", { name: "Ver carrinho", exact: true }).click();
  await expect(page).toHaveURL(/\/carrinho$/);
  await expect(page.getByRole("paragraph").filter({ hasText: productName })).toBeVisible();
});

test("oferece retorno ao catálogo para um produto inexistente", async ({ page }) => {
  await page.goto("/catalogo/produto-inexistente");

  await expect(page.getByRole("heading", { name: "Produto não encontrado" })).toBeVisible();
  await page.getByRole("link", { name: "Voltar ao catálogo" }).click();
  await expect(page.getByRole("heading", { name: "Catálogo", exact: true })).toBeVisible();
});
