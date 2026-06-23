"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { callStatusSchema } from "../schemas/call-status.schema";
import { saveCallStatusAction } from "../actions/call-status.write.action";
import { getCallStatusFormConfig, getCallStatusDefaultValues } from "../config/call-status.form.config";

export function useCallStatusForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(callStatusSchema),
    defaultValues: getCallStatusDefaultValues(item),
  });

  const formConfig = useMemo(() => getCallStatusFormConfig(), []);

  useEffect(() => {
    form.reset(getCallStatusDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveCallStatusAction(data);

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
