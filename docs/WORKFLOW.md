# Workflow del portal

Este documento es la referencia de los flujos operativos del portal, pensada para que el equipo construya en orden y para que la demo se pueda explicar paso a paso frente al jurado. No incluye implementación: es el mapa antes de escribir código.

## 1. Flujo del establecimiento (lado oferta)

```mermaid
sequenceDiagram
    participant Est as Establecimiento
    participant Portal as Portal
    participant Rec as Punto receptor

    Est->>Portal: Publica excedente (tipo, cantidad, apto para consumo, fecha limite)
    Portal->>Portal: Valida que el alimento este en categoria "apto para consumo"
    Portal->>Rec: Notifica disponibilidad
    Rec->>Portal: Reclama el excedente
    Portal->>Est: Notifica que fue reclamado y por quien
    Est->>Rec: Entrega fisica del excedente
    Rec->>Portal: Confirma recepcion
    Portal->>Est: Emite certificado de donacion (Ley 2380)
```

**Regla de negocio clave:** solo se publican alimentos aptos para consumo humano. Cualquier excedente que no cumpla esa condición no entra al portal (queda fuera de alcance, corresponde a otra categoría de manejo de residuos).

## 2. Flujo del punto receptor (lado demanda)

```mermaid
sequenceDiagram
    participant Rec as Punto receptor (banco de alimentos / ESAL aliada)
    participant Portal as Portal
    participant Dist as Distribuidor logistico

    Rec->>Portal: Publica su necesidad (que necesita, cuanto, donde)
    Portal->>Rec: Muestra excedentes disponibles que calzan con la necesidad
    Rec->>Portal: Reclama uno o varios excedentes
    alt Volumen manejable directamente
        Rec->>Rec: Organiza recoleccion propia
    else No da abasto
        Rec->>Portal: Solicita apoyo logistico
        Portal->>Dist: Notifica solicitud de recoleccion de volumen
        Dist->>Rec: Coordina recoleccion
    end
    Rec->>Portal: Confirma recepcion final
```

## 3. Flujo de certificación (ESAL)

```mermaid
sequenceDiagram
    participant Portal as Portal
    participant ESAL as ESAL (propia o aliada: ABACO / Banco de Alimentos de Colombia)
    participant Est as Establecimiento
    participant DIAN as Declaracion de renta

    Portal->>ESAL: Envia registro de donacion confirmada (quien, cuanto, cuando)
    ESAL->>ESAL: Verifica que la entidad receptora tenga regimen tributario especial vigente
    ESAL->>Est: Emite certificado de donacion (valor, 37% descuento tributario, exclusion de IVA)
    Est->>DIAN: Usa el certificado como soporte en su declaracion de renta
```

**Nota:** mientras la ESAL propia no tenga resuelto su régimen tributario especial ante la DIAN, este paso se ejecuta en alianza con una ESAL ya reconocida (ver `docs/MARCO_LEGAL.md`). El portal no debe prometer un certificado que no puede respaldar legalmente.

## 4. Vista operativa centralizada

Transversal a los tres flujos anteriores. El panel central debe responder, en todo momento, estas preguntas sin que el usuario tenga que buscarlas:

- ¿Qué excedentes hay disponibles ahora mismo, y dónde?
- ¿Qué necesidades hay sin cubrir?
- ¿Qué está en tránsito (reclamado pero no confirmado)?
- ¿Cuánto se ha certificado como donación en el periodo (para que el establecimiento vea su beneficio acumulado)?

```mermaid
flowchart TB
    subgraph Panel["Panel centralizado"]
        D1[Disponible]
        D2[Reclamado / en transito]
        D3[Confirmado]
        D4[Certificado emitido]
    end
    D1 --> D2 --> D3 --> D4
```

## Orden de construcción sugerido (ver también `docs/ROADMAP.md`)

1. Publicar excedente (establecimiento) — sin esto no hay nada que mostrar.
2. Ver disponible + reclamar (punto receptor) — cierra el loop mínimo demostrable.
3. Confirmar recepción + emitir certificado — es el momento que más impacta en la demo.
4. Panel centralizado — se arma con los datos que ya generan los tres pasos anteriores, no antes.
5. Apoyo de distribuidor logístico y necesidades publicadas por el receptor — quedan para si sobra tiempo; no son necesarios para que el loop principal se vea funcionando.
