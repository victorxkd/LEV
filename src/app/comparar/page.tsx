"use client";

import dynamic from "next/dynamic";

const CompararClient = dynamic(
  () => import("./CompararClient").then((m) => m.CompararClient),
  { ssr: false },
);

export default function CompararPage() {
  return <CompararClient />;
}
