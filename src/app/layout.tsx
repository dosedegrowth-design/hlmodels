import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";

export const metadata: Metadata = {
  title: "HL Models - Agência de Modelos",
  description: "Agência de modelos profissional. Conheça nosso casting de modelos masculinos, femininos e não-binários.",
  keywords: ["agência de modelos", "modelos", "casting", "moda", "HL Models"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-foreground antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
