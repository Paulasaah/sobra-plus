import Link from "next/link";

const HECHOS = [
  { big: "9,76 M t", texto: "de alimentos se pierden o desperdician al año en Colombia, el 34 % de la comida disponible.", fuente: "DNP, estudio 2016" },
  { big: "2,01 M t", texto: "se desperdician en distribución y venta (20,6 % del total), el eslabón donde están restaurantes, cafeterías y comercio.", fuente: "DNP, estudio 2016" },
  { big: "25,5 %", texto: "de los hogares del país tuvo inseguridad alimentaria moderada o grave en 2024. En Bogotá fue el 13,9 %.", fuente: "DANE · FIES 2024" },
  { big: "41.000 t", texto: "de alimentos rescató en 2024 la red de 26 bancos de ABACO, que atendió a 1,4 millones de personas en 220 municipios.", fuente: "ABACO vía Cambio, oct. 2025 · GFN 2025" },
  { big: "hasta 37 %", texto: "del valor donado se puede descontar del impuesto de renta si la donación va a un banco de alimentos del régimen tributario especial.", fuente: "Ley 2380 de 2024 · art. 257 E.T." },
  { big: "1 a 40 SMMLV", texto: "es el rango de sanción por destruir alimentos aptos, según el tamaño de la empresa, con 60 días para corregir.", fuente: "Ley 2536 de 2025 · art. 8" },
];

const PASOS = [
  { n: "Disponible", t: "El establecimiento publica", d: "Importa su cierre de turno o publica a mano. Solo entra lo que pasa las reglas sanitarias." },
  { n: "Reclamado", t: "El receptor lo toma", d: "Ve lo disponible ordenado por urgencia y lo reclama para recogerlo." },
  { n: "Recibido", t: "Confirma la recepción", d: "Registra el estado del producto y, si requiere frío, la temperatura al recibir." },
  { n: "Certificado", t: "Queda el soporte", d: "Se emite el certificado con la ESAL aliada y la bitácora de gestión." },
];

const LEYES = [
  { t: "Ley 1990 de 2019", s: "Política contra la pérdida y el desperdicio", d: <>Prioriza reducir y destinar a consumo humano antes que otros usos. Según el análisis de Harvard y la Red Mundial de Bancos de Alimentos, <b>prohíbe donar dentro de los 5 días previos a la fecha de vencimiento</b>, y el prototipo aplica esa regla a los productos empacados. Hace responsable de la calidad a la entidad receptora desde que recibe el alimento.</> },
  { t: "Ley 2380 de 2024", s: "Donación y seguridad alimentaria", d: <>Descuento en el impuesto de renta de <b>máximo el 37 %</b> del valor donado, incluido el transporte, y exclusión de IVA. Solo aplica si el receptor es un banco de alimentos del régimen tributario especial (o de una iglesia reconocida, o una asociación de bancos). Aplica desde el año gravable 2025 y está sujeto al tope del artículo 258 del E.T.</> },
  { t: "Ley 2536 de 2025", s: "Lucha contra el hambre y el desperdicio", d: <>Crea sanciones para quien destruya alimentos aptos para consumo humano y un fondo nacional contra el hambre. La bitácora de Sobra+ sirve como evidencia de gestión del excedente.</> },
  { t: "Resolución 2674 de 2013", s: "Requisitos sanitarios", d: <>Exige registros de temperatura en el transporte de alimentos. La vigilancia de restaurantes corresponde a la Secretaría de Salud, no al INVIMA, así que el prototipo pide el concepto sanitario.</> },
];

const SEGMENTOS = [
  { quien: "Establecimiento donante", dolor: "Hoy el excedente se bota, sin soporte ni beneficio, y destruirlo apto puede sancionarse.", valor: "Certificado de donación, bitácora de gestión y acceso al descuento de hasta 37 % cuando el receptor califica.", paga: "Sí: es el cliente." },
  { quien: "Banco de alimentos / ESAL", dolor: "Recibe excedentes sin aviso previo ni información sanitaria.", valor: "Excedentes visibles por urgencia, con temperatura y vencimiento registrados antes de recoger.", paga: "No: es el aliado que emite el certificado." },
  { quien: "Patrocinador (aseguradora, banco, fundación)", dolor: "Necesita impacto medible y trazable en seguridad alimentaria.", valor: "Reporte de kilos rescatados y entregas confirmadas por territorio.", paga: "Posible: por validar." },
];

const INGRESOS = [
  { t: "Suscripción por establecimiento", d: "Cuota recurrente por usar la importación de cierre, las reglas sanitarias, la bitácora y los certificados. Es el ingreso principal.", e: "hip", etiqueta: "Hipótesis · precio por definir en piloto" },
  { t: "Plan para cadenas y centros comerciales", d: "Un solo contrato para varias sedes con panel consolidado por establecimiento.", e: "hip", etiqueta: "Hipótesis · por validar con una cadena" },
  { t: "Patrocinio de impacto", d: "Aliados corporativos financian la operación con receptores y reciben reporte de impacto verificable.", e: "hip", etiqueta: "Hipótesis · conversación con aliados del reto" },
];

export default function Inicio() {
  return (
    <section className="view">
      <div className="hero dotted">
        <span className="eyebrow">Reto Seguros Bolívar · Davivienda · Fundación Bolívar · domoi</span>
        <h1>El excedente apto sale de tu cierre de turno y llega a un <em>banco de alimentos</em>, con su certificado.</h1>
        <p className="lead">Sobra+ no reemplaza el sistema de ventas del restaurante. Lee el reporte que ese sistema ya exporta, propone qué se puede donar según las reglas sanitarias, lo conecta con un punto receptor y deja la trazabilidad lista para el certificado de donación y para demostrar que el excedente se gestionó.</p>
        <div className="row">
          <Link className="btn primary" href="/establecimiento">Probar como establecimiento</Link>
          <Link className="btn" href="/receptor">Probar como banco de alimentos</Link>
        </div>
      </div>

      <div className="facts">
        {HECHOS.map((h) => (
          <div className="fact" key={h.big}><span className="big">{h.big}</span><p>{h.texto}</p><cite>{h.fuente}</cite></div>
        ))}
      </div>

      <div className="stack">
        <div className="section-head"><h2>Cómo funciona</h2><span className="eyebrow">Cuatro estados, un solo registro</span></div>
        <ol className="flow">
          {PASOS.map((p) => (
            <li key={p.n}><span className="step">{p.n}</span><strong>{p.t}</strong><span>{p.d}</span></li>
          ))}
        </ol>
      </div>

      <div className="stack">
        <div className="section-head"><h2>Por qué un establecimiento lo adopta</h2></div>
        <div className="canvas">
          <article className="plan">
            <h3>No cambia su sistema de ventas</h3>
            <p>El restaurante sube el reporte de cierre que su sistema ya exporta (CSV). Sobra+ calcula el sobrante como preparado menos vendido, sin pedir que cambie de sistema ni que digite el inventario. La ruta siguiente es la conexión directa con los sistemas más usados.</p>
          </article>
          <article className="plan">
            <h3>Un paso al día, con algo a cambio</h3>
            <p>Del reporte a la publicación hay una sola confirmación. A cambio, el establecimiento recibe su certificado de donación y una bitácora que prueba que gestionó el excedente en vez de botarlo.</p>
          </article>
        </div>
      </div>

      <div className="stack">
        <div className="section-head"><h2>Marco legal que aplica el prototipo</h2></div>
        <dl className="law">
          {LEYES.map((l) => (
            <div key={l.t}><dt>{l.t}<small>{l.s}</small></dt><dd>{l.d}</dd></div>
          ))}
        </dl>
      </div>

      <div className="stack" id="modelo">
        <div className="section-head"><h2>Modelo de negocio</h2><span className="eyebrow">Quién gana y quién paga</span></div>
        <p className="lead">El valor se genera para tres actores. Quien paga es el establecimiento, porque es quien obtiene el soporte tributario y el cumplimiento; el banco de alimentos no paga, porque es quien hace posible el certificado.</p>
        <div className="table-wrap">
          <table className="value-table">
            <thead><tr><th>Actor</th><th>Problema actual</th><th>Lo que recibe</th><th>¿Paga?</th></tr></thead>
            <tbody>
              {SEGMENTOS.map((s) => (
                <tr key={s.quien}><td>{s.quien}</td><td>{s.dolor}</td><td>{s.valor}</td><td>{s.paga}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="metrics">
          <div className="metric"><span>Establecimientos gastronómicos registrados</span><strong>107.000+</strong><small>Acodrés, 2025</small></div>
          <div className="metric"><span>Negocios del sector en la informalidad</span><strong>~75 %</strong><small>Acodrés, 2025 · no declaran renta, no usan el descuento</small></div>
          <div className="metric"><span>Mercado inicial</span><strong>Formales</strong><small>los que declaran renta y pueden usar la Ley 2380</small></div>
        </div>
        <div className="panel">
          <div className="stack-sm">
            <span className="eyebrow">Escenario ilustrativo · supuestos del equipo, no datos de un cliente</span>
            <h3>Cuánto vale para un restaurante formal</h3>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Supuesto o resultado</th><th>Valor</th></tr></thead>
              <tbody>
                <tr><td>Porciones aptas que sobran al día</td><td className="n">20</td></tr>
                <tr><td>Valor estimado por porción</td><td className="n">$ 6.000</td></tr>
                <tr><td>Días de operación al año</td><td className="n">300</td></tr>
                <tr><td>Valor donado al año</td><td className="n">$ 36.000.000</td></tr>
                <tr><td><b>Descuento máximo en renta (37 %)</b></td><td className="n"><b>$ 13.320.000</b></td></tr>
              </tbody>
            </table>
          </div>
          <p className="lead sm">Ese descuento solo procede si el receptor es un banco de alimentos del régimen especial y está sujeto al tope del art. 258 E.T. Sirve para poner un techo al precio: la suscripción tiene que costar una fracción de lo que el establecimiento recupera.</p>
        </div>
        <div className="canvas">
          {INGRESOS.map((i) => (
            <article className="plan" key={i.t}>
              <span className="who">Fuente de ingreso</span>
              <h3>{i.t}</h3>
              <p>{i.d}</p>
              <span className={`status ${i.e}`}>{i.etiqueta}</span>
            </article>
          ))}
          <article className="plan">
            <span className="who">Estructura de costos</span>
            <h3>Qué cuesta operar</h3>
            <ul>
              <li>Desarrollo y mantenimiento de la plataforma.</li>
              <li>Acompañamiento a los establecimientos en la integración del cierre de turno.</li>
              <li>Trámite del reconocimiento como ESAL o convenio con ESAL aliada.</li>
            </ul>
            <span className="status hip">Hipótesis · sin cifras hasta el piloto</span>
          </article>
          <article className="plan">
            <span className="who">Ventaja frente a otras soluciones</span>
            <h3>Se apoya en lo que la norma exige</h3>
            <p>Existen plataformas que combinan IA y cadena de bloques con bancos de alimentos. Ninguna norma colombiana exige cadena de bloques: sí exigen reglas sanitarias, un receptor calificado y evidencia de gestión, que es lo que Sobra+ resuelve primero.</p>
            <span className="status val">Respaldado por la norma</span>
          </article>
          <article className="plan">
            <span className="who">Riesgos y cómo se atienden</span>
            <h3>Lo que hay que cuidar</h3>
            <ul>
              <li>El certificado válido lo emite la ESAL aliada; el prototipo no tiene validez tributaria.</li>
              <li>El descuento es un máximo y depende del régimen y del tope del art. 258 E.T.</li>
              <li>La estructura jurídica de Sobra+ y su forma de cobro se definen con asesoría tributaria antes del piloto.</li>
            </ul>
            <span className="status hip">Por validar con asesor</span>
          </article>
        </div>
        <p className="lead sm">Las marcadas como hipótesis no tienen precio ni cifra de demanda todavía. El piloto con establecimientos y un banco de alimentos es lo que las valida.</p>
      </div>
    </section>
  );
}
