import {
  Users,
  Settings,
  UserLock,
  LayoutDashboard,
} from "lucide-react"
import { USER_CONFIG } from "@/features/users/config/user.constants"
import { ROLE_CONFIG } from "@/features/roles/config/role.constants"
import { AUTH_CONFIG } from "@/features/auth/config/auth.constants"

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG — Single source of truth for routes + sidebar
// ═══════════════════════════════════════════════════════════════════════════
//
// To add a new module:
//   1. Add its route in ROUTES.ADMIN below
//   2. Add its nav item in SIDEBAR_CONFIG.NAV.items below
//   3. Create the page at src/app/(root)/admin/[feature]/page.jsx
//
// ═══════════════════════════════════════════════════════════════════════════

// ── Routes (paths, permissions, titles) ──────────────────────────────────

export const ROUTES = {
  // Public Routes
  AUTH: {
    LOGIN: { path: AUTH_CONFIG.PATH.LOGIN },
  },

  // Main Dashboard
  DASHBOARD: { path: AUTH_CONFIG.PATH.DASHBOARD },

  // Admin Modules — add new modules here
  ADMIN: {
    USUARIOS: {
      path: USER_CONFIG.PATH,
      permission: USER_CONFIG.PERMISSIONS.READ,
      title: USER_CONFIG.TITLE,
    },
    ROLES: {
      path: ROLE_CONFIG.PATH,
      permission: ROLE_CONFIG.PERMISSIONS.READ,
      title: ROLE_CONFIG.TITLE,
    },
  },
}

// ── Sidebar (UI labels + nav structure) ──────────────────────────────────

export const SIDEBAR_CONFIG = {
  UI: {
    LABELS: {
      GROUP_TITLE: "Plataforma",
      THEME_MODE: "Modo de Luz",
      THEME_SYSTEM: "Sistema",
      THEME_LIGHT: "Claro",
      THEME_DARK: "Oscuro",
      VISUAL_THEME: "Tema Visual",
      EFFECTS: "Efectos Especiales",
      LOGOUT: "Cerrar Sesión",
    },
  },
  NAV: {
    items: [
      {
        title: "Dashboard",
        url: ROUTES.DASHBOARD.path,
        icon: LayoutDashboard,
      },
      {
        title: "Administración",
        url: "#",
        icon: Settings,
        isActive: true,
        items: [
          {
            title: ROUTES.ADMIN.USUARIOS.title,
            url: ROUTES.ADMIN.USUARIOS.path,
            permission: ROUTES.ADMIN.USUARIOS.permission,
            icon: Users,
          },
          {
            title: ROUTES.ADMIN.ROLES.title,
            url: ROUTES.ADMIN.ROLES.path,
            permission: ROUTES.ADMIN.ROLES.permission,
            icon: UserLock,
          },
          // Add new modules here following the same structure
        ],
      },
    ],
  },
}
