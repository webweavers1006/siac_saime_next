# 🗺️ ROADMAP — SIAC-SAIME Next.js

> **Última actualización:** 2026-06-23  
> **Estado general:** ~92% completado  
> **Stack:** Next.js 16.2 (App Router), React 19, Tailwind 4, Prisma 7.5, PostgreSQL, JWT (jose)

---

## 📊 Resumen de Progreso

| Estado | Cantidad | Descripción |
|--------|----------|-------------|
| ✅ Completado | 25 | Features con A-S-R-M + página admin funcional |
| 🟡 Feature OK, falta página | 3 | Estados, Municipios, Parroquias (baja prioridad) |
| 🟠 Feature OK, falta seed data | 1 | `case-coordinates/` (mapa funcional, seed cases sin polígono) |
| ⬛ Sin empezar | 1 | `attention-reports/` (reportes agregados) |
| 🟠 Bug | 0 | — |

---

## ✅ Módulos Completados

| # | Módulo | Feature | Página Admin |
|---|--------|---------|-------------|
| 1 | Autenticación | `auth/` | `/login` |
| 2 | Dashboard | `shared/` | `/` |
| 3 | Usuarios | `users/` | `/admin/users` |
| 4 | Roles | `roles/` | `/admin/roles` |
| 5 | Permisos | `permissions/` | Embebido en roles |
| 6 | Casos | `cases/` | `/admin/casos` |
| 7 | Personas | `persons/` | `/admin/personas` |
| 8 | Estatus de Caso | `case-statuses/` | `/admin/estatus-caso` |
| 9 | Estatus de Llamada | `call-statuses/` | `/admin/estatus-llamada` |
| 10 | Países | `countries/` | `/admin/paises` |
| 11 | Canales de Atención | `attention-channels/` | `/admin/canales-atencion` |
| 12 | Entes Adscritos | `attached-entities/` | `/admin/entes-adscritos` |
| 13 | Org. Populares | `popular-organizations/` | `/admin/organizaciones-populares` |
| 14 | Oficinas | `offices/` | `/admin/oficinas` |
| 15 | Tipos de Beneficiario | `beneficiary-types/` | `/admin/tipos-beneficiario` |
| 16 | Áreas de Caso | `case-areas/` | `/admin/areas-caso` |
| 17 | Motivos | `reasons/` | `/admin/motivos` |
| 18 | Tipos de Atención | `attention-types/` | `/admin/tipos-atencion` |
| 19 | Detalle Tipo Atención | `attention-type-details/` | `/admin/detalles-tipo-atencion` |
| 20 | Direcciones Admin. | `administrative-directions/` | `/admin/direcciones-administrativas` |
| 21 | Notificaciones | `notifications/` | Popover en header (sin página) |
| 22 | Correos Enviados | `sent-emails/` | `/admin/correos-enviados` |
| 23 | Mapa de Casos | `case-coordinates/` | `/admin/mapa` |
| 24 | Planillas PDF | `case-sheets/` | Sin página (embebido en casos) |
| 25 | Tickets / Colas | `tickets/` | `/admin/turnos` |

### Sub-entidades de Caso (embebidas, sin página propia)

| Sub-entidad | Feature | Estado |
|-------------|---------|--------|
| Remisiones | `case-forwards/` | ✅ Completo |
| Seguimientos | `case-follow-ups/` | ✅ Completo |
| Documentos | `case-documents/` | ✅ Completo |
| Denuncias | `case-complaints/` | ✅ Completo |
| Planillas PDF | `case-sheets/` | ✅ Completo |

---

## 🟢 BUG Corregido — Persistencia de Denuncias (CaseComplaint)

**✅ COMPLETADO 2026-06-23.** Se creó el feature independiente `case-complaints/` con su propio A-S-R-M:

- `case-complaints/` — Feature completo (config, schemas, mappers, repositories, services)
- `case.mapper.js` — `toDomain()` extrae `complaint` desde `raw.caseComplaints[0]`
- `case.read.repository.js` — `CASE_INCLUDE` incluye `caseComplaints: true`
- `case.write.action.js` — Orquesta el guardado llamando a `upsertComplaint(caseId, complaint)`
- El servicio `upsertComplaint` hace soft-delete del complaint existente + create del nuevo

---

## � Notificaciones — ✅ COMPLETADO 2026-06-23

**Feature implementado:** `notifications/` con A-S-R-M completo + polling + popover + triggers automáticos.

### Arquitectura A-S-R-M

| Capa | Archivo | Responsabilidad |
|------|---------|----------------|
| Config | `notification.constants.js` | Tipos (REMISION, CIERRE, SEGUIMIENTO), templates, UI labels, polling config |
| Schema | `notification.schema.js` | Zod: createNotification, markAsRead, listParams |
| Mapper | `notification.mapper.js` | toDomain, toDomainList, toPersistence, toSortKey |
| Repository | `notification.read.repository.js` | `findByUser()` paginado con filtros, `countUnread()` |
| Repository | `notification.write.repository.js` | `create()`, `markAsRead()`, `markAllAsRead()` |
| Service | `notification.read.service.js` | `fetchNotifications()`, `fetchUnreadCount()` |
| Service | `notification.write.service.js` | `createNotification()` fire-and-forget, `markNotificationAsRead()`, `markAllNotificationsAsRead()` |
| Action | `notification.read.action.js` | `getMyNotificationsAction`, `getUnreadCountAction` (protegidos) |
| Action | `notification.write.action.js` | `markAsReadAction`, `markAllAsReadAction` (protegidos) |

### Hooks (lógica separada de UI)

| Hook | Responsabilidad |
|------|----------------|
| `use-notification-polling.js` | Polling cada 30s a `/api/notifications/unread-count`, SWR-like throttling, cleanup |
| `use-notification-list.js` | Fetch lista en popover, optimistic mark-as-read/rollback, mark-all-as-read |

### Componentes (un archivo por componente)

| Componente | Rol |
|------------|-----|
| `NotificationBell.jsx` | Badge 🔔 en `SidebarInset` header + popover trigger (~50 líneas) |
| `NotificationPopoverContent.jsx` | Contenido del popover: header, loading skeletons, empty state, lista |
| `NotificationPopupItem.jsx` | Item individual: ícono, mensaje, tipo, tiempo relativo, link al caso |

### API Routes

| Ruta | Método | Respuesta | Arquitectura |
|------|--------|-----------|-------------|
| `/api/notifications/unread-count` | GET | `{ count: N }` | route → action → service → repository |
| `/api/notifications?limit=10` | GET | `{ items, totalCount }` | route → action → service → repository |

### Integraciones — Disparadores automáticos (fire-and-forget)

| Evento | Archivo | Tipo | Destinatario | Mensaje |
|--------|---------|------|-------------|---------|
| Remisión creada | `case-forward.write.service.js` | REMISION | Usuarios en dirección destino | *"El caso X te fue remitido desde Y"* |
| Seguimiento creado | `case-follow-up.write.service.js` | SEGUIMIENTO | Creador del caso (si no es el actor) | *"Nuevo seguimiento en tu caso X"* |
| Caso cerrado | `case.write.service.js` | CIERRE | Creador del caso (solo si cambia a Cerrado) | *"Tu caso X fue cerrado"* |

### Utilidad compartida

- `formatRelativeTime()` añadido a `src/features/shared/lib/date-utils.js` para tiempo relativo ("Hace 5 min", "Hace 2h", "Hace 3 d").

### Diseño

- **Sin página dedicada**: la campana abre un popover (más rápido, menos fricción).
- **Sin entrada en sidebar**: no es necesario — la campana siempre visible en el header es suficiente.
- **`relativeTime` en date-utils**: fuente única de verdad para formato de fechas.

---

## 🔴 Módulos con Shell Vacío

### 1. Auditoría (`audit-logs/`) ✅ COMPLETADO 2026-06-23

**Feature implementado:**
- `audit-log.constants.js` — Permisos, paginación, labels
- `audit-log.mapper.js` — toDomain, toDomainList, toPersistence, toSortKey
- `audit-log.read.repository.js` — findMany con filtros (fecha desde/hasta, búsqueda por acción, usuario)
- `audit-log.write.repository.js` — create (para registro automático)
- `audit-log.read.service.js` — fetchAuditLogsList
- `audit-log.write.service.js` — createAuditEntry (fire-and-forget, nunca lanza errores)
- `audit-log.read.action.js` — getAuditLogsAction (protegido)
- `AuditLogPageContainer.jsx` — Server component con fetch + searchParams
- `AuditLogTable.jsx` — Tabla con columnas: fecha, hora, usuario, acción
- `AuditLogFilters.jsx` — Filtros: búsqueda texto, fecha desde/hasta
- Página `/admin/auditoria/page.jsx` — Thin page con checkPageAccess
- **Integraciones:** Login exitoso, creación/actualización de casos, logs de auditoría propios

### 2. Mapa de Casos (`case-coordinates/`) 🟠 FEATURE IMPLEMENTADO — PENDIENTE SEED DATA

**✅ COMPLETADO 2026-06-23.** Feature A-S-R-M completo + mapa de coropletas funcional.

**Enfoque:** Mapa de coropletas por parroquia usando polígonos GeoJSON (`Parish.geoData`).
Los casos se cuentan por la cadena Case → Person → Parish.

#### Arquitectura A-S-R-M

| Capa | Archivo | Responsabilidad |
|------|---------|----------------|
| Config | `case-coordinate.constants.js` | PATH, PERMISSIONS, VIEW_MODES, COLOR_SCALE, UI labels |
| Schema | `case-coordinate.schema.js` | Zod: name, latitude, longitude, caseId |
| Mapper | `case-coordinate.mapper.js` | toDomain (parish + caseCount), toDomainList, toSortKey |
| Repository | `case-coordinate.read.repository.js` | `findAllForMap()` — 2 queries: parishes con geoData + cases con parishId, merge en JS |
| Repository | `case-coordinate.write.repository.js` | create, update, softDelete, softDeleteByCaseId |
| Service | `case-coordinate.read.service.js` | `fetchAllCoordinatesForMap(filters)` |
| Service | `case-coordinate.write.service.js` | `upsertCaseCoordinate()`, `updateCaseCoordinate()`, `deleteCaseCoordinate()` |
| Action | `case-coordinate.read.action.js` | `getMapCoordinatesAction` (protegido) |
| Action | `case-coordinate.write.action.js` | `saveCaseCoordinateAction`, `deleteCaseCoordinateAction` (protegidos) |
| Action | `case-coordinate.select.action.js` | `getCaseCoordinatesForSelectAction` (público) |

#### Componentes

| Componente | Rol |
|------------|-----|
| `CaseCoordinateMap.jsx` | Mapa Leaflet con capa GeoJSON, coropletas, popups, leyenda |
| `CaseCoordinateMapWrapper.jsx` | Client wrapper con `next/dynamic({ ssr: false })` para evitar SSR de Leaflet |
| `CaseCoordinateMapToolbar.jsx` | Toolbar estandarizado: Estado → Municipio (cascada), Área, Estatus, búsqueda, view mode |
| `CaseCoordinateForm.jsx` | Formulario para agregar/editar coordenadas por caso (embebible en detalle) |
| `CaseCoordinatePageContainer.jsx` | Server component: fetch inicial + debug counters |

#### Modos de Vista

| Modo | Coloración |
|------|-----------|
| **Parroquia** | Escala de verdes por caseCount (0→gris, 1-2→claro, 3-5→medio, 6+→oscuro) + leyenda |
| **Municipio** | Hash de color por municipio — todas las parroquias del mismo municipio igual color |
| **Estado** | Hash de color por estado — se ve la silueta del estado |

#### Filtros (Toolbar estandarizado)

- Estado → cascades Municipio (dropdown encadenado vía `useSearchParams`)
- Área de Caso
- Estatus de Caso
- Búsqueda por nombre de parroquia
- Selector de modo de vista (Parroquia / Municipio / Estado)
- Botón limpiar filtros

#### 🔧 Configuraciones adicionales

- **CSP** en `next.config.mjs`: agregados `tile.openstreetmap.org` y `cdnjs.cloudflare.com`
- **Permisos** en `prisma/seeds/data/auth.js`: `case_coordinates:view/read/create/update/delete`
- **Ruta** en `navigation.config.js`: `ROUTES.MAP` + sidebar item en "Procesos y Casos" con ícono `Map`
- **Dependencias**: `leaflet@1.9.4`, `react-leaflet@5.0.0`

#### ⚠️ Pendiente

- [ ] **Seed data**: Los 6 casos de ejemplo apuntan a personas cuyas `parishId` corresponden a parroquias **sin polígono GeoJSON**. Actualizar el seed para que los casos apunten a parroquias con `geoData`.
- [ ] Integrar `CaseCoordinateForm` en la página de detalle de caso (pestaña de coordenadas).
- [ ] Remover debug counters del `PageContainer` una vez verificado el flujo completo.

---

## 🟢 Correos Enviados — ✅ COMPLETADO 2026-06-23

**Feature implementado:** `sent-emails/` con A-S-R-M completo + SMTP + templates HTML + triggers automáticos + reenvío.

### Arquitectura A-S-R-M + Transport

| Capa | Archivo | Responsabilidad |
|------|---------|----------------|
| Config | `sent-email.constants.js` | Tipos (CASE_CREATED, CASE_CLOSED, CASE_FORWARDED, CASE_UPDATED), estados, SMTP config, UI labels |
| Schema | `sent-email.schema.js` | Zod: sendEmailSchema, sentEmailListParamsSchema |
| Mapper | `sent-email.mapper.js` | toDomain, toDomainList, toPersistence, toSortKey |
| Repository | `sent-email.read.repository.js` | findMany() paginado con filtros, findById(), findCaseDataForResend() |
| Repository | `sent-email.write.repository.js` | create(), updateStatus() |
| Service | `sent-email.read.service.js` | fetchSentEmailsList() |
| Service | `sent-email.write.service.js` | sendEmail() fire-and-forget, resendEmail() |
| Lib | `smtp-transport.js` | Único lugar que conoce nodemailer — `sendEmailViaSmtp()` |
| Action | `sent-email.read.action.js` | getSentEmailsAction (protegido) |
| Action | `sent-email.write.action.js` | dispatchEmailAction, resendEmailAction (protegidos) |
| Templates | `email-templates.js` | buildEmail() con wrapper HTML marca SAIME (tricolor 🇻🇪, header, footer oficial) |

### Componentes

| Componente | Rol |
|------------|-----|
| `SentEmailPageContainer.jsx` | Server component con fetch + searchParams + error handling |
| `SentEmailTable.jsx` | Client wrapper con hook de filtros |
| `SentEmailTableView.jsx` | DataTable + Toolbar + columna de acciones (reenvío) |
| `SentEmailToolbar.jsx` | Búsqueda por asunto/destinatario + botón limpiar |

### Integraciones — Disparadores automáticos

| Evento | Archivo | Tipo | Destinatario | Condición |
|--------|---------|------|-------------|-----------|
| Caso creado | `case.write.service.js` | CASE_CREATED | Ciudadano (person.email) | `attentionType.sendEmail = true` |
| Caso cerrado | `case.write.service.js` | CASE_CLOSED | Ciudadano (person.email) | Estatus cambia a "Cerrado" |
| Caso remitido | `case-forward.write.service.js` | CASE_FORWARDED | Ciudadano + email institucional de la dirección | Al crear remisión |

### Funcionalidades adicionales

- **Reenvío**: Botón 📤 en cada fila de la tabla. Reconstruye el template con datos actuales del caso y crea nuevo registro de auditoría.
- **Fallback seguro**: Si no hay SMTP configurado, usa `jsonTransport` (loguea en consola, no envía).
- **Fire-and-forget**: Los envíos nunca bloquean la operación principal ni lanzan errores al usuario.

---

## 🎫 Tickets / Colas en Tiempo Real — ✅ COMPLETADO 2026-06-23

**Feature implementado:** `tickets/` con A-S-R-M completo + SSE + pantalla pública + panel asesor + QR auto-servicio.

| Capa | Archivo | Responsabilidad |
|------|---------|----------------|
| Schema | `schema.prisma` | Modelos `Ticket` + `TicketCounter` (`turnos`, `contadores_turnos`) |
| Config | `ticket.constants.js` | Máquina de estados, prefijos, SSE, UI, rate limiting |
| Schema | `ticket.schema.js` | Zod: createTicket, updateStatus, callNext, listParams |
| Mapper | `ticket.mapper.js` | toDomain, toDomainList, toPersistence, toSortKey |
| Repository | `ticket.read.repository.js` | findMany, findDisplayData, findAdvisorQueue, findNextWaiting |
| Repository | `ticket.write.repository.js` | create, updateStatus, softDelete, incrementCounter |
| Service | `ticket.read.service.js` | fetchTicketsList, fetchDisplayPanel, fetchAdvisorQueue |
| Service | `ticket.write.service.js` | createTicket, callNextTicket, updateTicketStatus, cancel |
| Service | `ticket.integration.service.js` | createCaseFromTicket (fire-and-forget) |
| Action | `ticket.read.action.js` | getTicketsListAction, getTicketByIdAction |
| Action | `ticket.write.action.js` | createTicket, callNext, updateStatus, cancel + public |
| Action | `ticket.select.action.js` | getTicketsForSelectAction |

**Componentes:** `TicketPageContainer`, `TicketQueueTable` (auto-refresh 8s), `TicketToolbar`, `TicketFormDialog`, `TicketGeneratorForm`, `TicketDisplayScreen` (TV lobby), `TicketAdvisorPanel` (cola + filtro servicio + llamar)

**Páginas públicas:** `/turnos?oficina=X` (pantalla TV), `/tomar-turno` (formulario QR)

**Cambios cross-module:** `offices/` +`enableQrTicket` +`getOfficeCapabilitiesAction`, `users/` +`officeId`, `proxy.js` rutas públicas

**Flujo:** Ciudadano escanea QR → selecciona oficina + servicio → recibe turno → pantalla lobby → asesor llama por servicio → atiende → finaliza

---

## ⬛ Módulos Nuevos Sin Empezar

> Solo queda **1 módulo** por implementar:
> - **Reportes**: tablas agregadas con filtros, exportables a Excel + PDF. Basados en `Reporte_Controler.php`.

---

### 3. Reportes Agregados (`attention-reports/`)

**Modelo Prisma:** ❌ No existe — se consultan los modelos existentes (`Case`, `Person`, `AttentionType`, etc.)  
**Feature:** No existe  
**Página:** `/admin/reportes`  
**Exportación:** Excel (`.xlsx`) + PDF  

**Tipos de reporte a implementar:**

| Reporte | Descripción | Filtros principales |
|---------|-------------|---------------------|
| **Atención General** | Listado completo de casos/atenciones | Fecha (desde/hasta), tipo de atención, área, estatus, canal, dirección admin., tipo de beneficiario, sexo |
| **Por Operador** | Atenciones agrupadas por usuario/operador | Fecha, operador, tipo de atención, dirección |
| **Por Estado** | Atenciones agrupadas por estado geográfico | Fecha, estado, tipo de atención |
| **Por Tipo de Beneficiario** | Atenciones agrupadas por tipo de beneficiario | Fecha, tipo de beneficiario, tipo de atención |
| **Por Tipo de Atención** | Atenciones agrupadas por tipo de atención | Fecha, tipo de atención, estatus |
| **Consolidado General** | Reporte consolidado con totales y resumen | Fecha, dirección, tipo de atención |

**Funcionalidades clave:**
- Tabla de datos con paginación, ordenamiento y filtros dinámicos
- Filtros por rango de fechas (desde/hasta)
- Filtros por catálogos (dropdowns encadenados: área → motivo, estado → municipio)
- Totales y conteos por columna
- Exportación a **Excel** (`.xlsx`) con `exceljs`
- Exportación a **PDF** con `jspdf` + `jspdf-autotable`
- Botón de impresión directa (estilos limpios para papel)
- Selector de tipo de reporte en la misma página

**Arquitectura A-S-R-M:**

```
src/features/attention-reports/
├── attention-report.constants.js       # Tipos de reporte, labels, filtros, paginación
├── attention-report.schema.js          # Zod: parámetros de cada tipo de reporte
├── attention-report.mapper.js          # toDomain, toDomainList, toSortKey
├── attention-report.read.repository.js # Consultas agregadas con filtros dinámicos (Prisma)
├── attention-report.read.service.js    # Lógica de agrupación, totales, consolidación
├── attention-report.read.action.js     # Server actions para cada tipo de reporte
├── components/
│   ├── ReportPageContainer.jsx         # Server component: selector + fetch inicial
│   ├── ReportFilters.jsx               # Filtros reutilizables (fechas, catálogos encadenados)
│   ├── ReportTable.jsx                 # DataTable con totales y ordenamiento
│   └── ReportToolbar.jsx               # Botones exportar (Excel, PDF) + imprimir
├── lib/
│   ├── excel-export.js                 # Generación .xlsx con exceljs
│   └── pdf-table-export.js             # Generación PDF tablas con jspdf-autotable
└── index.js
```

**Tareas:**
- [ ] Crear estructura A-S-R-M: `src/features/attention-reports/`
- [ ] Implementar `attention-report.constants.js` (tipos de reporte, labels, filtros)
- [ ] Implementar `attention-report.read.repository.js` (consultas agregadas con filtros dinámicos)
- [ ] Implementar `attention-report.read.service.js` (lógica de agrupación y totales)
- [ ] Implementar `attention-report.read.action.js` (server actions para cada tipo de reporte)
- [ ] Implementar componentes: `ReportPageContainer`, `ReportFilters`, `ReportTable`, `ReportToolbar`
- [ ] Implementar página `/admin/reportes/page.jsx` (thin page → container)
- [ ] Implementar `lib/excel-export.js` (exceljs)
- [ ] Implementar `lib/pdf-table-export.js` (jspdf + jspdf-autotable)
- [ ] Agregar ruta en `ROUTES.ADMIN.REPORTS` y sidebar item en "Reportes"

---

### 4. Planillas PDF por Caso (`case-sheets/`) — ✅ COMPLETADO 2026-06-23

**Feature implementado:** A-S-R-M completo + 2 formatos de plantilla + API route + integración email + UI en tabla y detalle de caso.

| Capa | Archivo | Responsabilidad |
|------|---------|----------------|
| Config | `case-sheet.constants.js` | Paleta RGB, papel, mapeo attentionTypeId → template, UI labels |
| Schema | `case-sheet.schema.js` | Zod: generateSheetParams, batchGenerateParams |
| Mapper | `case-sheet.mapper.js` | toSheetData, toSheetDataList, toSortKey |
| Repository | `case-sheet.read.repository.js` | findCaseSheetData (JOIN Case+Person+Complaint+Geography) |
| Repository | `case-sheet.write.repository.js` | Stub para auditoría futura |
| Service | `case-sheet.read.service.js` | fetchSheetData, fetchBatchSheetData |
| Service | `case-sheet.write.service.js` | generateSheetBuffer, generateBatchSheetBuffers |
| Service | `case-sheet.integration.service.js` | attachPlanillaToEmail → attachment listo para nodemailer |
| Action | `case-sheet.read.action.js` | getCaseSheetDataAction (protegido) |
| Action | `case-sheet.write.action.js` | generateCaseSheetAction, generateBatchSheetsAction (protegidos) |

**2 formatos de plantilla (jsPDF):**

| `attentionTypeId` | Template | Título | Específico |
|---|---|---|---|
| 1,2,3,4,6 | `sheet-generic` | "PLANILLA DE ATENCIÓN AL CIUDADANO" | Checkboxes centrados (ASESORÍA/SUGERENCIA/QUEJA/RECLAMO/PETICIÓN), caja negra rellena |
| 5 | `sheet-denuncia` | "RECEPCIÓN DE LA DENUNCIA" | Afectación, involucrados, fecha hechos, Poder Popular |

**Elementos compartidos:** Cintillo SAIME + footer institucional + DATOS DEL SOLICITANTE + DESCRIPCIÓN + firmas (FECHA / FIRMA DEL SOLICITANTE centradas con líneas).

**Componentes + Hooks:**

| Componente | Rol |
|------------|-----|
| `GenerateSheetButton.jsx` | Botón reutilizable (variants: button | icon) con loading spinner + sonner toast |
| `use-case-sheet-download.js` | Hook cliente: fetch blob → download + error handling |

**Integraciones:**

| Evento | Archivo | Descripción |
|--------|---------|-------------|
| Caso creado | `case.write.service.js` → `notifyEmailCaseCreated` | Si `attentionType.sendEmail = true`, adjunta planilla PDF al correo |

**API Route:** `GET /api/case-sheets?caseId=X` → PDF download (protegido por sesión + permiso).

---

## 🟡 Features Existentes — Faltan Páginas (Baja Prioridad)

Estos catálogos geográficos ya tienen feature completa (A-S-R-M), solo falta crear la página y el item de navegación. Son datos mayormente estáticos.

### 6. Estados (`states/`)

- [ ] Crear `src/app/(root)/admin/estados/page.jsx` (thin page → container)
- [ ] Agregar ruta en `ROUTES.CATALOGS.STATES`
- [ ] Agregar item en `SIDEBAR_CONFIG.NAV.items` (sección Catálogos)

### 7. Municipios (`municipalities/`)

- [ ] Crear `src/app/(root)/admin/municipios/page.jsx`
- [ ] Agregar ruta en `ROUTES.CATALOGS.MUNICIPALITIES`
- [ ] Agregar item en `SIDEBAR_CONFIG.NAV.items`

### 8. Parroquias (`parishes/`)

- [ ] Crear `src/app/(root)/admin/parroquias/page.jsx`
- [ ] Agregar ruta en `ROUTES.CATALOGS.PARISHES`
- [ ] Agregar item en `SIDEBAR_CONFIG.NAV.items`

---

## 📋 Orden de Prioridad Sugerido

| Prioridad | Módulo | Tipo | Esfuerzo estimado |
|-----------|--------|------|-------------------|
| 🔴 P0 | Auditoría (`audit-logs/`) | ✅ Completado | — |
| 🟠 P1 | Notificaciones (`notifications/`) | ✅ Completado | — |
| 🟠 P1 | Correos Enviados (`sent-emails/`) | ✅ Completado | — |
| 🟠 P1 | Planillas PDF por Caso (`case-sheets/`) | ✅ Completado | — |
| 🟠 P1 | Reportes Agregados (`attention-reports/`) | Nuevo | 12-16 h |
| 🟡 P2 | Mapa de Casos (`case-coordinates/`) | 🟠 Feature OK, falta seed data | 2-4 h |
| 🟢 P3 | Estados / Municipios / Parroquias | Páginas faltantes | 3-4 h c/u |

---

## 🗑️ Módulos Descartados

Estos modelos existen en Prisma o en el sistema original pero **no se implementarán**:

| Modelo/Feature | Motivo |
|----------------|--------|
| `Mediation` (Mediaciones) | Fuera de alcance — no se usa. Su planilla PDF (`sheet-mediacion`) tampoco se implementa. |
| `CaseParticipant` (Participantes) | Fuera de alcance — no se usa |
| `CgrRecord` (Registros CGR) | Fuera de alcance — no se usa |
| `DirectionArea` | Tabla pivote, se gestiona al editar Direcciones Admin. |
| `RolePermission` | Tabla pivote, se gestiona al editar Roles |

---

## 📦 Dependencias Nuevas Requeridas

| Paquete | Para | Módulo | Instalación |
|---------|------|--------|-------------|
| `leaflet` + `react-leaflet` | Mapa de coordenadas | `case-coordinates/` | ✅ Instalado (leaflet@1.9.4, react-leaflet@5.0.0) |
| `nodemailer` | Envío de correos SMTP | `sent-emails/` | ✅ Instalado (v9.0.1) |
| `exceljs` | Exportación Excel (.xlsx) | `attention-reports/` | `pnpm add exceljs` |
| `jspdf` + `jspdf-autotable` | PDF tablas (reportes) + PDF planillas (casos) | `attention-reports/` + `case-sheets/` | `pnpm add jspdf jspdf-autotable` (jspdf ✅ instalado) |

---

## 🔜 Futuro (Backlog)

Módulos del sistema original (CodeIgniter) que podrían evaluarse a largo plazo:

- Encuestas de Satisfacción (nuevo modelo + feature)
- Punto de Cuenta (nuevo modelo + feature)
- Redes Sociales (nuevo modelo + feature)
- Talleres / Participantes (nuevo modelo + feature)
- Tipo de Propiedad Intelectual (catálogo simple)
- Mapa de Ayuda (probablemente reemplazado por el mapa de coordenadas)
- Usuarios Visitas (tracking de accesos)
