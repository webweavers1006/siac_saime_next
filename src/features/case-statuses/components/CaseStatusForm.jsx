"use client";

import { useCaseStatusForm } from "../hooks/use-case-status-form";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CASE_STATUS_CONFIG } from "../config/case-status.constants";

export function CaseStatusForm({ defaultValues: item, onSuccess }) {
  const { form, formConfig, isPending, onSubmit } = useCaseStatusForm({ defaultValues: item, onSuccess });
  const { LABELS } = CASE_STATUS_CONFIG.UI;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {formConfig.map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-4 md:grid-cols-2">
              {row.map((field) => {
                if (field.component === "input") {
                  return (
                    <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                      <CustomFormField
                        control={form.control}
                        {...field}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? LABELS.FORM.SAVING : (item ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
