// Calculo del certificado de donacion.
// Unica base legal valida: Ley 2380 de 2024 (docs/MARCO_LEGAL.md).
// Nunca usar 35% ni 27%: son cifras del esquema tributario anterior, ya derogado,
// o cifras no verificadas senaladas explicitamente como incorrectas en MARCO_LEGAL.md.

import { Certificado } from "./types";

export const PORCENTAJE_DESCUENTO_TRIBUTARIO = 37 as const;

export const VALOR_POR_DEFECTO_POR_UNIDAD = 6000; // COP, estimacion simple por kg/unidad/porcion

/**
 * Calcula un valor estimado por defecto cuando el establecimiento no
 * proporciona uno en el formulario de publicacion.
 */
export function calcularValorEstimadoPorDefecto(cantidad: number): number {
  return Math.round(cantidad * VALOR_POR_DEFECTO_POR_UNIDAD);
}

/**
 * Genera el certificado de donacion con el descuento tributario del 37%
 * (Ley 2380 de 2024) y la nota de exclusion de IVA.
 */
export function calcularCertificado(valorEstimado: number): Certificado {
  const descuentoTributario = Math.round(
    (valorEstimado * PORCENTAJE_DESCUENTO_TRIBUTARIO) / 100
  );

  return {
    valorEstimado,
    porcentajeDescuento: PORCENTAJE_DESCUENTO_TRIBUTARIO,
    descuentoTributario,
    notaExclusionIVA:
      "Donacion excluida de IVA (articulo 424 del Estatuto Tributario, modificado por la Ley 2380 de 2024).",
    ley: "Ley 2380 de 2024",
    emitidoEn: new Date().toISOString(),
  };
}
