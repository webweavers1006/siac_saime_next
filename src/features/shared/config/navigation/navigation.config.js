import {
  Users,
  Settings,
  UserLock,
  LayoutDashboard,
  Flag,
  Globe,
  PhoneCall,
  MessageCircle,
  Building2,
  Building,
  UserCheck,
  FolderTree,
  ListTree,
  Tags,
  Tag,
  MapPin,
  Map,
  Contact,
  Briefcase,
  CalendarSync,
  ClipboardList,
  Mail,
  TicketPercent,
} from "lucide-react"
import { USER_CONFIG } from "@/features/users/config/user.constants"
import { ROLE_CONFIG } from "@/features/roles/config/role.constants"
import { AUTH_CONFIG } from "@/features/auth/config/auth.constants"
import { CASE_STATUS_CONFIG } from "@/features/case-statuses/config/case-status.constants"
import { CALL_STATUS_CONFIG } from "@/features/call-statuses/config/call-status.constants"
import { ATTENTION_CHANNEL_CONFIG } from "@/features/attention-channels/config/attention-channel.constants"
import { ATTACHED_ENTITY_CONFIG } from "@/features/attached-entities/config/attached-entity.constants"
import { BENEFICIARY_TYPE_CONFIG } from "@/features/beneficiary-types/config/beneficiary-type.constants"
import { POPULAR_ORGANIZATION_CONFIG } from "@/features/popular-organizations/config/popular-organization.constants"
import { OFFICE_CONFIG } from "@/features/offices/config/offices.constants"
import { CASE_AREA_CONFIG } from "@/features/case-areas/config/case-area.constants"
import { ATTENTION_TYPE_CONFIG } from "@/features/attention-types/config/attention-type.constants"
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "@/features/administrative-directions/config/administrative-direction.constants"
import { COUNTRY_CONFIG } from "@/features/countries/config/country.constants"
import { ATTENTION_TYPE_DETAIL_CONFIG } from "@/features/attention-type-details/config/attention-type-detail.constants"
import { REASON_CONFIG } from "@/features/reasons/config/reason.constants"
import { CASE_CONFIG } from '@/features/cases/config/case.constants'
import { PERSON_CONFIG } from "@/features/persons/config/person.constants"
import { AUDIT_LOG_CONFIG } from "@/features/audit-logs/config/audit-log.constants"
import { SENT_EMAIL_CONFIG } from "@/features/sent-emails/config/sent-email.constants"
import { CASE_COORDINATE_CONFIG } from "@/features/case-coordinates/config/case-coordinate.constants"
import { TICKET_CONFIG } from "@/features/tickets/config/ticket.constants"

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION CONFIG — Single source of truth for routes + sidebar
// ═══════════════════════════════════════════════════════════════════════════
//
// To add a new module:
//   1. Add its route in the appropriate ROUTES section below
//      (PROCESSES for case/person modules, ADMIN for user/role management,
//       CATALOGS for reference data)
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

  // Process Modules — cases and related entities
  PROCESSES: {
    CASES: {
      path: CASE_CONFIG.PATH,
      permission: CASE_CONFIG.PERMISSIONS.VIEW,
      title: CASE_CONFIG.TITLE,
    },
    PERSONS: {
      path: PERSON_CONFIG.PATH,
      permission: PERSON_CONFIG.PERMISSIONS.VIEW,
      title: PERSON_CONFIG.TITLE,
    },
    TICKETS: {
      path: TICKET_CONFIG.PATH,
      permission: TICKET_CONFIG.PERMISSIONS.VIEW,
      title: TICKET_CONFIG.TITLE,
    },
  },

  // Admin Modules — user and role management
  ADMIN: {
    USERS: {
      path: USER_CONFIG.PATH,
      permission: USER_CONFIG.PERMISSIONS.VIEW,
      title: USER_CONFIG.TITLE,
    },
    ROLES: {
      path: ROLE_CONFIG.PATH,
      permission: ROLE_CONFIG.PERMISSIONS.VIEW,
      title: ROLE_CONFIG.TITLE,
    },
  },

  // Audit
  AUDIT: {
    path: AUDIT_LOG_CONFIG.PATH,
    permission: AUDIT_LOG_CONFIG.PERMISSIONS.VIEW,
    title: AUDIT_LOG_CONFIG.TITLE,
  },

  // Sent Emails
  SENT_EMAILS: {
    path: SENT_EMAIL_CONFIG.PATH,
    permission: SENT_EMAIL_CONFIG.PERMISSIONS.VIEW,
    title: SENT_EMAIL_CONFIG.TITLE,
  },

  // Case Map
  MAP: {
    path: CASE_COORDINATE_CONFIG.PATH,
    permission: CASE_COORDINATE_CONFIG.PERMISSIONS.VIEW,
    title: CASE_COORDINATE_CONFIG.TITLE,
  },

  // Catalog Modules — reference data
  CATALOGS: {
    CASE_STATUSES: {
      path: CASE_STATUS_CONFIG.PATH,
      permission: CASE_STATUS_CONFIG.PERMISSIONS.VIEW,
      title: CASE_STATUS_CONFIG.TITLE,
    },
    CALL_STATUSES: {
      path: CALL_STATUS_CONFIG.PATH,
      permission: CALL_STATUS_CONFIG.PERMISSIONS.VIEW,
      title: CALL_STATUS_CONFIG.TITLE,
    },
    COUNTRIES: {
      path: COUNTRY_CONFIG.PATH,
      permission: COUNTRY_CONFIG.PERMISSIONS.VIEW,
      title: COUNTRY_CONFIG.TITLE,
    },
    ATTENTION_CHANNELS: {
      path: ATTENTION_CHANNEL_CONFIG.PATH,
      permission: ATTENTION_CHANNEL_CONFIG.PERMISSIONS.VIEW,
      title: ATTENTION_CHANNEL_CONFIG.TITLE,
    },
    ATTACHED_ENTITIES: {
      path: ATTACHED_ENTITY_CONFIG.PATH,
      permission: ATTACHED_ENTITY_CONFIG.PERMISSIONS.VIEW,
      title: ATTACHED_ENTITY_CONFIG.TITLE,
    },
    POPULAR_ORGANIZATIONS: {
      path: POPULAR_ORGANIZATION_CONFIG.PATH,
      permission: POPULAR_ORGANIZATION_CONFIG.PERMISSIONS.VIEW,
      title: POPULAR_ORGANIZATION_CONFIG.TITLE,
    },
    OFFICES: {
      path: OFFICE_CONFIG.PATH,
      permission: OFFICE_CONFIG.PERMISSIONS.VIEW,
      title: OFFICE_CONFIG.TITLE,
    },
    BENEFICIARY_TYPES: {
      path: BENEFICIARY_TYPE_CONFIG.PATH,
      permission: BENEFICIARY_TYPE_CONFIG.PERMISSIONS.VIEW,
      title: BENEFICIARY_TYPE_CONFIG.TITLE,
    },
    CASE_AREAS: {
      path: CASE_AREA_CONFIG.PATH,
      permission: CASE_AREA_CONFIG.PERMISSIONS.VIEW,
      title: CASE_AREA_CONFIG.TITLE,
    },
    REASONS: {
      path: REASON_CONFIG.PATH,
      permission: REASON_CONFIG.PERMISSIONS.VIEW,
      title: REASON_CONFIG.TITLE,
    },
    ATTENTION_TYPES: {
      path: ATTENTION_TYPE_CONFIG.PATH,
      permission: ATTENTION_TYPE_CONFIG.PERMISSIONS.VIEW,
      title: ATTENTION_TYPE_CONFIG.TITLE,
    },
    ATTENTION_TYPE_DETAILS: {
      path: ATTENTION_TYPE_DETAIL_CONFIG.PATH,
      permission: ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS.VIEW,
      title: ATTENTION_TYPE_DETAIL_CONFIG.TITLE,
    },
    ADMINISTRATIVE_DIRECTIONS: {
      path: ADMINISTRATIVE_DIRECTION_CONFIG.PATH,
      permission: ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.VIEW,
      title: ADMINISTRATIVE_DIRECTION_CONFIG.TITLE,
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
        title: "Procesos y Casos",
        url: ROUTES.DASHBOARD.path,
        icon: CalendarSync,
        isActive: true,
        items: [
          {
            title: ROUTES.PROCESSES.CASES.title,
            url: ROUTES.PROCESSES.CASES.path,
            permission: ROUTES.PROCESSES.CASES.permission,
            icon: Briefcase,
          },
          {
            title: ROUTES.PROCESSES.PERSONS.title,
            url: ROUTES.PROCESSES.PERSONS.path,
            permission: ROUTES.PROCESSES.PERSONS.permission,
            icon: Contact,
          },
          {
            title: ROUTES.PROCESSES.TICKETS.title,
            url: ROUTES.PROCESSES.TICKETS.path,
            permission: ROUTES.PROCESSES.TICKETS.permission,
            icon: TicketPercent,
          },
          {
            title: ROUTES.MAP.title,
            url: ROUTES.MAP.path,
            permission: ROUTES.MAP.permission,
            icon: Map,
          }
        ],
      },
      {
        title: "Administrador",
        url: "#",
        icon: Settings,
        isActive: true,
        items: [
          {
            title: ROUTES.ADMIN.USERS.title,
            url: ROUTES.ADMIN.USERS.path,
            permission: ROUTES.ADMIN.USERS.permission,
            icon: Users,
          },
          {
            title: ROUTES.ADMIN.ROLES.title,
            url: ROUTES.ADMIN.ROLES.path,
            permission: ROUTES.ADMIN.ROLES.permission,
            icon: UserLock,
          },
          {
            title: ROUTES.AUDIT.title,
            url: ROUTES.AUDIT.path,
            permission: ROUTES.AUDIT.permission,
            icon: ClipboardList,
          },
          {
            title: ROUTES.SENT_EMAILS.title,
            url: ROUTES.SENT_EMAILS.path,
            permission: ROUTES.SENT_EMAILS.permission,
            icon: Mail,
          },
        ],
      },
      {
        title: "Catálogos",
        url: "#",
        icon: FolderTree,
        isActive: true,
        items: [
          {
            title: ROUTES.CATALOGS.CASE_STATUSES.title,
            url: ROUTES.CATALOGS.CASE_STATUSES.path,
            permission: ROUTES.CATALOGS.CASE_STATUSES.permission,
            icon: Flag,
          },
          {
            title: ROUTES.CATALOGS.CALL_STATUSES.title,
            url: ROUTES.CATALOGS.CALL_STATUSES.path,
            permission: ROUTES.CATALOGS.CALL_STATUSES.permission,
            icon: PhoneCall,
          },
          {
            title: ROUTES.CATALOGS.COUNTRIES.title,
            url: ROUTES.CATALOGS.COUNTRIES.path,
            permission: ROUTES.CATALOGS.COUNTRIES.permission,
            icon: Globe,
          },
          {
            title: ROUTES.CATALOGS.ATTENTION_CHANNELS.title,
            url: ROUTES.CATALOGS.ATTENTION_CHANNELS.path,
            permission: ROUTES.CATALOGS.ATTENTION_CHANNELS.permission,
            icon: MessageCircle,
          },
          {
            title: ROUTES.CATALOGS.ATTACHED_ENTITIES.title,
            url: ROUTES.CATALOGS.ATTACHED_ENTITIES.path,
            permission: ROUTES.CATALOGS.ATTACHED_ENTITIES.permission,
            icon: Building2,
          },
          {
            title: ROUTES.CATALOGS.POPULAR_ORGANIZATIONS.title,
            url: ROUTES.CATALOGS.POPULAR_ORGANIZATIONS.path,
            permission: ROUTES.CATALOGS.POPULAR_ORGANIZATIONS.permission,
            icon: Users,
          },
          {
            title: ROUTES.CATALOGS.OFFICES.title,
            url: ROUTES.CATALOGS.OFFICES.path,
            permission: ROUTES.CATALOGS.OFFICES.permission,
            icon: Building,
          },
          {
            title: ROUTES.CATALOGS.BENEFICIARY_TYPES.title,
            url: ROUTES.CATALOGS.BENEFICIARY_TYPES.path,
            permission: ROUTES.CATALOGS.BENEFICIARY_TYPES.permission,
            icon: UserCheck,
          },
          {
            title: ROUTES.CATALOGS.CASE_AREAS.title,
            url: ROUTES.CATALOGS.CASE_AREAS.path,
            permission: ROUTES.CATALOGS.CASE_AREAS.permission,
            icon: FolderTree,
          },
          {
            title: ROUTES.CATALOGS.REASONS.title,
            url: ROUTES.CATALOGS.REASONS.path,
            permission: ROUTES.CATALOGS.REASONS.permission,
            icon: Tag,
          },
          {
            title: ROUTES.CATALOGS.ATTENTION_TYPES.title,
            url: ROUTES.CATALOGS.ATTENTION_TYPES.path,
            permission: ROUTES.CATALOGS.ATTENTION_TYPES.permission,
            icon: Tags,
          },
          {
            title: ROUTES.CATALOGS.ATTENTION_TYPE_DETAILS.title,
            url: ROUTES.CATALOGS.ATTENTION_TYPE_DETAILS.path,
            permission: ROUTES.CATALOGS.ATTENTION_TYPE_DETAILS.permission,
            icon: ListTree,
          },
          {
            title: ROUTES.CATALOGS.ADMINISTRATIVE_DIRECTIONS.title,
            url: ROUTES.CATALOGS.ADMINISTRATIVE_DIRECTIONS.path,
            permission: ROUTES.CATALOGS.ADMINISTRATIVE_DIRECTIONS.permission,
            icon: MapPin,
          },
        ],
      },
    ],
  },
}
