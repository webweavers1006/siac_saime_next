# 🔐 Plan de Testing — Hardening de Sesión

> **Objetivo:** Validar las mejoras de seguridad en el manejo de sesión JWT.  
> **Alcance:** Token invalidation, cookie hardening, CSRF, CSP nonces, expiración reducida.  
> **Dependencia:** Sin BD para unit tests. Con BD de prueba para integración.

---

## 📊 Mejoras a Probar

| # | Mejora | Riesgo Actual | Mitigación |
|---|--------|---------------|------------|
| 1 | Invalidación server-side de tokens | Token robado → 8h de acceso | `jti` + blacklist o `tokenVersion` en User |
| 2 | Prefijo `__Host-` en cookie | Cookie vulnerable a subdominios | `__Host-session` fuerza `Secure` + `Path=/` + sin `Domain` |
| 3 | CSP sin `'unsafe-inline'` | XSS vía inline scripts | Nonces en `<script>` tags |
| 4 | Reducción de expiración | 8h es generoso para admin | 2-4 horas con posible refresh |
| 5 | CSRF token en mutaciones | `sameSite: 'lax'` no cubre todo | Token CSRF dedicado en Server Actions |

---

## 🟨 SUITE 1 — Token Invalidation (Unit Tests)

> **Sin PostgreSQL.** Mocks de Prisma y Redis/Memory store.  
> **Archivo:** `src/__tests__/token-invalidation.test.js`

### 1.1 — Generación de `jti` (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `encrypt` incluye `jti` único | Cada token generado tiene un `jti` (UUID v4) distinto |
| 2 | `jti` es string no vacío | El campo `jti` existe en el payload y tiene formato UUID |
| 3 | `jti` no revela información | El UUID no contiene datos del usuario ni timestamp |

**Dependencias mockeadas:** `crypto.randomUUID`

---

### 1.2 — Blacklist / Allowlist (5 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `addToBlacklist(jti, expiresAt)` almacena | El `jti` se guarda con TTL = tiempo restante del token |
| 2 | `isBlacklisted(jti)` → `true` para token revocado | Consulta retorna `true` si el `jti` está en blacklist |
| 3 | `isBlacklisted(jti)` → `false` para token válido | Token nunca revocado retorna `false` |
| 4 | Blacklist limpia entradas expiradas | `jti` con TTL vencido no aparece en `isBlacklisted` |
| 5 | `logout()` agrega `jti` a blacklist | Al cerrar sesión, el token actual se invalida server-side |

**Dependencias mockeadas:** Redis/Memory store (`Map` con TTL simulado)

---

### 1.3 — `tokenVersion` en User (4 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `encrypt` incluye `tokenVersion` del usuario | El payload contiene `tv` = `user.tokenVersion` |
| 2 | `decrypt` + `tokenVersion` mismatch → `null` | Si `user.tokenVersion` cambió, el token se rechaza |
| 3 | Cambio de contraseña incrementa `tokenVersion` | `changePassword()` → `tokenVersion += 1` → tokens viejos inválidos |
| 4 | `logoutAllSessions()` incrementa `tokenVersion` | Admin fuerza cierre de todas las sesiones del usuario |

**Dependencias mockeadas:** `userReadRepository.findById`, `userWriteRepository.updateTokenVersion`

---

### 1.4 — Integración en `getSession` (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `getSession` rechaza token blacklisteado | `decrypt` exitoso pero `isBlacklisted(jti)` → retorna `null` |
| 2 | `getSession` rechaza `tokenVersion` viejo | `decrypt` exitoso pero `tv !== user.tokenVersion` → retorna `null` |
| 3 | `getSession` acepta token válido + no blacklisteado + tv match | Retorna `{ id, role }` |

**Dependencias mockeadas:** `decrypt`, `isBlacklisted`, `userReadRepository.findTokenVersion`

---

### 📊 SUITE 1 — Resumen

| Archivo | Tests |
|---------|-------|
| `token-invalidation.test.js` | 15 |

---

## 🟨 SUITE 2 — Cookie Hardening (Unit Tests)

> **Sin PostgreSQL.** Mocks de `next/headers` y `jose`.  
> **Archivo:** `src/__tests__/cookie-hardening.test.js`

### 2.1 — Prefijo `__Host-` (4 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Cookie name es `__Host-session` | `cookies().set('__Host-session', ...)` |
| 2 | Sin atributo `Domain` | `set()` no incluye `domain` (host-bound only) |
| 3 | `Path=/` obligatorio | `set()` incluye `path: '/'` |
| 4 | `Secure` obligatorio | `set()` incluye `secure: true` siempre (incluso en dev con HTTPS local) |

---

### 2.2 — Comportamiento en entornos (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Desarrollo local con HTTP → error controlado | Si `NODE_ENV !== 'production'` y no hay HTTPS, advertir o usar nombre alternativo |
| 2 | Producción → `__Host-session` + `Secure` | `NODE_ENV=production` → cookie hardening completo |
| 3 | `sameSite: 'strict'` opcional | Evaluar si cambiar de `'lax'` a `'strict'` para mayor protección (trade-off UX) |

---

### 📊 SUITE 2 — Resumen

| Archivo | Tests |
|---------|-------|
| `cookie-hardening.test.js` | 7 |

---

## 🟨 SUITE 3 — CSRF Token en Server Actions (Unit Tests)

> **Sin PostgreSQL.** Mocks de `next/headers` y `server-only`.  
> **Archivo:** `src/__tests__/csrf.test.js`

### 3.1 — Generación y validación (5 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `generateCsrfToken()` crea token único | Retorna string aleatorio (32+ bytes, base64url) |
| 2 | Token se almacena en cookie `__Host-csrf` | `cookies().set('__Host-csrf', token, { httpOnly: false, ... })` |
| 3 | `validateCsrfToken(formToken)` compara con cookie | `formToken === cookieToken` → `true` |
| 4 | Token mismatch → error | `formToken !== cookieToken` → lanza `CsrfError` |
| 5 | Token ausente → error | Sin cookie `__Host-csrf` → lanza `CsrfError` |

**Dependencias mockeadas:** `next/headers` (cookies), `crypto.randomBytes`

---

### 3.2 — Integración en `createProtectedAction` (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Action con CSRF token válido → ejecuta | `createProtectedAction(handler, { csrf: true })` recibe token válido → handler se ejecuta |
| 2 | Action sin CSRF token → rechazada | Misma action sin token → error CSRF antes del handler |
| 3 | GET requests no requieren CSRF | Solo métodos POST/PUT/DELETE validan CSRF |

**Dependencias mockeadas:** `createProtectedAction`, `validateCsrfToken`

---

### 📊 SUITE 3 — Resumen

| Archivo | Tests |
|---------|-------|
| `csrf.test.js` | 8 |

---

## 🟨 SUITE 4 — CSP con Nonces (Unit Tests)

> **Sin PostgreSQL.** Mocks de `next/headers` y render.  
> **Archivo:** `src/__tests__/csp-nonce.test.js`

### 4.1 — Generación de nonce (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `generateNonce()` crea valor único por request | Dos llamadas → dos nonces distintos (base64url, 128+ bits) |
| 2 | Nonce se incluye en header CSP | `Content-Security-Policy` contiene `'nonce-<valor>'` |
| 3 | Nonce se pasa a `<Script>` components | Next.js `Script` con `nonce={nonce}` renderiza atributo `nonce` |

**Dependencias mockeadas:** `next/headers`, `crypto.randomBytes`

---

### 4.2 — Migración desde `'unsafe-inline'` (2 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | CSP header NO contiene `'unsafe-inline'` en `script-src` | Reemplazado por `'strict-dynamic'` o nonces |
| 2 | Scripts inline sin nonce son bloqueados | Navegador rechaza `<script>alert(1)</script>` sin nonce válido |

---

### 📊 SUITE 4 — Resumen

| Archivo | Tests |
|---------|-------|
| `csp-nonce.test.js` | 5 |

---

## 🟨 SUITE 5 — Expiración Reducida (Unit Tests)

> **Sin PostgreSQL.** Mocks de `jose` y constantes.  
> **Archivo:** `src/__tests__/session-expiry.test.js`

### 5.1 — Nueva expiración (4 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `EXPIRES_IN_MS` = 2-4 horas | `AUTH_CONFIG.SESSION.EXPIRES_IN_MS` ≤ `4 * 60 * 60 * 1000` |
| 2 | `EXPIRES_IN_STR` = `'2h'` o `'4h'` | Coincide con el valor en ms |
| 3 | Token expira en el tiempo configurado | `encrypt({ id, role })` → `exp` = `iat` + 2h/4h |
| 4 | `decrypt` rechaza token fuera de ventana | Token con 1 min extra sobre expiración → `null` |

---

### 5.2 — Refresh opcional (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | `shouldRefresh(token)` → `true` si queda < 25% de vida | Token con < 30 min restantes (para sesión de 2h) → refrescar |
| 2 | `refreshSession(oldToken)` emite nuevo token | Nuevo JWT con `iat` actual y `exp` extendido |
| 3 | Refresh mantiene `id` y `role` | El payload del nuevo token es idéntico en datos de usuario |

**Dependencias mockeadas:** `decrypt`, `encrypt`, `AUTH_CONFIG`

---

### 📊 SUITE 5 — Resumen

| Archivo | Tests |
|---------|-------|
| `session-expiry.test.js` | 7 |

---

## 🟦 SUITE 6 — Integración con BD (Integration Tests)

> **Requiere PostgreSQL de prueba.**  
> **Archivo:** `src/__tests__/session-hardening.integration.test.js`

### 6.1 — Flujo completo de sesión (5 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Login → cookie `__Host-session` + CSRF cookie | POST `/login` exitoso → ambas cookies presentes |
| 2 | Logout → token en blacklist | POST `/logout` → mismo token ya no permite acceso |
| 3 | Cambio de contraseña → token viejo inválido | `changePassword` → `tokenVersion`++ → sesión anterior rechazada |
| 4 | `logoutAllSessions` → todos los tokens del usuario inválidos | Admin fuerza cierre → todas las sesiones de ese usuario mueren |
| 5 | Token expirado → redirect login | Esperar/forzar expiración → siguiente request → 302 `/login` |

**Setup:** `DATABASE_URL_TEST` + seed (admin user + tokenVersion)

---

### 6.2 — CSRF en flujo real (3 tests)

| # | Test | Qué valida |
|---|------|------------|
| 1 | Form submit con CSRF token → éxito | `<form>` con `<input hidden name="csrf_token">` → acción ejecutada |
| 2 | Form submit sin CSRF token → rechazado | POST sin token → 403 `CSRF token missing` |
| 3 | CSRF token de otra sesión → rechazado | Token de sesión A usado en sesión B → 403 `CSRF token mismatch` |

---

### 📊 SUITE 6 — Resumen

| Archivo | Tests |
|---------|-------|
| `session-hardening.integration.test.js` | 8 |

---

## 🏁 Resumen Final

| Suite | Archivo | Tests | Tipo | Requiere BD |
|-------|---------|-------|------|-------------|
| SUITE 1 | `token-invalidation.test.js` | 15 | Unit | No |
| SUITE 2 | `cookie-hardening.test.js` | 7 | Unit | No |
| SUITE 3 | `csrf.test.js` | 8 | Unit | No |
| SUITE 4 | `csp-nonce.test.js` | 5 | Unit | No |
| SUITE 5 | `session-expiry.test.js` | 7 | Unit | No |
| SUITE 6 | `session-hardening.integration.test.js` | 8 | Integration | Sí |
| **Total** | | **50** | | |

---

## 🚀 Orden de Ejecución Recomendado

```
1. SUITE 5 — Expiración reducida           (más simple, sin dependencias)
2. SUITE 2 — Cookie hardening               (cambio de nombre + atributos)
3. SUITE 4 — CSP nonces                     (headers + render)
4. SUITE 1 — Token invalidation             (jti, blacklist, tokenVersion)
5. SUITE 3 — CSRF token en actions          (validación en mutations)
6. SUITE 6 — Integración completa           (requiere BD de prueba)
```

---

## 📝 Notas de Implementación

- **Token invalidation:** Se recomienda usar **`tokenVersion`** sobre blacklist para evitar almacenamiento externo (Redis). La blacklist es más precisa pero requiere infraestructura adicional.
- **Cookie `__Host-`:** Requiere HTTPS incluso en desarrollo. Usar `mkcert` o `localhost` con proxy HTTPS para pruebas locales.
- **CSP nonces:** Next.js 16 soporta nonces vía `headers()` en Server Components. El nonce debe generarse por request y pasarse a `<Script nonce={...}>`.
- **CSRF token:** Puede implementarse como un campo hidden en formularios + validación en `createProtectedAction`. Alternativa: usar `SameSite: 'strict'` si la UX lo permite.
- **Expiración:** 2 horas con refresh silencioso es el sweet spot para admin panels. El refresh puede ocurrir en cada request autenticado si queda < 25% del tiempo.
