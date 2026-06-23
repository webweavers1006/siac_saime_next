/**
 * case-sheets/index.js
 * Barrel exports for the case-sheets feature.
 *
 * SECURITY: Only export config, constants, and pure utilities.
 * NEVER export server-only functions (actions, prisma) through this barrel.
 * Those must be imported by direct path.
 *
 * Client-safe exports:
 * - CASE_SHEET_CONFIG (constants, labels)
 * - GenerateSheetButton (UI component)
 * - useCaseSheetDownload (client hook)
 */

export { CASE_SHEET_CONFIG } from "./config/case-sheet.constants";
export { GenerateSheetButton } from "./components/GenerateSheetButton";
export { useCaseSheetDownload } from "./hooks/use-case-sheet-download";
