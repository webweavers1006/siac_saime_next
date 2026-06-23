"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { beneficiaryTypeSchema } from "../schemas/beneficiary-type.schema";
import { saveBeneficiaryTypeAction } from "../actions/beneficiary-type.write.action";
import { getBeneficiaryTypeFormConfig, getBeneficiaryTypeDefaultValues } from "../config/beneficiary-type.form.config";

export function useBeneficiaryTypeForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(beneficiaryTypeSchema),
    defaultValues: getBeneficiaryTypeDefaultValues(item),
  });

  const formConfig = useMemo(() => getBeneficiaryTypeFormConfig(), []);

  useEffect(() => {
    form.reset(getBeneficiaryTypeDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveBeneficiaryTypeAction(data);

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
