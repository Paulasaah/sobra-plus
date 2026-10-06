# Plan de implementación

Plan concreto para construir el loop mínimo demostrable del portal, en el orden que más impacto tiene en una demo de hackathon. Se apoya en `docs/ARQUITECTURA.md` (qué se construye y qué no) y `docs/WORKFLOW.md` (los flujos exactos).

## Decisiones de stack (para no perder tiempo discutiendo)

| Decisión | Elección | Por qué |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Un solo proyecto sirve para frontend y backend (API routes), evita levantar dos servicios por separado |
| Estilos | **Tailwind CSS + shadcn/ui** | Componentes profesionales listos (formularios, tablas, badges de estado) sin diseñar desde cero; look serio, sin emojis, por defecto |
| Datos (para la demo) | **Almacenamiento en memoria o archivo JSON** en el servidor (sin configurar base de datos real) | Elimina el riesgo de perder tiempo en infraestructura de datos durante el hackathon |
| Datos (si sobra tiempo) | SQLite + Prisma | Upgrade natural si el loop mínimo ya funciona y sobra tiempo; no es requisito para la demo |
| Certificado de donación | Vista HTML renderizada (no PDF real todavía) con los datos de la donación y la referencia a la Ley 2380 (37% + exclusión de IVA) | Un PDF real no aporta a la demo; una vista clara sí |

## Estructura de carpetas propuesta (dentro de `modules/`)

```
modules/
├── redistribucion-incentivos/
│   ├── app/
│   │   ├── excedentes/nuevo/page.tsx       # Formulario: publicar excedente
│   │   ├── excedentes/[id]/page.tsx        # Detalle + certificado
│   │   └── api/excedentes/route.ts         # POST/GET excedentes
│   └── lib/
│       ├── store.ts                        # Almacenamiento en memoria/JSON
│       └── certificado.ts                  # Cálculo 37% + exclusión IVA
├── coordinacion-actores/
│   └── app/
│       ├── panel/page.tsx                  # Panel centralizado (4 estados)
│       └── api/excedentes/[id]/confirmar/route.ts
```

## Fases de construcción (orden estricto, no paralelizar sin terminar la anterior)

### Fase 1 — Esqueleto del proyecto
1. Inicializar proyecto Next.js + TypeScript + Tailwind + shadcn/ui dentro del repo.
2. Definir el tipo de dato `Excedente` (`id`, `establecimiento`, `tipoAlimento`, `cantidad`, `aptoConsumo: true`, `fechaLimite`, `estado: 'disponible' | 'reclamado' | 'confirmado' | 'certificado'`).
3. Layout base: encabezado con el nombre del portal, navegación simple (Publicar / Panel), paleta profesional (verdes/neutros).

### Fase 2 — Loop mínimo (lo único imprescindible para la demo)
1. **Publicar excedente**: formulario en `excedentes/nuevo`, valida que `aptoConsumo` sea obligatoriamente verdadero antes de guardar (regla de negocio del reto: solo alimentos aptos para consumo entran al portal).
2. **Listar disponibles**: vista con los excedentes en estado `disponible`.
3. **Reclamar**: acción que cambia el estado a `reclamado` y registra qué punto receptor lo reclamó.
4. **Confirmar recepción**: acción que cambia el estado a `confirmado`.
5. **Generar certificado**: al confirmar, se calcula y muestra el descuento tributario (37% del valor estimado) y la exclusión de IVA, citando la Ley 2380 de 2024 (ver `docs/MARCO_LEGAL.md`). **No usar ningún otro porcentaje no verificado.**

### Fase 3 — Panel centralizado
1. Vista `panel/page.tsx` con cuatro columnas: disponible / reclamado / confirmado / certificado emitido.
2. Métrica agregada simple: total de alimentos salvados (suma de `cantidad` de los confirmados) y descuento tributario estimado acumulado.

### Fase 4 — Landing / pitch dentro del propio portal
1. Página de inicio con el problema (dato DNP 34% / 9,76 millones de toneladas, verificado), el marco legal (Ley 1990, 2380, 2536) y el modelo (alianza con ESAL existentes).
2. Esto convierte al propio portal en la pieza de pitch: el jurado navega el problema y la solución en el mismo lugar.

### Fase 5 — Si sobra tiempo
1. Publicación de necesidad por parte del punto receptor.
2. Mock de badge/reconocimiento (módulo de incentivos de comportamiento).
3. Mención visual (no funcional) de la vía de donación de alimentos incautados/vencidos-pero-seguros habilitada por la Ley 2536 de 2025, como roadmap de expansión de oferta.

## Qué no se construye en este sprint (y por qué)

- Autenticación real de usuarios — se simula con un selector simple de "rol" (establecimiento / punto receptor) para la demo.
- Base de datos persistente real — el JSON/memoria alcanza para una demo en vivo.
- Integración real con ABACO/Banco de Alimentos de Colombia — se simula como si ya existiera la alianza; se documenta como paso siguiente real, no se construye.
- PDF descargable del certificado — una vista en pantalla es suficiente para la demo.

## Checklist de cierre antes de la demo

- [ ] El loop completo (publicar → reclamar → confirmar → certificado) funciona sin errores en vivo.
- [ ] Ningún texto en pantalla usa las cifras no verificadas ("35%/27%"); solo 37% + exclusión de IVA.
- [ ] El portal se ve bien en una pantalla de celular (responsive).
- [ ] Cero emojis en toda la interfaz.
- [ ] El pitch de 3-5 minutos (`docs/ROADMAP.md`) está ensayado sobre el portal real, no sobre diapositivas sueltas.
