# 📋 Plan de Estandarización y Refactorización — Admin Starter

> **Fecha:** 2026-06-23  
> **Origen:** Auditoría integral de estandarización, seguridad y deuda técnica  
> **Riesgo de regresión:** Cero — todos los refactors mantienen barrel re-exports

---

## 🟢 1. Suspense Boundaries — YA CUBIERTO

El archivo `src/app/(root)/admin/loading.jsx` ya provee el Suspense boundary a nivel de ruta para **todas** las páginas admin. Es el mecanismo canónico de Next.js App Router.

```jsx
// src/app/(root)/admin/loading.jsx — YA EXISTE ✅
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-5 w-96 animate-pulse rounded-md bg-muted" />
      </div>
      <TableSkeleton rows={10} columns={4} />
    </div>
  );
}
```

> **Acción opcional:** Algunos containers (ej: `BeneficiaryTypePageContainer`) ya tienen `<Suspense>` anidado para UX más granular. Se puede extender a otros containers progresivamente, pero no es urgente.

---

## 🟡 2. Estandarización de Features Incompletas

### 2.1 Sub-features de Casos

Estos features **no tienen página propia** — son pestañas dentro de `src/app/(root)/admin/casos/[id]/page.jsx`.

#### 📁 `case-complaints/` — Faltan `actions/` y `hooks/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C1 | `actions/case-complaint.write.action.js` | actions | Server action para upsert de denuncia (`createProtectedAction`) |
| C2 | `hooks/use-case-complaint-form.js` | hooks | Hook `useCaseComplaintForm` (react-hook-form + zod, maneja nested object `complaint.*`) |

#### 📁 `case-coordinates/` — Faltan `components/`, `hooks/`, `index.js`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C3 | `index.js` | barrel | Re-exporta constantes y utilidades (no server-only) |
| C4 | `hooks/use-case-coordinate-form.js` | hooks | Hook para formulario de coordenadas (lat/lng, dirección) |
| C5 | `components/CaseCoordinateForm.jsx` | components | Componente de formulario de coordenadas (usa el hook) |

#### 📁 `case-documents/` — Falta `hooks/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C6 | `hooks/use-case-document-upload.js` | hooks | Hook para subida de documentos (FileUpload, validación, progress) |

#### 📁 `case-follow-ups/` — Falta `hooks/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C7 | `hooks/use-case-follow-up-form.js` | hooks | Hook para formulario de seguimiento (fecha, descripción, tipo) |

#### 📁 `case-forwards/` — Falta `hooks/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C8 | `hooks/use-case-forward-form.js` | hooks | Hook para formulario de reenvío (oficina destino, motivo) |

### 2.2 Features Geográficos — Solo select endpoints

Estos features (`states/`, `municipalities/`, `parishes/`) solo tienen `actions/` + `repositories/` porque se usan exclusivamente como dropdowns encadenados. Necesitan completar estructura mínima.

#### 📁 `states/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C9 | `mappers/state.mapper.js` | mappers | `toDomain()`, `toDomainList()`, `toPersistence()`, `toSortKey()` |
| C10 | `schemas/state.schema.js` | schemas | Schema Zod (si aplica) |
| C11 | `index.js` | barrel | Re-exporta constantes y mapper |

#### 📁 `municipalities/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C12 | `mappers/municipality.mapper.js` | mappers | `toDomain()`, `toDomainList()`, `toPersistence()`, `toSortKey()` |
| C13 | `schemas/municipality.schema.js` | schemas | Schema Zod (si aplica) |
| C14 | `index.js` | barrel | Re-exporta constantes y mapper |

#### 📁 `parishes/`

| # | Archivo | Capa | Descripción |
|---|---|---|---|
| C15 | `mappers/parish.mapper.js` | mappers | `toDomain()`, `toDomainList()`, `toPersistence()`, `toSortKey()` |
| C16 | `schemas/parish.schema.js` | schemas | Schema Zod (si aplica) |
| C17 | `index.js` | barrel | Re-exporta constantes y mapper |

---

## 🟠 3. Refactorización de Archivos > 250 Líneas

### 3.1 `navigation.config.js` (328 → ~150 + ~180)

**Archivo:** `src/features/shared/config/navigation/navigation.config.js`  
**Estrategia:** Separar rutas de sidebar. Barrel mantiene compatibilidad.

```
config/navigation/
├── navigation.config.js      ← Barrel (re-exporta ROUTES + SIDEBAR_CONFIG) ~15 líneas
├── navigation.routes.js      ← Objeto ROUTES + imports de constantes       ~150 líneas
└── navigation.sidebar.js     ← SIDEBAR_CONFIG (UI.LABELS + NAV.items)      ~180 líneas
```

**Contenido de cada archivo:**

- **`navigation.routes.js`**: imports de todas las constantes de features + objeto `ROUTES` con `AUTH`, `DASHBOARD`, `PROCESSES`, `ADMIN`, `AUDIT`, `CATALOGS`.
- **`navigation.sidebar.js`**: imports de `ROUTES` desde `./navigation.routes.js` + íconos de `lucide-react` + objeto `SIDEBAR_CONFIG`.
- **`navigation.config.js`**: re-exporta `{ ROUTES }` desde `./navigation.routes` y `{ SIDEBAR_CONFIG }` desde `./navigation.sidebar`.

**Impacto:** Cero. Todos los imports existentes (`@/features/shared/config/navigation/navigation.config`) siguen funcionando.

---

### 3.2 `date-utils.js` (281 → ~90 + ~100 + ~90)

**Archivo:** `src/features/shared/lib/date-utils.js`  
**Estrategia:** Separar por responsabilidad: formateo, parseo, tiempo actual.

```
shared/lib/
├── date-utils.js             ← Barrel (re-exporta todo)                    ~15 líneas
├── date-format.js            ← formatDate, formatTime, formatRelativeTime,
│                                formatHM, currentYearVE, formatDateUTC(dep),
│                                formatTimeUTC(dep)                         ~100 líneas
├── date-parse.js             ← parseDateInput, toDateInput, parseTime      ~90 líneas
└── date-now.js               ← todayVE, nowTimeVE, getNowDefaults, nowVE   ~90 líneas
```

**Constantes compartidas:** `TIMEZONE`, `dateFormatter`, `timeFormatter`, `dateTimeFormatter` van en `date-format.js` (son usadas principalmente por formateo). Los otros archivos las importan desde ahí.

**Impacto:** Cero. `date-utils.js` re-exporta toda la API pública.

---

### 3.3 `case.form.config.js` (278 → ~160 + ~120)

**Archivo:** `src/features/cases/config/case.form.config.js`  
**Estrategia:** Extraer arrays de definición de secciones del formulario.

```
cases/config/
├── case.form.config.js       ← getCaseFormConfig() + getCaseDefaultValues() ~160 líneas
└── case.form.sections.js     ← Arrays de secciones del form                 ~120 líneas
```

**`case.form.sections.js`** contiene las funciones que generan los arrays de campos:
- `getDateTimeSection()`, `getApplicantSection()`, `getClassificationSection()`, `getDetailsSection()`, `getEntitiesSection()`, `getComplaintSection()`

**`case.form.config.js`** importa las secciones y las ensambla en `getCaseFormConfig()`. También mantiene `getCaseDefaultValues()`.

**Impacto:** Cero. `getCaseFormConfig` y `getCaseDefaultValues` siguen exportándose desde `case.form.config.js`.

---

### 3.4 `AsyncSelect.jsx` (294 → ~120 + ~180)

**Archivo:** `src/components/shared/form/AsyncSelect.jsx`  
**Estrategia:** Extraer toda la lógica de estado/efectos/fetch/debounce a un hook personalizado.

```
shared/form/
├── AsyncSelect.jsx           ← Solo render/JSX (Popover, Command, Input)   ~120 líneas
└── use-async-select.js       ← Hook: estado, refs, fetch, debounce,
│                                open/close, clear, selectedOption           ~180 líneas
```

**`use-async-select.js`** encapsula:
- Estados: `open`, `options`, `loading`, `searchTerm`
- Refs: `mountedRef`, `reqIdRef`, `cbRef`, `prevOpenRef`, `prevSearchRef`, `lastQueryRef`, `didInitRef`
- Callbacks: `loadOptions(query)`, `handleOpenChange(next)`, `handleClear()`
- Efectos: sync de props, initial load, open/search unificado
- Derivados: `selectedOption`, `displayLabel`, `showOverlay`

**`AsyncSelect.jsx`** recibe el resultado del hook y solo renderiza:
- `Popover` + `PopoverTrigger` (el `Trigger` button)
- `PopoverContent` con `Input` de búsqueda + `Command` + `CommandList` + overlay

**Impacto:** Cero. `AsyncSelect` sigue siendo el export default de `AsyncSelect.jsx`.

---

## 📊 Resumen de Tareas

| Fase | # Tareas | Archivos | Tiempo est. | Riesgo |
|---|---|---|---|---|
| 🟢 Suspense | 0 | — (ya cubierto) | 0 min | — |
| 🟡 Estandarización | 17 | 17 nuevos | ~1h 45min | Bajo |
| 🟠 Refactors | 4 | 11 archivos (7 nuevos + 4 modificados) | ~2h | Cero |
| **Total** | **21** | **28 archivos** | **~3h 45min** | |

### Desglose por feature/archivo

| ID | Archivo | Tipo | Fase |
|---|---|---|---|
| C1 | `case-complaints/actions/case-complaint.write.action.js` | Nuevo | Estandarización |
| C2 | `case-complaints/hooks/use-case-complaint-form.js` | Nuevo | Estandarización |
| C3 | `case-coordinates/index.js` | Nuevo | Estandarización |
| C4 | `case-coordinates/hooks/use-case-coordinate-form.js` | Nuevo | Estandarización |
| C5 | `case-coordinates/components/CaseCoordinateForm.jsx` | Nuevo | Estandarización |
| C6 | `case-documents/hooks/use-case-document-upload.js` | Nuevo | Estandarización |
| C7 | `case-follow-ups/hooks/use-case-follow-up-form.js` | Nuevo | Estandarización |
| C8 | `case-forwards/hooks/use-case-forward-form.js` | Nuevo | Estandarización |
| C9 | `states/mappers/state.mapper.js` | Nuevo | Estandarización |
| C10 | `states/schemas/state.schema.js` | Nuevo | Estandarización |
| C11 | `states/index.js` | Nuevo | Estandarización |
| C12 | `municipalities/mappers/municipality.mapper.js` | Nuevo | Estandarización |
| C13 | `municipalities/schemas/municipality.schema.js` | Nuevo | Estandarización |
| C14 | `municipalities/index.js` | Nuevo | Estandarización |
| C15 | `parishes/mappers/parish.mapper.js` | Nuevo | Estandarización |
| C16 | `parishes/schemas/parish.schema.js` | Nuevo | Estandarización |
| C17 | `parishes/index.js` | Nuevo | Estandarización |
| R1a | `shared/config/navigation/navigation.routes.js` | Nuevo | Refactor |
| R1b | `shared/config/navigation/navigation.sidebar.js` | Nuevo | Refactor |
| R1c | `shared/config/navigation/navigation.config.js` | Modificado | Refactor |
| R2a | `shared/lib/date-format.js` | Nuevo | Refactor |
| R2b | `shared/lib/date-parse.js` | Nuevo | Refactor |
| R2c | `shared/lib/date-now.js` | Nuevo | Refactor |
| R2d | `shared/lib/date-utils.js` | Modificado | Refactor |
| R3a | `cases/config/case.form.sections.js` | Nuevo | Refactor |
| R3b | `cases/config/case.form.config.js` | Modificado | Refactor |
| R4a | `shared/form/use-async-select.js` | Nuevo | Refactor |
| R4b | `shared/form/AsyncSelect.jsx` | Modificado | Refactor |

---

## 🚀 Orden de Ejecución

```
Fase 1 — Refactors (cero riesgo de regresión, mayor impacto)
├── R2: date-utils.js       ← más usado en todo el proyecto (importado por ~40+ archivos)
├── R4: AsyncSelect.jsx     ← usado en todos los formularios con selects
├── R1: navigation.config.js ← importado por proxy.js y sidebar
└── R3: case.form.config.js ← solo usado en el módulo de casos

Fase 2 — Estandarización (bajo riesgo, mejora integridad estructural)
├── C9-C17: Features geográficos (mappers, schemas, barrels)
└── C1-C8:  Sub-features de casos (hooks, actions, componentes)
```

---

## ⚠️ Notas

- **Todos los refactors usan barrel re-exports**: los imports existentes no se rompen.
- **Los features geográficos** (`states/`, `municipalities/`, `parishes/`) son solo para dropdowns encadenados. No necesitan UI independiente. Se agregan mappers/schemas/index por completitud estructural.
- **Las sub-features de casos** son tabs dentro del detalle de caso. Sus hooks se usarán desde `CaseDetailPageContainer` o los componentes de tabs existentes.
- **`FileUpload.jsx` (250 líneas)** y **`NotificationBell.jsx` (239 líneas)** están cerca del límite pero no lo exceden. Se monitorean para refactor futuro.
