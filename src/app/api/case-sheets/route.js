/**
 * GET /api/case-sheets?caseId=123
 *
 * Generates and downloads a planilla PDF for a single case.
 * Architecture: API route → action → service → repository → template
 */

import { NextResponse } from "next/server";
import { getCaseSheetDataAction } from "@/features/case-sheets/actions/case-sheet.read.action";
import { generateSheetBuffer } from "@/features/case-sheets/services/case-sheet.write.service";
import { logger } from "@/features/shared";

export async function GET(request) {
  try {
    // 1. Parse caseId from query params
    const { searchParams } = new URL(request.url);
    const caseId = parseInt(searchParams.get("caseId"), 10);

    if (isNaN(caseId) || caseId < 1) {
      return NextResponse.json({ error: "ID de caso inválido" }, { status: 400 });
    }

    // 2. Fetch data via protected action (handles session + permission + fetch)
    const result = await getCaseSheetDataAction({ caseId });

    if (!result.success) {
      const status = result.error === "No autorizado" ? 401
        : result.error === "Acceso denegado" ? 403
        : result.error === "Caso no encontrado" ? 404
        : 500;
      return NextResponse.json({ error: result.error }, { status });
    }

    // 3. Generate PDF buffer from template data
    const buffer = generateSheetBuffer(result.data);
    const safeName = (result.data.requestNumber || `caso-${caseId}`).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `planilla_${safeName}.pdf`;

    // 4. Return PDF
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    logger.error("API case-sheets error", { error: error.message });
    return NextResponse.json({ error: "Error al generar la planilla" }, { status: 500 });
  }
}
