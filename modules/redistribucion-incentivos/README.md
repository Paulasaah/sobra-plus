# Módulo: Redistribución + Incentivos (núcleo del portal)

Estado: **núcleo, se construye completo**. Junto con `coordinacion-actores`, forma la experiencia de portal del usuario final (ver `docs/ARQUITECTURA.md`).

## Qué hace

1. Recibe la publicación de un excedente por parte de un establecimiento (tipo de alimento, cantidad, apto para consumo, fecha límite).
2. Permite que un punto receptor (banco de alimentos / ESAL aliada) lo reclame.
3. Registra la confirmación de recepción.
4. Genera el certificado de donación, referenciando el descuento tributario del 37% + exclusión de IVA de la Ley 2380 de 2024 (ver `/docs/MARCO_LEGAL.md`). **No usar porcentajes no verificados.**

Detalle paso a paso con diagramas en `docs/WORKFLOW.md`, secciones 1 y 3.

## Contrato

```
POST /excedentes
GET  /excedentes?estado=disponible
POST /excedentes/{id}/confirmar
GET  /excedentes/{id}/certificado
```

## Pendiente de implementar

Ver `docs/ROADMAP.md`, Fase 1.
