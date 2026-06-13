import { logger } from "@/features/shared";
import bcrypt from 'bcryptjs';
import { createSession } from '@/features/auth/lib/auth';
import { AUTH_CONFIG } from '../config/auth.constants';
import { authReadRepository } from '../repositories/auth.read.repository';

/**
 * Authenticates a user with their credentials.
 * @param {string} email - User's Email
 * @param {string} password - Raw password
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>}
 */
export async function authenticateUser(email, password) {
  try {
    const user = await authReadRepository.findByEmail(email);

    if (!user || !user.password || user.deletedAt !== null) {
      return { success: false, error: AUTH_CONFIG.ERRORS.INVALID_CREDENTIALS };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { success: false, error: AUTH_CONFIG.ERRORS.INVALID_CREDENTIALS };
    }


    return { success: true, user };

  } catch (error) {
    logger.error('Authentication error:', error);
    return { success: false, error: AUTH_CONFIG.ERRORS.SERVER_ERROR };
  }
}

/**
 * Creates a session for an authenticated user.
 * @param {Object} user - Domain user object
 */
export async function loginUserSession(user) {
  await createSession({
    id: user.id,
    role: user.roleName || AUTH_CONFIG.ROLES.USER,
  });
}
