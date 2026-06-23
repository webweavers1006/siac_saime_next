"use client";

import { useOfficeForm } from "../hooks/use-offices-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { CustomFormTextarea } from "@/components/shared/form/CustomFormTextarea";
import { CustomFormSwitch } from "@/components/shared/form/CustomFormSwitch";
import { AsyncSelect } from "@/components/shared/form/AsyncSelect";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { OFFICE_CONFIG } from "../config/offices.constants";

export function OfficeForm({ defaultValues: item, onSuccess }) {
  const { form, formConfig, isPending, onSubmit } = useOfficeForm({ defaultValues: item, onSuccess });
  const { LABELS } = OFFICE_CONFIG.UI;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {formConfig.map((row, rowIndex) => {
            const rowKey = row.map(f => f.name || f.component).join('|');
            return (
              <div key={rowKey} className={`grid gap-4 ${row.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
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

                  if (field.component === "textarea") {
                    return (
                      <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                        <CustomFormTextarea
                          control={form.control}
                          {...field}
                        />
                      </div>
                    );
                  }

                  if (field.component === "switch") {
                    return (
                      <div key={field.name}>
                        <CustomFormSwitch
                          control={form.control}
                          {...field}
                        />
                      </div>
                    );
                  }

                  if (field.component === "asyncSelect") {
                    return (
                      <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                        <FormField
                          control={form.control}
                          name={field.name}
                          render={({ field: controllerField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <AsyncSelect
                                value={controllerField.value}
                                onChange={(val) => form.setValue(field.name, val, { shouldDirty: true })}
                                fetcher={field.loadOptions}
                                getLabel={field.getOptionLabel}
                                getValue={field.getOptionValue}
                                placeholder={field.placeholder}
                                emptyMessage={field.emptyMessage || "No se encontraron resultados."}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            );
          })}
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
