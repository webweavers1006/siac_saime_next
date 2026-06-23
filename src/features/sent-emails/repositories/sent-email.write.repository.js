import prisma from "@/features/shared/lib/prisma";
import { sentEmailMapper } from "../mappers/sent-email.mapper";

export const sentEmailWriteRepository = {
  /**
   * Records a sent email in the audit table.
   * @param {Object} data - Domain data for the sent email.
   * @returns {Promise<Object>} The created record.
   */
  async create(data) {
    const persistence = sentEmailMapper.toPersistence(data);
    return prisma.sentEmail.create({ data: persistence });
  },

  /**
   * Updates the status of a sent email (e.g., mark as bounced).
   * @param {number} id - SentEmail ID.
   * @param {string} status - New status.
   * @param {string} [errorMessage] - Error details if failed/bounced.
   * @returns {Promise<Object>} The updated record.
   */
  async updateStatus(id, status, errorMessage) {
    return prisma.sentEmail.update({
      where: { id },
      data: {
        status,
        ...(errorMessage && { errorMessage }),
      },
    });
  },
};
