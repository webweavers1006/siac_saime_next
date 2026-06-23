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
import { saveCaseFollowUpAction } from "@/features/case-follow-ups/actions/case-follow-up.write.action";
import { getCallStatusesListAction } from "@/features/call-statuses/actions/call-status.read.action";
import { CASE_FOLLOW_UP_CONFIG } from "@/features/case-follow-ups/config/case-follow-up.constants";
import { caseFollowUpSchema } from "@/features/case-follow-ups/schemas/case-follow-up.schema";
import { getNowDefaults } from "@/features/shared/lib/date-utils";

const { LABELS } = CASE_FOLLOW_UP_CONFIG.UI;

/**
 * Form to create a new follow-up entry.
 * Follows the same aesthetic pattern as CaseForm.
 */
export function FollowUpForm({ caseId, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const { date: defaultDate, time: defaultTime } = getNowDefaults();

  const form = useForm({
    resolver: zodResolver(caseFollowUpSchema),
    defaultValues: {
      caseId: Number(caseId),
      callStatusId: null,
      comment: "",
      date: defaultDate,
      time: defaultTime,
    },
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveCaseFollowUpAction(data);

      if (result.success) {
        toast.success(LABELS.MESSAGES.SUCCESS.CREATE);
        const { date: resetDate, time: resetTime } = getNowDefaults();
        form.reset({
          caseId: Number(caseId),
          callStatusId: null,
          comment: "",
          date: resetDate,
          time: resetTime,
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
            Registrar Seguimiento
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="callStatusId"
              render={({ field: controllerField }) => (
                <FormItem>
                  <FormLabel>{LABELS.FORM.FIELDS.CALL_STATUS}</FormLabel>
                  <AsyncSelect
                    value={controllerField.value}
                    onChange={(val) => form.setValue("callStatusId", val, { shouldDirty: true })}
                    fetcher={async (search) => {
                      const result = await getCallStatusesListAction({
                        searchTerm: search,
                        page: 1,
                        pageSize: 50,
                      });
                      return (result?.items || []).map((item) => ({
                        label: item.name,
                        value: item.id,
                      }));
                    }}
                    placeholder={LABELS.FORM.PLACEHOLDERS.CALL_STATUS}
                    emptyMessage="No se encontraron resultados."
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 grid-cols-2">
              <CustomFormField
                control={form.control}
                name="date"
                label={LABELS.FORM.FIELDS.DATE}
                type="date"
                disabled
              />
              <CustomFormField
                control={form.control}
                name="time"
                label={LABELS.FORM.FIELDS.TIME}
                type="time"
                disabled
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <CustomFormTextarea
              control={form.control}
              name="comment"
              label={LABELS.FORM.FIELDS.COMMENT}
              placeholder={LABELS.FORM.PLACEHOLDERS.COMMENT}
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
