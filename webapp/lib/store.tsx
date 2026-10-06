"use client";

// Estado de la demo en el navegador (localStorage). Se eligió así porque en Vercel las funciones
// serverless no comparten memoria entre instancias: un store en el servidor perdería datos al azar.
// Siguiente paso real: base de datos (ver docs/ROADMAP.md).

import * as React from "react";
import type { Borrador, EstadoApp, Excedente } from "./types";
import { D, H, certificar, ESTABLECIMIENTOS, RECEPTORES, VALOR_UNIDAD } from "./reglas";
import { isoDate } from "./format";

const KEY = "sobraplus-next-v1";

function mk(
  id: number, est: string, tipo: string, categoria: Excedente["categoria"], cantidad: number, unidad: Excedente["unidad"],
  valor: number, limite: number, extra: Partial<Excedente>, estado: Excedente["estado"], creado: number,
): Excedente {
  return {
    id, codigo: "EXC-" + String(id).padStart(4, "0"), establecimiento: est, tipo, categoria, cantidad, unidad, valor,
    limite: new Date(limite).toISOString(), conservacion: null, temperatura: null, vencimiento: null, origen: "manual",
    estado, creadoEn: new Date(creado).toISOString(), receptorId: null, ...extra,
  };
}

export function semilla(): EstadoApp {
  const now = Date.now();
  const items: Excedente[] = [];
  items.push(mk(1, "Restaurante La Central", "Arroz y pollo guisado", "preparado", 25, "porciones", 225000, now + 5 * H, { conservacion: "frio", temperatura: 4 }, "disponible", now - H));
  items.push(mk(2, "Cafetería Universidad Externado", "Frutas y verduras frescas", "fresco", 40, "kg", 320000, now + 20 * H, {}, "disponible", now - 3 * H));
  items.push(mk(3, "Plazoleta C.C. Santa Fe", "Sándwiches empacados", "empacado", 30, "unidades", 165000, now + 9 * D, { vencimiento: isoDate(now + 14 * D) }, "disponible", now - 2 * H));
  items.push(mk(4, "Cafetería Universidad Externado", "Pasta boloñesa", "preparado", 18, "porciones", 144000, now + 2 * H,
    { conservacion: "caliente", temperatura: 65, receptorId: "abaco", reclamadoEn: new Date(now - 2 * H).toISOString() }, "reclamado", now - 4 * H));
  const c5 = mk(5, "Plazoleta C.C. Santa Fe", "Panadería y repostería del día", "fresco", 15, "kg", 180000, now - 20 * H,
    { receptorId: "bab", reclamadoEn: new Date(now - 28 * H).toISOString(), confirmadoEn: new Date(now - 26 * H).toISOString() }, "certificado", now - 30 * H);
  c5.certificado = certificar(c5, 1, now - 26 * H);
  items.push(c5);
  const c6 = mk(6, "Restaurante La Central", "Sopa de verduras", "preparado", 30, "porciones", 195000, now - 44 * H,
    { conservacion: "frio", temperatura: 3, receptorId: "abaco", reclamadoEn: new Date(now - 48 * H).toISOString(), confirmadoEn: new Date(now - 46 * H).toISOString(), temperaturaRecepcion: 4 },
    "certificado", now - 50 * H);
  c6.certificado = certificar(c6, 2, now - 46 * H);
  items.push(c6);
  return { seq: 6, certSeq: 2, establecimiento: ESTABLECIMIENTOS[0], receptorId: RECEPTORES[0].id, items };
}

type Ctx = {
  ready: boolean;
  state: EstadoApp;
  toast: string | null;
  certAbierto: number | null;
  setEstablecimiento: (n: string) => void;
  setReceptor: (id: string) => void;
  publicar: (items: { x: Borrador; limite: number }[]) => Excedente[];
  reclamar: (id: number) => void;
  confirmar: (id: number, temp: number | null) => void;
  rechazar: (id: number, temp: number | null) => void;
  reiniciar: () => void;
  avisar: (msg: string) => void;
  abrirCertificado: (id: number | null) => void;
};

const StoreCtx = React.createContext<Ctx | null>(null);

export function useStore(): Ctx {
  const c = React.useContext(StoreCtx);
  if (!c) throw new Error("useStore debe usarse dentro de StoreProvider.");
  return c;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<EstadoApp>(() => ({ seq: 0, certSeq: 0, establecimiento: ESTABLECIMIENTOS[0], receptorId: RECEPTORES[0].id, items: [] }));
  const [ready, setReady] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);
  const [certAbierto, setCertAbierto] = React.useState<number | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => {
    let s: EstadoApp | null = null;
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) { const p = JSON.parse(raw); if (p && Array.isArray(p.items)) s = p; }
    } catch { /* sin almacenamiento: se usa la semilla */ }
    setState(s ?? semilla());
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignorar */ }
  }, [state, ready]);

  const avisar = React.useCallback((msg: string) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Se calcula el siguiente estado de forma síncrona sobre una referencia, para poder devolver resultados
  // (p. ej. los códigos creados) sin depender del orden de ejecución de los updaters de React.
  const ref = React.useRef(state);
  ref.current = state;
  const mutar = (fn: (s: EstadoApp) => EstadoApp) => {
    const next = fn(structuredClone(ref.current));
    ref.current = next;
    setState(next);
  };

  const value: Ctx = {
    ready, state, toast, certAbierto, avisar,
    abrirCertificado: setCertAbierto,
    setEstablecimiento: (n) => mutar((s) => ({ ...s, establecimiento: n })),
    setReceptor: (id) => mutar((s) => ({ ...s, receptorId: id })),
    publicar: (lista) => {
      const creados: Excedente[] = [];
      mutar((s) => {
        for (const { x, limite } of lista) {
          const id = ++s.seq;
          const valor = x.valor > 0 ? x.valor : Math.round(x.cantidad * VALOR_UNIDAD);
          const e = mk(id, s.establecimiento, x.tipo.trim(), x.categoria, x.cantidad, x.unidad, valor, limite, {
            conservacion: x.categoria === "preparado" ? x.conservacion : null,
            temperatura: x.categoria === "preparado" ? x.temperatura : null,
            vencimiento: x.categoria === "empacado" ? x.vencimiento : null,
            origen: x.origen,
          }, "disponible", Date.now());
          s.items.push(e);
          creados.push(e);
        }
        return s;
      });
      return creados;
    },
    reclamar: (id) => mutar((s) => {
      const e = s.items.find((i) => i.id === id);
      if (!e || e.estado !== "disponible") return s;
      e.estado = "reclamado"; e.receptorId = s.receptorId; e.reclamadoEn = new Date().toISOString();
      return s;
    }),
    confirmar: (id, temp) => mutar((s) => {
      const e = s.items.find((i) => i.id === id);
      if (!e || e.estado !== "reclamado") return s;
      e.estado = "certificado"; e.confirmadoEn = new Date().toISOString(); e.temperaturaRecepcion = temp;
      e.certificado = certificar(e, ++s.certSeq, Date.now());
      return s;
    }),
    rechazar: (id, temp) => mutar((s) => {
      const e = s.items.find((i) => i.id === id);
      if (!e || e.estado !== "reclamado") return s;
      e.estado = "rechazado"; e.confirmadoEn = new Date().toISOString(); e.temperaturaRecepcion = temp;
      e.motivo = e.categoria === "preparado" ? "Temperatura fuera de rango o producto en mal estado al recibir" : "Producto en mal estado al recibir";
      return s;
    }),
    reiniciar: () => setState(semilla()),
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
