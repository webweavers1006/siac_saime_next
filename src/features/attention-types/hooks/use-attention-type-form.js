"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { attentionTypeSchema } from "../schemas/attention-type.schema";
import { saveAttentionTypeAction } from "../actions/attention-type.write.action";
import { getAttentionTypeFormConfig, getAttentionTypeDefaultValues } from "../config/attention-type.form.config";

export function useAttentionTypeForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(attentionTypeSchema),
    defaultValues: getAttentionTypeDefaultValues(item),
  });

  const formConfig = useMemo(() => getAttentionTypeFormConfig(), []);

  useEffect(() => {
    form.reset(getAttentionTypeDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveAttentionTypeAction(data);

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
