"use client";

import { useCallback, useEffect, useState } from "react";
import { getAttentionTypesForSelectAction } from "@/features/attention-types/actions/attention-type.select.action";
import { getOfficesForSelectAction } from "@/features/offices/actions/offices.select.action";
import { getOfficeCapabilitiesAction } from "@/features/offices/actions/office-capabilities.action";
import { useTicketForm } from "../hooks/use-ticket-form";
import { TICKET_CONFIG } from "../config/ticket.constants";
import { AsyncSelect } from "@/components/shared/form/AsyncSelect";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Ticket, Loader2, Globe, Plane, Mail } from "lucide-react";

export default function TicketGeneratorForm({ onSuccess, isPublic = false, defaultOfficeId = null }) {
  const { form, isPending, onSubmit } = useTicketForm({ onSuccess, isPublic });
  const { LABELS } = TICKET_CONFIG.UI;
  const [officeCapabilities, setOfficeCapabilities] = useState(null);
  const selectedOfficeId = form.watch("officeId");

  useEffect(() => {
    if (defaultOfficeId) {
      form.setValue("officeId", defaultOfficeId);
    }
  }, [defaultOfficeId, form]);

  // Fetch office capabilities when office changes (public mode only)
  useEffect(() => {
    if (!isPublic || !selectedOfficeId) {
      setOfficeCapabilities(null);
      return;
    }
    getOfficeCapabilitiesAction(selectedOfficeId).then(setOfficeCapabilities);
  }, [selectedOfficeId, isPublic]);

  const officeFetcher = useCallback(async (query = "") => {
    try {
      return await getOfficesForSelectAction({
        searchTerm: query,
        enableQrTicket: isPublic ? true : undefined,
      });
    } catch {
      return [];
    }
  }, [isPublic]);

  const attentionTypeFetcher = useCallback(async (query = "") => {
    try {
      return await getAttentionTypesForSelectAction({ searchTerm: query });
    } catch {
      return [];
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Generar Turno</h2>
        </div>

        <FormField
          control={form.control}
          name="officeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{LABELS.FORM.FIELDS.OFFICE}</FormLabel>
              <FormControl>
                <AsyncSelect
                  value={field.value}
                  onChange={(val) => form.setValue("officeId", val, { shouldValidate: true })}
                  fetcher={officeFetcher}
                  placeholder={LABELS.FORM.PLACEHOLDERS.OFFICE}
                  emptyMessage="No se encontraron oficinas."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPublic && officeCapabilities && (
          <div className="flex flex-wrap gap-2 text-xs">
            {officeCapabilities.hasForeignAffairs && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                <Globe className="h-3 w-3" /> Extranjería
              </span>
            )}
            {officeCapabilities.hasMigration && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
                <Plane className="h-3 w-3" /> Migración
              </span>
            )}
            {officeCapabilities.hasEmailChange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                <Mail className="h-3 w-3" /> Cambio de Correo
              </span>
            )}
            {!officeCapabilities.hasForeignAffairs && !officeCapabilities.hasMigration && !officeCapabilities.hasEmailChange && (
              <span className="text-muted-foreground">Atención general</span>
            )}
          </div>
        )}

        {isPublic ? (
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>¿Qué servicio necesita?</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {!selectedOfficeId && (
                      <p className="text-xs text-muted-foreground">Seleccione una oficina primero</p>
                    )}
                    {selectedOfficeId && officeCapabilities?.hasForeignAffairs && (
                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input type="radio" name="serviceType" value="FOREIGN_AFFAIRS"
                          checked={field.value === "FOREIGN_AFFAIRS"}
                          onChange={() => form.setValue("serviceType", "FOREIGN_AFFAIRS")}
                          className="h-4 w-4" />
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span>Extranjería</span>
                      </label>
                    )}
                    {selectedOfficeId && officeCapabilities?.hasMigration && (
                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input type="radio" name="serviceType" value="MIGRATION"
                          checked={field.value === "MIGRATION"}
                          onChange={() => form.setValue("serviceType", "MIGRATION")}
                          className="h-4 w-4" />
                        <Plane className="h-4 w-4 text-green-600" />
                        <span>Migración</span>
                      </label>
                    )}
                    {selectedOfficeId && officeCapabilities?.hasEmailChange && (
                      <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                        <input type="radio" name="serviceType" value="EMAIL_CHANGE"
                          checked={field.value === "EMAIL_CHANGE"}
                          onChange={() => form.setValue("serviceType", "EMAIL_CHANGE")}
                          className="h-4 w-4" />
                        <Mail className="h-4 w-4 text-yellow-600" />
                        <span>Cambio de Correo</span>
                      </label>
                    )}
                    <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <input type="radio" name="serviceType" value="GENERAL"
                        checked={!field.value || field.value === "GENERAL"}
                        onChange={() => form.setValue("serviceType", "GENERAL")}
                        className="h-4 w-4" />
                      <span>Atención General</span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="attentionTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{LABELS.FORM.FIELDS.ATTENTION_TYPE}</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value}
                    onChange={(val) => form.setValue("attentionTypeId", val, { shouldValidate: true })}
                    fetcher={attentionTypeFetcher}
                    placeholder={LABELS.FORM.PLACEHOLDERS.ATTENTION_TYPE}
                    emptyMessage="No se encontraron tipos de atención."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="personIdCard"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{LABELS.FORM.FIELDS.PERSON_ID_CARD}</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder={LABELS.FORM.PLACEHOLDERS.PERSON_ID_CARD} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="personFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{LABELS.FORM.FIELDS.PERSON_FIRST_NAME}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder={LABELS.FORM.PLACEHOLDERS.PERSON_FIRST_NAME} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{LABELS.FORM.FIELDS.PERSON_LAST_NAME}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder={LABELS.FORM.PLACEHOLDERS.PERSON_LAST_NAME} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{LABELS.FORM.FIELDS.NOTES}</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} placeholder={LABELS.FORM.PLACEHOLDERS.NOTES} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? LABELS.FORM.SAVING : LABELS.FORM.SUBMIT}
        </Button>
      </form>
    </Form>
  );
}
