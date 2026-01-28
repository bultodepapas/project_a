# Datos Pendientes de Angela para Completar el Portfolio

> **Fecha:** 2026-01-18
> **Estado:** Análisis del estado actual vs. requisitos del SPEC
> **Propósito:** Lista de información específica que Angela debe proporcionar para finalizar la página

---

## Resumen Ejecutivo

El portfolio está **estructuralmente completo** (Sprint 0-3 finalizados). Los componentes funcionan, el contenido base está traducido a 4 idiomas (EN, ES, FR, PT), y las animaciones están implementadas.

Sin embargo, hay datos específicos que **solo Angela puede proporcionar** para que el portfolio alcance su máximo potencial de impacto y credibilidad profesional.

---

## Clasificación de Prioridad

| Prioridad | Descripción | Impacto en Conversión |
|-----------|-------------|----------------------|
| 🔴 **Crítico** | Sin esto, el portfolio pierde credibilidad | Alto |
| 🟠 **Alto** | Mejora significativamente la percepción de seniority | Medio-Alto |
| 🟡 **Medio** | Añade valor pero no bloquea el lanzamiento | Medio |
| 🟢 **Opcional** | Nice-to-have para versiones futuras | Bajo |

---

## 1. 🔴 CRÍTICO: Decision Impact con Métricas Específicas

### Estado Actual
Los 3 case studies tienen `decisionImpact` con bullets genéricos como:
- "Informed results-based management across LATAM, Canada, and US teams"
- "Enabled evidence-based reporting to donors"

### Lo Que Falta
**Números y métricas concretas** que demuestren impacto real. El SPEC indica:

> "Decision impact es el diferenciador senior. Mínimo 3 bullets por case que expliquen qué decisiones reales se tomaron gracias al sistema."

### Preguntas para Angela

#### Case 1: Audience Intelligence Framework
1. ¿Cuántos equipos regionales adoptaron el framework? (ej: "8 equipos regionales")
2. ¿Hubo reasignación de presupuesto basada en los insights? (ej: "$2M+ redirigidos a segmentos de alto potencial")
3. ¿Con qué frecuencia se usa el sistema? (ej: "Referenciado en 12 sesiones de planificación trimestral")
4. ¿Algún cambio de estrategia específico documentable? (ej: "Cambió la estrategia de mensajes en 3 países")

#### Case 2: Performance Benchmark System
1. ¿Cuántas regiones/equipos compara el sistema?
2. ¿Se identificaron mejoras medibles? (ej: "Identificó 15% de mejora potencial en eficiencia de campañas")
3. ¿Frecuencia de uso del dashboard?
4. ¿Alguna decisión de recursos documentable?

#### Case 3: Narrative Tracking System
1. ¿Cuántas plataformas/fuentes integra?
2. ¿Cuántas alertas de tendencia se generan? (ej: "100+ alertas mensuales")
3. ¿Algún ejemplo de adaptación en tiempo real de estrategia?
4. ¿Número de usuarios del sistema?

### Formato de Respuesta Esperado
```yaml
# Ejemplo ideal de decision impact
decisionImpact:
  - "Shifted messaging strategy in 3 regions based on segment migration data"
  - "Reallocated $2M+ in campaign budget toward high-potential segments"
  - "Informed partner selection criteria for 2023 grant cycle"
  - "Reduced survey duplication by 40% through standardized methodology"
```

---

## 2. 🔴 CRÍTICO: Cadencia y Adoption Roles

### Estado Actual
Los campos `adoption` y `governance` son genéricos:
- "Used by regional teams in Latin America, Canada, and United States"
- "Collaboration with EU-aligned partners"

### Lo Que Falta
**Quién específicamente usa cada sistema, con qué frecuencia, y en qué contexto.**

### Preguntas para Angela

1. **¿Quiénes son los usuarios principales de cada sistema?**
   - Títulos de cargo (ej: "Regional Directors", "Programme Managers", "Research Team")
   - ¿Board members o stakeholders senior también lo usan?

2. **¿Con qué frecuencia se consultan los sistemas?**
   - ¿Diario, semanal, mensual, trimestral?
   - ¿Hay reportes automáticos o alertas?

3. **¿En qué reuniones/procesos se usan?**
   - ¿Sesiones de planificación trimestral?
   - ¿Reportes a donantes?
   - ¿Board meetings?

4. **¿Cuántos usuarios activos tiene cada sistema aproximadamente?**

### Formato de Respuesta Esperado
```yaml
# Ejemplo ideal
adoption: "Used by 15+ team members across 8 regional offices on weekly basis. Integrated into quarterly strategic planning sessions. Referenced in board reporting and donor communications."
governance: "Owned by Data & Analytics team. QA by Research Director. Consumed by Regional Directors, Programme Managers, and Board (quarterly summaries)."
```

---

## 3. 🟠 ALTO: Métricas del Proof Strip

### Estado Actual
Los 5 items del Proof Strip son correctos pero podrían ser más impactantes:

| ID | Actual | Potencial Mejora |
|----|--------|------------------|
| frameworks | "3 impact frameworks built" | ✅ Está bien |
| scope | "Cross-regional scope" | "X countries reached" |
| experience | "8+ years in M&E" | ✅ Está bien |
| recognition | "Recognized at ECF" | "Recognized by [nombre específico]" |
| reference | "Multi-country reference" | "Referenced in X assessments" |

### Preguntas para Angela

1. **¿Cuántos países abarca el trabajo?** (ej: "12 countries", "15+ countries")
2. **¿Quién otorgó el reconocimiento en ECF?** (ej: "Communications Director", "Executive Team")
3. **¿En cuántas evaluaciones internacionales fueron referenciados los sistemas?**
4. **¿Hay algún número de donantes o socios que usen los frameworks?**

---

## 4. 🟠 ALTO: Capabilities - 2 Bloques Faltantes

### Estado Actual
El archivo `skills.json` tiene **4 capabilities**, pero el SPEC permite hasta **6**.

### Capabilities Actuales
1. Impact Assessment ✅
2. Audience Intelligence ✅
3. Performance Benchmarking ✅
4. Narrative Tracking ✅

### Capabilities Sugeridas (del CONTENT_MAP)
5. **Research & Mixed Methods** - Falta agregar
6. **Capacity Building & Training** - Falta agregar

### Preguntas para Angela

1. **Research & Mixed Methods:**
   - ¿Qué herramientas usas? (ej: "Qualitative coding, Survey design, Excel")
   - ¿Ejemplo de evidencia? (ej: "Designed survey instruments for X countries")

2. **Capacity Building & Training:**
   - ¿Cuántos talleres has facilitado?
   - ¿A cuántas personas has entrenado?
   - ¿Qué temas cubres? (ej: "Data literacy, Results measurement")

### Datos Necesarios
```yaml
# Research & Mixed Methods
- id: "research-methods"
  name: "Research & Mixed Methods"
  tools: ["Qualitative coding", "Survey design", "Data analysis", "Excel"]
  evidence: "TODO: Angela debe proporcionar ejemplo específico"
  caseLink: "/case-studies/audience-framework"

# Capacity Building
- id: "capacity-building"
  name: "Capacity Building & Training"
  tools: ["Workshop facilitation", "Data literacy", "Results measurement"]
  evidence: "TODO: Angela - ¿cuántos talleres? ¿cuántas personas?"
  caseLink: "/case-studies/audience-framework"
```

---

## 5. 🟠 ALTO: Artifacts Visuales

### Estado Actual
Los case studies no tienen `artifacts` (diagramas, scorecards, screenshots).

### Lo Que Falta
Imágenes visuales que demuestren el trabajo de forma tangible.

### Preguntas para Angela

1. **¿Tienes capturas de dashboards que puedas compartir?**
   - Pueden ser anonimizadas/difuminadas
   - Solo para mostrar la estructura visual

2. **¿Tienes diagramas de arquitectura de los sistemas?**
   - Pueden ser simplificados
   - SVG o PNG de alta calidad

3. **¿Tienes templates de scorecards/reportes?**
   - Versiones en blanco o con datos ficticios
   - Solo para mostrar el formato

4. **Nota de confidencialidad:**
   - ¿Necesitamos agregar `confidentialityNote` a algún case?
   - ¿Hay restricciones sobre qué se puede mostrar?

### Formato de Respuesta Esperado
```yaml
artifacts:
  - type: "diagram"
    src: "/assets/artifacts/audience-framework-architecture.svg"
    alt: "Audience Framework Architecture"
    caption: "Simplified system architecture (confidential details removed)"

  - type: "scorecard"
    src: "/assets/artifacts/regional-scorecard-template.png"
    alt: "Regional Scorecard Template"
```

---

## 6. 🟡 MEDIO: Foto Profesional

### Estado Actual
No hay foto de Angela en el sitio.

### Preguntas para Angela

1. ¿Tienes una foto profesional que quieras usar?
2. ¿Preferencia de ubicación? (Header, About section, o ninguno)
3. Formato preferido (cuadrada, circular, etc.)

### Especificaciones Técnicas
- Resolución mínima: 400x400px
- Formatos aceptados: JPG, PNG, WebP
- El sistema generará versiones optimizadas automáticamente

---

## 7. 🟡 MEDIO: PDFs en Francés y Portugués

### Estado Actual
```json
{
  "pdf": {
    "en": "/pdf/angela-parra-resume-en.pdf",
    "es": "/pdf/angela-parra-resume-es.pdf",
    "fr": "/pdf/angela-parra-resume-en.pdf",  // Fallback a EN
    "pt": "/pdf/angela-parra-resume-en.pdf"   // Fallback a EN
  }
}
```

### Lo Que Falta
PDFs nativos en francés y portugués (actualmente usan fallback al inglés).

### Preguntas para Angela
1. ¿Necesitas PDFs en FR y PT?
2. ¿O el fallback a inglés es aceptable para esas audiencias?

---

## 8. 🟡 MEDIO: URL de LinkedIn Correcta

### Estado Actual
```json
"linkedin": "https://www.linkedin.com/in/angela-parra-sanchez-89548165"
```

### Verificación Necesaria
- ¿Es esta la URL correcta y actualizada?
- ¿Debería tener tilde en "Sánchez"? (algunas URLs de LinkedIn lo omiten)

---

## 9. 🟡 MEDIO: Headline Personalizado del Hero

### Estado Actual
```
"Data & Impact Assessment Specialist"
```

### Preguntas para Angela
1. ¿Estás satisfecha con este headline?
2. ¿Preferirías algo más específico o diferente?

**Alternativas sugeridas:**
- "Building Decision Systems for Climate Action"
- "Impact Measurement Architect"
- "Data Strategist for International Programmes"

---

## 10. 🟢 OPCIONAL: Calendly/Booking

### Estado Actual
No hay sistema de reserva de reuniones integrado.

### Preguntas para Angela
1. ¿Tienes cuenta de Calendly o similar?
2. ¿Quieres agregar un botón de "Schedule a call" en el Contact?

---

## 11. 🟢 OPCIONAL: Case Study #4 (Fidelizador)

### Estado Actual
El CONTENT_MAP menciona un **caso opcional** sobre Fidelizador que no está implementado.

### Preguntas para Angela
1. ¿Quieres incluir el caso de Fidelizador como cuarto case study?
2. Si sí, necesitamos los mismos datos que los otros casos (problem, approach, decision impact, etc.)

---

## Resumen de Datos Pendientes por Prioridad

### 🔴 Crítico (Necesario para lanzamiento)
| Item | Descripción | Formato |
|------|-------------|---------|
| Decision Impact - Case 1 | Métricas específicas Audience Framework | 3-4 bullets con números |
| Decision Impact - Case 2 | Métricas específicas Benchmark System | 3-4 bullets con números |
| Decision Impact - Case 3 | Métricas específicas Narrative Tracking | 3-4 bullets con números |
| Adoption Roles | Quién usa cada sistema, frecuencia | Texto descriptivo |

### 🟠 Alto (Mejora significativa)
| Item | Descripción | Formato |
|------|-------------|---------|
| Proof Strip metrics | Números específicos (países, evaluaciones) | Números |
| Capabilities 5 & 6 | Research Methods + Capacity Building | JSON structure |
| Artifacts | Diagramas, scorecards (anonimizados) | PNG/SVG |

### 🟡 Medio (Nice-to-have)
| Item | Descripción | Formato |
|------|-------------|---------|
| Foto profesional | Imagen de Angela | JPG/PNG 400x400+ |
| PDFs FR/PT | Versiones nativas o confirmar fallback | PDF |
| LinkedIn URL | Verificar que es correcta | URL |
| Headline | Confirmar o proponer alternativa | Texto |

### 🟢 Opcional (Post-lanzamiento)
| Item | Descripción | Formato |
|------|-------------|---------|
| Calendly | URL de booking | URL |
| Case #4 Fidelizador | Caso completo adicional | MDX |

---

## Próximos Pasos

1. **Angela revisa este documento** y proporciona los datos críticos
2. **Actualizar archivos JSON/MDX** con la información recibida
3. **Generar artifacts** si Angela proporciona imágenes
4. **Re-ejecutar validación** para confirmar completitud
5. **Sprint 4-5**: Polish final y deploy

---

## Notas Técnicas

### Cómo proporcionar los datos
Angela puede responder en cualquier formato (email, documento, conversación). El equipo de desarrollo convertirá los datos al formato técnico necesario.

### Datos que NO son necesarios
- ✅ Estructura del sitio - Completada
- ✅ Traducciones base - Completadas (EN, ES, FR, PT)
- ✅ Componentes UI - Implementados
- ✅ Animaciones - Funcionando
- ✅ SEO base - Configurado

### Tiempo estimado de integración
Una vez Angela proporcione los datos críticos, la integración tomará:
- Datos críticos: ~1-2 horas
- Datos de alta prioridad: ~2-3 horas
- Datos opcionales: ~1 hora cada uno

---

*Documento generado: 2026-01-18*
*Basado en: SPEC.md, CONTENT_MAP.md, análisis de archivos de datos actuales*


Respuesta: 

interveiw angela answer.pdf
