import { Badge } from "@/components/ui/badge";
import { USER_CONFIG } from "./user.constants";
import { createActionsColumn } from "@/components/shared/TableUtils";

export const getUserTableColumns = (onEdit, onDelete, can = () => false) => {
  const { PERMISSIONS, UI } = USER_CONFIG;
  const labels = UI.LABELS.TABLE;

  const columns = [
    {
      header: labels.NAME,
      accessorKey: "firstName",
      sortable: true,
      width: "300px",
      cell: (user) => (
        <div className="flex flex-col">
          <span className="font-medium truncate" title={`${user.firstName} ${user.lastName}`}>
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      ),
    },
    {
      header: labels.ROLE,
      accessorKey: "role",
      sortable: true,
      cell: (user) => (
        <Badge variant="outline" className="font-medium">
          {user.role?.name || UI.LABELS.NO_ROLE}
        </Badge>
      ),
    },
    {
      header: labels.STATUS,
      accessorKey: "deletedAt",
      sortable: true,
      cell: (user) => (
        <Badge variant={user.deletedAt ? UI.BADGE_VARIANTS.INACTIVE : UI.BADGE_VARIANTS.ACTIVE}>
          {user.deletedAt ? UI.LABELS.INACTIVE : UI.LABELS.ACTIVE}
        </Badge>
      ),
    },
  ];

  const actionsColumn = createActionsColumn({
    onEdit,
    onDelete,
    can,
    permissions: PERMISSIONS,
  });

  if (actionsColumn) {
    // Para usuarios, queremos que las acciones estén alineadas a la derecha
    actionsColumn.className = "text-right";
    columns.push(actionsColumn);
  }

  return columns;
};
