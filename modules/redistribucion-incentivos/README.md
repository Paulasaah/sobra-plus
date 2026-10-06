# Módulo: Redistribución + Incentivos (flagship)

Estado: **funcional** (en construcción durante el hackathon).

## Qué hace

1. Recibe el registro de un excedente de un establecimiento.
2. Lo asigna a un banco de alimentos / entidad receptora.
3. Genera el soporte de la donación, referenciando el descuento tributario del 37% de la Ley 2380 de 2024 (ver `/docs/MARCO_LEGAL.md`).

## Contrato (interfaz común de módulos)

```
POST /modulos/redistribucion-incentivos/excedente
GET  /modulos/redistribucion-incentivos/estado/{id}
GET  /modulos/redistribucion-incentivos/metricas
```

## Pendiente de implementar

Ver `docs/ROADMAP.md`, Fase 1.
