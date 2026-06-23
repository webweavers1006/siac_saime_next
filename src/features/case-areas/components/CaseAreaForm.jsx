"use client";

import { useCaseAreaForm } from "../hooks/use-case-area-form";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CASE_AREA_CONFIG } from "../config/case-area.constants";

export function CaseAreaForm({ defaultValues: item, onSuccess }) {
  const { form, formConfig, isPending, onSubmit } = useCaseAreaForm({ defaultValues: item, onSuccess });
  const { LABELS } = CASE_AREA_CONFIG.UI;

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
