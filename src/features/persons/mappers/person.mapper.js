import { parseDateInput } from "@/features/shared/lib/date-utils";

export const personMapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      firstName: raw.firstName,
      lastName: raw.lastName,
      idCard: raw.idCard,
      phone: raw.phone,
      email: raw.email,
      address: raw.address,
      nationality: raw.nationality,
      sex: raw.sex,
      age: raw.age,
      birthDate: raw.birthDate,
      profession: raw.profession,
      personType: raw.personType,
      legalInfo: raw.legalInfo,
      countryId: raw.countryId,
      countryName: raw.country?.name || null,
      stateId: raw.stateId,
      stateName: raw.state?.name || null,
      municipalityId: raw.municipalityId,
      municipalityName: raw.municipality?.name || null,
      parishId: raw.parishId,
      parishName: raw.parish?.name || null,
      beneficiaryTypeId: raw.beneficiaryTypeId,
      beneficiaryTypeName: raw.beneficiaryType?.name || null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toDomainList(list) {
    if (!list) return [];
    return list.map(this.toDomain);
  },

  toPersistence(domain) {
    return {
      firstName: domain.firstName?.trim(),
      lastName: domain.lastName?.trim() || null,
      idCard: domain.idCard?.trim() || null,
      phone: domain.phone?.trim() || null,
      email: domain.email?.trim() || null,
      address: domain.address?.trim() || null,
      nationality: domain.nationality || null,
      sex: domain.sex || null,
      age: domain.age ? Number(domain.age) : null,
      birthDate: parseDateInput(domain.birthDate),
      profession: domain.profession?.trim() || null,
      personType: domain.personType || null,
      legalInfo: domain.legalInfo?.trim() || null,
      countryId: domain.countryId ? Number(domain.countryId) : null,
      stateId: domain.stateId ? Number(domain.stateId) : null,
      municipalityId: domain.municipalityId ? Number(domain.municipalityId) : null,
      parishId: domain.parishId ? Number(domain.parishId) : null,
      beneficiaryTypeId: domain.beneficiaryTypeId ? Number(domain.beneficiaryTypeId) : null,
    };
  },

  toSortKey(domainKey) {
    const map = {
      firstName: "firstName",
      lastName: "lastName",
      idCard: "idCard",
      personType: "personType",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
