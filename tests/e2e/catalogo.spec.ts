import { test, expect } from "@playwright/test";

const miceByAscendingPrice = [
  "Mouse Gamer Razer DeathAdder Essential",
  "Mouse Gamer Logitech G502 HERO",
  "Mouse Gamer Logitech G PRO X SUPERLIGHT 2",
];

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
});

test("exibe todos os produtos ao abrir o catálogo", async ({ page }) => {
  await expect(page.getByRole("article")).toHaveCount(18);
});

test("filtra produtos pelo campo de busca", async ({ page }) => {
  await page.getByLabel("Buscar produto").fill("Logitech");

  const names = page.getByRole("article").getByRole("heading");
  await expect(names.filter({ hasText: "Logitech" }).first()).toBeVisible();
  await expect(names.filter({ hasNotText: "Logitech" })).toHaveCount(0);
});

test("exibe mensagem quando busca não retorna resultados", async ({ page }) => {
  await page.getByLabel("Buscar produto").fill("produto inexistente xyz123");
  await expect(page.getByText("Nenhum produto encontrado.")).toBeVisible();
});

test("filtra produtos por categoria", async ({ page }) => {
  await page.getByLabel("Filtrar por categoria").selectOption("mouse");

  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(3);
  await expect(cards.filter({ has: page.getByText("Mouse", { exact: true }) })).toHaveCount(3);
});

test("ordena produtos do menor para o maior preço", async ({ page }) => {
  await page.getByLabel("Filtrar por categoria").selectOption("mouse");
  await page.getByLabel("Ordenar por preço").selectOption("asc");

  await expect(page.getByRole("article").getByRole("heading")).toHaveText(miceByAscendingPrice);
});

test("ordena produtos do maior para o menor preço", async ({ page }) => {
  await page.getByLabel("Filtrar por categoria").selectOption("mouse");
  await page.getByLabel("Ordenar por preço").selectOption("desc");

  await expect(page.getByRole("article").getByRole("heading")).toHaveText(
    [...miceByAscendingPrice].reverse(),
  );
});
