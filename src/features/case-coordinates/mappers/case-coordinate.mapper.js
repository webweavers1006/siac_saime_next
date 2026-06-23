/**
 * Mapper for the Map Parish Feature entity.
 *
 * Transforms Prisma Parish records (with geoData, municipality, state, and case counts)
 * into domain objects ready for Leaflet GeoJSON rendering.
 */

export const caseCoordinateMapper = {
  /**
   * Transforms a Prisma Parish record (with nested relations) into a Domain object.
   *
   * @param {object} raw — Prisma Parish record with:
   *   - geoData (GeoJSON geometry)
   *   - municipality (with state)
   *   - persons[] (with cases[])
   *   - _count? (aggregated case count)
   */
  toDomain(raw) {
    if (!raw) return null;

    // Compute case count: from _count if available, else from nested relations
    let caseCount = 0;
    if (raw._count?.persons) {
      caseCount = raw._count.persons;
    } else if (raw.persons) {
      caseCount = raw.persons.reduce(
        (sum, p) => sum + (p._count?.cases || p.cases?.length || 0),
        0
      );
    }

    return {
      id: raw.id,
      name: raw.name,
      pcode: raw.pcode,
      geoData: raw.geoData,
      municipalityId: raw.municipalityId,
      municipalityName: raw.municipality?.name || null,
      stateId: raw.municipality?.stateId || null,
      stateName: raw.municipality?.state?.name || null,
      caseCount,
    };
  },

  /**
   * Transforms a list of Prisma records.
   */
  toDomainList(list) {
    if (!list) return [];
    return list.map(this.toDomain);
  },

  /**
   * Not used for map features (read-only from parish data).
   */
  toPersistence() {
    return {};
  },

  /**
   * Maps a domain-level sort key to the database column name.
   */
  toSortKey(domainKey) {
    const map = {
      name: "name",
      caseCount: "caseCount",
    };
    return map[domainKey] || "name";
  },
};
