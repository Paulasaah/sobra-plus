import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(valor: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
