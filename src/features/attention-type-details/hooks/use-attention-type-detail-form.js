"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { attentionTypeDetailSchema } from "../schemas/attention-type-detail.schema";
import { saveAttentionTypeDetailAction } from "../actions/attention-type-detail.write.action";
import { getAttentionTypeDetailFormConfig, getAttentionTypeDetailDefaultValues } from "../config/attention-type-detail.form.config";

export function useAttentionTypeDetailForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(attentionTypeDetailSchema),
    defaultValues: getAttentionTypeDetailDefaultValues(item),
  });

  const formConfig = useMemo(() => getAttentionTypeDetailFormConfig(), []);

  useEffect(() => {
    form.reset(getAttentionTypeDetailDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveAttentionTypeDetailAction(data);

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
