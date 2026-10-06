import { ESTADOS } from "@/lib/reglas";
import type { Estado } from "@/lib/types";

export function Pill({ estado }: { estado: Estado }) {
  return <span className={`pill s-${estado}`}>{ESTADOS[estado]}</span>;
}
