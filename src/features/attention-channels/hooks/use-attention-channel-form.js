"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { attentionChannelSchema } from "../schemas/attention-channel.schema";
import { saveAttentionChannelAction } from "../actions/attention-channel.write.action";
import { getAttentionChannelFormConfig, getAttentionChannelDefaultValues } from "../config/attention-channel.form.config";

export function useAttentionChannelForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(attentionChannelSchema),
    defaultValues: getAttentionChannelDefaultValues(item),
  });

  const formConfig = useMemo(() => getAttentionChannelFormConfig(), []);

  useEffect(() => {
    form.reset(getAttentionChannelDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveAttentionChannelAction(data);

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
