import prisma from "@/features/shared/lib/prisma";
import { userMapper } from "../mappers/user.mapper";

/**
 * Busca usuarios con paginación, ordenamiento y filtros.
 */
export async function findUsersPaginated({ page, pageSize, searchTerm, status, sortKey, sortDirection }) {
  const skip = (page - 1) * pageSize;

  let orderBy = { createdAt: "desc" };

  if (sortKey) {
    const dbKey = userMapper.toSortKey(sortKey);

    if (dbKey === "role") {
      orderBy = { role: { name: sortDirection } };
    } else {
      orderBy = { [dbKey]: sortDirection };
    }
  }

  const where = {
    ...(status === "active"   && { deletedAt: null }),
    ...(status === "inactive" && { deletedAt: { not: null } }),
    ...(searchTerm && {
      OR: [
        { firstName: { contains: searchTerm, mode: "insensitive" } },
        { lastName:  { contains: searchTerm, mode: "insensitive" } },
        { idCard:    { contains: searchTerm } },
        { email:     { contains: searchTerm, mode: "insensitive" } },
      ],
    }),
  };

  const [totalCount, rawUsers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        role: true,
        caseArea: true,
        administrativeDirection: true,
        attentionChannel: true,
      },
    }),
  ]);

  return {
    totalCount,
    users: userMapper.toDomainList(rawUsers),
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/**
 * Busca un único usuario por ID.
 */
export async function findUserById(id) {
  const rawUser = await prisma.user.findUnique({
    where: { id },
    include: {
        role: true,
        caseArea: true,
        administrativeDirection: {
          include: {
            defaultCaseArea: true,
            directionAreas: { include: { area: true } },
          },
        },
        attentionChannel: true,
      },
  });
  return userMapper.toDomain(rawUser);
}

/**
 * Finds the officeId for a given user (lightweight, no includes).
 * @param {number} id
 * @returns {Promise<{ officeId: number|null }|null>}
 */
export async function findUserOfficeById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: { officeId: true },
  });
}

/**
 * Finds all non-deleted users belonging to a given administrative direction.
 * Used for notification routing when a case is forwarded.
 * @param {number} administrativeDirectionId
 * @returns {Promise<Array<{ id: string }>>} Minimal user objects.
 */
export async function findUsersByAdministrativeDirectionId(administrativeDirectionId) {
  const rawUsers = await prisma.user.findMany({
    where: {
      administrativeDirectionId: Number(administrativeDirectionId),
      deletedAt: null,
    },
    select: { id: true },
  });
  return rawUsers;
}

/**
 * Busca un usuario por idCard o email para verificar unicidad.
 */
export async function findUserByUniqueFields(idCard, email, currentId = null) {
  return await prisma.user.findFirst({
    where: {
      OR: [{ idCard }, { email }],
      NOT: currentId ? { id: currentId } : undefined,
    },
    select: { id: true, idCard: true, email: true },
  });
}
