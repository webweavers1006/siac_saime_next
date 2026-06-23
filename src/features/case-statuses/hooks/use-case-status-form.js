"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { caseStatusSchema } from "../schemas/case-status.schema";
import { saveCaseStatusAction } from "../actions/case-status.write.action";
import { getCaseStatusFormConfig, getCaseStatusDefaultValues } from "../config/case-status.form.config";

export function useCaseStatusForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(caseStatusSchema),
    defaultValues: getCaseStatusDefaultValues(item),
  });

  const formConfig = useMemo(() => getCaseStatusFormConfig(), []);

  useEffect(() => {
    form.reset(getCaseStatusDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveCaseStatusAction(data);

      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            form.setError(field, { type: "server", message: messages[0] });
          });
        } else {
          toast.error(result.error || "Error al guardar");
        }
      }
    });
  };

  return {
    form,
    formConfig,
    isPending,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
