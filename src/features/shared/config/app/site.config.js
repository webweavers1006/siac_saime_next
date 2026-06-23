/**
 * Global site metadata and branding configuration.
 * Consumed by layout.jsx for Next.js metadata and by shared components.
 */
export const SITE_CONFIG = {
  name: "SAIME",
  shortName: "SIAC",
  tagline: "Sistema de atencion al ciudadano",
  logo: "/img/saime_logo.png",
  title: "SAIME - Sistema de Atención al Ciudadano",
  description:
    "Sistema de atención al ciudadano con autenticación, usuarios, roles y permisos.",
  keywords: [
    "admin",
    "panel",
    "gestión",
    "usuarios",
    "roles",
  ],
  openGraph: {
    title: "SAIME - Sistema de Atención al Ciudadano",
    description:
      "Sistema de atención al ciudadano con autenticación, usuarios, roles y permisos.",
    type: "website",
  },
  toaster: {
    position: "bottom-right",
    fontSize: "0.875rem",
  },
};
