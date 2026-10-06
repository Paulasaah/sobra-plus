import { Badge } from "@/components/ui/badge";
import { EstadoExcedente } from "@/lib/types";

const CONFIG: Record<
  EstadoExcedente,
  { etiqueta: string; variant: "default" | "secondary" | "outline" | "success" | "warning" }
> = {
  disponible: { etiqueta: "Disponible", variant: "success" },
  reclamado: { etiqueta: "Reclamado", variant: "warning" },
  confirmado: { etiqueta: "Confirmado", variant: "secondary" },
  certificado: { etiqueta: "Certificado emitido", variant: "default" },
};

export function EstadoBadge({ estado }: { estado: EstadoExcedente }) {
  const config = CONFIG[estado];
  return <Badge variant={config.variant}>{config.etiqueta}</Badge>;
}
