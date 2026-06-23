import prisma from "@/features/shared/lib/prisma";
import { personMapper } from "../mappers/person.mapper";

export const personWriteRepository = {
  async create(data) {
    const persistence = personMapper.toPersistence(data);
    const item = await prisma.person.create({ data: persistence });
    return personMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = personMapper.toPersistence(data);
    const item = await prisma.person.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return personMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.person.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
