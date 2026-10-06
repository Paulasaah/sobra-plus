# Sobra+

Portal web de gestión para reducir el desperdicio de alimentos: conecta a establecimientos con excedentes aptos para consumo (restaurantes, universidades, grandes cocinas, comercio) con puntos receptores (bancos de alimentos, ESAL aliadas) y, para volúmenes grandes, con distribuidores logísticos.

Reto planteado por **Seguros Bolívar**, **Davivienda** y **Fundación Bolívar**, con **domoi** como aliado.

## El problema

Cada día se generan grandes cantidades de alimentos y productos aprovechables que terminan convertidos en residuos. Detrás de eso hay comportamientos, decisiones operativas, incentivos, problemas de información y distintos actores que no están coordinados entre sí. Ver [docs/PROBLEMA.md](docs/PROBLEMA.md) para el detalle completo del reto y la evidencia recogida.

## Nuestro enfoque

Un portal **intermediario**: centraliza la visibilidad de qué excedente hay disponible y qué necesidad hay sin cubrir, conecta ambos lados, y facilita que el establecimiento done en vez de botar, reclamando el incentivo tributario real que ya existe en Colombia (Ley 2380 de 2024 — ver [docs/MARCO_LEGAL.md](docs/MARCO_LEGAL.md)).

El modelo de negocio objetivo es operar como **ESAL** (Entidad Sin Ánimo de Lucro) para poder emitir directamente el certificado de donación. Para el MVP de hackathon, ese paso se demuestra en alianza con ESAL ya reconocidas (ABACO, Banco de Alimentos de Colombia), mientras se tramita el reconocimiento propio — ver la nota de alcance en [docs/MARCO_LEGAL.md](docs/MARCO_LEGAL.md).

Diagramas de los tres flujos operativos (establecimiento, punto receptor, certificación) en [docs/WORKFLOW.md](docs/WORKFLOW.md). Justificación de la arquitectura y recorte de alcance en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

| Pieza | Estado | Por qué |
|---|---|---|
| **Portal de conexión y donación** (publicar excedente, reclamar, confirmar, certificar) | 🟢 Núcleo, se construye completo | Es el producto. Ataca directamente la brecha de adopción de donación con un incentivo tributario real y verificado |
| **Alianzas con grandes distribuidores** | 🟡 Diseñado, no bloqueante para el MVP | Necesario para escalar volumen cuando el punto receptor no da abasto |
| **Incentivos de comportamiento** | ⚪ Secundario / roadmap | El incentivo tangible ya es el certificado tributario; la gamificación es una capa futura, no el motor de adopción |
| **Predicción + Prevención** | ⛔ Fuera de alcance | Los establecimientos ya cuentan con esos datos y esa infraestructura; no se duplica |

Roadmap completo y orden de construcción en [docs/ROADMAP.md](docs/ROADMAP.md).

## Estructura del repositorio

```
.
├── docs/
│   ├── PROBLEMA.md        # Reto y evidencia original del hackathon
│   ├── MARCO_LEGAL.md     # Incentivos legales/tributarios y modelo ESAL (Colombia)
│   ├── ARQUITECTURA.md    # Diseño del portal y justificación de alcance
│   ├── WORKFLOW.md        # Diagramas de los flujos operativos
│   └── ROADMAP.md         # Workflow de implementación, priorizado
└── modules/
    ├── redistribucion-incentivos/   # Núcleo del portal: publicar, reclamar, certificar
    ├── coordinacion-actores/        # Núcleo del portal: panel centralizado y enrutamiento
    ├── incentivos-comportamiento/   # Secundario
    └── prediccion-prevencion/       # Fuera de alcance, documentado por completitud
```

Nota: `redistribucion-incentivos` y `coordinacion-actores` son **una sola experiencia de portal** para el usuario final; se mantienen como carpetas separadas solo por límite técnico de servicio (ver `docs/ARQUITECTURA.md`).

## Estética

Portal profesional e intuitivo. Sin emojis ni elementos decorativos innecesarios.

## Equipo

_Completar con nombres y roles del equipo._

## Estado

Repositorio organizado durante el hackathon (octubre 2026). Documentación y arquitectura del portal corregidas y alineadas con el modelo de negocio (octubre 2026). Implementación del loop mínimo (Fase 1 del roadmap) pendiente de construir.
