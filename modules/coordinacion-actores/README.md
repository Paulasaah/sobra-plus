# Módulo: Coordinación entre actores

Estado: **interfaz definida**, implementación mínima necesaria para que el módulo flagship funcione.

## Qué hace

Enruta el excedente registrado en `redistribucion-incentivos` hacia el actor correspondiente (banco de alimentos disponible más cercano, para la demo puede ser una lista fija).

## Contrato (interfaz común de módulos)

```
POST /modulos/coordinacion-actores/excedente
GET  /modulos/coordinacion-actores/estado/{id}
GET  /modulos/coordinacion-actores/metricas
```

## Pendiente de implementar

Ver `docs/ROADMAP.md`, Fase 2.
