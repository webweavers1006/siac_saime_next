import { cn } from "@/features/shared"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginFields } from "./LoginFields"
import { AUTH_CONFIG } from "../config/auth.constants"

/**
 * Contenedor principal del formulario de Login.
 * Provee la tarjeta con encabezado y contenido del formulario.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} [props.className] - Clases CSS adicionales.
 */
export function LoginForm({ className, ...props }) {
  const { CARD } = AUTH_CONFIG.UI.LABELS;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{CARD.TITLE}</CardTitle>
          <CardDescription>{CARD.DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginFields />
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        {AUTH_CONFIG.UI.LABELS.FOOTER.TERMS_TEXT}{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          {AUTH_CONFIG.UI.LABELS.FOOTER.TERMS_LINK}
        </a>{" "}
        y{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          {AUTH_CONFIG.UI.LABELS.FOOTER.PRIVACY_LINK}
        </a>
      </p>
    </div>
  )
}
