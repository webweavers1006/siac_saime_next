"use client";

import { FileText, Upload } from "lucide-react";
import { CaseInfoTab } from "./CaseInfoTab";
import { CaseDocumentsTab } from "./CaseDocumentsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenerateSheetButton } from "@/features/case-sheets/components/GenerateSheetButton";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";

const TABS = [
  { id: "info", label: "Información", icon: FileText },
  { id: "documents", label: "Documentos", icon: Upload },
];

export function CaseDetailView({ caseData, documents: initialDocuments }) {
  const { can } = usePermission();
  const canGenerateSheet = can("case_sheets:generate");

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar row with planilla button */}
      {canGenerateSheet && (
        <div className="flex justify-end">
          <GenerateSheetButton caseId={caseData.id} variant="button" />
        </div>
      )}

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <CaseInfoTab caseData={caseData} />
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <CaseDocumentsTab caseId={caseData.id} initialDocuments={initialDocuments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
