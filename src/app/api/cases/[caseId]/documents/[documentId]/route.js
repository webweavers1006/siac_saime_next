import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getSession } from "@/features/auth/lib/auth";
import { verifyPermission } from "@/features/permissions/services/permission.authorization.service";
import { caseDocumentReadRepository } from "@/features/case-documents/repositories/case-document.read.repository";
import { logger } from "@/features/shared/lib/logger";

/**
 * GET /api/cases/[caseId]/documents/[documentId]
 * Serves a case document file with authentication.
 */
export async function GET(_request, { params }) {
  try {
    // 1. Auth
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const authorized = await verifyPermission(session.role, "case_documents:read");
    if (!authorized) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    // 2. Resolve params
    const { caseId, documentId } = await params;

    // 3. Look up document
    const doc = await caseDocumentReadRepository.findById(documentId);
    if (!doc || String(doc.caseId) !== String(caseId)) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }

    // 4. Resolve file path — ensure it stays within storage/
    const absolutePath = path.resolve(process.cwd(), doc.filePath);
    const STORAGE_BASE = path.resolve(process.cwd(), "storage");
    if (!absolutePath.startsWith(STORAGE_BASE)) {
      logger.warn("Path traversal attempt blocked", { path: doc.filePath });
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }
    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json({ error: "Archivo no encontrado en disco" }, { status: 404 });
    }

    // 5. Read file
    const buffer = fs.readFileSync(absolutePath);
    const mimeType = doc.mimeType || "application/octet-stream";
    const fileName = doc.originalName || doc.filePath.split("/").pop() || "documento";

    // 6. Return file with inline disposition (view in browser) + proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.length),
        "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    logger.error("Error serving document", { error: error.message });
    return NextResponse.json({ error: "Error al servir el documento" }, { status: 500 });
  }
}
