"use client";

import { useState } from "react";
import { useProducts } from "@/lib/storage/useProducts";
import { formatPrice } from "@/lib/format";
import { Category, Product } from "@/lib/types";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "keyboard", label: "Teclado" },
  { value: "mouse", label: "Mouse" },
  { value: "mousepad", label: "Mousepad" },
  { value: "monitor-stand", label: "Suporte de monitor" },
  { value: "headset", label: "Headset" },
  { value: "accessory", label: "Acessório" },
];

type FormState = {
  name: string;
  category: Category;
  priceInCents: string;
  stock: string;
  specs: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  category: "keyboard",
  priceInCents: "",
  stock: "",
  specs: "",
};

function productToForm(p: Product): FormState {
  return {
    name: p.name,
    category: p.category,
    priceInCents: (p.priceInCents / 100).toFixed(2),
    stock: String(p.stock),
    specs: Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n"),
  };
}

function parseSpecs(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw
      .split("\n")
      .map((line) => line.split(":").map((s) => s.trim()))
      .filter(([k]) => k),
  );
}

function formToInput(form: FormState): Omit<Product, "id"> {
  return {
    name: form.name.trim(),
    category: form.category,
    priceInCents: Math.round(parseFloat(form.priceInCents) * 100),
    stock: parseInt(form.stock, 10),
    specs: parseSpecs(form.specs),
  };
}

export function AdminClient() {
  const { products, add, edit, remove } = useProducts();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2500);
  }

  function handleField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const input = formToInput(form);

    if (editingId) {
      const ok = edit(editingId, input);
      if (!ok) {
        setError("Dados inválidos. Verifique os campos.");
        return;
      }
      flash("Produto atualizado com sucesso.");
      setEditingId(null);
    } else {
      const ok = add(input);
      if (!ok) {
        setError("Dados inválidos. Verifique os campos.");
        return;
      }
      flash("Produto criado com sucesso.");
    }
    setForm(EMPTY_FORM);
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm(productToForm(product));
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancel() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  function handleRemove(id: string, name: string) {
    if (!confirm(`Remover "${name}"?`)) return;
    remove(id);
    flash("Produto removido.");
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-zinc-900 mb-8">Admin — Produtos</h1>

      {/* Formulário */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 mb-10">
        <h2 className="text-base font-semibold text-zinc-900 mb-5">
          {editingId ? "Editar produto" : "Novo produto"}
        </h2>

        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="admin-name" className="block text-sm font-medium text-zinc-700 mb-1">
              Nome
            </label>
            <input
              id="admin-name"
              type="text"
              value={form.name}
              onChange={(e) => handleField("name", e.target.value)}
              placeholder="Ex: Teclado Mecânico XYZ"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div>
            <label
              htmlFor="admin-category"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Categoria
            </label>
            <select
              id="admin-category"
              value={form.category}
              onChange={(e) => handleField("category", e.target.value)}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="admin-price" className="block text-sm font-medium text-zinc-700 mb-1">
              Preço (R$)
            </label>
            <input
              id="admin-price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.priceInCents}
              onChange={(e) => handleField("priceInCents", e.target.value)}
              placeholder="Ex: 299.90"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div>
            <label htmlFor="admin-stock" className="block text-sm font-medium text-zinc-700 mb-1">
              Estoque
            </label>
            <input
              id="admin-stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => handleField("stock", e.target.value)}
              placeholder="Ex: 10"
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="admin-specs" className="block text-sm font-medium text-zinc-700 mb-1">
              Especificações{" "}
              <span className="text-zinc-400 font-normal">(uma por linha: chave: valor)</span>
            </label>
            <textarea
              id="admin-specs"
              value={form.specs}
              onChange={(e) => handleField("specs", e.target.value)}
              rows={4}
              placeholder={"marca: Redragon\nconexão: USB"}
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-zinc-400 resize-none"
            />
          </div>

          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-zinc-900 text-white text-sm font-semibold rounded-lg px-6 py-2.5 hover:bg-zinc-700 transition-colors"
            >
              {editingId ? "Salvar alterações" : "Criar produto"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm font-medium text-zinc-500 border border-zinc-300 rounded-lg px-6 py-2.5 hover:bg-zinc-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista de produtos */}
      <section>
        <h2 className="text-base font-semibold text-zinc-900 mb-4">
          Produtos cadastrados ({products.length})
        </h2>

        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-zinc-900 truncate">{product.name}</p>
                <p className="text-sm text-zinc-500">
                  {formatPrice(product.priceInCents)} · {product.stock} em estoque
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg px-3 py-1.5 hover:bg-zinc-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleRemove(product.id, product.name)}
                  className="text-sm font-medium text-red-500 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
