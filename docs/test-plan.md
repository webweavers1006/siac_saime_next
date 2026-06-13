# 🧪 Plan de Testing de Seguridad — Admin Starter

> **Cobertura actual:** 35% (40 tests — 4 suites)  
> **Objetivo final:** 95-100% (80+ tests — 12+ suites)

---

## 📊 Visión General

```
FASE 5 ✅  35%  40 tests   Unit tests (rate-limiter, mappers, safe-action)
FASE 7 ⬜  80%  58 tests   Unit tests de seguridad (JWT, bcrypt, cookies, soft-delete)
FASE 8 ⬜  95%  68 tests   Integración con BD (login E2E, RBAC, headers HTTP)
FASE 9 ⬜  100% 80 tests   E2E + Penetration + CI/CD (Playwright, mass assignment, IDOR)
```

---

## 🟨 FASE 7 — Unit Tests de Seguridad (35% → 80%)

> **Sin PostgreSQL.** Mocks de Prisma y Next.js APIs.  
> **Duración estimada:** 1-2 días

### 7.1 — `jwt.test.js` (5 tests)

**Archivo:** `src/__tests__/jwt.test.js`

| # | Test | Qué valida |
|---|------|------------|
| 1 | `encrypt` crea token válido | El token es string, no vacío, formato JWT (3 partes separadas por `.`) |
| 2 | `decrypt` lee token válido | Retorna payload con `id` y `role`, sin `cedula` ni PII |
| 3 | Token expirado → null | `decrypt` de token con `exp` en pasado retorna `null` |
| 4 | Token manipulado → null | Alterar payload sin re-firmar → `decrypt` retorna `null` |
| 5 | Payload mínimo | `encrypt({ id, role })` produce JWT sin campos extras |

**Dependencias mockeadas:** `jose` (SignJWT, jwtVerify), `process.env.JWT_SECRET`

---

### 7.2 — `auth.service.test.js` (4 tests)

**Archivo:** `src/__tests__/auth.service.test.js`

| # | Test | Qué valida |
|---|------|------------|
| 1 | Credenciales correctas → éxito | `authenticateUser(email, password)` retorna `{ success: true, user }` |
| 2 | Password incorrecta → mismo mensaje | Mismo error que usuario inexistente (`INVALID_CREDENTIALS`) |
| 3 | Usuario inexistente → mismo mensaje | No revela si el email existe o no |
| 4 | Usuario soft-deleted → mismo mensaje | `deletedAt !== null` → mismo error de credenciales |

**Dependencias mockeadas:** `authReadRepository.findByEmail`, `bcrypt.compare`

---

### 7.3 — `cookies.test.js` (5 tests)

**Archivo:** `src/__tests__/cookies.test.js`

| # | Test | Qué valida |
|---|------|------------|
| 1 | `createSession` setea cookie | `cookies().set('session', ...)` es llamado |
| 2 | `httpOnly: true` | La cookie no es accesible por JavaScript |
| 3 | `secure: true` en producción | `NODE_ENV=production` → `secure: true` |
| 4 | `sameSite: 'lax'` | Protección contra CSRF básico |
| 5 | `path: '/'` | Cookie disponible en toda la app |

**Dependencias mockeadas:** `next/headers` (cookies), `jose` (encrypt), `process.env`

---

### 7.4 — `logout.test.js` (2 tests)

**Archivo:** `src/__tests__/logout.test.js`

| # | Test | Qué valida |
|---|------|------------|
| 1 | `logout()` elimina cookie | `cookies().delete('session')` es llamado |
| 2 | `logout()` no lanza errores | Incluso si no hay cookie, no debe crashear |

**Dependencias mockeadas:** `next/headers` (cookies)

---

### 7.5 — `soft-delete.test.js` (4 tests)

**Archivo:** `src/__tests__/soft-delete.test.js`

| # | Test | Qué valida |
|---|------|------------|
| 1 | `deleteUser` no borra físicamente | El registro sigue existiendo, `deletedAt` tiene fecha |
| 2 | Usuario soft-deleted no aparece en activos | `findUsersPaginated({ status: 'active' })` excluye deleted |
| 3 | Usuario soft-deleted SÍ aparece en inactivos | `findUsersPaginated({ status: 'inactive' })` lo incluye |
| 4 | Auth rechaza usuario soft-deleted | `findByEmail` incluye `deletedAt !== null` → `authenticateUser` rechaza |

**Dependencias mockeadas:** Prisma client (`user.update`, `user.findMany`, `user.findUnique`)

---

### 7.6 — `jwt-secret.test.js` (2 tests)

**Archivo:** `src/__tests__/jwt-secret.test.js`

| # | Test | Qué valida |
|---|------|------------|
| 1 | `JWT_SECRET` < 32 chars → error fatal | La app lanza `Error` al iniciar |
| 2 | `JWT_SECRET` no definido → error fatal | `process.env.JWT_SECRET` es `undefined` → lanza `Error` |

**Dependencias mockeadas:** `process.env.JWT_SECRET`

---

### 📊 FASE 7 — Resumen

| Archivo | Tests |
|---------|-------|
| `jwt.test.js` | 5 |
| `auth.service.test.js` | 4 |
| `cookies.test.js` | 5 |
| `logout.test.js` | 2 |
| `soft-delete.test.js` | 4 |
| `jwt-secret.test.js` | 2 |
| **Total** | **22** |

---

## 🟦 FASE 8 — Integración con BD y Auth Real (80% → 95%)

> **Requiere PostgreSQL de prueba.** Base de datos separada para tests.  
> **Duración estimada:** 2-3 días

### 8.1 — `login.integration.test.js` (4 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Login exitoso → 302 redirect + cookie | POST `/login` con credenciales válidas → `Set-Cookie: session=...` |
| 2 | 5 intentos fallidos → rate limited | 6° intento en 15 min → bloqueado |
| 3 | Rate limit reset tras ventana | Esperar 15 min → intento exitoso |
| 4 | CSRF sin Origin → rechazado | POST sin header `Origin` ni `Referer` → error |

**Setup:** `DATABASE_URL_TEST` + seed mínimo (1 admin user)

---

### 8.2 — `rbac.integration.test.js` (4 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | USER no puede crear usuarios | `saveUser` con sesión USER → `Acceso denegado` |
| 2 | USER puede leer usuarios | `getAllUsersListAction` con sesión USER → éxito |
| 3 | ADMIN puede crear/editar/eliminar | CRUD completo con sesión ADMIN → éxito |
| 4 | Sin sesión → redirect login | Llamada sin cookie → 302 a `/login` |

**Setup:** 2 roles (ADMIN, USER) + permisos en BD

---

### 8.3 — `headers.test.js` (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | CSP header presente | `Content-Security-Policy` en response headers |
| 2 | HSTS en producción | `NODE_ENV=production` → `Strict-Transport-Security` presente |
| 3 | X-Frame-Options: DENY | No se puede embeber en iframe |

**Setup:** `pnpm build && pnpm start` + `curl -I`

---

### 📊 FASE 8 — Resumen

| Archivo | Tests |
|---------|-------|
| `login.integration.test.js` | 4 |
| `rbac.integration.test.js` | 4 |
| `headers.test.js` | 3 |
| **Total** | **11** |

---

## 🟪 FASE 9 — E2E + Penetration + CI/CD (95% → 100%)

> **Tests de usuario real + seguridad ofensiva.**  
> **Duración estimada:** 3-4 días

### 9.1 — E2E con Playwright (4 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Login UI → dashboard | Flujo completo: llenar form → submit → redirige a `/` |
| 2 | UI respeta RBAC | USER no ve botón "Nuevo Usuario" en `/admin/usuarios` |
| 3 | XSS en formularios | `<script>alert(1)</script>` en campo nombre → no se ejecuta |
| 4 | Rate limit en UI | 5 intentos fallidos → mensaje "Demasiados intentos" |

**Herramienta:** Playwright (`@playwright/test`)

---

### 9.2 — IDOR (Insecure Direct Object Reference) (2 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Usuario A no ve datos de usuario B | `GET /api/users?id=<uuid-de-B>` con sesión de A → 403 |
| 2 | Usuario A no edita usuario B | `POST` a `saveUser` con `id=<uuid-de-B>` con sesión de A → 403 |

---

### 9.3 — Mass Assignment (2 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `roleId` arbitrario ignorado | Enviar `roleId=1` (ADMIN) en form de registro → se usa rol por defecto |
| 2 | `id` arbitrario ignorado | Enviar `id=<uuid-existente>` en creación → se genera nuevo UUID |

---

### 9.4 — CI/CD Security Gates (4 checks)

| # | Gate | Qué valida |
|---|------|------------|
| 1 | `gitleaks` / `truffleHog` | No hay secrets en el código |
| 2 | `pnpm audit` | Sin vulnerabilidades críticas/high |
| 3 | `eslint` security rules | No `dangerouslySetInnerHTML`, no `eval()` |
| 4 | Tests pasan | `pnpm test` → exit code 0 |

---

### 📊 FASE 9 — Resumen

| Categoría | Tests/Checks |
|-----------|-------------|
| E2E Playwright | 4 |
| IDOR | 2 |
| Mass Assignment | 2 |
| CI/CD Gates | 4 |
| **Total** | **12** |

---

## 🏁 Resumen Final

| Fase | Cobertura | Tests | Días | Requiere BD |
|------|-----------|-------|------|-------------|
| ✅ FASE 5 | 35% | 40 | — | No |
| ⬜ FASE 7 | 80% | 62 | 1-2 | No |
| ⬜ FASE 8 | 95% | 73 | 2-3 | Sí |
| ⬜ FASE 9 | 100% | 85 | 3-4 | Sí + Playwright |

---

## 🚀 Orden de Ejecución Recomendado

1. **FASE 7** — Sin dependencias externas, se puede hacer ya
2. **FASE 8** — Necesita `DATABASE_URL_TEST` y un seed mínimo
3. **FASE 9** — Necesita CI/CD pipeline + Playwright + BD de test

> **Nota:** El 100% absoluto en seguridad es asintótico. Estas fases cubren el espectro práctico de un sistema RBAC con JWT. Para requerimientos de compliance (SOC2, ISO 27001), se recomienda además un pentest externo anual.
