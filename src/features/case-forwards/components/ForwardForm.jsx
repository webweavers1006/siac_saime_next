"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { CustomFormTextarea } from "@/components/shared/form/CustomFormTextarea";
import { AsyncSelect } from "@/components/shared/form/AsyncSelect";
import { Button } from "@/components/ui/button";
import { saveCaseForwardAction } from "@/features/case-forwards/actions/case-forward.write.action";
import { getAdministrativeDirectionsForSelectAction } from "@/features/administrative-directions/actions/administrative-direction.select.action";
import { CASE_FORWARD_CONFIG } from "@/features/case-forwards/config/case-forward.constants";
import { caseForwardSchema } from "@/features/case-forwards/schemas/case-forward.schema";
import { getNowDefaults } from "@/features/shared/lib/date-utils";

const { LABELS } = CASE_FORWARD_CONFIG.UI;

/**
 * Form to create a new forward (remisión) entry.
 */
export function ForwardForm({ caseId, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const { date: defaultDate } = getNowDefaults();

  const form = useForm({
    resolver: zodResolver(caseForwardSchema),
    defaultValues: {
      caseId: Number(caseId),
      administrativeDirectionId: null,
      description: "",
      date: defaultDate,
    },
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveCaseForwardAction(data);

      if (result.success) {
        toast.success(LABELS.MESSAGES.SUCCESS.CREATE);
        const { date: resetDate } = getNowDefaults();
        form.reset({
          caseId: Number(caseId),
          administrativeDirectionId: null,
          description: "",
          date: resetDate,
        });
        onSuccess?.();
      } else {
        toast.error(result.error || LABELS.MESSAGES.ERROR.CREATE);
        if (result.details) {
          Object.entries(result.details).forEach(([field, msgs]) => {
            form.setError(field, { type: "server", message: msgs[0] });
          });
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2 first:pt-0">
            Registrar Remisión
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="administrativeDirectionId"
              render={({ field: controllerField }) => (
                <FormItem>
                  <FormLabel>{LABELS.FORM.FIELDS.ADMINISTRATIVE_DIRECTION}</FormLabel>
                  <AsyncSelect
                    value={controllerField.value}
                    onChange={(val) => form.setValue("administrativeDirectionId", val, { shouldDirty: true })}
                    fetcher={async (search) => {
                      const result = await getAdministrativeDirectionsForSelectAction({
                        searchTerm: search || "",
                      });
                      return result || [];
                    }}
                    placeholder={LABELS.FORM.PLACEHOLDERS.ADMINISTRATIVE_DIRECTION}
                    emptyMessage="No se encontraron resultados."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomFormField
              control={form.control}
              name="date"
              label={LABELS.FORM.FIELDS.DATE}
              type="date"
              disabled
            />
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <CustomFormTextarea
              control={form.control}
              name="description"
              label={LABELS.FORM.FIELDS.DESCRIPTION}
              placeholder={LABELS.FORM.PLACEHOLDERS.DESCRIPTION}
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? LABELS.FORM.SAVING : LABELS.FORM.SUBMIT}
          </Button>
        </div>
      </form>
    </Form>
  );
}
