# Módulo: Predicción + Prevención

Estado: **fuera de alcance**, documentado por completitud arquitectónica.

## Por qué no se construye

La evidencia del reto indica que "muchos establecimientos tienen información sobre ventas y operación, pero no necesariamente la utilizan para anticipar excedentes". Eso significa que la infraestructura de datos y, en muchos casos, los modelos de predicción **ya existen dentro de los establecimientos**. Construir un módulo propio de predicción duplicaría esa inversión en lugar de resolver el problema real, que es de adopción y de acción sobre esos datos, no de falta de ellos.

## Qué haría si se integrara a futuro

Exponer la misma interfaz común de módulos para que un sistema de predicción ya existente del establecimiento pueda alimentar al orquestador con alertas tempranas de excedente, sin que este repositorio tenga que reimplementar esa lógica.

```
POST /modulos/prediccion-prevencion/excedente   # consumido desde el sistema externo del establecimiento
GET  /modulos/prediccion-prevencion/estado/{id}
GET  /modulos/prediccion-prevencion/metricas
```
