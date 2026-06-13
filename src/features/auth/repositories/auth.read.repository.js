import prisma from "@/features/shared/lib/prisma";
import { authMapper } from "../mappers/auth.mapper";

/**
 * Repository for Authentication Read Operations.
 */
export const authReadRepository = {
  /**
   * Retrieves a user by their ID Card for authentication purposes.
   * @param {string} idCard - User's ID Card
   * @returns {Promise<Object|null>} Domain user object
   */
  /**
  * Retrieves a user by their Email for authentication purposes.
  * @param {string} email - User's Email
  * @returns {Promise<Object|null>} Domain user object
  */
  async findByEmail(email) {
    const rawUser = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
    return authMapper.toDomain(rawUser);
  },

  async findByIdCard(idCard) {
    const rawUser = await prisma.user.findUnique({
      where: { idCard },
      include: { role: true }
    });
    return authMapper.toDomain(rawUser);
  }
};
