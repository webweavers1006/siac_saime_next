import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/features/auth/lib/auth";
import { getUserPermissions } from "@/features/permissions/services/permission.authorization.service";
import { PermissionsProvider } from "@/features/permissions/components/PermissionsProvider";
import { ThemeProvider } from "@/components/shared/providers/theme-provider";
import { SITE_CONFIG } from "@/features/shared";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
};

export default async function RootLayout({ children }) {
  const session = await getSession();
  const permissions = session ? await getUserPermissions(session.role) : [];

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
    >
      <head />
      <body className="antialiased">
        <ThemeProvider>
          <PermissionsProvider permissions={permissions}>
            {children}
          </PermissionsProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
