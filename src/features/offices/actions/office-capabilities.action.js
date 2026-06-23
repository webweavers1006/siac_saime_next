"use server";

import { officeReadRepository } from "@/features/offices/repositories/offices.read.repository";

/**
 * Returns office capabilities for display on the public ticket form.
 */
export async function getOfficeCapabilitiesAction(officeId) {
  if (!officeId) return null;
  const office = await officeReadRepository.findById(officeId);
  if (!office) return null;
  return {
    hasForeignAffairs: office.hasForeignAffairs,
    hasMigration: office.hasMigration,
    hasEmailChange: office.hasEmailChange,
  };
}
