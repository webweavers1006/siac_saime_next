"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useCaseForm } from "../hooks/use-case-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { CustomFormTextarea } from "@/components/shared/form/CustomFormTextarea";
import { AsyncSelect } from "@/components/shared/form/AsyncSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { logger } from "@/features/shared/lib/logger";
import { CASE_CONFIG } from "../config/case.constants";
import { getOperatorDefaultsAction } from "../actions/case.read.action";

export function CaseForm({ defaultValues: item, onSuccess }) {
  const [operatorProfile, setOperatorProfile] = useState(null);

  // Fetch operator defaults once on mount
  useEffect(() => {
    getOperatorDefaultsAction()
      .then(setOperatorProfile)
      .catch((error) => {
        logger.error("Failed to load operator case defaults", { error: error?.message });
        setOperatorProfile(null);
      });
  }, []);

  const { form, formConfig, isPending, onSubmit } = useCaseForm({ defaultValues: item, operatorProfile, onSuccess });
  const { LABELS } = CASE_CONFIG.UI;

  // Track loaded attention types with their flags for conditional rendering
  const [attentionTypes, setAttentionTypes] = useState([]);
  const attentionTypeId = useWatch({ control: form.control, name: "attentionTypeId" });
  const caseAreaId = useWatch({ control: form.control, name: "caseAreaId" });

  // Reset reasonId when caseAreaId changes (prevent motive from wrong area)
  useEffect(() => {
    form.setValue("reasonId", null, { shouldDirty: false });
  }, [caseAreaId]); // eslint-disable-line react-hooks/exhaustive-deps

  const attentionFlags = useMemo(() => {
    if (!attentionTypeId || !attentionTypes.length) return {};
    const selected = attentionTypes.find(
      (t) => String(t.value) === String(attentionTypeId)
    );
    return {
      hasComplaint: selected?.hasComplaint ?? false,
      hasAttentionDetail: selected?.hasAttentionDetail ?? false,
    };
  }, [attentionTypeId, attentionTypes]);

  const handleAttentionTypesLoad = useCallback((options) => {
    setAttentionTypes(options);
  }, []);

  // Derive a stable row key from the row content so that conditional
  // showWhen rows don't shift indices and cause unmount/remount of AsyncSelect.
  const getRowKey = (row) => row.map(f => f.name || f.component + '-' + (f.title || '')).join('|');

  // Filter form config rows: hide rows/fields where showWhen returns false
  const visibleConfig = useMemo(() => {
    return formConfig
      .map((row) => {
        const filteredRow = row.filter((field) => {
          if (!field.showWhen) return true;
          return field.showWhen(attentionFlags);
        });
        return filteredRow;
      })
      .filter((row) => row.length > 0);
  }, [formConfig, attentionFlags]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-6">
          {visibleConfig.map((row) => {
            const rowKey = getRowKey(row);
            // Check if the row is a section title
            if (row.length === 1 && row[0].component === "sectionTitle") {
              return (
                <h3
                  key={rowKey}
                  className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2 first:pt-0"
                >
                  {row[0].title}
                </h3>
              );
            }

            return (
              <div key={rowKey} className={`grid gap-4 ${row.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
                {row.map((field) => {
                  // Strip internal config props before spreading to DOM components
                  const { showWhen, onOptionsLoad: _onLoad, ...domProps } = field;

                  if (field.component === "input") {
                    return (
                      <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                        <CustomFormField
                          control={form.control}
                          {...domProps}
                        />
                      </div>
                    );
                  }

                  if (field.component === "checkbox") {
                    return (
                      <div key={field.name} className="flex items-center gap-2">
                        <FormField
                          control={form.control}
                          name={field.name}
                          render={({ field: controllerField }) => (
                            <FormItem className="flex items-center gap-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={controllerField.value ?? false}
                                  onCheckedChange={(checked) => controllerField.onChange(checked)}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {field.label}
                              </FormLabel>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    );
                  }

                  if (field.component === "textarea") {
                    return (
                      <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                        <CustomFormTextarea
                          control={form.control}
                          {...domProps}
                        />
                      </div>
                    );
                  }

                  if (field.component === "asyncSelect") {
                    // Resolve parent value for dependent selects (dependsOn pattern)
                    const parentValues = { caseAreaId, attentionTypeId };
                    const parentValue = field.dependsOn ? parentValues[field.dependsOn] : undefined;
                    return (
                      <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                        <FormField
                          control={form.control}
                          name={field.name}
                          render={({ field: controllerField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>
                              <AsyncSelect
                                key={
                                  field.dependsOn
                                    ? `${field.name}-${parentValue || "none"}`
                                    : undefined
                                }
                                value={controllerField.value}
                                onChange={(val) => form.setValue(field.name, val, { shouldDirty: true })}
                                fetcher={
                                  field.dependsOn
                                    ? (search) => field.loadOptions(search, parentValue)
                                    : field.loadOptions
                                }
                                getLabel={field.getOptionLabel}
                                getValue={field.getOptionValue}
                                renderOption={field.renderOption}
                                placeholder={field.placeholder}
                                emptyMessage="No se encontraron resultados."
                                onOptionsLoad={
                                  field.name === "attentionTypeId"
                                    ? handleAttentionTypesLoad
                                    : undefined
                                }
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
