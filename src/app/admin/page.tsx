"use client";

import dynamic from "next/dynamic";

const AdminClient = dynamic(
  () => import("./AdminClient").then((m) => m.AdminClient),
  { ssr: false },
);

export default function AdminPage() {
  return <AdminClient />;
}
