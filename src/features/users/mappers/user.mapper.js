/**
 * Mapeador para la entidad User.
 * Centraliza la transformación entre Prisma y el Dominio.
 */

export const userMapper = {
  /**
   * Transforms a Prisma record into a Domain object.
   */
  toDomain(entity) {
    if (!entity) return null;

    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      idCard: entity.idCard,
      email: entity.email,
      password: entity.password,
      roleId: entity.roleId,
      // Computado: activo cuando no está eliminado suavemente
      isActive: entity.deletedAt == null,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,

      // Relación
      role: entity.role ? {
        id: entity.role.id,
        name: entity.role.name,
        description: entity.role.description,
      } : null,
    };
  },

  /**
   * Transforms a list of Prisma records.
   */
  toDomainList(entities) {
    if (!entities || !Array.isArray(entities)) return [];
    return entities.map(this.toDomain);
  },

  /**
   * Transforms a Domain object into a Prisma write payload.
   */
  toPersistence(domain) {
    if (!domain) return null;

    const entity = {};

    if (domain.firstName !== undefined) entity.firstName = domain.firstName?.trim();
    if (domain.lastName  !== undefined) entity.lastName  = domain.lastName?.trim();
    if (domain.idCard    !== undefined) entity.idCard    = domain.idCard?.trim();
    if (domain.email     !== undefined) entity.email     = domain.email?.trim().toLowerCase();
    if (domain.password  !== undefined) entity.password  = domain.password;
    if (domain.roleId    !== undefined) entity.roleId    = Number(domain.roleId);
    
    // isActive (dominio) → deletedAt (Prisma): true = activo (null), false = soft-delete (ahora)
    if (domain.isActive !== undefined) {
      entity.deletedAt = domain.isActive ? null : (domain.deletedAt || new Date());
    }

    return entity;
  },

  /**
   * Translates domain sort keys to Prisma field names.
   */
  toSortKey(domainKey) {
    const allowedKeys = ["firstName", "lastName", "idCard", "email", "role", "createdAt"];
    return allowedKeys.includes(domainKey) ? domainKey : "createdAt";
  }
};
