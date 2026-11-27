"use client";

import dynamic from "next/dynamic";

const CatalogoClient = dynamic(() => import("./CatalogoClient").then((m) => m.CatalogoClient), {
  ssr: false,
});

export default function CatalogoPage() {
  return <CatalogoClient />;
}
