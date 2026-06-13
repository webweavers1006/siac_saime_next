import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRateLimiter } from '@/features/shared/lib/rate-limiter'

describe('createRateLimiter', () => {
  let limiter

  beforeEach(() => {
    vi.useFakeTimers()
    limiter = createRateLimiter({ maxAttempts: 3, windowMs: 60000, name: 'test' })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should allow requests within the limit', () => {
    expect(limiter.checkLimit('127.0.0.1')).toMatchObject({ allowed: true, remaining: 2 })
    expect(limiter.checkLimit('127.0.0.1')).toMatchObject({ allowed: true, remaining: 1 })
    expect(limiter.checkLimit('127.0.0.1')).toMatchObject({ allowed: true, remaining: 0 })
  })

  it('should block requests after exceeding the limit', () => {
    limiter.checkLimit('127.0.0.1') // 1
    limiter.checkLimit('127.0.0.1') // 2
    limiter.checkLimit('127.0.0.1') // 3 (limit)
    const result = limiter.checkLimit('127.0.0.1') // 4 (blocked)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should track different IPs independently', () => {
    limiter.checkLimit('10.0.0.1')
    limiter.checkLimit('10.0.0.1')
    expect(limiter.checkLimit('10.0.0.2')).toMatchObject({ allowed: true, remaining: 2 })
  })

  it('should reset after the window expires', () => {
    limiter.checkLimit('127.0.0.1')
    limiter.checkLimit('127.0.0.1')
    limiter.checkLimit('127.0.0.1')
    expect(limiter.checkLimit('127.0.0.1').allowed).toBe(false)

    // Advance time past the window
    vi.advanceTimersByTime(60001)

    expect(limiter.checkLimit('127.0.0.1')).toMatchObject({ allowed: true, remaining: 2 })
  })

  it('should reject invalid keys', () => {
    expect(limiter.checkLimit('').allowed).toBe(false)
    expect(limiter.checkLimit(null).allowed).toBe(false)
    expect(limiter.checkLimit(undefined).allowed).toBe(false)
  })

  it('should use default values when no options provided', () => {
    const defaultLimiter = createRateLimiter()
    const result = defaultLimiter.checkLimit('test')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4) // default maxAttempts = 5
  })

  it('should return a resetTime in the future', () => {
    const now = Date.now()
    const result = limiter.checkLimit('new-ip')
    expect(result.resetTime.getTime()).toBeGreaterThan(now)
  })
})
