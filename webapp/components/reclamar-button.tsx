"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReclamarButton({ excedenteId }: { excedenteId: string }) {
  const router = useRouter();
  const [abierto, setAbierto] = React.useState(false);
  const [reclamadoPor, setReclamadoPor] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [enviando, setEnviando] = React.useState(false);

  async function handleReclamar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!reclamadoPor.trim()) {
      setError("Indica el nombre del punto receptor.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`/api/excedentes/${excedenteId}/reclamar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reclamadoPor }),
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.error ?? "No se pudo reclamar el excedente.");
        return;
      }

      setAbierto(false);
      router.refresh();
    } catch {
      setError("Ocurrio un error de red. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  if (!abierto) {
    return (
      <Button size="sm" onClick={() => setAbierto(true)}>
        Reclamar
      </Button>
    );
  }

  return (
    <form onSubmit={handleReclamar} className="flex flex-col gap-2">
      <Input
        autoFocus
        placeholder="Nombre del punto receptor"
        value={reclamadoPor}
        onChange={(e) => setReclamadoPor(e.target.value)}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={enviando}>
          {enviando ? "Reclamando..." : "Confirmar reclamo"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setAbierto(false)}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
