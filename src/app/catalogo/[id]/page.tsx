"use client";

import dynamic from "next/dynamic";

const ProdutoDetalheClient = dynamic(
  () => import("./ProdutoDetalheClient").then((m) => m.ProdutoDetalheClient),
  { ssr: false },
);

export default function ProdutoDetalhePage() {
  return <ProdutoDetalheClient />;
}
