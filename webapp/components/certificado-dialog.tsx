"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { receptorPorId, CATEGORIAS } from "@/lib/reglas";
import { cantidad, dia, fecha, money, num } from "@/lib/format";

export function CertificadoDialog() {
  const { state, certAbierto, abrirCertificado } = useStore();
  const ref = React.useRef<HTMLDialogElement>(null);
  const e = state.items.find((i) => i.id === certAbierto && i.certificado);

  React.useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (e && !d.open) { if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", ""); }
    if (!e && d.open) d.close();
  }, [e]);

  const c = e?.certificado;
  const r = e ? receptorPorId(e.receptorId) : undefined;

  return (
    <dialog
      ref={ref}
      aria-labelledby="cert-title"
      onClose={() => abrirCertificado(null)}
      onClick={(ev) => { if (ev.target === ref.current) abrirCertificado(null); }}
    >
      {e && c && (
        <div className="cert">
          <div className="cert-head">
            <div className="stack-sm">
              <span className="eyebrow mono">{c.numero}</span>
              <h3 id="cert-title">{c.aplica ? "Certificado de donación de alimentos" : "Constancia de entrega de alimentos"}</h3>
              <span className="lead sm">
                {c.aplica ? "Soporte del descuento tributario de la Ley 2380 de 2024" : "El receptor no es un banco de alimentos del régimen tributario especial"}
              </span>
            </div>
            <span className="stamp">Prototipo sin validez tributaria</span>
          </div>
          <dl className="cert-grid">
            <div><dt>Donante</dt><dd>{e.establecimiento}</dd></div>
            <div>
              <dt>Receptor</dt>
              <dd>{r?.nombre}<br /><span className="lead sm">{r?.tipo}{r?.rte ? " · régimen tributario especial" : ""}</span></dd>
            </div>
            <div><dt>Alimento</dt><dd>{e.tipo} · {CATEGORIAS[e.categoria]}</dd></div>
            <div><dt>Cantidad</dt><dd className="mono">{cantidad(e)}</dd></div>
            <div>
              <dt>Recibido</dt>
              <dd>{e.confirmadoEn ? fecha(e.confirmadoEn) : ""}{e.temperaturaRecepcion != null && <> · <span className="mono">{num(e.temperaturaRecepcion)} °C</span></>}</dd>
            </div>
            <div><dt>Registro de origen</dt><dd className="mono">{e.codigo}{e.origen === "cierre" ? " · cierre de turno" : " · manual"}</dd></div>
          </dl>
          <div className="cert-amounts">
            <div><span>Valor estimado de la donación</span><strong>{money(c.valor)}</strong></div>
            <div className="hl">
              <span>{c.aplica ? "Descuento máximo estimado (37 %)" : "Descuento Ley 2380"}</span>
              <strong>{c.aplica ? money(c.descuento) : "No aplica"}</strong>
            </div>
          </div>
          <ul className="cert-notes">
            {c.aplica ? (
              <>
                <li>Descuento en el impuesto sobre la renta (art. 257 E.T., parágrafo adicionado por la Ley 2380 de 2024), aplicable desde el año gravable 2025. No es una deducción.</li>
                <li>Sujeto al tope del artículo 258 del E.T.; el excedente no usado puede tomarse en periodos siguientes. El valor y la procedencia los confirma el contador del donante.</li>
                <li>Donación excluida de IVA (numeral 9, art. 424 E.T.). Los costos de transporte deben desagregarse en el certificado definitivo.</li>
                <li>El certificado válido lo emite la ESAL aliada (banco de alimentos o ABACO) mientras Sobra+ tramita su propio reconocimiento.</li>
              </>
            ) : (
              <>
                <li>La Ley 2380 solo da el descuento por donaciones a bancos de alimentos del régimen tributario especial, de iglesias reconocidas o a sus asociaciones.</li>
                <li>Esta constancia sirve como evidencia de que el excedente se gestionó y no se destruyó (Ley 2536 de 2025).</li>
              </>
            )}
          </ul>
          <div className="row between">
            <span className="lead sm">Emitido el {dia(c.emitidoEn)}</span>
            <button className="btn" type="button" onClick={() => abrirCertificado(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
