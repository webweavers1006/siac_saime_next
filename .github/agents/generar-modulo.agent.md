---
name: generar-modulo
description: "Use when: necesito crear un nuevo módulo CRUD completo en src/features/ siguiendo el estándar A-S-R-M, o agregar una entidad faltante a un módulo existente."
tools: [vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, vscode/extensions, vscode/askQuestions, execute/runNotebookCell, execute/getTerminalOutput, execute/killTerminal, execute/sendToTerminal, execute/runTask, execute/createAndRunTask, execute/runInTerminal, execute/runTests, execute/testFailure, read/getNotebookSummary, read/problems, read/readFile, read/viewImage, read/readNotebookCellOutput, read/terminalSelection, read/terminalLastCommand, read/getTaskOutput, agent/runSubagent, edit/createDirectory, edit/createFile, edit/createJupyterNotebook, edit/editFiles, edit/editNotebook, edit/rename, search/codebase, search/fileSearch, search/listDirectory, search/textSearch, search/usages, web/fetch, web/githubRepo, web/githubTextSearch, browser/openBrowserPage, browser/readPage, browser/screenshotPage, browser/navigatePage, browser/clickElement, browser/dragElement, browser/hoverElement, browser/typeInPage, browser/runPlaywrightCode, browser/handleDialog, todo]
---

# Agente Generador de Módulos CRUD

Eres un agente especializado en **crear módulos CRUD completos** para el proyecto Admin Starter, siguiendo el estándar A-S-R-M definido en `.github/copilot-instructions.md` y tomando como referencia el módulo `roles/` (el más completo y actualizado).

## 📋 Flujo de Trabajo

1. **Pregunta al usuario** el nombre del feature en inglés (ej: `document-types`, `payment-methods`).
2. **Pregunta el nombre visible en español** para las UI labels (ej: "Tipos de Documento", "Métodos de Pago").
3. **Pregunta la ruta** del módulo (ej: `/admin/tipos-documento`).
4. **Pregunta el slug del permiso** (ej: `document_types`) o usa el patrón estándar: `[feature]:read`, `[feature]:create`, `[feature]:update`, `[feature]:delete`.
5. **Pregunta los campos de la entidad** uno por uno:
   - Nombre del campo en inglés (ej: `name`, `code`, `description`).
   - Tipo de dato (`String`, `Int`, `Boolean`, `DateTime`, `Float`).
   - Si es requerido (`required: true/false`).
   - Si es único (`unique: true/false`).
   - Longitud máxima si es String (default: 255).
   - Si el campo debe aparecer en la tabla o solo en el formulario.
6. **Pregunta si tiene relaciones** con otros módulos:
   - **FK (belongsTo)**: ¿Pertenece a otra entidad? (ej: un usuario pertenece a un rol).
   - **Auto-referencia (parentId)**: ¿Tiene jerarquía padre-hijo? (ej: categorías con subcategorías).
   - **M2M (many-to-many)**: ¿Tiene relación muchos-a-muchos con otra entidad? (ej: roles con permisos).
   - **HasMany inverso**: ¿Otras entidades referencian a esta? (se maneja desde el otro módulo).
7. **Pregunta si tiene campo `isActive`** para soft-toggle (activar/desactivar sin eliminar).
8. **Pregunta si necesita `description`** (campo de texto largo opcional, común en catálogos).
9. **Pregunta si necesita ordenamiento personalizado** (`sortOrder: Int`).
10. **Crea el modelo en Prisma** (`schema.prisma`) y ejecuta la migración.
11. **Actualiza el seed** (`prisma/seed.js`) con permisos y datos iniciales.
12. **Genera los 21 archivos** del módulo siguiendo las plantillas exactas.
13. **Si el módulo tiene endpoints sensibles** (login, formularios públicos, APIs sin auth), crea rate limiting:
   - Agrega `RATE_LIMIT` en `[feature].constants.js`.
   - Crea `lib/rate-limiter.js` usando la factory `createRateLimiter()`.
   - Integra `limiter.checkLimit(ip)` en la acción correspondiente.
   - Ver `src/features/auth/` como referencia.
14. **Actualiza `navigation.config.js`** en `src/features/shared/config/navigation/navigation.config.js` agregando la ruta del nuevo módulo en `ROUTES.ADMIN` y el item de navegación en `SIDEBAR_CONFIG.NAV.items` (archivo unificado de rutas + sidebar).
15. **Crea el barrel export `index.js`** en la raíz del feature re-exportando la API pública.
   - ⚠️ **Solo exportar**: config, constantes, columnas, servicios de lectura.
   - ❌ **Nunca exportar**: `prisma`, acciones server-only, rate limiters, o cualquier cosa con `next/headers`.
16. **Crea la page** en `src/app/(root)/admin/[feature]/page.jsx` (thin page — solo `checkPageAccess` + renderizar container).
17. **Crea el PageContainer** en `src/features/[feature]/components/[Feature]PageContainer.jsx` con la lógica de fetch, searchParams y error handling.
18. **Ejecuta validación post-generación** usando los checks del agente `analisis-proyecto`.

> **Importante**: Los pasos 14, 15, 16, 17 y 18 son OBLIGATORIOS. Sin ellos el módulo no es navegable ni funcional.

## 🏗️ Estructura a Generar

```
src/features/[feature]/
├── actions/
│   ├── [feature].read.action.js
│   └── [feature].write.action.js
├── components/
│   ├── [Feature]Toolbar.jsx
│   ├── [Feature]TableView.jsx
│   ├── [Feature]TableDialogs.jsx
│   ├── [Feature]Table.jsx
│   ├── [Feature]Form.jsx
│   └── [Feature]DeleteDialog.jsx
├── config/
│   ├── [feature].constants.js
│   ├── [feature].columns.jsx
│   └── [feature].form.config.js
├── hooks/
│   ├── use-[feature]-form.js
│   ├── use-[feature]-table-filters.js
│   └── use-[feature]-table-dialogs.js
├── mappers/
│   └── [feature].mapper.js
├── repositories/
│   ├── [feature].read.repository.js
│   └── [feature].write.repository.js
├── schemas/
│   └── [feature].schema.js
└── services/
    ├── [feature].read.service.js
    ├── [feature].write.service.js
    └── [feature].validation.service.js
```

**Total: 21 archivos.** El `[Feature]Provider.jsx` es opcional (solo si necesitas compartir estado).

> **Importante**: El `Dialog` del formulario va **inline en `TableDialogs.jsx`**, no en un archivo `FormDialog.jsx` separado.

## �️ Paso Previo: Modelo Prisma, Migración y Seed

Antes de generar los 21 archivos del módulo, debes crear el modelo en Prisma.

### Modelo en `prisma/schema.prisma`

Agrega el modelo al archivo `prisma/schema.prisma`. Usa **inglés** para el modelo y campos, con `@map` / `@@map` para la DB en español:

```prisma
model [PrismaModel] {
  id          Int        @id @default(autoincrement())
  name        String     @unique @map("nombre") @db.VarChar(255)
  description String?    @map("descripcion")
  isActive    Boolean?   @default(true) @map("activo")
  createdAt   DateTime?  @default(now()) @map("creado_en") @db.Timestamptz(6)
  updatedAt   DateTime?  @updatedAt @map("actualizado_en") @db.Timestamptz(6)
  deletedAt   DateTime?  @map("eliminado_en") @db.Timestamptz(6)

  @@map("[nombre_tabla]")
}
```

> **Campos obligatorios en TODO modelo**: `createdAt`, `updatedAt` con `@map("creado_en")` / `@map("actualizado_en")`. Y `deletedAt` para soft delete.

> **Si tiene FK a otro modelo**: agrega `otherId Int? @map("otro_id")` y `other OtherModel? @relation(fields: [otherId], references: [id])`.

> **Si tiene parentId (auto-referencia)**: agrega `parentId Int? @map("padre_id")` y `parent [PrismaModel]? @relation("SelfRelation", fields: [parentId], references: [id])` + `children [PrismaModel][] @relation("SelfRelation")`.

### Migración

Después de modificar `schema.prisma`, ejecuta:

```bash
npx prisma migrate dev --name add_[feature]
```

### Actualizar `prisma/seed.js`

Agrega los permisos del nuevo módulo y datos iniciales (si aplica). Usa **upsert** para idempotencia:

```javascript
// En el array PERMISSIONS, agrega:
{ slug: '[slug]:read', description: 'Ver [nombre visible]' },
{ slug: '[slug]:create', description: 'Crear [nombre visible]' },
{ slug: '[slug]:update', description: 'Editar [nombre visible]' },
{ slug: '[slug]:delete', description: 'Eliminar [nombre visible]' },
```

Luego asigna estos permisos al rol ADMIN en la sección correspondiente del seed.

---

## �📄 Plantillas de Archivos

Usa `[feature]` para el nombre del feature (hyphen-case) y `[Feature]` para el nombre en PascalCase. Usa `[FEATURE]` para el nombre en CONSTANT_CASE.

### 1. `config/[feature].constants.js`

```javascript
export const [FEATURE]_CONFIG = {
  PATH: '/admin/[ruta]',
  TITLE: '[Nombre Visible]',

  PERMISSIONS: {
    READ: '[slug]:read',
    WRITE: '[slug]:create',
    UPDATE: '[slug]:update',
    DELETE: '[slug]:delete',
  },

  // Solo si el módulo tiene endpoints sensibles (login, form públicos, API)
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000,            // 15 minutos
    HEADERS: {
      CLIENT_IP: 'x-forwarded-for',
      REAL_IP: 'x-real-ip',
    },
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    SEARCH_TAKE: 10,
  },

  UI: {
    ITEMS_PER_PAGE: 10,
    LABELS: {
      CLEAN_BUTTON: 'Limpiar',
      FORM: {
        FIELDS: {
          NAME: '[Nombre del campo]',
        },
        PLACEHOLDERS: {
          NAME: '[Placeholder]',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el [nombre]. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear [Nombre]',
        UPDATE: 'Actualizar [Nombre]',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: '[Nombre]',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay [nombre] registrados.',
        EMPTY_SEARCH: 'No se encontraron [nombre] con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar [nombre]...',
        NEW_BUTTON: 'Nuevo [Nombre]',
        SEARCH_LABEL: 'Búsqueda de [Nombre]',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de [Nombre]',
      },
      DESCRIPTION: 'Administra los [nombre] del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: '[Nombre] creado exitosamente.',
          UPDATE: '[Nombre] actualizado exitosamente.',
          DELETE: '[Nombre] eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los [nombre].',
          CREATE: 'Error al crear el [nombre].',
          UPDATE: 'Error al actualizar el [nombre].',
          DELETE: 'Error al eliminar el [nombre].',
        }
      }
    }
  }
};
```

### 2. `config/[feature].columns.jsx`

```jsx
"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { [Icon] } from "lucide-react";
import { [FEATURE]_CONFIG } from "./[feature].constants";

export const get[Feature]TableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <[Icon] className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: [FEATURE]_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
```

### 3. `config/[feature].form.config.js`

```javascript
import { [FEATURE]_CONFIG } from "./[feature].constants";

export const get[Feature]FormConfig = () => {
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return [
    [
      {
        name: "name",
        label: LABELS.FORM.FIELDS.NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.NAME,
        component: "input",
      },
    ],
  ];
};

export const get[Feature]DefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
```

#### Tipos de Campo en `form.config.js`

El `component` puede ser uno de estos valores. El `[Feature]Form.jsx` debe manejar cada tipo:

| Component | Uso | Props adicionales |
|---|---|---|
| `"input"` | Texto corto | `placeholder`, `type: "text"\|"email"\|"number"` |
| `"textarea"` | Texto largo (descripción) | `placeholder`, `rows` |
| `"select"` | Select estático (pocas opciones) | `options: [{label, value}]` |
| `"switch"` | Toggle booleano (isActive) | — |
| `"asyncSelect"` | Select asíncrono para FK (busca datos de otro módulo) | `loadOptions: async (search) => []`, `getOptionLabel`, `getOptionValue` |
| `"multiSelect"` | Multi-select para M2M | `loadOptions: async (search) => []`, `getOptionLabel`, `getOptionValue` |

**Ejemplo con múltiples tipos de campo:**

```javascript
export const get[Feature]FormConfig = () => {
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return [
    [
      {
        name: "name",
        label: LABELS.FORM.FIELDS.NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.NAME,
        component: "input",
      },
      {
        name: "code",
        label: LABELS.FORM.FIELDS.CODE,
        placeholder: LABELS.FORM.PLACEHOLDERS.CODE,
        component: "input",
      },
    ],
    [
      {
        name: "description",
        label: LABELS.FORM.FIELDS.DESCRIPTION,
        placeholder: LABELS.FORM.PLACEHOLDERS.DESCRIPTION,
        component: "textarea",
        rows: 3,
      },
    ],
    [
      {
        name: "isActive",
        label: LABELS.FORM.FIELDS.IS_ACTIVE,
        component: "switch",
      },
    ],
  ];
};
```

> **Nota para FK con `asyncSelect`**: El `loadOptions` debe llamar a un server action que busque en el otro módulo. Ejemplo: `loadOptions: async (search) => { const result = await getOtherListAction({ searchTerm: search }); return result.map(item => ({ label: item.name, value: item.id })); }`.

### 4. `schemas/[feature].schema.js`

```javascript
import { z } from "zod";

export const [feature]Schema = z.object({
  id: z.any().optional(),
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
});
```

### 5. `mappers/[feature].mapper.js`

```javascript
export const [feature]Mapper = {
  toDomain(raw) {
    if (!raw) return null;
    return {
      id: raw.id,
      name: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toDomainList(list) {
    if (!list) return [];
    return list.map(this.toDomain);
  },

  toPersistence(domain) {
    return {
      name: domain.name?.trim(),
    };
  },

  toSortKey(domainKey) {
    const map = {
      name: "name",
      createdAt: "createdAt",
    };
    return map[domainKey] || "createdAt";
  },
};
```

### 6. `repositories/[feature].read.repository.js`

```javascript
import prisma from "@/features/shared/lib/prisma";
import { [feature]Mapper } from "../mappers/[feature].mapper";

export const [feature]ReadRepository = {
  async findMany({ page, pageSize, searchTerm, sortKey, sortDirection }) {
    const skip = (page - 1) * pageSize;
    const dbKey = [feature]Mapper.toSortKey(sortKey);
    const orderBy = { [dbKey]: sortDirection || "asc" };

    const where = {
      ...(searchTerm && {
        name: { contains: searchTerm, mode: "insensitive" },
      }),
      deletedAt: null,
    };

    const [totalCount, items] = await prisma.$transaction([
      prisma.[prismaModel].count({ where }),
      prisma.[prismaModel].findMany({ where, skip, take: pageSize, orderBy }),
    ]);

    return {
      items: [feature]Mapper.toDomainList(items),
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      page,
      pageSize,
    };
  },

  async findById(id) {
    const item = await prisma.[prismaModel].findUnique({
      where: { id: Number(id) },
    });
    return [feature]Mapper.toDomain(item);
  },

  async findByName(name, excludeId = null) {
    return await prisma.[prismaModel].findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        deletedAt: null,
        ...(excludeId && { id: { not: Number(excludeId) } }),
      },
    });
  },
};
```

### 7. `repositories/[feature].write.repository.js`

```javascript
import prisma from "@/features/shared/lib/prisma";
import { [feature]Mapper } from "../mappers/[feature].mapper";

export const [feature]WriteRepository = {
  async create(data) {
    const persistence = [feature]Mapper.toPersistence(data);
    const item = await prisma.[prismaModel].create({ data: persistence });
    return [feature]Mapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = [feature]Mapper.toPersistence(data);
    const item = await prisma.[prismaModel].update({
      where: { id: Number(id) },
      data: persistence,
    });
    return [feature]Mapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.[prismaModel].update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
```

### 8. `services/[feature].read.service.js`

```javascript
"use cache";

import { [feature]ReadRepository } from "../repositories/[feature].read.repository";
import { logger } from "@/features/shared/lib/logger";

export async function fetch[Feature]sList(params) {
  try {
    return await [feature]ReadRepository.findMany(params);
  } catch (error) {
    logger.error("Failed to fetch [feature]s list", { error: error.message });
    throw new Error("No se pudo obtener la lista.");
  }
}

export async function fetch[Feature]ById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await [feature]ReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch [feature] by id", { error: error.message, [feature]Id: id });
    throw new Error("No se pudo obtener el registro.");
  }
}
```

> **Importante**: `"use cache"` solo en read services. NUNCA en write services o validation services.

### 9. `services/[feature].write.service.js`

```javascript
import { [feature]WriteRepository } from "../repositories/[feature].write.repository";
import { validate[Feature]Rules } from "./[feature].validation.service";

export async function create[Feature](data) {
  const validation = await validate[Feature]Rules(data);
  if (!validation.success) return validation;

  try {
    const result = await [feature]WriteRepository.create(data);
    return { success: true, data: result, message: "[Nombre] creado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al crear el [nombre]." };
  }
}

export async function update[Feature](id, data) {
  const validation = await validate[Feature]Rules(data, id);
  if (!validation.success) return validation;

  try {
    const result = await [feature]WriteRepository.update(id, data);
    return { success: true, data: result, message: "[Nombre] actualizado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al actualizar el [nombre]." };
  }
}

export async function delete[Feature](id) {
  try {
    await [feature]WriteRepository.softDelete(id);
    return { success: true, message: "[Nombre] eliminado exitosamente." };
  } catch (error) {
    return { success: false, error: "Error al eliminar el [nombre]." };
  }
}
```

### 10. `services/[feature].validation.service.js`

```javascript
import { [feature]ReadRepository } from "../repositories/[feature].read.repository";

export async function validate[Feature]Rules(data, excludeId = null) {
  const existing = await [feature]ReadRepository.findByName(data.name, excludeId);

  if (existing) {
    return {
      success: false,
      error: "Ya existe un registro con este nombre.",
      details: { name: ["Este nombre ya está en uso."] }
    };
  }

  return { success: true };
}
```

### 11. `actions/[feature].read.action.js`

```javascript
"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";
import { fetch[Feature]sList } from "../services/[feature].read.service";

export const get[Feature]sListAction = createProtectedFunction(
  [FEATURE]_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetch[Feature]sList(params);
  }
);
```

### 12. `actions/[feature].write.action.js`

```javascript
"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  create[Feature],
  update[Feature],
  delete[Feature],
} from "../services/[feature].write.service";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";
import { [feature]Schema } from "../schemas/[feature].schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const save[Feature]Action = createProtectedAction(
  (data) => data.id ? [FEATURE]_CONFIG.PERMISSIONS.UPDATE : [FEATURE]_CONFIG.PERMISSIONS.WRITE,
  [feature]Schema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await update[Feature](id, rest);
      } else {
        result = await create[Feature](rest);
      }

      if (result.success) {
        revalidatePath([FEATURE]_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save [feature]", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const delete[Feature]Action = createProtectedFunction(
  [FEATURE]_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await delete[Feature](id);
      if (result.success) {
        revalidatePath([FEATURE]_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete [feature]", { error: error.message, [feature]Id: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
```

### 13. `hooks/use-[feature]-form.js`

```javascript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { [feature]Schema } from "../schemas/[feature].schema";
import { save[Feature]Action } from "../actions/[feature].write.action";
import { get[Feature]FormConfig, get[Feature]DefaultValues } from "../config/[feature].form.config";

export function use[Feature]Form({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver([feature]Schema),
    defaultValues: get[Feature]DefaultValues(item),
  });

  const formConfig = useMemo(() => get[Feature]FormConfig(), []);

  useEffect(() => {
    form.reset(get[Feature]DefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await save[Feature]Action(data);

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
```

### 14. `hooks/use-[feature]-table-filters.js`

```javascript
"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function use[Feature]TableFilters(pagination) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [localSearchTerm, setLocalSearchTerm] = useState(
    searchParams.get("q") || ""
  );

  const currentPage = pagination?.page || Number(searchParams.get("page") || 1);
  const totalPages = pagination?.totalPages || 1;
  const totalCount = pagination?.totalCount || 0;
  const sortKey = searchParams.get("sortKey") || "";
  const sortDirection = searchParams.get("sortDirection") || "asc";

  const navigateWithParams = useCallback(
    (next) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || v === "all") params.delete(k);
        else params.set(k, String(v));
      });
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  const handleSortChange = useCallback(
    (key, direction) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key) params.set("sortKey", key);
      else params.delete("sortKey");
      if (direction) params.set("sortDirection", direction);
      else params.delete("sortDirection");
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  const searchDebounceRef = useRef(null);
  const handleSearchChange = useCallback(
    (value) => {
      setLocalSearchTerm(value);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        navigateWithParams({ q: value, page: 1 });
      }, 400);
    },
    [navigateWithParams]
  );

  const handlePageChange = useCallback(
    (nextPage) => navigateWithParams({ page: nextPage }),
    [navigateWithParams]
  );

  const handleReset = useCallback(() => {
    setLocalSearchTerm("");
    startTransition(() => {
      router.push("?", { scroll: false });
    });
  }, [router]);

  return {
    isPending,
    filters: { searchTerm: localSearchTerm },
    paginationState: { currentPage, totalPages, totalCount },
    sortConfig: { key: sortKey || null, direction: sortDirection === "desc" ? "desc" : "asc" },
    handlers: { handleSearchChange, handlePageChange, handleSortChange, handleReset },
  };
}
```

### 15. `hooks/use-[feature]-table-dialogs.js`

```javascript
"use client";

import { useState, useCallback } from "react";

export function use[Feature]Dialogs() {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  const handleCreate = useCallback(() => {
    setEditingItem(null);
    setOpen(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setOpen(true);
  }, []);

  const handleDelete = useCallback((item) => {
    setDeletingItem(item);
  }, []);

  const handleSuccess = useCallback(() => {
    setOpen(false);
    setEditingItem(null);
    setDeletingItem(null);
  }, []);

  const onOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) setEditingItem(null);
  };

  return {
    open,
    onOpenChange,
    editingItem,
    deletingItem,
    setDeletingItem,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSuccess,
  };
}
```

### 16. `components/[Feature]Toolbar.jsx`

```jsx
"use client";

import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";
import { Toolbar } from "@/components/shared/Toolbar";

export function [Feature]Toolbar({
  searchTerm,
  onSearchChange,
  onReset,
  onCreate,
}) {
  const { can } = usePermission();
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return (
    <Toolbar>
      <Toolbar.Footer>
        <Toolbar.Search
          label={LABELS.TOOLBAR.SEARCH_LABEL}
          placeholder={LABELS.TOOLBAR.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Toolbar.Actions label={LABELS.TOOLBAR.DIVIDER_ACTIONS}>
          <Button variant="secondary" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            <span>{LABELS.CLEAN_BUTTON}</span>
          </Button>

          {can([FEATURE]_CONFIG.PERMISSIONS.WRITE) && (
            <Button onClick={onCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>{LABELS.TOOLBAR.NEW_BUTTON}</span>
            </Button>
          )}
        </Toolbar.Actions>
      </Toolbar.Footer>
    </Toolbar>
  );
}
```

### 17. `components/[Feature]TableView.jsx`

```jsx
"use client";

import { DataTable } from "@/components/shared/table/DataTable";
import { [Feature]Toolbar } from "./[Feature]Toolbar";
import { [Feature]TableDialogs } from "./[Feature]TableDialogs";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";

export function [Feature]TableView({
  items,
  isPending,
  pagination,
  filters,
  sortConfig,
  handlers,
  dialogState,
  columns
}) {
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return (
    <div className="space-y-4">
      <[Feature]Toolbar
        searchTerm={filters.searchTerm}
        onSearchChange={handlers.handleSearchChange}
        onReset={handlers.handleReset}
        onCreate={dialogState.handleCreate}
      />

      <DataTable
        data={items || []}
        columns={columns}
        sortConfig={sortConfig}
        onSort={handlers.handleSortChange}
        emptyMessage={filters.searchTerm ? LABELS.TABLE.EMPTY_SEARCH : LABELS.TABLE.EMPTY}
        isLoading={isPending}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          onPageChange: handlers.handlePageChange,
          currentCount: (items || []).length,
          totalCount: pagination.totalCount,
          entityName: LABELS.TABLE.NAME.toLowerCase(),
        }}
      />

      <[Feature]TableDialogs
        open={dialogState.open}
        onOpenChange={dialogState.onOpenChange}
        editingItem={dialogState.editingItem}
        deletingItem={dialogState.deletingItem}
        setDeletingItem={dialogState.setDeletingItem}
        onSuccess={dialogState.handleSuccess}
      />
    </div>
  );
}
```

### 18. `components/[Feature]Table.jsx`

```jsx
"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { get[Feature]TableColumns } from "../config/[feature].columns";
import { use[Feature]Dialogs } from "../hooks/use-[feature]-table-dialogs";
import { use[Feature]TableFilters } from "../hooks/use-[feature]-table-filters";
import { [Feature]TableView } from "./[Feature]TableView";

export function [Feature]Table({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = use[Feature]Dialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    use[Feature]TableFilters(pagination);

  const columns = useMemo(
    () => get[Feature]TableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <[Feature]TableView
      items={data}
      isPending={isPending}
      pagination={paginationState}
      filters={filters}
      sortConfig={sortConfig}
      handlers={handlers}
      dialogState={dialogState}
      columns={columns}
    />
  );
}
```

### 19. `components/[Feature]TableDialogs.jsx`

```jsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { [Feature]Form } from "./[Feature]Form";
import { [Feature]DeleteDialog } from "./[Feature]DeleteDialog";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";

export function [Feature]TableDialogs({
  open,
  onOpenChange,
  editingItem,
  deletingItem,
  setDeletingItem,
  onSuccess
}) {
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
            </DialogTitle>
          </DialogHeader>
          <[Feature]Form
            defaultValues={editingItem}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>

      <[Feature]DeleteDialog
        item={deletingItem}
        onOpenChange={(isOpen) => !isOpen && setDeletingItem(null)}
        onSuccess={onSuccess}
      />
    </>
  );
}
```

### 20. `components/[Feature]Form.jsx`

```jsx
"use client";

import { use[Feature]Form } from "../hooks/use-[feature]-form";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/shared/form/CustomFormField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";

export function [Feature]Form({ defaultValues: item, onSuccess }) {
  const { form, formConfig, isPending, onSubmit } = use[Feature]Form({ defaultValues: item, onSuccess });
  const { LABELS } = [FEATURE]_CONFIG.UI;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          {formConfig.map((row, rowIndex) => (
            <div key={rowIndex} className="grid gap-4 md:grid-cols-2">
              {row.map((field) => {
                if (field.component === "input") {
                  return (
                    <div key={field.name} className={row.length === 1 ? "md:col-span-2" : ""}>
                      <CustomFormField
                        control={form.control}
                        {...field}
                      />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? LABELS.FORM.SAVING : (item ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

### 21. `components/[Feature]DeleteDialog.jsx`

```jsx
"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { delete[Feature]Action } from "../actions/[feature].write.action";
import { [FEATURE]_CONFIG } from "../config/[feature].constants";

export function [Feature]DeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = [FEATURE]_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await delete[Feature]Action(item.id);
    if (result.success) {
      toast.success(result.message);
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
    onOpenChange(false);
  };

  return (
    <DeleteConfirmDialog
      isOpen={!!item}
      onConfirm={handleDelete}
      onCancel={() => onOpenChange(false)}
      title={LABELS.FORM.DELETE_DIALOG.TITLE}
      description={LABELS.FORM.DELETE_DIALOG.DESCRIPTION}
    />
  );
}
```

### 22. `components/[Feature]Provider.jsx` (OPCIONAL)

Solo se necesita si el feature requiere compartir estado entre componentes (ej: catálogo de permisos en roles). Si no se necesita, omite este archivo.

```jsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";

const [Feature]Context = createContext(null);

export function use[Feature]Context() {
  const context = useContext([Feature]Context);
  if (!context) {
    throw new Error("use[Feature]Context must be used within a [Feature]Provider");
  }
  return context;
}

export function [Feature]Provider({ children, initialData = {} }) {
  const [data, setData] = useState(initialData);

  const refresh = useCallback(async () => {
    // Re-fetch data if needed
  }, []);

  return (
    <[Feature]Context.Provider value={{ data, setData, refresh }}>
      {children}
    </[Feature]Context.Provider>
  );
}
```

> Si usas Provider, envuélvelo en la page RSC alrededor del `[Feature]Table`.

---

## 📄 Plantillas para Relaciones

### FK (belongsTo) — Relación con otra entidad

Cuando el módulo tiene una clave foránea hacia otro módulo (ej: `roleId`):

**En el mapper (`toDomain`)**:
```javascript
toDomain(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    otherId: raw.otherId,
    otherName: raw.other?.name || null,  // include relacionado
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
},
```

**En el `read.repository` (include para evitar N+1)**:
```javascript
const items = await prisma.[prismaModel].findMany({
  where,
  skip,
  take: pageSize,
  orderBy,
  include: { other: { select: { id: true, name: true } } },
});
```

**En el `write.repository` (solo guardar el FK)**:
```javascript
toPersistence(domain) {
  return {
    name: domain.name?.trim(),
    otherId: domain.otherId ? Number(domain.otherId) : null,
  };
},
```

**En `form.config.js` (asyncSelect para buscar la entidad relacionada)**:
```javascript
{
  name: "otherId",
  label: LABELS.FORM.FIELDS.OTHER,
  placeholder: LABELS.FORM.PLACEHOLDERS.OTHER,
  component: "asyncSelect",
  loadOptions: async (search) => {
    const result = await getOtherListAction({ searchTerm: search });
    return (result || []).map(item => ({ label: item.name, value: item.id }));
  },
  getOptionLabel: (opt) => opt.label,
  getOptionValue: (opt) => opt.value,
},
```

### M2M (many-to-many) — Relación con tabla pivote

Cuando el módulo tiene relación muchos-a-muchos (ej: roles ↔ permisos vía `RolePermission`).

**En `form.config.js` (multiSelect)**:
```javascript
{
  name: "relatedIds",
  label: LABELS.FORM.FIELDS.RELATED,
  placeholder: LABELS.FORM.PLACEHOLDERS.RELATED,
  component: "multiSelect",
  loadOptions: async (search) => {
    const result = await getRelatedListAction({ searchTerm: search });
    return (result || []).map(item => ({ label: item.name, value: item.id }));
  },
  getOptionLabel: (opt) => opt.label,
  getOptionValue: (opt) => opt.value,
},
```

**En el schema Zod**:
```javascript
relatedIds: z.array(z.number()).optional(),
```

**En el `write.repository` (update con set en transacción)**:
```javascript
async updateWithRelations(id, data) {
  const { relatedIds, ...rest } = data;
  const persistence = [feature]Mapper.toPersistence(rest);
  
  return await prisma.$transaction(async (tx) => {
    const updated = await tx.[prismaModel].update({
      where: { id: Number(id) },
      data: persistence,
    });
    
    // Sincronizar M2M: eliminar existentes y crear nuevos
    await tx.[pivotModel].deleteMany({ where: { [feature]Id: Number(id) } });
    if (relatedIds?.length) {
      await tx.[pivotModel].createMany({
        data: relatedIds.map(relatedId => ({
          [feature]Id: Number(id),
          relatedId: Number(relatedId),
        })),
      });
    }
    
    return updated;
  });
},
```

### Auto-referencia (parentId) — Jerarquía padre-hijo

Cuando una entidad puede tener un padre del mismo tipo (ej: categorías):

**En el `read.repository` (incluir hijos o padre)**:
```javascript
const items = await prisma.[prismaModel].findMany({
  where: { ...where, parentId: null },  // solo raíces
  include: { 
    children: { 
      select: { id: true, name: true },
      where: { deletedAt: null },
      orderBy: { name: "asc" },
    },
  },
  skip,
  take: pageSize,
  orderBy,
});
```

---

## 📄 Archivos Adicionales (Ruteo, Sidebar y Page)

### 23. Actualizar `src/features/shared/config/navigation/navigation.config.js`

El archivo `navigation.config.js` unifica rutas y sidebar en un solo lugar. Agrega el import al inicio y actualiza ambas secciones:

**Import (agregar al inicio, en orden alfabético):**
```javascript
import { [FEATURE]_CONFIG } from '@/features/[feature]/config/[feature].constants'
```

**Ruta en `ROUTES.ADMIN`:**
```javascript
[FEATURE_SLUG]: { 
  path: [FEATURE]_CONFIG.PATH, 
  permission: [FEATURE]_CONFIG.PERMISSIONS.READ,
  title: [FEATURE]_CONFIG.TITLE 
},
```

**Item en `SIDEBAR_CONFIG.NAV.items` (dentro de la sección "Administración"):**
```javascript
{
  title: ROUTES.ADMIN.[FEATURE_SLUG].title,
  url: ROUTES.ADMIN.[FEATURE_SLUG].path,
  permission: ROUTES.ADMIN.[FEATURE_SLUG].permission,
  icon: [IconComponent],
},
```

> **Nota**: En Admin Starter no existe sección `CATALOGS`. Todos los módulos van dentro de `ROUTES.ADMIN`.
> **Iconos**: Usar componentes de `lucide-react`. Elegir uno adecuado (ej: `Tags` para etiquetas, `FileText` para documentos, `CreditCard` para pagos).

### 25. Crear `src/features/[feature]/index.js` (Barrel Export)

Re-exporta la API pública del feature. **Solo datos, config y constantes**:

```javascript
export { [FEATURE]_CONFIG } from './config/[feature].constants'
export { [feature]Columns } from './config/[feature].columns'
```

> ⚠️ **Nunca exportar en el barrel**: `prisma`, acciones (`createProtectedAction`), `getSession`, `checkPageAccess`, ni nada que importe `next/headers`. Esas van por ruta directa. Si un cliente importa del barrel y este re-exporta server-only, el build truena.

### 26. Crear `src/features/[feature]/components/[Feature]PageContainer.jsx`

Extrae la lógica de fetch, searchParams y error handling a un Server Component container:

```jsx
import { logger } from "@/features/shared/lib/logger";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { fetch[Feature]sList } from "@/features/[feature]/services/[feature].read.service";
import { [FEATURE]_CONFIG } from "@/features/[feature]/config/[feature].constants";

export async function [Feature]PageContainer({ session, searchParams }) {
  const params = (await searchParams) || {};
  // Lógica de fetch y error handling aquí...
}
```

### 27. `src/app/(root)/admin/[ruta]/page.jsx` (Thin Page)

La page solo verifica permisos y renderiza el container:

```jsx
import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { [Feature]PageContainer } from "@/features/[feature]/components/[Feature]PageContainer";
import { [FEATURE]_CONFIG } from "@/features/[feature]/config/[feature].constants";

export const metadata = {
  title: `${[FEATURE]_CONFIG.TITLE} | Admin Starter`,
};

export default async function [Feature]sPage({ searchParams }) {
  const { authorized, session } = await checkPageAccess([FEATURE]_CONFIG.PERMISSIONS.READ);
  if (!authorized) return <AccessDenied />;
  return <[Feature]PageContainer session={session} searchParams={searchParams} />;
}
```

> **Regla**: La page NO debe contener lógica de fetch, searchParams, try/catch ni paginación.

> **Reglas de la page**:
> - Es un **Server Component** (sin `"use client"`).
> - **Thin page**: solo `checkPageAccess()` + renderizar `[Feature]PageContainer`.
> - **Prohibido**: lógica de fetch, searchParams, try/catch, paginación en la page.
> - El `PageContainer` (en `components/`) contiene fetch, error handling, Suspense y TableSkeleton.

## ✅ Validación Post-Generación

Después de generar todos los archivos, ejecuta estos checks (mismos que usa `analisis-proyecto`):

1. ✅ Verificar que **no hay `prisma` fuera de `repositories/`** — `grep_search` con `import prisma from`.
2. ✅ Verificar que **cada archivo ≤ 250 líneas** — leer los archivos generados.
3. ✅ Verificar que **`"use cache"` está en `read.service.js`** — no en write/validation.
4. ✅ Verificar que **todas las acciones usan `createProtectedAction` o `createProtectedFunction`**.
5. ✅ Verificar que **la page es \"thin\" (≤30 líneas, sin fetch/searchParams/try-catch)** y delega al PageContainer.
6. ✅ Verificar que **no hay texto en español hardcodeado en JSX** — solo referencias a `[FEATURE]_CONFIG.UI.LABELS`.
7. ✅ Verificar que **`navigation.config.js` fue actualizado** correctamente (ruta en `ROUTES.ADMIN` + item en `SIDEBAR_CONFIG.NAV.items`).
8. ✅ Verificar que **el barrel export `index.js` existe y SOLO exporta config/datos** (sin `prisma`, `getSession`, `createProtectedAction`, ni `next/headers`).
9. ✅ Verificar que **el modelo Prisma tiene `createdAt`, `updatedAt` con `@map` y `deletedAt`**.
10. ✅ Verificar que **el seed incluye los permisos del módulo** y usa `upsert`.
11. ✅ Verificar que **los hooks de tabla tienen doble estado (local + URL sync con debounce 400ms)**.
12. ✅ Si el módulo tiene endpoints sensibles, verificar que **tiene rate limiting**: `RATE_LIMIT` en constants, instancia con `createRateLimiter()`, y `checkLimit()` en la acción.

Si algún check falla, corrígelo antes de dar el módulo por terminado.

---

## ⚠️ Recordatorios

1. **Prisma solo en `repositories/`** — nunca importar `prisma` en actions, services, components, hooks, etc.
2. **Logger centralizado** — usar `logger.error()` en lugar de `console.error()`.
3. **Dialog inline en TableDialogs** — no crear archivo `FormDialog.jsx` separado.
4. **Toolbar compuesto** — usar el componente `<Toolbar>`, no HTML genérico.
5. **Doble estado en search** — `localSearchTerm` + URL sync con debounce 400ms.
6. **Constantes en inglés** — todas las variables, funciones y comentarios en inglés. Solo los labels de UI van en español.
7. **Sin `forwardRef`** — React 19 los refs son props normales.
8. **Sin `dangerouslySetInnerHTML`** — riesgo de XSS.
9. **Máx. 250 líneas por archivo** — si un archivo se acerca, refactorizar.
10. **Máx. 3 niveles de anidación**.
11. **Usar `roles/` como referencia** — es el módulo más completo y actualizado del proyecto.
12. **`"use cache"` en `read.service.js`** — obligatorio para optimizar data fetching en Next.js 16.2.
13. **`@map` / `@@map` en todos los modelos** — nombres de campos en inglés, DB en español.
14. **Soft delete con `deletedAt`** — obligatorio para todo modelo de negocio. Nunca DELETE físico.
15. **Seed idempotente con `upsert`** — el seed debe poder ejecutarse múltiples veces sin errores.
16. **Rate limiting en endpoints sensibles** — usar `createRateLimiter()` de `@/features/shared/lib/rate-limiter`. Configurar en constants, instanciar en `lib/rate-limiter.js`, usar en actions.
17. **Validación post-generación obligatoria** — ejecutar los 12 checks antes de dar por terminado.
