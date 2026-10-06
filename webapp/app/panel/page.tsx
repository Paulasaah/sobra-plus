"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { Cargando } from "@/components/cargando";
import { Urgencia } from "@/components/urgencia";
import { H, receptorPorId, restante } from "@/lib/reglas";
import { cantidad, money, num } from "@/lib/format";
import type { Estado, Excedente } from "@/lib/types";

const COLUMNAS: [Estado, string][] = [["disponible", "Disponible"], ["reclamado", "Reclamado"], ["certificado", "Certificado"], ["rechazado", "No recibido"]];

export default function PanelPage() {
  const { ready, state, abrirCertificado, reiniciar, avisar } = useStore();
  const [armado, setArmado] = React.useState(false);
  if (!ready) return <Cargando />;

  const por: Record<Estado, Excedente[]> = { disponible: [], reclamado: [], certificado: [], rechazado: [] };
  state.items.forEach((e) => por[e.estado].push(e));

  const salvado: Record<string, number> = {};
  let desc = 0, valor = 0;
  for (const e of por.certificado) {
    salvado[e.unidad] = (salvado[e.unidad] ?? 0) + e.cantidad;
    valor += e.valor;
    if (e.certificado?.aplica) desc += e.certificado.descuento;
  }
  const salvTxt = Object.entries(salvado).map(([u, n]) => `${num(n)} ${u}`).join(" · ") || "0";
  const vencidos = por.disponible.filter((e) => restante(e.limite).ms <= 0).length;
  const t = state.items.filter((e) => e.reclamadoEn).map((e) => (new Date(e.reclamadoEn!).getTime() - new Date(e.creadoEn).getTime()) / H);
  const prom = t.length ? t.reduce((a, b) => a + b, 0) / t.length : 0;

  const agg: Record<string, { n: number; v: number; d: number }> = {};
  for (const e of por.certificado) {
    const a = (agg[e.establecimiento] ??= { n: 0, v: 0, d: 0 });
    a.n++; a.v += e.valor; if (e.certificado?.aplica) a.d += e.certificado.descuento;
  }
  const filas = Object.entries(agg).sort((a, b) => b[1].d - a[1].d);
  const maxV = Math.max(1, ...filas.map(([, a]) => a.v));

  function reset() {
    if (!armado) { setArmado(true); setTimeout(() => setArmado(false), 4000); return; }
    reiniciar(); setArmado(false); avisar("Datos de ejemplo restaurados.");
  }

  return (
    <section className="view">
      <div className="section-head">
        <div className="stack-sm"><span className="eyebrow">Vista centralizada</span><h2>Panel de operación</h2></div>
        <button className="btn sm danger" type="button" onClick={reset}>{armado ? "Confirmar reinicio" : "Reiniciar datos de ejemplo"}</button>
      </div>

      <div className="metrics">
        <div className="metric"><span>Rescatado y certificado</span><strong>{salvTxt}</strong><small>{por.certificado.length} entregas confirmadas</small></div>
        <div className="metric"><span>Descuento estimado acumulado</span><strong>{money(desc)}</strong><small>sobre {money(valor)} donados</small></div>
        <div className="metric"><span>En tránsito</span><strong>{por.reclamado.length}</strong><small>reclamados sin confirmar</small></div>
        <div className="metric"><span>Tiempo medio hasta el reclamo</span><strong>{num(prom)} h</strong><small>{vencidos ? `${vencidos} disponibles con plazo vencido` : "ningún disponible con plazo vencido"}</small></div>
      </div>

      <div className="board">
        {COLUMNAS.map(([k, titulo]) => (
          <div className="col" key={k}>
            <h4>{titulo}<span>{por[k].length}</span></h4>
            {por[k].length ? [...por[k]].sort((a, b) => b.creadoEn.localeCompare(a.creadoEn)).map((e) => (
              <div className="mini" key={e.id}>
                <b>{e.tipo}</b>
                <span>{e.establecimiento} · {cantidad(e)}</span>
                {k === "disponible" ? <Urgencia limite={e.limite} /> : <span>{receptorPorId(e.receptorId)?.nombre}</span>}
                {e.certificado && <button className="btn sm" type="button" onClick={() => abrirCertificado(e.id)}>Certificado</button>}
                {k === "rechazado" && e.motivo && <span>{e.motivo}</span>}
              </div>
            )) : <div className="mini"><span>Sin registros</span></div>}
          </div>
        ))}
      </div>

      <div className="stack">
        <div className="section-head"><h2>Beneficio estimado por establecimiento</h2></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Establecimiento</th><th>Donaciones certificadas</th><th>Valor donado</th><th>Descuento estimado</th></tr></thead>
            <tbody>
              {filas.length ? filas.map(([k, a]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td className="n">{a.n}</td>
                  <td className="n">{money(a.v)}<div className="bar" aria-hidden="true"><i style={{ width: `${(a.v / maxV) * 100}%` }} /></div></td>
                  <td className="n">{money(a.d)}</td>
                </tr>
              )) : <tr><td colSpan={4}>Aún no hay donaciones certificadas.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="lead" style={{ fontSize: 13 }}>El descuento es un estimado del máximo legal. El valor real depende del régimen del establecimiento y del tope del artículo 258 del Estatuto Tributario.</p>
      </div>
    </section>
  );
}
