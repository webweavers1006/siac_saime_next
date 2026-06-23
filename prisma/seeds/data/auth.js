/**
 * Auth seed constants — Roles, Permissions, and default Admin User.
 * These are shared between seed-auth and seed-cases modules.
 */

const ROLES = [
  { name: 'ADMIN', description: 'Administrador del Sistema con acceso total' },
  { name: 'USER', description: 'Usuario estándar con acceso limitado' },
  { name: 'OPERADOR', description: 'Operador — gestión de personas, casos, seguimientos y documentos' },
]

const PERMISSIONS = [
  // System / Permissions module
  { slug: 'permissions:read', description: 'Ver catálogo de permisos del sistema' },

  // Users module
  { slug: 'users:read', description: 'Ver listado propio de usuarios' },
  { slug: 'users:read_all', description: 'Ver todos los usuarios del sistema' },
  { slug: 'users:create', description: 'Crear nuevos usuarios' },
  { slug: 'users:update', description: 'Editar información de usuarios' },
  { slug: 'users:delete', description: 'Eliminar o desactivar usuarios' },

  // Roles module
  { slug: 'roles:read', description: 'Ver roles propios' },
  { slug: 'roles:read_all', description: 'Ver todos los roles del sistema' },
  { slug: 'roles:create', description: 'Crear nuevos roles' },
  { slug: 'roles:update', description: 'Editar roles existentes' },
  { slug: 'roles:delete', description: 'Eliminar roles del sistema' },

  // Case Statuses module
  { slug: 'case_statuses:read', description: 'Ver estatus de caso' },
  { slug: 'case_statuses:create', description: 'Crear estatus de caso' },
  { slug: 'case_statuses:update', description: 'Editar estatus de caso' },
  { slug: 'case_statuses:delete', description: 'Eliminar estatus de caso' },

  // Call Statuses module
  { slug: 'call_statuses:read', description: 'Ver estatus de llamada' },
  { slug: 'call_statuses:create', description: 'Crear estatus de llamada' },
  { slug: 'call_statuses:update', description: 'Editar estatus de llamada' },
  { slug: 'call_statuses:delete', description: 'Eliminar estatus de llamada' },

  // Countries module
  { slug: 'countries:read', description: 'Ver países' },
  { slug: 'countries:create', description: 'Crear países' },
  { slug: 'countries:update', description: 'Editar países' },
  { slug: 'countries:delete', description: 'Eliminar países' },

  // Attention Channels module
  { slug: 'attention_channels:read', description: 'Ver canales de atención' },
  { slug: 'attention_channels:create', description: 'Crear canales de atención' },
  { slug: 'attention_channels:update', description: 'Editar canales de atención' },
  { slug: 'attention_channels:delete', description: 'Eliminar canales de atención' },

  // Attached Entities module
  { slug: 'attached_entities:read', description: 'Ver entes adscritos' },
  { slug: 'attached_entities:create', description: 'Crear entes adscritos' },
  { slug: 'attached_entities:update', description: 'Editar entes adscritos' },
  { slug: 'attached_entities:delete', description: 'Eliminar entes adscritos' },

  // Popular Organizations module
  { slug: 'popular_organizations:read', description: 'Ver organizaciones de poder popular' },
  { slug: 'popular_organizations:create', description: 'Crear organizaciones de poder popular' },
  { slug: 'popular_organizations:update', description: 'Editar organizaciones de poder popular' },
  { slug: 'popular_organizations:delete', description: 'Eliminar organizaciones de poder popular' },

  // Offices module
  { slug: 'offices:read', description: 'Ver oficinas' },
  { slug: 'offices:create', description: 'Crear oficinas' },
  { slug: 'offices:update', description: 'Editar oficinas' },
  { slug: 'offices:delete', description: 'Eliminar oficinas' },

  // Beneficiary Types module
  { slug: 'beneficiary_types:read', description: 'Ver tipos de beneficiario' },
  { slug: 'beneficiary_types:create', description: 'Crear tipos de beneficiario' },
  { slug: 'beneficiary_types:update', description: 'Editar tipos de beneficiario' },
  { slug: 'beneficiary_types:delete', description: 'Eliminar tipos de beneficiario' },

  // Case Areas module
  { slug: 'case_areas:read', description: 'Ver áreas de caso' },
  { slug: 'case_areas:create', description: 'Crear áreas de caso' },
  { slug: 'case_areas:update', description: 'Editar áreas de caso' },
  { slug: 'case_areas:delete', description: 'Eliminar áreas de caso' },

  // Reasons module
  { slug: 'reasons:read', description: 'Ver motivos' },
  { slug: 'reasons:create', description: 'Crear motivos' },
  { slug: 'reasons:update', description: 'Editar motivos' },
  { slug: 'reasons:delete', description: 'Eliminar motivos' },

  // Attention Types module
  { slug: 'attention_types:read', description: 'Ver tipos de atención' },
  { slug: 'attention_types:create', description: 'Crear tipos de atención' },
  { slug: 'attention_types:update', description: 'Editar tipos de atención' },
  { slug: 'attention_types:delete', description: 'Eliminar tipos de atención' },

  // Attention Type Details module
  { slug: 'attention_type_details:read', description: 'Ver detalles de tipo de atención' },
  { slug: 'attention_type_details:create', description: 'Crear detalles de tipo de atención' },
  { slug: 'attention_type_details:update', description: 'Editar detalles de tipo de atención' },
  { slug: 'attention_type_details:delete', description: 'Eliminar detalles de tipo de atención' },

  // Administrative Directions module
  { slug: 'administrative_directions:read', description: 'Ver direcciones administrativas' },
  { slug: 'administrative_directions:create', description: 'Crear direcciones administrativas' },
  { slug: 'administrative_directions:update', description: 'Editar direcciones administrativas' },
  { slug: 'administrative_directions:delete', description: 'Eliminar direcciones administrativas' },

  // Persons module
  { slug: 'persons:read', description: 'Ver personas' },
  { slug: 'persons:create', description: 'Crear personas' },
  { slug: 'persons:update', description: 'Editar personas' },
  { slug: 'persons:delete', description: 'Eliminar personas' },

  // Cases module
  { slug: 'cases:read', description: 'Ver casos propios y remitidos a su dirección' },
  { slug: 'cases:read_all', description: 'Ver todos los casos del sistema' },
  { slug: 'cases:create', description: 'Crear casos' },
  { slug: 'cases:update', description: 'Editar casos' },
  { slug: 'cases:delete', description: 'Eliminar casos' },

  // Tickets module
  { slug: 'tickets:view', description: 'Ver módulo de turnos' },
  { slug: 'tickets:read', description: 'Ver listado de turnos' },
  { slug: 'tickets:create', description: 'Crear turnos' },
  { slug: 'tickets:update', description: 'Actualizar estado de turnos' },
  { slug: 'tickets:delete', description: 'Eliminar turnos' },
  { slug: 'tickets:call', description: 'Llamar siguiente turno' },

  // Case Documents module
  { slug: 'case_documents:read', description: 'Ver documentos de casos' },
  { slug: 'case_documents:create', description: 'Subir documentos a casos' },
  { slug: 'case_documents:update', description: 'Editar documentos de casos' },
  { slug: 'case_documents:delete', description: 'Eliminar documentos de casos' },

  // Case Follow-ups module
  { slug: 'case_follow_ups:read', description: 'Ver seguimientos de casos' },
  { slug: 'case_follow_ups:create', description: 'Registrar seguimientos' },
  { slug: 'case_follow_ups:update', description: 'Editar seguimientos' },
  { slug: 'case_follow_ups:delete', description: 'Eliminar seguimientos' },

  // Case Forwards module
  { slug: 'case_forwards:read', description: 'Ver remisiones de su dirección' },
  { slug: 'case_forwards:read_all', description: 'Ver todas las remisiones del sistema' },
  { slug: 'case_forwards:create', description: 'Registrar remisiones' },
  { slug: 'case_forwards:update', description: 'Editar remisiones' },
  { slug: 'case_forwards:delete', description: 'Eliminar remisiones' },

  // Audit Logs module
  { slug: 'audit_logs:read', description: 'Ver registros de auditoría' },
  { slug: 'audit_logs:view', description: 'Ver el módulo de Auditoría en el menú' },

  // Sent Emails module
  { slug: 'sent_emails:read', description: 'Ver registros de correos enviados' },
  { slug: 'sent_emails:view', description: 'Ver el módulo de Correos Enviados en el menú' },

  // Case Coordinates module
  { slug: 'case_coordinates:read', description: 'Ver coordenadas de casos' },
  { slug: 'case_coordinates:create', description: 'Registrar coordenadas de casos' },
  { slug: 'case_coordinates:update', description: 'Editar coordenadas de casos' },
  { slug: 'case_coordinates:delete', description: 'Eliminar coordenadas de casos' },

  // ── View permissions (module visibility — sidebar + page access) ──
  { slug: 'users:view', description: 'Ver el módulo de Usuarios en el menú' },
  { slug: 'roles:view', description: 'Ver el módulo de Roles y Permisos en el menú' },
  { slug: 'cases:view', description: 'Ver el módulo de Casos en el menú' },
  { slug: 'persons:view', description: 'Ver el módulo de Personas en el menú' },
  { slug: 'case_statuses:view', description: 'Ver el módulo de Estatus de Caso en el menú' },
  { slug: 'call_statuses:view', description: 'Ver el módulo de Estatus de Llamada en el menú' },
  { slug: 'countries:view', description: 'Ver el módulo de Países en el menú' },
  { slug: 'attention_channels:view', description: 'Ver el módulo de Canales de Atención en el menú' },
  { slug: 'attached_entities:view', description: 'Ver el módulo de Entes Adscritos en el menú' },
  { slug: 'popular_organizations:view', description: 'Ver el módulo de Organizaciones Populares en el menú' },
  { slug: 'offices:view', description: 'Ver el módulo de Oficinas en el menú' },
  { slug: 'beneficiary_types:view', description: 'Ver el módulo de Tipos de Beneficiario en el menú' },
  { slug: 'case_areas:view', description: 'Ver el módulo de Áreas de Caso en el menú' },
  { slug: 'reasons:view', description: 'Ver el módulo de Motivos en el menú' },
  { slug: 'attention_types:view', description: 'Ver el módulo de Tipos de Atención en el menú' },
  { slug: 'attention_type_details:view', description: 'Ver el módulo de Detalles de Atención en el menú' },
  { slug: 'administrative_directions:view', description: 'Ver el módulo de Direcciones Administrativas en el menú' },
  { slug: 'case_coordinates:view', description: 'Ver el módulo de Mapa de Casos en el menú' },

  // Case Sheets module (planilla PDF generation)
  { slug: 'case_sheets:generate', description: 'Generar planillas PDF de casos' },
]

const ADMIN_USER = {
  firstName: 'Admin',
  lastName: 'Principal',
  email: 'admin@admin.starter',
  idCard: '000000000',
  password: 'admin123',
  administrativeDirectionId: 1, // OFICINA DE ATENCIÓN AL CIUDADANO
  attentionChannelId: 1,        // Oficina Presencial (SAIME)
}

module.exports = { ROLES, PERMISSIONS, ADMIN_USER }
