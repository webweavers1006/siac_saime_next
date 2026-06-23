"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { caseAreaSchema } from "../schemas/case-area.schema";
import { saveCaseAreaAction } from "../actions/case-area.write.action";
import { getCaseAreaFormConfig, getCaseAreaDefaultValues } from "../config/case-area.form.config";

export function useCaseAreaForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(caseAreaSchema),
    defaultValues: getCaseAreaDefaultValues(item),
  });

  const formConfig = useMemo(() => getCaseAreaFormConfig(), []);

  useEffect(() => {
    form.reset(getCaseAreaDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveCaseAreaAction(data);

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
