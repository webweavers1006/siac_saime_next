# Reglas del Proyecto — Admin Starter

> **Agent Profile:** Senior Full-Stack Developer.
> **Environment:** Linux. Node.js con `TZ=UTC`.
> **Stack:** Next.js 16.2 (App Router), React 19, Tailwind 4, Prisma 7.5, PostgreSQL, JWT (jose).

---

## 1. 🛠️ Stack Specifications

### Next.js 16.2 & React 19

- Usar **Server Components por defecto**.
- Implementar `"use cache"` en `services/` para optimizar data fetching.
- En React 19, los `refs` son props normales. **Prohibido**: usar `forwardRef`.
- **Prohibido**: renderizar fechas dinámicas directamente en el cliente. Usar estrategias de supresión o formateo del lado del servidor para evitar *Hydration Mismatch*.

### Tailwind CSS v4

- **Prohibido**: usar `tailwind.config.js`. Toda la customización del tema va en CSS global vía `@theme`.

### Prisma

- Uso exclusivo en la capa `repositories/`. Prohibido en componentes, actions, services o app.
- Usar el Driver Adapter `@prisma/adapter-pg` para estabilidad.
- Después de cualquier cambio en el schema, ejecutar `npx prisma generate`.
- Usar `npx prisma migrate dev --name <description>` para migraciones en desarrollo.
- **No ejecutar** `npm audit fix --force`: rompe Next.js y Prisma.

### Shadcn UI

- **Configuración canónica**: `components.json` define los aliases. El alias `utils` apunta a `@/features/shared/lib/shared-utils`.
- **Prohibido**: crear `src/lib/utils.js` o usar `@/lib/utils`. Todos los componentes shadcn importan `cn` desde `@/features/shared/lib/shared-utils`.
- Al añadir componentes con `npx shadcn add`, el CLI respeta el alias de `components.json` automáticamente.
- **DataTable**: Usar `@/components/shared/table/DataTable` (basado en TanStack Table). La paginación viene incluida vía `TablePagination` interno.

### UI

- Íconos: `lucide-react`.
- Notificaciones toast: `sonner`.
- Puerto: **3001**.

---

## 2. 🎯 Code Paradigms

### Límite estricto de líneas

- Máximo **250 líneas por archivo**. Si se excede, refactorizar inmediatamente.
- *Excepción*: Código de librería (Shadcn UI en `src/components/ui/`) no tiene límite.

### Lenguaje

- Solo **JS/JSX**. TypeScript está prohibido a menos que se solicite explícitamente.

### Estructura modular por Feature

#### `src/app/`
- Solo archivos de ruteo. **Prohibido**: lógica de negocio o UI compleja aquí.
- El page component solo debe: (1) verificar permisos con `checkPageAccess()`, (2) renderizar el container del feature.
- **Patrón page**: Extraer la lógica de fetch, searchParams y error handling a un Server Component container en `src/features/[feature]/components/` (ej: `UserPageContainer.jsx`).

#### `src/features/[feature]/`
- Único lugar para lógica de dominio. Capas: `components/`, `hooks/`, `actions/`, `services/`, `repositories/`, `mappers/`, `schemas/`, `config/`.
- **Barrel exports obligatorio**: Cada feature debe tener un `index.js` que re-exporte su API pública. Evita imports con rutas profundas y facilita refactors.
- **Regla de seguridad del barrel**: Solo exportar config, constantes, datos y utilidades puras. **Prohibido** exportar funciones server-only (`getSession`, `prisma`, `createProtectedAction`, `checkPageAccess`) a través del barrel. Estas deben importarse por ruta directa. Si un componente cliente importa del barrel y este re-exporta algo con `next/headers` o `prisma`, el build truena.

#### `src/components/`
- `ui/` (átomos shadcn), `shared/` (infraestructura/layout), `app-sidebar/` (sidebar).

#### Carpetas PROHIBIDAS en `src/`
- ❌ `src/lib/` — No existe. Utilidades en `src/features/shared/lib/`.
- ❌ `src/hooks/` — No existe. Hooks en `src/features/shared/hooks/`.
- Solo deben existir: `src/app/`, `src/components/`, `src/features/`.

---

## 3. 🧱 Architecture Layers (A-S-R-M)

### Actions (`actions/`)
- Orquestación de Next.js.
- Manejan validación **Zod**, revalidación de caché (`revalidatePath`) y gestión de sesión.
- Llaman **exclusivamente** a `services`.

### Services (`services/`)
- Lógica de dominio y negocio.
- Orquestan llamadas a uno o más `repositories`.
- **Prohibido**: usar API client o conocer URLs aquí.

### Repositories (`repositories/`)
- Acceso a datos.
- **Único lugar** donde se hacen queries de Prisma (read, write, update, delete).
- Llaman **exclusivamente** a `mappers`.
- Gracias a Prisma `@map` / `@@map`, todos los nombres de campos aquí son en **inglés**.

### Mappers (`mappers/`)
- Capa de transformación de datos **obligatoria**.
- Métodos obligatorios: `toDomain(entity)`, `toDomainList(entities)`, `toPersistence(domain)`, `toSortKey(domainKey)`.

### Segregación Read/Write (CQRS)
- Para mantener el límite de 250 líneas, separar archivos por intención:
  - `[feature].read.[layer].js`
  - `[feature].write.[layer].js`

### Convención de nombres (Inglés)
- Nombres de archivos, carpetas, variables, funciones y constantes en **INGLÉS**.
- Componentes UI en **PascalCase** (ej. `UserTable.jsx`).
- Hooks en **hyphen-case** (ej. `use-user-form.js`).

---

## 4. 🧱 Database

### Queries seguras
- **Prohibido**: usar strings concatenadas en queries. Solo se permite la API tipada de Prisma.

### Prisma Schema: Puente Inglés/Español vía `@map` / `@@map`
- Todos los modelos y campos en **inglés** en el schema.
- Usar `@map("nombre_columna")` y `@@map("nombre_tabla")` para la DB en español.

### Convención de Timestamps
- Todo modelo debe incluir:
  - `createdAt DateTime? @default(now()) @map("creado_en")`
  - `updatedAt DateTime? @updatedAt @map("actualizado_en")`

---

## 5. 🖼️ UI Conventions

### UI Config-Driven (Obligatorio)
- **Prohibido**: strings hardcodeados (texto en español) directamente en componentes.
- Todos los labels, placeholders, tooltips y mensajes deben residir en `[feature].constants.js`.

### Formularios
- Stack: `react-hook-form` + `zod` + `[feature].form.config.js`.

### Tablas
- Usar `createActionsColumn` + `DataTable` genérico.

### Toolbar
- Usar el componente compuesto `<Toolbar>` de `@/components/shared/Toolbar`.

---

## 6. 🛡️ Security & Authentication (PRIORIDAD MÁXIMA)

### 🔑 JWT y Secrets

- `JWT_SECRET` **debe** tener mínimo **32 caracteres**. Sin fallback. Si no existe o es corto, el sistema debe lanzar error fatal.
- **Prohibido**: valores por defecto, hardcodeados o `fallback` en secrets.
- **Prohibido**: commits con secrets. Usar `.env` (ya en `.gitignore`).

### 🔐 Sesión (Jose)

- Almacenada en cookies **HTTP-only**, **Secure** (en producción), **SameSite=Lax**, **Path=/**.
- **Payload mínimo**: `id, role`. No incluir datos innecesarios.
- **Expiración obligatoria**: **8 horas**.
- **Logout**: debe eliminar la cookie del lado del servidor.
- **Prohibido**: almacenar tokens o sesiones en `localStorage`, `sessionStorage`, o cookies accesibles por JS.

### 🔒 Autenticación

- **bcrypt** con mínimo **10 rondas de salt** para hashing de contraseñas.
- **Mismo mensaje de error** para credenciales inválidas, usuario inexistente, o cuenta inactiva. **Nunca** revelar si el usuario existe.

### ⏱️ Rate Limiting

- **Obligatorio** en endpoints de login: mínimo **5 intentos por IP en 15 minutos**.
- Usar la factory genérica `createRateLimiter()` de `@/features/shared/lib/rate-limiter`.
- **Patrón por feature**:
  1. Definir config en `[feature].constants.js` → `RATE_LIMIT: { MAX_ATTEMPTS, WINDOW_MS, HEADERS: { CLIENT_IP, REAL_IP } }`
  2. Crear instancia en `[feature]/lib/rate-limiter.js` con `createRateLimiter({ maxAttempts, windowMs, name })`
  3. Usar `limiter.checkLimit(ip)` en el action ANTES de cualquier lógica de negocio
- **Prohibido**: usar `express-rate-limit` (es para Express, no Next.js).
- **No reinventar**: la factory ya maneja algoritmo, limpieza, stats y reset.

### 🛂 Control de Acceso (RBAC)

- **Toda** Server Action debe usar `createProtectedAction` o `createProtectedFunction`.
- **Toda** página RSC debe usar `checkPageAccess(requiredSlug)`.
- **Cliente**: usar `usePermission().can(slug)` solo para ocultar UI. **Nunca** como única verificación.
- **Prohibido**: mensajes de error que filtren slugs de permisos o detalles internos.

### ✅ Validación (Zod)

- **Obligatoria** en cada entrada de datos (formularios, APIs, params).
- **Whitelist**, no blacklist: definir exactamente qué se acepta, no qué se rechaza.
- Schemas mínimos: email con formato, strings con límites de longitud, números con rangos.

### 🧹 Sanitización y XSS

- **Prohibido**: `dangerouslySetInnerHTML`.
- **Excepción**: `src/components/ui/chart.jsx` — código de librería shadcn UI, necesario para inyectar CSS de gráficos. No modificar.
- **Prohibido**: renderizar datos crudos de usuario sin sanitizar.
- Todo output en JSX debe ser escapado por React (no usar `@html` ni similares).

### 🗄️ Base de Datos

- **Prohibido**: SQL crudo o strings concatenadas. Solo API tipada de Prisma.
- **Soft delete obligatorio**: nunca `DELETE` físico en modelos de negocio. Usar `deletedAt`.
  - Aplica a: usuarios, roles, catálogos, y cualquier entidad referenciada por FK.
  - Excepción: tablas pivote M2M (se gestionan con connect/disconnect, no tienen delete propio).
- **Timestamps de auditoría**: `createdAt`, `updatedAt` en todos los modelos.

### 🔍 Logging Seguro

- **Prohibido**: loguear PII (cédulas completas, JWT, cookies, contraseñas).
- Solo IDs, hashes, o datos anonimizados.
- Usar `logger` centralizado (`@/features/shared/lib/logger`), nunca `console.log`.

### 🌐 Headers de Seguridad

- **CSP**: Content-Security-Policy configurado en `proxy.js` o `next.config.mjs`.
- **HSTS**: Strict-Transport-Security en producción.
- **X-Content-Type-Options**: nosniff.
- **X-Frame-Options**: DENY.

### 📦 Dependencias

- **Prohibido**: `npm audit fix --force` (rompe Next.js/Prisma).
- Ejecutar `npm audit` regularmente. Vulnerabilidades moderadas en dependencias de build son aceptables.
- Mantener dependencias actualizadas (Dependabot o similar).

### 🏷️ Environment Variables

- **Prohibido**: valores por defecto para secrets en código.
- `.env.example` debe documentar todas las variables requeridas sin valores reales.
- `.env` **nunca** se commitea (verificar `.gitignore`).

---

## 7. 📝 Communication

### Código
- Nombres de variables, funciones y **comentarios en INGLÉS**.

### Interacción
- Explicaciones y respuestas al usuario en **ESPAÑOL**.

---

## 8. 🧭 Navegación y Rutas

### Sidebar (Configuración Unificada)
- Toda la configuración del sidebar reside en **un solo archivo**: `src/features/shared/config/navigation/sidebar.constants.js`.
- Contiene tanto `UI.LABELS` (textos) como `NAV.items` (estructura de navegación con íconos, rutas y permisos).
- El componente `SidebarNav` consume `SIDEBAR_CONFIG.NAV.items` para renderizar la navegación filtrando por permisos.

### Rutas Centralizadas
- `src/features/shared/config/navigation/routes.js` centraliza todas las rutas del panel admin.
- Cada feature exporta su `PATH`, `TITLE` y `PERMISSIONS` desde su `[feature].constants.js`.
- `routes.js` importa esos datos y los ensambla en el objeto `ROUTES`.

### Auto-Registro de Módulos (Pattern)
- Al crear un nuevo feature, debes:
  1. Agregar su ruta en `shared/config/navigation/routes.js` (una línea).
  2. Agregar su nav item en `shared/config/navigation/sidebar.constants.js` → `NAV.items` (una entrada).
  3. Crear la page en `src/app/(root)/admin/[feature]/page.jsx` (thin page → delega al container).

### proxy.js (Next.js 16+)
- El archivo `proxy.js` reemplaza al deprecado `middleware.js` en Next.js 16+.
- Debe residir en `src/proxy.js` (no en la raíz del proyecto).
- Exporta una función `proxy(request)` y opcionalmente un `config.matcher`.
- Maneja protección de rutas, redirección login/dashboard, y headers de seguridad.

---

## 9. ⚡ Performance

### React.cache() para Sesión
- `getSession()` en `src/features/auth/lib/auth.js` debe usar `React.cache()` para deduplicar llamadas dentro del mismo request.
- Esto evita que layouts anidados (`app/layout.js` + `(root)/layout.jsx`) hagan múltiples lecturas de cookie.

### Server Components por defecto
- Solo añadir `"use client"` cuando sea estrictamente necesario (hooks, eventos, estado).
- Las páginas RSC hacen el fetch inicial y pasan datos como props a client components.

---

## 10. 🗂️ shared/config/ — Convención de Agrupación

`src/features/shared/config/` está organizado por dominio:

```
config/
├── app/          # site.config.js, theme.config.js, animations.config.js
├── navigation/   # routes.js, sidebar.constants.js
├── pages/        # dashboard.constants.js
└── shared.constants.js
```

- Al añadir nuevos archivos de config, seguir esta agrupación.
- `shared.constants.js` permanece en la raíz de `config/` por ser transversal.
