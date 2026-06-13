import prisma from "@/features/shared/lib/prisma";
import { userMapper } from "../mappers/user.mapper";

/**
 * Crea un nuevo usuario en la base de datos.
 */
export async function createUser(userDomainDto) {
  const data = userMapper.toPersistence(userDomainDto);
  const rawUser = await prisma.user.create({ data });
  return userMapper.toDomain(rawUser);
}

/**
 * Actualiza un usuario existente.
 */
export async function updateUser(id, userDomainDto) {
  const data = userMapper.toPersistence(userDomainDto);
  const rawUser = await prisma.user.update({ 
    where: { id }, 
    data 
  });
  return userMapper.toDomain(rawUser);
}

/**
 * Realiza un borrado lógico (soft delete) de un usuario.
 */
export async function deleteUser(id) {
  const rawUser = await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return userMapper.toDomain(rawUser);
}
