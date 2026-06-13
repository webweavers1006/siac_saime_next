'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CustomFormField } from '@/components/shared/form/CustomFormField'
import { Loader2 } from 'lucide-react'
import { cn } from '@/features/shared/lib/shared-utils'
import { loginFormConfig } from '../config/auth.form.config'
import { useAuthLogin } from '../hooks/use-auth-login'
import { AUTH_CONFIG } from '../config/auth.constants'

/**
 * Componente que maneja la vista del formulario de login.
 * Usa useAuthLogin hook para toda la lógica (A-S-R-M compliance).
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.className] - Clases adicionales de estilo.
 */
export function LoginFields({ className }) {
  const { form, isSubmitting, serverError, onSubmit } = useAuthLogin();
  const { SEPARATOR, FORM } = AUTH_CONFIG.UI.LABELS;
  const formConfig = loginFormConfig;

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          {/* Separator */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">
              {SEPARATOR}
            </span>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {formConfig.map((field) => (
              <CustomFormField
                key={field.name}
                control={form.control}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
              />
            ))}
          </div>

          {serverError && (
            <div className="text-sm text-destructive font-medium text-center">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {FORM.SUBMIT}
          </Button>
        </form>
      </Form>
    </div>
  )
}
