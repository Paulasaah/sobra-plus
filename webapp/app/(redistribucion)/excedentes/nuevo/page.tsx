"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { UnidadCantidad } from "@/lib/types";

export default function NuevoExcedentePage() {
  const router = useRouter();

  const [establecimiento, setEstablecimiento] = React.useState("");
  const [tipoAlimento, setTipoAlimento] = React.useState("");
  const [cantidad, setCantidad] = React.useState("");
  const [unidad, setUnidad] = React.useState<UnidadCantidad>("kg");
  const [aptoConsumo, setAptoConsumo] = React.useState<"si" | "no" | "">("");
  const [fechaLimite, setFechaLimite] = React.useState("");
  const [valorEstimado, setValorEstimado] = React.useState("");

  const [error, setError] = React.useState<string | null>(null);
  const [enviando, setEnviando] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (aptoConsumo === "no") {
      setError(
        "Solo se aceptan alimentos aptos para consumo humano. Este excedente no puede publicarse en el portal; corresponde a otra categoria de manejo de residuos."
      );
      return;
    }

    if (aptoConsumo === "") {
      setError("Debes indicar si el alimento es apto para consumo humano.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch("/api/excedentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          establecimiento,
          tipoAlimento,
          cantidad: Number(cantidad),
          unidad,
          aptoConsumo: aptoConsumo === "si",
          fechaLimite: new Date(fechaLimite).toISOString(),
          valorEstimado: valorEstimado ? Number(valorEstimado) : undefined,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.error ?? "No se pudo publicar el excedente.");
        return;
      }

      router.push(`/excedentes/${data.excedente.id}`);
    } catch {
      setError("Ocurrio un error de red. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Publicar excedente</CardTitle>
          <CardDescription>
            Registra el excedente disponible para que un punto receptor pueda
            reclamarlo. Solo se aceptan alimentos aptos para consumo humano.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="establecimiento">Establecimiento</Label>
              <Input
                id="establecimiento"
                placeholder="Ej. Restaurante La Central"
                value={establecimiento}
                onChange={(e) => setEstablecimiento(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tipoAlimento">Tipo de alimento</Label>
              <Input
                id="tipoAlimento"
                placeholder="Ej. Arroz y pollo guisado preparados"
                value={tipoAlimento}
                onChange={(e) => setTipoAlimento(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cantidad">Cantidad</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="Ej. 25"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="unidad">Unidad</Label>
                <Select
                  id="unidad"
                  value={unidad}
                  onChange={(e) => setUnidad(e.target.value as UnidadCantidad)}
                >
                  <option value="kg">Kilogramos (kg)</option>
                  <option value="unidades">Unidades</option>
                  <option value="porciones">Porciones</option>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>¿Es apto para consumo humano?</Label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="aptoConsumo"
                    value="si"
                    checked={aptoConsumo === "si"}
                    onChange={() => setAptoConsumo("si")}
                  />
                  Si, es apto para consumo humano
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="aptoConsumo"
                    value="no"
                    checked={aptoConsumo === "no"}
                    onChange={() => setAptoConsumo("no")}
                  />
                  No
                </label>
              </div>
              <p className="text-xs text-muted-foreground">
                El portal solo gestiona excedentes aptos para consumo humano.
                Alimentos no aptos corresponden a otra categoria de manejo de
                residuos y no pueden publicarse aqui.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="fechaLimite">Fecha limite de recoleccion</Label>
              <Input
                id="fechaLimite"
                type="datetime-local"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="valorEstimado">
                Valor estimado en COP (opcional)
              </Label>
              <Input
                id="valorEstimado"
                type="number"
                min="0"
                placeholder="Si lo dejas vacio, se calcula un estimado automatico"
                value={valorEstimado}
                onChange={(e) => setValorEstimado(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Este valor se usa para calcular el descuento tributario del
                37% al emitir el certificado de donacion (Ley 2380 de 2024).
              </p>
            </div>

            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" disabled={enviando}>
              {enviando ? "Publicando..." : "Publicar excedente"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
