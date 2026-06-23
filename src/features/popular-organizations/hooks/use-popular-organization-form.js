"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { popularOrganizationSchema } from "../schemas/popular-organization.schema";
import { savePopularOrganizationAction } from "../actions/popular-organization.write.action";
import { getPopularOrganizationFormConfig, getPopularOrganizationDefaultValues } from "../config/popular-organization.form.config";

export function usePopularOrganizationForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(popularOrganizationSchema),
    defaultValues: getPopularOrganizationDefaultValues(item),
  });

  const formConfig = useMemo(() => getPopularOrganizationFormConfig(), []);

  useEffect(() => {
    form.reset(getPopularOrganizationDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await savePopularOrganizationAction(data);

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
