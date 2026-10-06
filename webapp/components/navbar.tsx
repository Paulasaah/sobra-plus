"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RoleToggle } from "@/components/role-toggle";
import { cn } from "@/lib/utils";

const ENLACES = [
  { href: "/", etiqueta: "Inicio" },
  { href: "/excedentes/nuevo", etiqueta: "Publicar excedente" },
  { href: "/excedentes", etiqueta: "Disponibles" },
  { href: "/panel", etiqueta: "Panel" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
            Sobra+
          </Link>
          <div className="sm:hidden">
            <RoleToggle />
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-1">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted",
                pathname === enlace.href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {enlace.etiqueta}
            </Link>
          ))}
        </nav>

        <div className="hidden sm:block">
          <RoleToggle />
        </div>
      </div>
    </header>
  );
}
