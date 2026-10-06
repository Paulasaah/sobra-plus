# Sobra+

Solución digital modular para reducir el desperdicio de alimentos en universidades, restaurantes, eventos y zonas comerciales.

Reto planteado por **Seguros Bolívar**, **Davivienda** y **Fundación Bolívar**, con **domoi** como aliado.

## El problema

Cada día se generan grandes cantidades de alimentos y productos aprovechables que terminan convertidos en residuos. Detrás de eso hay comportamientos, decisiones operativas, incentivos, problemas de información y distintos actores que no están coordinados entre sí. Ver [docs/PROBLEMA.md](docs/PROBLEMA.md) para el detalle completo del reto y la evidencia recogida.

## Nuestro enfoque

No construimos una sola app monolítica: diseñamos una **arquitectura de módulos orquestados**, cada uno atacando un momento distinto del problema (prevención, redistribución, incentivos, coordinación), pensada para integrarse a futuro dentro de sistemas más grandes (ERPs de establecimientos, apps de bancos, plataformas de seguros).

Dado el tiempo disponible, priorizamos profundidad real en **un módulo flagship** y dejamos el resto con arquitectura definida e interfaces mockeadas. Ver el porqué y el detalle técnico en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md).

| Módulo | Estado | Por qué |
|---|---|---|
| **Redistribución + Incentivos** | 🟢 Flagship (funcional) | Ataca la brecha de adopción de donación, aprovechando el incentivo tributario real de la Ley 2380 de 2024 (ver [docs/MARCO_LEGAL.md](docs/MARCO_LEGAL.md)) |
| **Coordinación entre actores** | 🟡 Interfaz definida | Capa que conecta establecimientos, bancos de alimentos y consumidores; se apoya en el módulo flagship |
| **Incentivos de comportamiento** | ⚪ Mockeado / roadmap | Brecha intención-acción; nudges y nudges económicos para consumidores y establecimientos |
| **Predicción + Prevención** | ⛔ Fuera de alcance | Los establecimientos ya cuentan con datos de ventas/operación; no vale la pena duplicar esa infraestructura |

Roadmap completo y orden de construcción en [docs/ROADMAP.md](docs/ROADMAP.md).

## Estructura del repositorio

```
.
├── docs/
│   ├── PROBLEMA.md        # Reto y evidencia original del hackathon
│   ├── MARCO_LEGAL.md     # Incentivos legales/tributarios relevantes (Colombia)
│   ├── ARQUITECTURA.md    # Diseño modular y justificación de alcance
│   └── ROADMAP.md         # Workflow de elementos a implementar, priorizado
└── modules/
    ├── redistribucion-incentivos/   # Flagship
    ├── coordinacion-actores/
    ├── incentivos-comportamiento/
    └── prediccion-prevencion/       # Fuera de alcance, documentado por completitud
```

## Equipo

_Completar con nombres y roles del equipo._

## Estado

Repositorio organizado durante el hackathon (octubre 2026). Implementación del módulo flagship en progreso.
