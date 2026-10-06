"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { Cargando } from "@/components/cargando";
import { Pill } from "@/components/pill";
import { Urgencia } from "@/components/urgencia";
import { CATEGORIAS, RECEPTORES, receptorPorId, restante, temperaturaValida } from "@/lib/reglas";
import { cantidad, fecha, money, num } from "@/lib/format";
import type { Excedente } from "@/lib/types";

function Datos({ e }: { e: Excedente }) {
  return (
    <dl>
      <dt>Cantidad</dt><dd>{cantidad(e)}</dd>
      <dt>Valor estimado</dt><dd>{money(e.valor)}</dd>
      {e.categoria === "preparado" && <><dt>Conservación</dt><dd>{e.conservacion === "frio" ? "Refrigerado" : "Caliente"} · {num(e.temperatura ?? 0)} °C</dd></>}
      {e.categoria === "empacado" && <><dt>Vence</dt><dd>{e.vencimiento}</dd></>}
      <dt>Recoger antes de</dt><dd>{fecha(e.limite)}</dd>
    </dl>
  );
}

export default function ReceptorPage() {
  const { ready, state, setReceptor, reclamar, avisar } = useStore();
  if (!ready) return <Cargando />;
  const r = receptorPorId(state.receptorId) ?? RECEPTORES[0];
  const disp = state.items.filter((e) => e.estado === "disponible" && restante(e.limite).ms > 0).sort((a, b) => a.limite.localeCompare(b.limite));
  const mios = state.items.filter((e) => e.estado === "reclamado" && e.receptorId === r.id);

  return (
    <section className="view">
      <div className="section-head">
        <div className="stack-sm">
          <span className="eyebrow">Vista del punto receptor</span>
          <h2>Excedentes disponibles</h2>
        </div>
        <div className="field" style={{ minWidth: "min(100%,300px)" }}>
          <label htmlFor="rec-sel">Punto receptor</label>
          <select id="rec-sel" value={r.id} onChange={(e) => setReceptor(e.target.value)}>
            {RECEPTORES.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
          </select>
          <span className="hint">{r.tipo}{r.rte ? " · régimen tributario especial: sus donaciones generan descuento" : " · sin régimen especial: entrega constancia, no descuento"}</span>
        </div>
      </div>

      {disp.length ? (
        <div className="cards">
          {disp.map((e) => (
            <article className="xc" key={e.id}>
              <div className="xc-head">
                <div><h4>{e.tipo}</h4><span className="from">{e.establecimiento}</span></div>
                <span className="tag">{CATEGORIAS[e.categoria]}</span>
              </div>
              <Datos e={e} />
              <div className="row between">
                <Urgencia limite={e.limite} />
                <button className="btn primary sm" type="button" onClick={() => { reclamar(e.id); avisar(`Reclamado ${e.codigo}. Coordina la recogida con ${e.establecimiento}.`); }}>Reclamar</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">No hay excedentes disponibles en este momento. Publica uno desde la vista del establecimiento.</div>
      )}

      <div className="stack">
        <div className="section-head"><h2>Por recibir</h2><span className="eyebrow">Reclamados por este punto</span></div>
        {mios.length ? (
          <div className="cards">{mios.map((e) => <PorRecibir key={e.id} e={e} />)}</div>
        ) : (
          <div className="empty">No tienes recogidas pendientes. Reclama un excedente disponible para verlo aquí.</div>
        )}
      </div>
    </section>
  );
}

function PorRecibir({ e }: { e: Excedente }) {
  const { confirmar, rechazar, abrirCertificado, avisar } = useStore();
  const [temp, setTemp] = React.useState("");
  const [ok, setOk] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  function confirmarRecepcion() {
    if (!ok) { setMsg("Marca que recibiste el producto en buen estado, o regístralo como no recibido."); return; }
    let t: number | null = null;
    if (e.categoria === "preparado") {
      t = parseFloat(temp);
      if (Number.isNaN(t)) { setMsg("Registra la temperatura al recibir."); return; }
      if (!temperaturaValida(e.conservacion, t)) {
        setMsg(`La temperatura está fuera de rango (${e.conservacion === "frio" ? "máx. 5 °C" : "mín. 60 °C"}). No se puede recibir: regístralo como no recibido.`);
        return;
      }
    }
    confirmar(e.id, t);
    avisar("Recepción confirmada. Certificado emitido.");
    abrirCertificado(e.id);
  }
  function noRecibido() {
    const t = parseFloat(temp);
    rechazar(e.id, Number.isNaN(t) ? null : t);
    avisar("Registrado como no recibido. No genera certificado.");
  }

  return (
    <article className="xc">
      <div className="xc-head">
        <div><h4>{e.tipo}</h4><span className="from">{e.establecimiento}</span></div>
        <Pill estado={e.estado} />
      </div>
      <Datos e={e} />
      <div className="confirm-box">
        {e.categoria === "preparado" && (
          <div className="field">
            <label htmlFor={`t-${e.id}`}>Temperatura al recibir (°C)</label>
            <input id={`t-${e.id}`} type="number" step="0.5" placeholder={e.conservacion === "frio" ? "máx. 5" : "mín. 60"} value={temp} onChange={(x) => { setTemp(x.target.value); setMsg(""); }} />
          </div>
        )}
        <label className="check">
          <input type="checkbox" checked={ok} onChange={(x) => { setOk(x.target.checked); setMsg(""); }} />
          <span>Recibido completo y en buen estado</span>
        </label>
        {msg && <span className="err">{msg}</span>}
        <div className="row">
          <button className="btn primary sm" type="button" onClick={confirmarRecepcion}>Confirmar recepción</button>
          <button className="btn sm danger" type="button" onClick={noRecibido}>No recibido</button>
        </div>
      </div>
    </article>
  );
}
