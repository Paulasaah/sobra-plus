import Link from "next/link";
import { listarExcedentes } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EstadoBadge } from "@/components/estado-badge";
import { ReclamarButton } from "@/components/reclamar-button";
import { RoleGate } from "@/components/role-gate";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function ExcedentesDisponiblesPage() {
  const disponibles = listarExcedentes("disponible");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Excedentes disponibles</h1>
        <p className="text-muted-foreground">
          Alimentos aptos para consumo humano publicados por establecimientos,
          listos para ser reclamados por un punto receptor.
        </p>
      </div>

      {disponibles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-muted-foreground">
              No hay excedentes disponibles en este momento.
            </p>
            <Link href="/excedentes/nuevo">
              <Button variant="outline">Publicar el primero</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {disponibles.map((excedente) => (
            <Card key={excedente.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{excedente.tipoAlimento}</CardTitle>
                  <EstadoBadge estado={excedente.estado} />
                </div>
                <CardDescription>{excedente.establecimiento}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Cantidad</dt>
                    <dd className="font-medium">
                      {excedente.cantidad} {excedente.unidad}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Valor estimado</dt>
                    <dd className="font-medium">{formatCOP(excedente.valorEstimado)}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Fecha limite</dt>
                    <dd className="font-medium">{formatFecha(excedente.fechaLimite)}</dd>
                  </div>
                </dl>

                <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
                  <Link
                    href={`/excedentes/${excedente.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Ver detalle
                  </Link>
                  <RoleGate
                    rolRequerido="punto-receptor"
                    fallback={
                      <span className="text-xs text-muted-foreground">
                        Cambia a punto receptor para reclamar
                      </span>
                    }
                  >
                    <ReclamarButton excedenteId={excedente.id} />
                  </RoleGate>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
