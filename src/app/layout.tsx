import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geist = localFont({
  src: "./fonts/geist-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "LEV — Loja de Periféricos",
  description: "Teclados, mouses, mousepads, headsets e acessórios para computador.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans antialiased">
        <header className="bg-white border-b border-zinc-200 px-6 py-4">
          <nav className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
              LEV
            </Link>
            <div className="flex gap-6 text-sm font-medium text-zinc-700">
              <Link href="/catalogo" className="hover:text-zinc-900 transition-colors">
                Catálogo
              </Link>
              <Link href="/carrinho" className="hover:text-zinc-900 transition-colors">
                Carrinho
              </Link>
              <Link href="/comparar" className="hover:text-zinc-900 transition-colors">
                Comparar
              </Link>
              <Link href="/admin" className="hover:text-zinc-900 transition-colors">
                Admin
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-400">
          LEV — Loja de Periféricos
        </footer>
      </body>
    </html>
  );
}
