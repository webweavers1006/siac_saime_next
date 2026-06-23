/**
 * seed-geo-data.js — Phase 2.5: INE codes + GeoJSON polygons
 *
 * Loads INE codes (pcode) and geo polygons from the mapavenezuela2024 GeoJSON
 * into states, municipalities, and parishes.
 *
 * Source: /tmp/mapavenezuela2024.github.io/create_json/ven_admbnda_adm3_ine_20210223.json
 *
 * This module is called by the main orchestrator (index.js) after geography seed.
 */

const fs = require("node:fs");
require("dotenv").config();
const { prisma } = require("./lib/prisma");
const { log } = require("./lib/logger");

// ─── Config ──────────────────────────────────────────────────────────────────

const GEOJSON_PATHS = [
  // Permanent project location
  require("node:path").resolve(__dirname, "../geo-data/ven_admbnda_adm3_ine_20210223.json"),
  // Fallback: temp clone location
  "/tmp/mapavenezuela2024.github.io/create_json/ven_admbnda_adm3_ine_20210223.json",
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeName(name) {
  if (!name) return "";
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, "")
    .trim()
    .toLowerCase();
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function seedGeoData() {
  log.info("🌎 Fase 2.5: Cargando códigos INE y datos geoespaciales…\n");

  // Find the GeoJSON file
  let geojsonPath = null;
  for (const p of GEOJSON_PATHS) {
    if (fs.existsSync(p)) {
      geojsonPath = p;
      break;
    }
  }

  if (!geojsonPath) {
    log.warn(
      "⚠️  GeoJSON no encontrado. Se buscó en:\n   " + GEOJSON_PATHS.join("\n   ")
    );
    log.warn(
      "   Clona https://github.com/mapavenezuela2024/mapavenezuela2024.github.io.git\n"
    );
    return;
  }

  log.info("   Archivo: " + geojsonPath);
  const geojson = JSON.parse(fs.readFileSync(geojsonPath, "utf-8"));
  const features = geojson.features || [];
  log.info("   " + features.length + " parroquias cargadas del GeoJSON.");

  // ─── Step 1: Collect unique states & municipalities ────────────────────────

  const stateMap = new Map();
  const muniMap = new Map();

  for (const feat of features) {
    const p = feat.properties;
    if (!stateMap.has(p.ADM1_PCODE)) {
      stateMap.set(p.ADM1_PCODE, { pcode: p.ADM1_PCODE, name: p.ADM1_ES });
    }
    if (!muniMap.has(p.ADM2_PCODE)) {
      muniMap.set(p.ADM2_PCODE, {
        pcode: p.ADM2_PCODE,
        name: p.ADM2_ES,
        statePcode: p.ADM1_PCODE,
      });
    }
  }

  log.info(
    "   Estados únicos: " + stateMap.size + ", municipios únicos: " + muniMap.size
  );

  // ─── Step 2: Build DB lookup maps ──────────────────────────────────────────

  const dbStates = await prisma.state.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  });
  const dbStateByName = new Map();
  for (const s of dbStates) dbStateByName.set(normalizeName(s.name), s);

  const dbMunis = await prisma.municipality.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, stateId: true },
  });
  const dbMuniByName = new Map();
  for (const m of dbMunis) dbMuniByName.set(normalizeName(m.name), m);

  const dbParishes = await prisma.parish.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true, municipalityId: true },
  });
  const dbParishByName = new Map();
  for (const p of dbParishes) dbParishByName.set(normalizeName(p.name), p);

  // ─── Step 3: Update states with pcodes ─────────────────────────────────────

  let stateOk = 0;
  let stateSkip = 0;

  for (const [pcode, ine] of stateMap) {
    const db = dbStateByName.get(normalizeName(ine.name));
    if (!db) { stateSkip++; continue; }
    await prisma.state.update({ where: { id: db.id }, data: { pcode } });
    stateOk++;
  }
  log.info("   ✅ Estados actualizados: " + stateOk + ", omitidos: " + stateSkip);

  // ─── Step 4: Update municipalities with pcodes ─────────────────────────────

  let muniOk = 0;
  let muniSkip = 0;

  for (const [pcode, ine] of muniMap) {
    const db = dbMuniByName.get(normalizeName(ine.name));
    if (!db) { muniSkip++; continue; }
    await prisma.municipality.update({ where: { id: db.id }, data: { pcode } });
    muniOk++;
  }
  log.info("   ✅ Municipios actualizados: " + muniOk + ", omitidos: " + muniSkip);

  // ─── Step 5: Update parishes with pcodes + polygons ────────────────────────

  let parishOk = 0;
  let parishSkip = 0;
  let geoOk = 0;

  for (const feat of features) {
    const p = feat.properties;
    const normName = normalizeName(p.ADM3_ES);
    let target = dbParishByName.get(normName);

    if (!target) { parishSkip++; continue; }

    // Disambiguate: same parish name in different municipalities
    const normMuni = normalizeName(p.ADM2_ES);
    const dbMuni = dbMuniByName.get(normMuni);
    if (dbMuni && target.municipalityId !== dbMuni.id) {
      const alt = await prisma.parish.findFirst({
        where: { name: p.ADM3_ES, municipalityId: dbMuni.id, deletedAt: null },
      });
      if (alt) target = alt;
    }

    await prisma.parish.update({
      where: { id: target.id },
      data: { pcode: p.ADM3_PCODE, geoData: feat.geometry },
    });
    parishOk++;
    geoOk++;
  }
  log.info(
    "   ✅ Parroquias actualizadas: " + parishOk + ", omitidas: " + parishSkip + ", con polígonos: " + geoOk
  );

  // ─── Verify ────────────────────────────────────────────────────────────────

  const st = await prisma.state.count({ where: { pcode: { not: null } } });
  const mu = await prisma.municipality.count({ where: { pcode: { not: null } } });
  const pa = await prisma.parish.count({ where: { pcode: { not: null } } });
  const ge = await prisma.parish.count({ where: { geoData: { not: null } } });

  log.info("\n🔍 Verificación:");
  log.info("   Estados con código INE:     " + st);
  log.info("   Municipios con código INE:  " + mu);
  log.info("   Parroquias con código INE:  " + pa);
  log.info("   Parroquias con polígono:    " + ge);
  log.info("");
}

module.exports = { seedGeoData };

// Allow standalone execution: node prisma/seeds/seed-geo-data.js
if (require.main === module) {
  seedGeoData()
    .catch((e) => {
      console.error("❌ Error:", e?.message || e, e?.stack || "");
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
