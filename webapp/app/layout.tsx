import type { Metadata, Viewport } from "next";
import { StoreProvider } from "@/lib/store";
import { Topbar } from "@/components/topbar";
import { CertificadoDialog } from "@/components/certificado-dialog";
import { Toast } from "@/components/toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sobra+ | Excedentes de alimentos con certificado de donación",
  description:
    "Portal que conecta establecimientos con excedentes aptos para consumo con bancos de alimentos y ESAL aliadas, con certificado de donación según la Ley 2380 de 2024.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          <a className="skip" href="#contenido">Ir al contenido</a>
          <Topbar />
          <main id="contenido">{children}</main>
          <footer className="foot">
            <span>Prototipo de demostración. Los datos son de ejemplo y se guardan solo en este navegador.</span>
            <span>Sobra+ · reto domoi</span>
          </footer>
          <CertificadoDialog />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
