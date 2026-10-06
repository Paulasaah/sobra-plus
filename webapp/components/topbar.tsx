"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/establecimiento", etiqueta: "Establecimiento" },
  { href: "/receptor", etiqueta: "Punto receptor" },
  { href: "/panel", etiqueta: "Panel" },
];

export function Topbar() {
  const pathname = usePathname();
  return (
    <header className="top">
      <div className="top-in">
        <Link className="wordmark" href="/">
          Sobra<b>+</b>
          <small>prototipo</small>
        </Link>
        <nav className="tabs" aria-label="Secciones">
          {ENLACES.map((e) => (
            <Link key={e.href} className="tab" href={e.href} aria-current={pathname === e.href ? "page" : undefined}>
              {e.etiqueta}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
