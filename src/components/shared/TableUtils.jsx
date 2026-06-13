import { Pencil, Trash2, Loader2 } from "lucide-react";
import { SHARED_CONFIG } from "@/features/shared";
import { TableActions } from "./table/TableActions";

const { ACTIONS } = SHARED_CONFIG.UI.LABELS;

/**
 * UTILITY: Creates a standardized actions column for DataTables.
 * 
 * @param {Object} options
 * @param {Function} options.onEdit - Callback when edit is clicked.
 * @param {Function} options.onDelete - Callback when delete is clicked.
 * @param {Function} options.can - Permission check function (can(perm)).
 * @param {Object} options.permissions - Feature permissions { UPDATE, DELETE }.
 * @param {Object} options.labels - UI labels { ACTIONS, EDIT, DELETE }.
 * @param {boolean} options.isFetching - Loading state for edit action.
 * @returns {Object} Column definition for DataTable.
 */
export const createActionsColumn = ({
  onEdit,
  onDelete,
  can = () => true,
  permissions,
  labels = {},
  isFetching = false,
}) => {
  const canUpdate = can(permissions.UPDATE);
  const canDelete = can(permissions.DELETE);

  if (!canUpdate && !canDelete) return null;

  const actionLabels = {
    ACTIONS: labels.ACTIONS || ACTIONS.TITLE,
    EDIT: labels.EDIT || ACTIONS.EDIT,
    DELETE: labels.DELETE || ACTIONS.DELETE,
  };

  return {
    header: actionLabels.ACTIONS,
    id: "actions",
    cell: (item) => {
      const actions = [
        {
          label: actionLabels.EDIT,
          icon: isFetching ? Loader2 : Pencil,
          onClick: () => onEdit(item),
          show: () => canUpdate,
          // Si está cargando, podemos pasar una clase para animar el icono
          className: isFetching ? "animate-spin" : "",
        },
        {
          label: actionLabels.DELETE,
          icon: Trash2,
          onClick: () => onDelete(item),
          variant: "destructive",
          show: () => canDelete,
          divider: canUpdate, // Separador si hubo una acción previa
        },
      ];

      return <TableActions actions={actions} row={item} />;
    },
  };
};
