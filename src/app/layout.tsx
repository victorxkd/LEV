import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LEV — Loja de Periféricos",
  description: "Teclados, mouses, mousepads, headsets e acessórios para computador.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        <header className="bg-white border-b border-zinc-200 px-6 py-4">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight">
              LEV
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link href="/catalogo" className="hover:text-zinc-600 transition-colors">
                Catálogo
              </Link>
              <Link href="/carrinho" className="hover:text-zinc-600 transition-colors">
                Carrinho
              </Link>
              <Link href="/comparar" className="hover:text-zinc-600 transition-colors">
                Comparar
              </Link>
              <Link href="/admin" className="hover:text-zinc-600 transition-colors">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-400">
          LEV — Loja de Periféricos · Trabalho prático de Teste de Software · DCC/UFMG
        </footer>
      </body>
    </html>
  );
}
