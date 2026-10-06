# Roadmap / workflow de implementación

Orden recomendado de construcción, pensado para maximizar lo demostrable en el tiempo que quede de hackathon. Cada fase es útil por sí sola: si el tiempo se corta, el repo sigue teniendo algo coherente que mostrar.

## Fase 0 — Ya hecho
- [x] Problema y evidencia documentados (`docs/PROBLEMA.md`)
- [x] Marco legal e incentivo identificado: Ley 2380 de 2024 (`docs/MARCO_LEGAL.md`)
- [x] Arquitectura modular definida y alcance recortado (`docs/ARQUITECTURA.md`)

## Fase 1 — Flagship mínimo demostrable
- [ ] Formulario: establecimiento registra un excedente (producto, cantidad, fecha límite de aprovechamiento)
- [ ] Lógica de match: asignar el excedente a un banco de alimentos/entidad receptora (puede ser una lista fija para la demo, no hace falta un algoritmo sofisticado)
- [ ] Generación de "soporte de donación" descargable (PDF o vista simple) que referencia la Ley 2380 y el 37% de descuento tributario — esto es lo que un jurado recuerda
- [ ] Pantalla de confirmación / estado del excedente (pendiente, asignado, entregado)

## Fase 2 — Coordinación visible
- [ ] Vista simple para el banco de alimentos: lista de excedentes asignados a confirmar/recibir
- [ ] Métrica agregada: alimentos salvados, descuento tributario estimado acumulado (aunque sea con datos de la demo)

## Fase 3 — Si sobra tiempo
- [ ] Mock de módulo de incentivos de comportamiento (ej. badge o "puntos" simbólicos al establecimiento que más dona)
- [ ] Placeholder de integración con sistemas de predicción existentes (solo la interfaz, sin lógica real)

## Explícitamente fuera de este sprint
- Módulo de predicción de excedentes con modelos propios — ya existe en los establecimientos, no se duplica.
- Autenticación/roles robustos, multi-tenant real, pasarela de pago — quedan en el roadmap de producto, no en el MVP de hackathon.

## Qué mostrar en la demo (3-5 minutos)

1. Problema + evidencia (30s)
2. El gancho: Ley 2380 explicada en una frase ("donar paga menos impuesto que botar, pero nadie sabe cómo reclamarlo fácil")
3. Demo en vivo del flujo: establecimiento registra excedente → se asigna a banco de alimentos → se genera el soporte con el descuento tributario calculado
4. Arquitectura modular como argumento de escalabilidad/integración (mostrar el diagrama de `ARQUITECTURA.md`, no necesita estar todo codeado)
5. Cierre: qué sigue si esto se convirtiera en producto real
