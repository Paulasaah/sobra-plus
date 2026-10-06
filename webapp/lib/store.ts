// Almacenamiento en memoria del proceso (sin base de datos real).
// Ver docs/PLAN_IMPLEMENTACION.md: "Datos (para la demo): almacenamiento en
// memoria o archivo JSON en el servidor".
//
// Se guarda en globalThis para sobrevivir al hot-reload del modulo en
// desarrollo (Next.js recarga modulos de API routes con frecuencia).

import {
  Excedente,
  Metricas,
  NuevoExcedenteInput,
  EstadoExcedente,
} from "./types";
import {
  calcularCertificado,
  calcularValorEstimadoPorDefecto,
} from "./certificado";

type Almacen = {
  excedentes: Excedente[];
  siguienteId: number;
};

const ALMACEN_KEY = "__sobraPlusStore__";

function obtenerAlmacen(): Almacen {
  const global = globalThis as unknown as { [ALMACEN_KEY]?: Almacen };
  if (!global[ALMACEN_KEY]) {
    global[ALMACEN_KEY] = {
      excedentes: semillaInicial(),
      siguienteId: 4,
    };
  }
  return global[ALMACEN_KEY];
}

// Datos de ejemplo para que la demo no arranque vacia.
function semillaInicial(): Excedente[] {
  const ahora = new Date().toISOString();
  return [
    {
      id: "1",
      establecimiento: "Restaurante La Central",
      tipoAlimento: "Arroz y pollo guisado preparados",
      cantidad: 25,
      unidad: "porciones",
      aptoConsumo: true,
      fechaLimite: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
      valorEstimado: 250000,
      estado: "disponible",
      creadoEn: ahora,
    },
    {
      id: "2",
      establecimiento: "Universidad del Norte - Cafeteria Central",
      tipoAlimento: "Frutas y verduras frescas",
      cantidad: 40,
      unidad: "kg",
      aptoConsumo: true,
      fechaLimite: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      valorEstimado: 320000,
      estado: "reclamado",
      reclamadoPor: "Banco de Alimentos de Colombia - Sede Bogota",
      creadoEn: ahora,
      reclamadoEn: ahora,
    },
    {
      id: "3",
      establecimiento: "Centro Comercial Santa Fe - Plazoleta",
      tipoAlimento: "Panaderia y reposteria del dia",
      cantidad: 15,
      unidad: "kg",
      aptoConsumo: true,
      fechaLimite: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      valorEstimado: 180000,
      estado: "certificado",
      reclamadoPor: "ABACO - Punto de recoleccion Chapinero",
      creadoEn: ahora,
      reclamadoEn: ahora,
      confirmadoEn: ahora,
      certificado: calcularCertificado(180000),
    },
  ];
}

export function listarExcedentes(estado?: EstadoExcedente): Excedente[] {
  const { excedentes } = obtenerAlmacen();
  const resultado = estado
    ? excedentes.filter((e) => e.estado === estado)
    : excedentes;
  return [...resultado].sort(
    (a, b) => new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime()
  );
}

export function obtenerExcedente(id: string): Excedente | undefined {
  const { excedentes } = obtenerAlmacen();
  return excedentes.find((e) => e.id === id);
}

export type ResultadoCreacion =
  | { ok: true; excedente: Excedente }
  | { ok: false; error: string };

export function crearExcedente(input: NuevoExcedenteInput): ResultadoCreacion {
  if (!input.aptoConsumo) {
    return {
      ok: false,
      error:
        "Solo se aceptan alimentos aptos para consumo humano. Este excedente no puede publicarse en el portal; corresponde a otra categoria de manejo de residuos.",
    };
  }

  if (!input.establecimiento?.trim()) {
    return { ok: false, error: "El establecimiento es obligatorio." };
  }

  if (!input.tipoAlimento?.trim()) {
    return { ok: false, error: "El tipo de alimento es obligatorio." };
  }

  if (!input.cantidad || input.cantidad <= 0) {
    return { ok: false, error: "La cantidad debe ser mayor a cero." };
  }

  if (!input.fechaLimite) {
    return { ok: false, error: "La fecha limite es obligatoria." };
  }

  const almacen = obtenerAlmacen();
  const id = String(almacen.siguienteId++);
  const valorEstimado =
    input.valorEstimado && input.valorEstimado > 0
      ? input.valorEstimado
      : calcularValorEstimadoPorDefecto(input.cantidad);

  const excedente: Excedente = {
    id,
    establecimiento: input.establecimiento.trim(),
    tipoAlimento: input.tipoAlimento.trim(),
    cantidad: input.cantidad,
    unidad: input.unidad,
    aptoConsumo: true,
    fechaLimite: input.fechaLimite,
    valorEstimado,
    estado: "disponible",
    creadoEn: new Date().toISOString(),
  };

  almacen.excedentes.push(excedente);
  return { ok: true, excedente };
}

export type ResultadoAccion =
  | { ok: true; excedente: Excedente }
  | { ok: false; error: string };

export function reclamarExcedente(
  id: string,
  reclamadoPor: string
): ResultadoAccion {
  const excedente = obtenerExcedente(id);
  if (!excedente) {
    return { ok: false, error: "Excedente no encontrado." };
  }
  if (excedente.estado !== "disponible") {
    return {
      ok: false,
      error: `Este excedente ya no esta disponible (estado actual: ${excedente.estado}).`,
    };
  }
  if (!reclamadoPor?.trim()) {
    return { ok: false, error: "El nombre del punto receptor es obligatorio." };
  }

  excedente.estado = "reclamado";
  excedente.reclamadoPor = reclamadoPor.trim();
  excedente.reclamadoEn = new Date().toISOString();
  return { ok: true, excedente };
}

/**
 * Confirma la recepcion fisica del excedente y emite el certificado de
 * donacion en la misma operacion (ver docs/WORKFLOW.md, seccion 3): el
 * excedente pasa por "confirmado" y queda en "certificado" con los datos
 * del descuento tributario adjuntos.
 */
export function confirmarExcedente(id: string): ResultadoAccion {
  const excedente = obtenerExcedente(id);
  if (!excedente) {
    return { ok: false, error: "Excedente no encontrado." };
  }
  if (excedente.estado !== "reclamado") {
    return {
      ok: false,
      error: `Solo se puede confirmar un excedente reclamado (estado actual: ${excedente.estado}).`,
    };
  }

  const ahora = new Date().toISOString();
  excedente.estado = "certificado";
  excedente.confirmadoEn = ahora;
  excedente.certificado = calcularCertificado(excedente.valorEstimado);

  return { ok: true, excedente };
}

export function obtenerMetricas(): Metricas {
  const { excedentes } = obtenerAlmacen();

  const porEstado: Record<EstadoExcedente, number> = {
    disponible: 0,
    reclamado: 0,
    confirmado: 0,
    certificado: 0,
  };

  let cantidadTotalSalvada = 0;
  let descuentoTributarioAcumulado = 0;

  for (const e of excedentes) {
    porEstado[e.estado] += 1;

    // "Salvada" = ya fue asegurada por un punto receptor (reclamada o mas
    // alla en el flujo), no solo publicada como disponible.
    if (e.estado === "reclamado" || e.estado === "confirmado" || e.estado === "certificado") {
      cantidadTotalSalvada += e.cantidad;
    }

    if (e.estado === "certificado" && e.certificado) {
      descuentoTributarioAcumulado += e.certificado.descuentoTributario;
    }
  }

  return {
    totalGestionados: excedentes.length,
    cantidadTotalSalvada,
    descuentoTributarioAcumulado,
    porEstado,
  };
}
