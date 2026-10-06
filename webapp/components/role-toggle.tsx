"use client";

import { useRole } from "@/components/role-provider";
import { cn } from "@/lib/utils";

const OPCIONES: { valor: "establecimiento" | "punto-receptor"; etiqueta: string }[] = [
  { valor: "establecimiento", etiqueta: "Establecimiento" },
  { valor: "punto-receptor", etiqueta: "Punto receptor" },
];

export function RoleToggle() {
  const { rol, setRol } = useRole();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-muted p-1 text-xs">
      {OPCIONES.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          onClick={() => setRol(opcion.valor)}
          className={cn(
            "rounded px-2.5 py-1.5 font-medium transition-colors",
            rol === opcion.valor
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={rol === opcion.valor}
        >
          {opcion.etiqueta}
        </button>
      ))}
    </div>
  );
}
