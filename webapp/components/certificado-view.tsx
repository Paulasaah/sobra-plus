import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Certificado, Excedente } from "@/lib/types";
import { formatCOP, formatFecha } from "@/lib/utils";

export function CertificadoView({
  excedente,
  certificado,
}: {
  excedente: Excedente;
  certificado: Certificado;
}) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle>Certificado de donacion</CardTitle>
        <CardDescription>
          Soporte del beneficio tributario por donacion de alimentos, {certificado.ley}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Establecimiento donante</dt>
            <dd className="font-medium">{excedente.establecimiento}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Punto receptor</dt>
            <dd className="font-medium">{excedente.reclamadoPor ?? "N/A"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Cantidad donada</dt>
            <dd className="font-medium">
              {excedente.cantidad} {excedente.unidad}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Fecha de emision</dt>
            <dd className="font-medium">{formatFecha(certificado.emitidoEn)}</dd>
          </div>
        </dl>

        <div className="rounded-md border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Valor estimado de la donacion</p>
          <p className="text-2xl font-semibold">{formatCOP(certificado.valorEstimado)}</p>
        </div>

        <div className="rounded-md border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-primary">
            Descuento tributario ({certificado.porcentajeDescuento}%)
          </p>
          <p className="text-2xl font-semibold text-primary">
            {formatCOP(certificado.descuentoTributario)}
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {certificado.notaExclusionIVA}
        </p>

        <p className="text-xs text-muted-foreground">
          Certificado emitido en alianza con una ESAL reconocida (ABACO / Banco
          de Alimentos de Colombia) mientras la entidad operadora del portal
          tramita su propio reconocimiento como ESAL con regimen tributario
          especial ante la DIAN. Documento de referencia para la declaracion
          de renta del establecimiento donante.
        </p>
      </CardContent>
    </Card>
  );
}
