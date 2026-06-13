import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { AUTH_CONFIG } from '../config/auth.constants'

const secret = process.env.JWT_SECRET
if (!secret || secret.length < 32) {
  throw new Error(
    '[AUTH] JWT_SECRET no está definido o es menor a 32 caracteres. ' +
    'Genera uno seguro con: openssl rand -base64 32'
  )
}
const key = new TextEncoder().encode(secret)
const ALG = 'HS256'

/**
 * Encrypts a payload into a JWT.
 * @param {Object} payload - Data to encrypt.
 * @returns {Promise<string>} JWT string.
 */
export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(AUTH_CONFIG.SESSION.EXPIRES_IN_STR)
    .sign(key)
}

/**
 * Decrypts and verifies a JWT.
 * @param {string} token - JWT string.
 * @returns {Promise<Object|null>} Payload or null if invalid.
 */
export async function decrypt(token) {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: [ALG] })
    return payload
  } catch (error) {
    return null
  }
}

/**
 * Creates a session cookie.
 * @param {Object} user - User data ({ id, role }).
 */
export async function createSession(user) {
  const expires = new Date(Date.now() + AUTH_CONFIG.SESSION.EXPIRES_IN_MS)

  // Minimal JWT payload — only id and role per security policy
  const session = await encrypt({
    id: user.id,
    role: user.role,
  })

  const cookieStore = await cookies()

  // Secure only in production (requires HTTPS).
  // Development uses plain HTTP on localhost, so secure: false.
  const isSecure = process.env.NODE_ENV === 'production'

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: isSecure,
    expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export const getSession = cache(async () => {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  return await decrypt(session)
})
