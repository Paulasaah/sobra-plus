# Módulo: Coordinación entre actores (núcleo del portal)

Estado: **núcleo, se construye completo**. Junto con `redistribucion-incentivos`, forma la experiencia de portal del usuario final (ver `docs/ARQUITECTURA.md`).

## Qué hace

1. Panel centralizado con visibilidad de qué está pasando: disponible, reclamado/en tránsito, confirmado, certificado emitido.
2. Enruta el excedente reclamado hacia el punto receptor correspondiente.
3. Cuando el punto receptor no da abasto, permite solicitar apoyo a un distribuidor logístico aliado (fase posterior, ver roadmap).

Detalle paso a paso con diagramas en `docs/WORKFLOW.md`, secciones 2 y 4.

## Contrato

```
GET  /panel
POST /excedentes/{id}/match
POST /necesidades
```

## Pendiente de implementar

Ver `docs/ROADMAP.md`, Fase 2 y Fase 3.
