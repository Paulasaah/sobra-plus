import { notFound } from "next/navigation";
import { obtenerExcedente } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoBadge } from "@/components/estado-badge";
import { ReclamarButton } from "@/components/reclamar-button";
import { ConfirmarButton } from "@/components/confirmar-button";
import { CertificadoView } from "@/components/certificado-view";
import { RoleGate } from "@/components/role-gate";
import { formatCOP, formatFecha } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ExcedenteDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const excedente = obtenerExcedente(id);

  if (!excedente) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{excedente.tipoAlimento}</CardTitle>
            <EstadoBadge estado={excedente.estado} />
          </div>
          <CardDescription>{excedente.establecimiento}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <dl className="grid grid-cols-2 gap-4 text-sm">
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
            <div>
              <dt className="text-xs text-muted-foreground">Fecha limite</dt>
              <dd className="font-medium">{formatFecha(excedente.fechaLimite)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Publicado el</dt>
              <dd className="font-medium">{formatFecha(excedente.creadoEn)}</dd>
            </div>
            {excedente.reclamadoPor && (
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Reclamado por</dt>
                <dd className="font-medium">{excedente.reclamadoPor}</dd>
              </div>
            )}
          </dl>

          {excedente.estado === "disponible" && (
            <RoleGate
              rolRequerido="punto-receptor"
              fallback={
                <p className="text-sm text-muted-foreground">
                  Este excedente esta disponible. Cambia tu rol a punto
                  receptor para reclamarlo.
                </p>
              }
            >
              <ReclamarButton excedenteId={excedente.id} />
            </RoleGate>
          )}

          {excedente.estado === "reclamado" && (
            <RoleGate
              rolRequerido="punto-receptor"
              fallback={
                <p className="text-sm text-muted-foreground">
                  Este excedente fue reclamado por {excedente.reclamadoPor} y
                  esta pendiente de confirmacion de recepcion.
                </p>
              }
            >
              <ConfirmarButton excedenteId={excedente.id} />
            </RoleGate>
          )}
        </CardContent>
      </Card>

      {excedente.estado === "certificado" && excedente.certificado && (
        <CertificadoView excedente={excedente} certificado={excedente.certificado} />
      )}
    </div>
  );
}
