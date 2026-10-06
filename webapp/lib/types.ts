// Tipos del dominio del portal Sobra+.
// Fuente de verdad del negocio: docs/ARQUITECTURA.md, docs/WORKFLOW.md, docs/MARCO_LEGAL.md.

export type EstadoExcedente =
  | "disponible"
  | "reclamado"
  | "confirmado"
  | "certificado";

export type Rol = "establecimiento" | "punto-receptor";

export type UnidadCantidad = "kg" | "unidades" | "porciones";

export type Certificado = {
  valorEstimado: number;
  porcentajeDescuento: 37;
  descuentoTributario: number;
  notaExclusionIVA: string;
  ley: "Ley 2380 de 2024";
  emitidoEn: string;
};

export type Excedente = {
  id: string;
  establecimiento: string;
  tipoAlimento: string;
  cantidad: number;
  unidad: UnidadCantidad;
  aptoConsumo: boolean;
  fechaLimite: string;
  valorEstimado: number;
  estado: EstadoExcedente;
  reclamadoPor?: string;
  creadoEn: string;
  reclamadoEn?: string;
  confirmadoEn?: string;
  certificado?: Certificado;
};

export type NuevoExcedenteInput = {
  establecimiento: string;
  tipoAlimento: string;
  cantidad: number;
  unidad: UnidadCantidad;
  aptoConsumo: boolean;
  fechaLimite: string;
  valorEstimado?: number;
};

export type Metricas = {
  totalGestionados: number;
  cantidadTotalSalvada: number;
  descuentoTributarioAcumulado: number;
  porEstado: Record<EstadoExcedente, number>;
};
