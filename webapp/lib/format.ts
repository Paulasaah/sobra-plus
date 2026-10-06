import type { Excedente } from "./types";

const cop = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const nf = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });
const fFecha = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const fDia = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric" });

export const money = (n: number) => cop.format(Math.round(n));
export const num = (n: number) => nf.format(n);
export const fecha = (iso: string | number | Date) => fFecha.format(new Date(iso));
export const dia = (iso: string | number | Date) => fDia.format(new Date(iso));
export const cantidad = (e: Pick<Excedente, "cantidad" | "unidad">) => `${nf.format(e.cantidad)} ${e.unidad}`;

const pad = (n: number) => String(n).padStart(2, "0");
export const isoDate = (t: number) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
export const localDT = (t: number) => { const d = new Date(t); return `${isoDate(t)}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };
