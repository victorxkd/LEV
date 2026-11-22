"use client";

import dynamic from "next/dynamic";

const CarrinhoClient = dynamic(
  () => import("./CarrinhoClient").then((m) => m.CarrinhoClient),
  { ssr: false },
);

export default function CarrinhoPage() {
  return <CarrinhoClient />;
}
