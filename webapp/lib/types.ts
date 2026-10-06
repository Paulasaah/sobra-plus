// Dominio de Sobra+. Reglas de negocio: docs/WORKFLOW.md y docs/MARCO_LEGAL.md.

export type Categoria = "preparado" | "fresco" | "empacado";
export type Unidad = "kg" | "unidades" | "porciones";
export type Conservacion = "frio" | "caliente";
export type Estado = "disponible" | "reclamado" | "certificado" | "rechazado";
export type Origen = "manual" | "cierre";

export type Receptor = {
  id: string;
  nombre: string;
  tipo: string;
  /** Banco de alimentos del régimen tributario especial: único caso que da descuento (Ley 2380). */
  rte: boolean;
};

export type Certificado = {
  numero: string;
  /** true: certificado con descuento; false: constancia de entrega sin descuento. */
  aplica: boolean;
  valor: number;
  descuento: number;
  emitidoEn: string;
};

export type Excedente = {
  id: number;
  codigo: string;
  establecimiento: string;
  tipo: string;
  categoria: Categoria;
  cantidad: number;
  unidad: Unidad;
  valor: number;
  limite: string;
  conservacion: Conservacion | null;
  temperatura: number | null;
  vencimiento: string | null;
  origen: Origen;
  estado: Estado;
  creadoEn: string;
  receptorId: string | null;
  reclamadoEn?: string;
  confirmadoEn?: string;
  temperaturaRecepcion?: number | null;
  motivo?: string;
  certificado?: Certificado;
};

export type Borrador = {
  categoria: Categoria;
  tipo: string;
  cantidad: number;
  unidad: Unidad;
  valor: number;
  conservacion: Conservacion;
  temperatura: number | null;
  limite: string;
  vencimiento: string;
  apto: boolean;
  origen: Origen;
};

export type EstadoApp = {
  seq: number;
  certSeq: number;
  establecimiento: string;
  receptorId: string;
  items: Excedente[];
};
