import { Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROLE_CONFIG } from "./role.constants";
import { createActionsColumn } from "@/components/shared/TableUtils";

export const getRoleTableColumns = (onEdit, onDelete, can = () => true, isFetching = false) => {
  const { PERMISSIONS, UI } = ROLE_CONFIG;
  const labels = UI.LABELS.TABLE;

  const columns = [
    {
      header: labels.NAME,
      accessorKey: "name",
      sortable: true,
      cell: (item) => (
        <div className="flex flex-col">
          <span className="font-medium flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            {item.name}
          </span>
        </div>
      ),
    },
    {
      header: labels.DESCRIPTION,
      accessorKey: "description",
      sortable: false,
      cell: (item) => (
        <span className="text-muted-foreground text-sm truncate max-w-[200px] block" title={item.description}>
          {item.description || "-"}
        </span>
      ),
    },
    {
      header: labels.USERS,
      accessorKey: "usersCount",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{item.usersCount}</span>
        </div>
      ),
    },
    {
      header: labels.PERMISSIONS,
      accessorKey: "permissions",
      sortable: false,
      cell: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.permissions?.slice(0, UI.MAX_VISIBLE_PERMISSIONS).map((p) => (
            <Badge key={p.id} variant="outline" className="text-xs">
              {p.slug}
            </Badge>
          ))}
          {item.permissions?.length > UI.MAX_VISIBLE_PERMISSIONS && (
            <Badge variant="secondary" className="text-xs">
              +{item.permissions.length - UI.MAX_VISIBLE_PERMISSIONS}
            </Badge>
          )}
        </div>
      ),
    },
  ];

  const actionsColumn = createActionsColumn({
    onEdit,
    onDelete,
    can,
    permissions: PERMISSIONS,
    isFetching,
  });

  if (actionsColumn) {
    columns.push(actionsColumn);
  }

  return columns;
};
