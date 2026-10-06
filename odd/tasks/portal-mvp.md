# Feature: Portal MVP (loop mínimo demostrable)

## Objetivo
Construir el loop mínimo del portal Sobra+: publicar excedente -> reclamar -> confirmar -> certificado de donación, más un panel centralizado y una landing con el pitch, para demo de hackathon.

## Por qué
Ver `docs/PROBLEMA.md`, `docs/MARCO_LEGAL.md`, `docs/ARQUITECTURA.md`, `docs/WORKFLOW.md`, `docs/PLAN_IMPLEMENTACION.md`. Decisión de alcance ya tomada con el usuario: un solo núcleo funcional, sin predicción, sin auth real, sin DB persistente.

## Alcance autorizado
- Un proyecto Next.js (App Router + TypeScript + Tailwind + shadcn/ui) en `webapp/` en la raíz del repo (corrección respecto al plan original: un solo proyecto, no carpetas `app/` separadas por módulo — Next.js no soporta eso dentro de un mismo proceso de dev).
- Datos en memoria/archivo JSON en servidor, sin base de datos real.
- Páginas: landing/pitch, publicar excedente, listado + reclamar, confirmar recepción, certificado (solo 37% + exclusión IVA, Ley 2380 — nunca otro porcentaje), panel centralizado con 4 estados y métricas agregadas.
- Selector simple de rol (establecimiento / punto receptor), sin auth real.
- Regla de negocio: `aptoConsumo` obligatorio `true` antes de guardar un excedente.
- Estética profesional, responsive, cero emojis.

## Modo TDD resuelto
Config global del usuario: Strict TDD enabled (`CLAUDE.md`). **Desviación deliberada para este sprint**: se omite el ciclo red-green-refactor por tratarse de código de demo de hackathon que se descarta/reemplaza después del evento. Decisión comunicada al usuario, no oculta. No aplica a trabajo futuro fuera de este sprint.

## Tareas
- [x] Scaffold Next.js + TypeScript + Tailwind + shadcn/ui en `webapp/`
- [x] Modelo de datos `Excedente` + store en memoria/JSON
- [x] Página: publicar excedente (con validación aptoConsumo)
- [x] Página: listado de disponibles + acción reclamar
- [x] Acción: confirmar recepción (une confirmación + emisión de certificado en una sola acción, según `docs/WORKFLOW.md`)
- [x] Vista: certificado (37% + exclusión IVA, Ley 2380)
- [x] Panel centralizado (4 estados + métricas agregadas)
- [x] Landing con el pitch (problema, marco legal, modelo)
- [x] Verificar build (`npm run build`) sin errores

## Ruta
Delegado a un agente escritor (nextjs-developer) por tratarse de 2+ archivos no triviales.

## Verificación (hecha por el orquestador, no solo por el escritor)
- Lectura de `lib/certificado.ts`, `lib/store.ts`, `lib/types.ts`, rutas API y vistas clave — lógica correcta, cálculo del 37% aislado y documentado, nunca usa cifras no verificadas.
- Build (`npm run build`) y dev server arrancados; las 4 rutas (`/`, `/excedentes`, `/excedentes/nuevo`, `/panel`) responden 200.
- Smoke test funcional end-to-end vía API: creación con `aptoConsumo:false` rechazada con mensaje correcto; creación válida -> reclamar -> confirmar -> certificado emitido con el cálculo exacto (48.000 × 37% = 17.760).
- Revisión visual con capturas (`agent-browser`): landing, formulario y panel. Estética profesional, sin emojis, responsive, cifras verificadas visibles.
- Decisión del escritor de subir a Next.js 15 / React 19 por CVEs críticas sin parche en la rama 14.x: validada, razonable.
- Deuda técnica conocida y no silenciada: 9 advisories moderate/high en dependencias de build de Tailwind (nunca se ejecutan en runtime); requieren migración a Tailwind v4, fuera de alcance de este sprint.

## Estado
Completo (Fase 1 y 2 del roadmap). Pendiente de decisión del usuario: commit/push.
