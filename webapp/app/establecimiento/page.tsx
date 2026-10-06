"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { Cargando } from "@/components/cargando";
import { Pill } from "@/components/pill";
import { Urgencia } from "@/components/urgencia";
import {
  CATEGORIAS, D, ESTABLECIMIENTOS, H, REGLA_TEXTO, csvEjemplo, leerCierre, receptorPorId, unidadPorDefecto, validar,
  type Errores, type FilaCierre,
} from "@/lib/reglas";
import { cantidad, dia, fecha, isoDate, localDT, money, num } from "@/lib/format";
import type { Borrador, Categoria, Conservacion, Estado, Unidad } from "@/lib/types";

const limiteDefecto = () => localDT(Date.now() + 6 * H);
const vencDefecto = () => isoDate(Date.now() + 30 * D);

export default function EstablecimientoPage() {
  const { ready, state, setEstablecimiento } = useStore();
  if (!ready) return <Cargando />;
  return (
    <section className="view">
      <div className="section-head">
        <div className="stack-sm">
          <span className="eyebrow">Vista del establecimiento</span>
          <h2>Publicar excedente</h2>
        </div>
        <div className="field" style={{ minWidth: "min(100%,280px)" }}>
          <label htmlFor="est-sel">Establecimiento</label>
          <select id="est-sel" value={state.establecimiento} onChange={(e) => setEstablecimiento(e.target.value)}>
            {ESTABLECIMIENTOS.map((n) => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="split">
        <ImportarCierre />
        <FormManual />
      </div>
      <MisDonaciones />
    </section>
  );
}

function ImportarCierre() {
  const { publicar, avisar } = useStore();
  const [texto, setTexto] = React.useState("");
  const [filas, setFilas] = React.useState<FilaCierre[] | null>(null);
  const [error, setError] = React.useState("");
  const [error2, setError2] = React.useState("");
  const [limite, setLimite] = React.useState(limiteDefecto);
  const [temp, setTemp] = React.useState("4");
  const [apto, setApto] = React.useState(false);

  function leer(t: string) {
    const r = leerCierre(t);
    if (r.error) { setError(r.error); return; }
    setError(""); setFilas(r.filas);
  }
  const seleccionadas = filas?.filter((f) => f.sel && !f.motivo) ?? [];

  function publicarSel() {
    if (!seleccionadas.length) { setError2("Selecciona al menos un producto donable."); return; }
    if (!apto) { setError2("Confirma que lo seleccionado es apto para consumo humano."); return; }
    const t = parseFloat(temp);
    const cons: Conservacion = t >= 60 ? "caliente" : "frio";
    const lote: { x: Borrador; limite: number }[] = [];
    const fallos: string[] = [];
    for (const f of seleccionadas) {
      const x: Borrador = {
        categoria: f.categoria, tipo: f.tipo, cantidad: f.cantidad, unidad: f.unidad, valor: f.valor, conservacion: cons,
        temperatura: Number.isNaN(t) ? null : t, limite, vencimiento: f.vencimiento ?? "", apto, origen: "cierre",
      };
      const v = validar(x);
      if (v.ok && v.limite) lote.push({ x, limite: v.limite });
      else fallos.push(`${f.tipo}: ${Object.values(v.err)[0]}`);
    }
    if (fallos.length) { setError2(fallos.join(" ")); return; }
    publicar(lote);
    setError2(""); setFilas(null); setApto(false); setTexto("");
    avisar(`${lote.length} ${lote.length === 1 ? "excedente publicado" : "excedentes publicados"} desde el cierre de turno.`);
  }

  return (
    <div className="panel">
      <div className="stack-sm">
        <h3>Desde el cierre de turno</h3>
        <p className="lead sm">Sube o pega el reporte que exporta tu sistema de ventas. Sobra+ calcula el sobrante (preparado menos vendido) y propone qué se puede donar.</p>
      </div>
      <div className="row">
        <button className="btn sm" type="button" onClick={() => { const c = csvEjemplo(); setTexto(c); leer(c); }}>Usar reporte de ejemplo</button>
        <label className="btn sm" htmlFor="csv-file">Subir archivo CSV</label>
        <input
          id="csv-file" type="file" accept=".csv,text/csv,text/plain" hidden
          onChange={(e) => {
            const f = e.target.files?.[0]; if (!f) return;
            const rd = new FileReader();
            rd.onload = () => { const t = String(rd.result ?? ""); setTexto(t); leer(t); };
            rd.readAsText(f); e.target.value = "";
          }}
        />
      </div>
      <div className="field">
        <label htmlFor="csv-text">Reporte (CSV)</label>
        <textarea id="csv-text" spellCheck={false} value={texto} onChange={(e) => { setTexto(e.target.value); setError(""); }}
          placeholder="producto,preparado,vendido,unidad,valor_unitario,categoria,vencimiento" />
        <span className="hint">Columnas: producto, preparado, vendido, unidad (kg, unidades o porciones), valor_unitario en COP, categoria (preparado, fresco o empacado) y vencimiento (AAAA-MM-DD, solo para empacados).</span>
        {error && <span className="err">{error}</span>}
      </div>
      <button className="btn" type="button" onClick={() => leer(texto)}>Leer reporte</button>

      {filas && (
        <div className="stack">
          <div className="table-wrap">
            <table>
              <thead><tr><th></th><th>Producto</th><th>Sobrante</th><th>Valor</th><th>Revisión</th></tr></thead>
              <tbody>
                {filas.map((f) => (
                  <tr key={f.i} className={f.motivo ? "off" : ""}>
                    <td>
                      <input type="checkbox" aria-label={`Incluir ${f.tipo}`} checked={f.sel} disabled={!!f.motivo}
                        onChange={(e) => setFilas(filas.map((g) => g.i === f.i ? { ...g, sel: e.target.checked } : g))} />
                    </td>
                    <td>{f.tipo || "Sin nombre"}<br /><span className="tag">{CATEGORIAS[f.categoria]}</span></td>
                    <td className="n">{Number.isNaN(f.cantidad) ? "–" : `${num(f.cantidad)} ${f.unidad}`}</td>
                    <td className="n">{f.valor ? money(f.valor) : "–"}</td>
                    <td>{f.motivo ? <span className="pill s-rechazado">{f.motivo}</span> : <span className="pill s-certificado">Donable</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid-2">
            <div className="field">
              <label htmlFor="csv-limit">Recoger antes de</label>
              <input id="csv-limit" type="datetime-local" value={limite} onChange={(e) => setLimite(e.target.value)} />
              <span className="hint">Aplica a preparados y frescos.</span>
            </div>
            <div className="field">
              <label htmlFor="csv-temp">Temperatura de los preparados (°C)</label>
              <input id="csv-temp" type="number" step="0.5" value={temp} onChange={(e) => setTemp(e.target.value)} />
              <span className="hint">Refrigerados a 5 °C o menos, o en caliente a 60 °C o más.</span>
            </div>
          </div>
          <label className="check">
            <input type="checkbox" checked={apto} onChange={(e) => { setApto(e.target.checked); setError2(""); }} />
            <span>Confirmo que lo seleccionado es apto para consumo humano y no proviene de platos servidos ni de buffet expuesto al público.</span>
          </label>
          {error2 && <span className="err">{error2}</span>}
          <button className="btn primary" type="button" onClick={publicarSel}>
            {seleccionadas.length ? `Publicar ${seleccionadas.length} ${seleccionadas.length === 1 ? "excedente" : "excedentes"}` : "Publicar seleccionados"}
          </button>
        </div>
      )}
    </div>
  );
}

function FormManual() {
  const { publicar, avisar } = useStore();
  const vacio = (): Borrador => ({
    categoria: "preparado", tipo: "", cantidad: NaN, unidad: "porciones", valor: 0, conservacion: "frio", temperatura: 4,
    limite: limiteDefecto(), vencimiento: vencDefecto(), apto: false, origen: "manual",
  });
  const [x, setX] = React.useState<Borrador>(vacio);
  const [err, setErr] = React.useState<Errores>({});
  const set = (p: Partial<Borrador>) => { setX((v) => ({ ...v, ...p })); setErr({}); };
  const cat = x.categoria;

  function enviar(ev: React.FormEvent) {
    ev.preventDefault();
    const v = validar(x);
    setErr(v.err);
    if (!v.ok || v.limite == null) { avisar("Revisa los campos marcados."); return; }
    const [e] = publicar([{ x, limite: v.limite }]);
    setX(vacio());
    avisar(`Publicado ${e.codigo}. Ya lo ven los puntos receptores.`);
  }
  const inv = (k: keyof Errores) => (err[k] ? true : undefined);

  return (
    <form className="panel" onSubmit={enviar} noValidate>
      <div className="stack-sm">
        <h3>Publicación manual</h3>
        <p className="lead sm">Para un excedente puntual que no viene del reporte.</p>
      </div>
      <div className="field">
        <span className="lbl">Tipo de producto</span>
        <div className="seg" role="radiogroup" aria-label="Tipo de producto">
          {([["preparado", "Cocinado, requiere control de temperatura"], ["fresco", "Frutas, verduras, panadería"], ["empacado", "Cerrado y con fecha de vencimiento"]] as [Categoria, string][]).map(([k, d]) => (
            <label key={k}>
              <input type="radio" name="cat" value={k} checked={cat === k}
                onChange={() => set({ categoria: k, unidad: unidadPorDefecto(k) })} />
              <strong>{CATEGORIAS[k]}</strong><span>{d}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="field">
        <label htmlFor="m-tipo">Qué es</label>
        <input id="m-tipo" type="text" placeholder="Arroz con pollo" autoComplete="off" value={x.tipo} aria-invalid={inv("tipo")} onChange={(e) => set({ tipo: e.target.value })} />
        {err.tipo && <span className="err">{err.tipo}</span>}
      </div>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="m-cant">Cantidad</label>
          <input id="m-cant" type="number" min="0" step="0.5" placeholder="20" value={Number.isNaN(x.cantidad) ? "" : x.cantidad} aria-invalid={inv("cantidad")}
            onChange={(e) => set({ cantidad: e.target.value === "" ? NaN : parseFloat(e.target.value) })} />
          {err.cantidad && <span className="err">{err.cantidad}</span>}
        </div>
        <div className="field">
          <label htmlFor="m-unidad">Unidad</label>
          <select id="m-unidad" value={x.unidad} onChange={(e) => set({ unidad: e.target.value as Unidad })}>
            <option value="porciones">porciones</option><option value="kg">kg</option><option value="unidades">unidades</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="m-valor">Valor estimado total (COP)</label>
        <input id="m-valor" type="number" min="0" step="1000" placeholder="Si lo dejas vacío se estiman $6.000 por unidad" value={x.valor || ""}
          onChange={(e) => set({ valor: parseFloat(e.target.value) || 0 })} />
        <span className="hint">Es la base del certificado. El valor fiscal final lo define el contador del establecimiento.</span>
      </div>
      {cat === "preparado" && (
        <div className="grid-2">
          <div className="field">
            <label htmlFor="m-cons">Conservación</label>
            <select id="m-cons" value={x.conservacion} onChange={(e) => { const c = e.target.value as Conservacion; set({ conservacion: c, temperatura: c === "frio" ? 4 : 65 }); }}>
              <option value="frio">Refrigerado</option><option value="caliente">En caliente</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="m-temp">Temperatura medida (°C)</label>
            <input id="m-temp" type="number" step="0.5" value={x.temperatura ?? ""} aria-invalid={inv("temp")}
              onChange={(e) => set({ temperatura: e.target.value === "" ? null : parseFloat(e.target.value) })} />
            {err.temp && <span className="err">{err.temp}</span>}
          </div>
        </div>
      )}
      {cat !== "empacado" ? (
        <div className="field">
          <label htmlFor="m-limit">Recoger antes de</label>
          <input id="m-limit" type="datetime-local" value={x.limite} aria-invalid={inv("limite")} onChange={(e) => set({ limite: e.target.value })} />
          {err.limite && <span className="err">{err.limite}</span>}
        </div>
      ) : (
        <div className="field">
          <label htmlFor="m-venc">Fecha de vencimiento del empaque</label>
          <input id="m-venc" type="date" value={x.vencimiento} aria-invalid={inv("venc")} onChange={(e) => set({ vencimiento: e.target.value })} />
          {err.venc && <span className="err">{err.venc}</span>}
        </div>
      )}
      <p className="rule"><b>{REGLA_TEXTO[cat].titulo}:</b> {REGLA_TEXTO[cat].texto}</p>
      <label className="check">
        <input type="checkbox" checked={x.apto} aria-invalid={inv("apto")} onChange={(e) => set({ apto: e.target.checked })} />
        <span>Es apto para consumo humano, está en buen estado y, si es preparado, no proviene de platos servidos ni de buffet expuesto.</span>
      </label>
      {err.apto && <span className="err">{err.apto}</span>}
      <button className="btn primary" type="submit">Publicar excedente</button>
    </form>
  );
}

function MisDonaciones() {
  const { state, abrirCertificado, avisar } = useStore();
  const mias = state.items.filter((e) => e.establecimiento === state.establecimiento).sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));

  function bitacora() {
    const lineas = [`Bitácora de gestión de excedentes · ${state.establecimiento}`, `Generada ${dia(Date.now())}`, ""];
    for (const e of mias) {
      const r = receptorPorId(e.receptorId);
      lineas.push([e.codigo, e.tipo, cantidad(e), e.estado, `publicado ${fecha(e.creadoEn)}`, r ? `receptor ${r.nombre}` : "sin receptor", e.certificado ? `cert. ${e.certificado.numero}` : ""].filter(Boolean).join(" | "));
    }
    const txt = lineas.join("\n");
    const ok = () => avisar(`Bitácora copiada (${mias.length} registros).`);
    navigator.clipboard?.writeText(txt).then(ok, () => avisar("No se pudo copiar. Selecciona la tabla y cópiala a mano."));
  }

  return (
    <div className="stack">
      <div className="section-head">
        <h2>Mis donaciones</h2>
        <button className="btn sm" type="button" onClick={bitacora}>Copiar bitácora de gestión</button>
      </div>
      {mias.length === 0 ? (
        <div className="empty">Aún no hay publicaciones de este establecimiento. Importa tu cierre de turno o publica un excedente manual.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Registro</th><th>Alimento</th><th>Cantidad</th><th>Estado</th><th>Receptor</th><th>Descuento est.</th><th></th></tr></thead>
            <tbody>
              {mias.map((e) => {
                const r = receptorPorId(e.receptorId);
                return (
                  <tr key={e.id}>
                    <td className="mono">{e.codigo}</td>
                    <td>{e.tipo}<br /><span className="tag">{CATEGORIAS[e.categoria]}{e.origen === "cierre" ? " · cierre" : ""}</span></td>
                    <td className="n">{cantidad(e)}</td>
                    <td><Pill estado={e.estado as Estado} /></td>
                    <td>{r ? r.nombre : <Urgencia limite={e.limite} />}</td>
                    <td className="n">{e.certificado ? (e.certificado.aplica ? money(e.certificado.descuento) : "No aplica") : "–"}</td>
                    <td>{e.certificado && <button className="btn sm" type="button" onClick={() => abrirCertificado(e.id)}>Ver certificado</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
