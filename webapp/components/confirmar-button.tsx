"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ConfirmarButton({ excedenteId }: { excedenteId: string }) {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [enviando, setEnviando] = React.useState(false);

  async function handleConfirmar() {
    setError(null);
    setEnviando(true);
    try {
      const respuesta = await fetch(`/api/excedentes/${excedenteId}/confirmar`, {
        method: "POST",
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.error ?? "No se pudo confirmar la recepcion.");
        return;
      }

      router.refresh();
    } catch {
      setError("Ocurrio un error de red. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleConfirmar} disabled={enviando}>
        {enviando ? "Confirmando..." : "Confirmar recepcion"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
