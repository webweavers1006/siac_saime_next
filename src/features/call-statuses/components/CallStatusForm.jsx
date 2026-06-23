"use client";

import { useCallStatusForm } from "../hooks/use-call-status-form";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CALL_STATUS_CONFIG } from "../config/call-status.constants";

export function CallStatusForm({ defaultValues: item, onSuccess }) {
  const { form, formConfig, isPending, onSubmit } = useCallStatusForm({ defaultValues: item, onSuccess });
  const { LABELS } = CALL_STATUS_CONFIG.UI;

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
