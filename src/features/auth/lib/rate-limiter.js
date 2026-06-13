/**
 * Auth Module Rate Limiter — Thin wrapper around the shared rate limiter factory.
 *
 * Configuration lives in {@link ../config/auth.constants.js AUTH_CONFIG.RATE_LIMIT}.
 * Single source of truth — no env var overrides. Keep it simple.
 *
 * This instance protects the login endpoint.
 * To rate-limit other auth operations (password reset, MFA), create additional instances.
 */

import { createRateLimiter } from '@/features/shared/lib/rate-limiter'
import { AUTH_CONFIG } from '../config/auth.constants'

// ── Named instance for login ─────────────────────────────────────────────────

export const loginRateLimiter = createRateLimiter({
  maxAttempts: AUTH_CONFIG.RATE_LIMIT.MAX_ATTEMPTS,
  windowMs: AUTH_CONFIG.RATE_LIMIT.WINDOW_MS,
  name: 'auth:login',
})
