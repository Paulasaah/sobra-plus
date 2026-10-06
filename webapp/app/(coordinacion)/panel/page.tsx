import Link from "next/link";
import { listarExcedentes, obtenerMetricas } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoBadge } from "@/components/estado-badge";
import { EstadoExcedente, Excedente } from "@/lib/types";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

const COLUMNAS: { estado: EstadoExcedente; titulo: string }[] = [
  { estado: "disponible", titulo: "Disponible" },
  { estado: "reclamado", titulo: "Reclamado" },
  { estado: "confirmado", titulo: "Confirmado" },
  { estado: "certificado", titulo: "Certificado emitido" },
];

export default function PanelPage() {
  const metricas = obtenerMetricas();
  const excedentesPorEstado = Object.fromEntries(
    COLUMNAS.map(({ estado }) => [estado, listarExcedentes(estado)])
  ) as Record<EstadoExcedente, Excedente[]>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Panel centralizado</h1>
        <p className="text-muted-foreground">
          Vista operativa de todo lo que esta pasando en el portal: disponible,
          en transito, confirmado y donaciones certificadas.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total de excedentes gestionados</CardDescription>
            <CardTitle className="text-3xl">{metricas.totalGestionados}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>
              Cantidad total salvada (reclamada o certificada)
            </CardDescription>
            <CardTitle className="text-3xl">{metricas.cantidadTotalSalvada}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Descuento tributario acumulado (37%)</CardDescription>
            <CardTitle className="text-3xl">
              {formatCOP(metricas.descuentoTributarioAcumulado)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {COLUMNAS.map(({ estado, titulo }) => (
          <div key={estado} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {titulo}
              </h2>
              <span className="text-xs text-muted-foreground">
                {excedentesPorEstado[estado].length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {excedentesPorEstado[estado].length === 0 ? (
                <p className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                  Sin excedentes en este estado.
                </p>
              ) : (
                excedentesPorEstado[estado].map((excedente) => (
                  <Link key={excedente.id} href={`/excedentes/${excedente.id}`}>
                    <Card className="transition-colors hover:border-primary/50">
                      <CardContent className="flex flex-col gap-2 pt-5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">
                            {excedente.tipoAlimento}
                          </p>
                          <EstadoBadge estado={excedente.estado} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {excedente.establecimiento}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {excedente.cantidad} {excedente.unidad} · Limite{" "}
                          {formatFecha(excedente.fechaLimite)}
                        </p>
                        {excedente.certificado && (
                          <p className="text-xs font-medium text-primary">
                            Descuento: {formatCOP(excedente.certificado.descuentoTributario)}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
