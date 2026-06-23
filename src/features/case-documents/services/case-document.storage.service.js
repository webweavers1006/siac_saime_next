/**
 * File storage service for case documents.
 * Only file I/O operations. Validation lives in shared/lib/file-validation.js
 *
 * Storage path: storage/uploads/cases/<caseId>/<uuid>_<sanitized_name>.<ext>
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { sanitizeFileName } from "@/features/shared/lib/file-validation";
import { logger } from "@/features/shared/lib/logger";

const STORAGE_BASE = path.resolve(process.cwd(), "storage", "uploads", "cases");

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Saves a File object to disk. Assumes the file is already validated.
 * Returns { success, filePath } where filePath is relative to project root.
 */
export async function saveUploadedFile(file, caseId) {
  const dirPath = path.join(STORAGE_BASE, String(caseId));
  ensureDir(dirPath);

  const sanitized = sanitizeFileName(file.name);
  const uuid = crypto.randomUUID().split("-")[0];
  const fileName = `${uuid}_${sanitized}`;
  const absolutePath = path.join(dirPath, fileName);

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(absolutePath, buffer);
    logger.info("File saved", { path: absolutePath, size: buffer.length });

    const relativePath = path.relative(process.cwd(), absolutePath);
    return { success: true, filePath: relativePath };
  } catch (error) {
    logger.error("Failed to save file", { error: error.message, path: absolutePath });
    return { success: false, error: "STORAGE" };
  }
}

/**
 * Deletes a file from disk by its stored relative path.
 * Only deletes files within STORAGE_BASE for safety.
 */
export async function deleteStoredFile(relativePath) {
  if (!relativePath) return;

  const absolutePath = path.resolve(process.cwd(), relativePath);
  if (!absolutePath.startsWith(STORAGE_BASE)) {
    logger.warn("Refusing to delete file outside storage", { path: relativePath });
    return;
  }

  try {
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      logger.info("File deleted", { path: relativePath });
    }
  } catch (error) {
    logger.error("Failed to delete file", { error: error.message, path: relativePath });
    throw error;
  }
}
