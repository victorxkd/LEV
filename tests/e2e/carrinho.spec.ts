import { test, expect } from "@playwright/test";
import { initialProducts } from "../../src/data/products";

const keyboard = "Teclado Mecânico Redragon Kumara K552";

test.beforeEach(async ({ page }) => {
  await page.goto("/catalogo");
});

test("adiciona produto ao carrinho e exibe feedback", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await expect(page.getByRole("status")).toContainText("adicionado ao carrinho");
});

test("calcula o total do carrinho e o atualiza ao mudar a quantidade", async ({ page }) => {
  const card = page.getByRole("article").filter({ hasText: keyboard });
  await card.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.getByRole("link", { name: "Ver carrinho", exact: true }).click();

  const total = page.getByLabel("Total do carrinho");
  await expect(total).toHaveText("R$ 189,90");

  await page.getByRole("button", { name: "Aumentar quantidade" }).click();
  await expect(total).toHaveText("R$ 379,80");

  await page.getByRole("button", { name: "Diminuir quantidade" }).click();
  await expect(total).toHaveText("R$ 189,90");
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
  const modified = initialProducts.map((product) =>
    product.name === keyboard ? { ...product, stock: 0 } : product,
  );

  await page.evaluate((products) => {
    localStorage.setItem("lev:products", JSON.stringify(products));
  }, modified);
  await page.reload();

  const card = page.getByRole("article").filter({ hasText: keyboard });
  await expect(card.getByRole("button", { name: "Adicionar ao carrinho" })).toBeDisabled();
});

test("remove item do carrinho", async ({ page }) => {
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).first().click();
  await page.goto("/carrinho");

  await page.getByRole("button", { name: "Remover" }).first().click();
  await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible();
});

test("permite retirar do carrinho um produto excluído do catálogo", async ({ page }) => {
  const card = page.getByRole("article").filter({ hasText: keyboard });
  await card.getByRole("button", { name: "Adicionar ao carrinho" }).click();

  await page.goto("/admin");
  const product = page.getByRole("listitem").filter({ hasText: keyboard });
  page.once("dialog", (dialog) => dialog.accept());
  await product.getByRole("button", { name: "Remover", exact: true }).click();
  await expect(product).toHaveCount(0);

  await page.goto("/carrinho");
  await expect(page.getByText("Produto indisponível")).toBeVisible();
  await page.getByRole("button", { name: "Remover", exact: true }).click();
  await expect(page.getByText("Seu carrinho está vazio.")).toBeVisible();
});
