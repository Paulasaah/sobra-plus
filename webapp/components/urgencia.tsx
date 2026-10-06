import { restante } from "@/lib/reglas";

export function Urgencia({ limite }: { limite: string }) {
  const r = restante(limite);
  return <span className={`urg ${r.cls}`}>{r.txt}</span>;
}
