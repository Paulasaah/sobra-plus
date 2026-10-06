import type { Metadata } from "next";
import { RoleProvider } from "@/components/role-provider";
import { Navbar } from "@/components/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sobra+ | Portal de redistribucion de excedentes alimentarios",
  description:
    "Portal que conecta establecimientos con excedentes de alimentos aptos para consumo con puntos receptores (bancos de alimentos y ESAL aliadas), con certificado de donacion segun la Ley 2380 de 2024.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <RoleProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </RoleProvider>
      </body>
    </html>
  );
}
