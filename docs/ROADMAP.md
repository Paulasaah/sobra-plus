# Roadmap / workflow de implementación

Orden recomendado de construcción, pensado para maximizar lo demostrable en el tiempo que quede de hackathon. Cada fase es útil por sí sola: si el tiempo se corta, el repo sigue teniendo algo coherente que mostrar. El detalle de cada flujo (con diagramas) está en `docs/WORKFLOW.md`.

## Fase 0 — Ya hecho
- [x] Problema y evidencia documentados (`docs/PROBLEMA.md`)
- [x] Marco legal e incentivo identificado y verificado: Ley 2380 de 2024, 37% + exclusión de IVA (`docs/MARCO_LEGAL.md`)
- [x] Arquitectura del portal definida, alcance recortado a un solo núcleo (`docs/ARQUITECTURA.md`)
- [x] Workflow de los tres flujos operativos documentado (`docs/WORKFLOW.md`)

## Fase 1 — Loop mínimo demostrable (prioridad máxima)
- [ ] Formulario: establecimiento publica un excedente (tipo de alimento, cantidad, apto para consumo, fecha límite)
- [ ] Listado: punto receptor ve los excedentes disponibles y los reclama
- [ ] Confirmación de recepción por parte del punto receptor
- [ ] Generación de certificado de donación (referencia Ley 2380, 37% + exclusión de IVA — **sin inventar porcentajes no verificados**, ver `docs/MARCO_LEGAL.md`)

## Fase 2 — Visibilidad centralizada
- [ ] Panel con los cuatro estados: disponible / reclamado / confirmado / certificado emitido
- [ ] Métrica agregada: alimentos salvados, descuento tributario estimado acumulado por establecimiento

## Fase 3 — Si sobra tiempo
- [ ] Publicación de necesidad por parte del punto receptor (no solo reclamar lo disponible)
- [ ] Solicitud de apoyo a distribuidor logístico cuando el punto receptor no da abasto
- [ ] Mock de incentivos de comportamiento (badge o reconocimiento simbólico al establecimiento que más dona)

## Explícitamente fuera de este sprint
- Módulo de predicción de excedentes con modelos propios — ya existe en los establecimientos, no se duplica.
- Trámite real de constitución de la ESAL y su régimen tributario especial — se presenta como modelo de negocio objetivo, se demuestra en alianza con ESAL ya reconocidas (ABACO, Banco de Alimentos de Colombia).
- Autenticación/roles robustos, multi-tenant real, pasarela de pago — quedan en el roadmap de producto, no en el MVP de hackathon.

## Qué mostrar en la demo (3-5 minutos)

1. Problema + evidencia (30s)
2. El gancho: Ley 2380 explicada en una frase ("donar paga menos impuesto que botar, pero nadie sabe cómo reclamarlo fácil, y el portal lo centraliza")
3. Demo en vivo del flujo: establecimiento publica excedente → punto receptor lo reclama → se confirma recepción → se genera el certificado de donación
4. Panel centralizado como argumento de transparencia y escalabilidad (alianzas con grandes distribuidores, modelo ESAL)
5. Cierre: qué sigue si esto se convirtiera en producto real
