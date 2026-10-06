// Reglas sanitarias y tributarias del prototipo. Funciones puras, sin acceso a DOM.
import type { Borrador, Categoria, Certificado, Conservacion, Excedente, Receptor, Unidad } from "./types";

export const H = 3_600_000;
export const D = 24 * H;
export const PCT_DESCUENTO = 37; // Ley 2380 de 2024: máximo, solo receptor RTE
export const VALOR_UNIDAD = 6000; // COP por unidad cuando no se informa valor
export const DIAS_MIN_EMPACADO = 5; // Ley 1990 de 2019 (según análisis Harvard/GFN)
export const MAX_FRIO = 5;
export const MIN_CALIENTE = 60;
export const PLAZO_PREPARADO_H = 24; // criterio propio del prototipo

export const RECEPTORES: Receptor[] = [
  { id: "bab", nombre: "Banco de Alimentos de Bogotá", tipo: "Banco de alimentos", rte: true },
  { id: "abaco", nombre: "ABACO · punto de recolección Chapinero", tipo: "Asociación de bancos de alimentos", rte: true },
  { id: "fund", nombre: "Fundación Comedor Las Cruces", tipo: "Fundación receptora", rte: false },
];

export const ESTABLECIMIENTOS = [
  "Restaurante La Central",
  "Cafetería Universidad Externado",
  "Plazoleta C.C. Santa Fe",
];

export const CATEGORIAS: Record<Categoria, string> = { preparado: "Preparado", fresco: "Fresco", empacado: "Empacado" };
export const ESTADOS = { disponible: "Disponible", reclamado: "Reclamado", certificado: "Certificado", rechazado: "No recibido" } as const;

export const REGLA_TEXTO: Record<Categoria, { titulo: string; texto: string }> = {
  preparado: {
    titulo: "Regla para preparados",
    texto:
      "Refrigerado a 5 °C o menos, o en caliente a 60 °C o más, y recogida en máximo 24 horas. El plazo de 24 horas es un criterio del prototipo para acordar con cada banco.",
  },
  fresco: { titulo: "Regla para frescos", texto: "Producto entero, sin cortar y en buen estado, con hora límite de recogida." },
  empacado: {
    titulo: "Regla para empacados",
    texto:
      "Empaque íntegro y rotulado, y más de 5 días antes del vencimiento (Ley 1990 de 2019). El plazo de recogida se fija en el último día donable.",
  },
};

export function receptorPorId(id: string | null | undefined): Receptor | undefined {
  return RECEPTORES.find((r) => r.id === id);
}

export function unidadPorDefecto(c: Categoria): Unidad {
  return c === "preparado" ? "porciones" : c === "fresco" ? "kg" : "unidades";
}

export function diasHasta(fechaISO: string, ahora = Date.now()): number {
  const t = new Date(fechaISO + "T23:59:00").getTime();
  return Math.floor((t - ahora) / D);
}

export type Errores = Partial<Record<"tipo" | "cantidad" | "apto" | "venc" | "limite" | "temp", string>>;

export function validar(x: Borrador, ahora = Date.now()): { ok: boolean; err: Errores; limite: number | null } {
  const err: Errores = {};
  if (!x.tipo.trim()) err.tipo = "Escribe qué alimento es.";
  if (!(x.cantidad > 0)) err.cantidad = "La cantidad debe ser mayor que cero.";
  if (!x.apto) err.apto = "Solo se publican alimentos aptos para consumo humano. Si no lo es, va a manejo de residuos y no entra al portal.";
  let limite: number | null = null;

  if (x.categoria === "empacado") {
    if (!x.vencimiento) err.venc = "Indica la fecha de vencimiento del empaque.";
    else {
      const dias = diasHasta(x.vencimiento, ahora);
      if (Number.isNaN(dias)) err.venc = "La fecha de vencimiento no es válida.";
      else if (dias <= DIAS_MIN_EMPACADO)
        err.venc = `Faltan ${Math.max(dias, 0)} días para el vencimiento. No se puede donar dentro de los ${DIAS_MIN_EMPACADO} días previos (Ley 1990 de 2019).`;
      else limite = new Date(x.vencimiento + "T23:59:00").getTime() - DIAS_MIN_EMPACADO * D;
    }
  } else {
    if (!x.limite) err.limite = "Indica hasta cuándo se puede recoger.";
    else {
      limite = new Date(x.limite).getTime();
      if (Number.isNaN(limite) || limite <= ahora) err.limite = "La hora de recogida debe ser posterior a este momento.";
      else if (x.categoria === "preparado" && limite - ahora > PLAZO_PREPARADO_H * H)
        err.limite = "Para preparados el plazo máximo de recogida es de 24 horas.";
    }
    if (x.categoria === "preparado") {
      const t = x.temperatura;
      if (t === null || Number.isNaN(t)) err.temp = "Registra la temperatura medida.";
      else if (x.conservacion === "frio" && t > MAX_FRIO) err.temp = "Un preparado refrigerado debe estar a 5 °C o menos.";
      else if (x.conservacion === "caliente" && t < MIN_CALIENTE) err.temp = "Un preparado en caliente debe estar a 60 °C o más.";
    }
  }
  return { ok: Object.keys(err).length === 0, err, limite };
}

export function temperaturaValida(cons: Conservacion | null, t: number): boolean {
  return cons === "caliente" ? t >= MIN_CALIENTE : t <= MAX_FRIO;
}

/** Certificado con descuento solo si el receptor es banco de alimentos RTE; si no, constancia sin descuento. */
export function certificar(e: Pick<Excedente, "valor" | "receptorId">, numero: number, at: number): Certificado {
  const r = receptorPorId(e.receptorId);
  const aplica = !!r?.rte;
  return {
    numero: `SOB-${new Date(at).getFullYear()}-${String(numero).padStart(4, "0")}`,
    aplica,
    valor: e.valor,
    descuento: aplica ? Math.round((e.valor * PCT_DESCUENTO) / 100) : 0,
    emitidoEn: new Date(at).toISOString(),
  };
}

export type Urgencia = { txt: string; cls: "" | "soon" | "hot"; ms: number };
export function restante(iso: string, ahora = Date.now()): Urgencia {
  const ms = new Date(iso).getTime() - ahora;
  if (ms <= 0) return { txt: "plazo vencido", cls: "hot", ms };
  const h = ms / H;
  if (h < 24)
    return { txt: `recoger en ${h < 1 ? Math.max(1, Math.round(ms / 60000)) + " min" : Math.round(h) + " h"}`, cls: h < 3 ? "hot" : "soon", ms };
  return { txt: `recoger en ${Math.round(h / 24)} d`, cls: "", ms };
}

// ---------- Cierre de turno (CSV) ----------
export type FilaCierre = {
  i: number;
  tipo: string;
  categoria: Categoria;
  unidad: Unidad;
  cantidad: number;
  valor: number;
  vencimiento: string | null;
  motivo: string;
  sel: boolean;
};

function dividir(linea: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < linea.length; i++) {
    const ch = linea[i];
    if (ch === '"') {
      if (q && linea[i + 1] === '"') { cur += '"'; i++; } else q = !q;
    } else if (ch === sep && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "_");
const num = (s: string) => parseFloat(s.replace(",", "."));

export function leerCierre(texto: string, ahora = Date.now()): { filas: FilaCierre[]; error?: string } {
  const lineas = texto.split(/\r?\n/).filter((l) => l.trim());
  if (lineas.length < 2) return { filas: [], error: "Pega un reporte con encabezado y al menos una fila, o usa el reporte de ejemplo." };
  const sep = lineas[0].split(";").length > lineas[0].split(",").length ? ";" : ",";
  const cab = dividir(lineas[0], sep).map(norm);
  const faltan = ["producto", "preparado", "vendido"].filter((k) => !cab.includes(k));
  if (faltan.length) return { filas: [], error: `Faltan columnas: ${faltan.join(", ")}. Revisa el encabezado del reporte.` };

  const filas = lineas.slice(1).map((l, i): FilaCierre => {
    const c = dividir(l, sep);
    const get = (k: string) => { const j = cab.indexOf(k); return j >= 0 ? c[j] ?? "" : ""; };
    const prep = num(get("preparado"));
    const vend = num(get("vendido"));
    let categoria = norm(get("categoria")) as Categoria;
    if (!(categoria in CATEGORIAS)) categoria = "preparado";
    let unidad = norm(get("unidad")) as Unidad;
    if (!["kg", "unidades", "porciones"].includes(unidad)) unidad = unidadPorDefecto(categoria);
    const vu = parseFloat(get("valor_unitario").replace(/[^\d.,]/g, "").replace(",", ".")) || VALOR_UNIDAD;
    const sobrante = Number.isNaN(prep) || Number.isNaN(vend) ? NaN : Math.max(0, prep - vend);
    const venc = get("vencimiento") || null;
    let motivo = "";
    if (!get("producto")) motivo = "Sin nombre de producto";
    else if (Number.isNaN(sobrante)) motivo = "Cantidades no numéricas";
    else if (sobrante <= 0) motivo = "Sin sobrante";
    else if (categoria === "empacado") {
      if (!venc) motivo = "Falta fecha de vencimiento";
      else {
        const d = diasHasta(venc, ahora);
        if (Number.isNaN(d)) motivo = "Fecha de vencimiento inválida";
        else if (d <= DIAS_MIN_EMPACADO) motivo = `Vence en ${Math.max(d, 0)} días: no donable`;
      }
    }
    return { i, tipo: get("producto"), categoria, unidad, cantidad: sobrante, valor: Math.round((sobrante || 0) * vu), vencimiento: venc, motivo, sel: !motivo };
  });
  return { filas };
}

export function csvEjemplo(ahora = Date.now()): string {
  const iso = (t: number) => {
    const d = new Date(t);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  return [
    "producto,preparado,vendido,unidad,valor_unitario,categoria,vencimiento",
    "Arroz con pollo,80,62,porciones,9000,preparado,",
    "Crema de ahuyama,40,33,porciones,6500,preparado,",
    "Ensalada de frutas,30,30,porciones,5000,preparado,",
    "Pan aliñado,60,41,unidades,1200,fresco,",
    "Banano,25,14,kg,3200,fresco,",
    `Jugo de naranja embotellado,48,30,unidades,3500,empacado,${iso(ahora + 3 * D)}`,
    `Galletas de avena empacadas,36,20,unidades,2800,empacado,${iso(ahora + 40 * D)}`,
  ].join("\n");
}
