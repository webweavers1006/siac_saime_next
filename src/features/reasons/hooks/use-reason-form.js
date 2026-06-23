"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { reasonSchema } from "../schemas/reason.schema";
import { saveReasonAction } from "../actions/reason.write.action";
import { getReasonFormConfig, getReasonDefaultValues } from "../config/reason.form.config";

export function useReasonForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(reasonSchema),
    defaultValues: getReasonDefaultValues(item),
  });

  const formConfig = useMemo(() => getReasonFormConfig(), []);

  useEffect(() => {
    form.reset(getReasonDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveReasonAction(data);

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
    onSubmit: form.handleSubmit(onSubmit),
  };
}
